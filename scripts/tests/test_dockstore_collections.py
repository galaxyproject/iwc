import copy
import json
import threading
from http.server import BaseHTTPRequestHandler
from socketserver import ThreadingTCPServer
from urllib.parse import parse_qs, unquote, urlsplit

import pytest
import yaml

import dockstore_collections
from dockstore_collections import Dockstore, DockstoreError, check_config, load_config, resolve

TRS_ORG = "lab-workflows"
ORG_ID = 7
TOKEN = "s3cret"

CONFIG = {
    "organization": "lab",
    "collections": {
        "variant-calling": {"displayName": "Variant Calling", "topic": "Variant Calling"},
        "Covid": {"displayName": "SARS-COV-2", "topic": "SARS-COV-2 Workflows"},
        "machine-learning": {"displayName": "Machine Learning", "topic": "Workflows that train models"},
    },
    "assignments": {
        "variant-calling": ["variant-calling"],
        "sars-cov-2": ["Covid", "variant-calling"],
        "sars-cov-2/consensus": ["Covid"],
        "machine-learning": ["machine-learning"],
    },
}


def entry(repo, name="main"):
    return f"github.com/{TRS_ORG}/{repo}/{name}"


def sync(config, desired, dockstore, **kwargs):
    return dockstore_collections.sync(config, desired, dockstore, TRS_ORG, **kwargs)


@pytest.fixture
def workflows_dir(tmp_path):
    repos = {
        "variant-calling/haploid": ["main"],
        "sars-cov-2/artic": ["pe", "se"],
        "sars-cov-2/consensus": ["main"],
        "machine-learning/lstm": ["main"],
    }
    for directory, names in repos.items():
        add_repo(tmp_path, directory, names)
    return tmp_path


def add_repo(workflows_dir, directory, names=("main",)):
    repo = workflows_dir / directory
    repo.mkdir(parents=True)
    workflows = [{"name": name, "subclass": "Galaxy", "primaryDescriptorPath": f"/{name}.ga"} for name in names]
    (repo / ".dockstore.yml").write_text(yaml.safe_dump({"version": 1.2, "workflows": workflows}))


class FakeDockstore(ThreadingTCPServer):
    """
    The handful of Dockstore endpoints the sync uses, over real HTTP.

    Not an HTTPServer: that one looks up the host's name when it binds, which
    can take half a minute.
    """

    daemon_threads = True

    def __init__(self):
        super().__init__(("127.0.0.1", 0), FakeDockstoreHandler)
        self.published = {
            entry("haploid"): 1,
            entry("artic", "pe"): 2,
            entry("artic", "se"): 3,
            entry("consensus"): 4,
            # Deleted from the repository, still on Dockstore
            entry("retired"): 5,
            # machine-learning/lstm was merged, but Dockstore hasn't registered it
        }
        self.collections = {
            "variant-calling": self.collection(10, "variant-calling", [entry("haploid"), entry("retired")]),
            "Covid": self.collection(11, "Covid", [entry("artic", "pe"), entry("consensus")]),
        }
        self.writes = []
        # Entry IDs the fake refuses to add to any collection
        self.refused = set()

    def collection(self, collection_id, name, entry_paths):
        entries = [{"entryPath": path, "id": self.published[path], "versionName": None} for path in entry_paths]
        return {"id": collection_id, "name": name, "entries": entries}

    def memberships(self):
        return {name: sorted(e["entryPath"] for e in c["entries"]) for name, c in self.collections.items()}

    @property
    def api(self):
        return f"http://127.0.0.1:{self.server_address[1]}"


class FakeDockstoreHandler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def reply(self, status, body=None):
        payload = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def route(self):
        url = urlsplit(self.path)
        # The entry path arrives percent-encoded, so it stays one segment
        return url.path.strip("/").split("/"), {key: values[0] for key, values in parse_qs(url.query).items()}

    def authorized(self):
        if self.headers.get("Authorization") == f"Bearer {TOKEN}":
            return True
        self.reply(401, {"message": "Credentials are required to access this resource."})
        return False

    def do_GET(self):
        segments, query = self.route()
        if segments == ["organizations", "name", CONFIG["organization"]]:
            return self.reply(200, {"id": ORG_ID})
        if segments == ["organizations", str(ORG_ID), "collections"]:
            collections = copy.deepcopy(list(self.server.collections.values()))
            if query.get("include") != "entries":
                for collection in collections:
                    collection["entries"] = []
            return self.reply(200, collections)
        if segments[:3] == ["workflows", "path", "workflow"] and segments[4:] == ["published"]:
            entry_id = self.server.published.get(unquote(segments[3]))
            if entry_id is None:
                return self.reply(404, {"message": "Entry not found"})
            return self.reply(200, {"id": entry_id})
        self.reply(404, {"message": f"No route for {self.path}"})

    def do_POST(self):
        segments, query = self.route()
        if not self.authorized():
            return
        self.server.writes.append(f"POST {self.path}")
        if segments == ["organizations", str(ORG_ID), "collections"]:
            body = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
            collection = {"id": 100 + len(self.server.collections), "entries": [], **body}
            self.server.collections[body["name"]] = collection
            return self.reply(200, collection)
        collection = self.find_collection(segments)
        if collection is None:
            return self.reply(404, {"message": f"No route for {self.path}"})
        entry_id = int(query["entryId"])
        if entry_id in self.server.refused:
            return self.reply(400, {"message": "Entry is archived"})
        (entry_path,) = [path for path, published_id in self.server.published.items() if published_id == entry_id]
        collection["entries"].append({"entryPath": entry_path, "id": entry_id, "versionName": None})
        self.reply(200, collection)

    def do_DELETE(self):
        segments, query = self.route()
        if not self.authorized():
            return
        self.server.writes.append(f"DELETE {self.path}")
        collection = self.find_collection(segments)
        if collection is None:
            return self.reply(404, {"message": f"No route for {self.path}"})
        removed = {"id": int(query["entryId"]), "versionName": query.get("versionName")}
        collection["entries"] = [
            e for e in collection["entries"] if {"id": e["id"], "versionName": e["versionName"]} != removed
        ]
        self.reply(200, collection)

    def find_collection(self, segments):
        if segments[:3] != ["organizations", str(ORG_ID), "collections"] or segments[4:] != ["entry"]:
            return None
        for collection in self.server.collections.values():
            if str(collection["id"]) == segments[3]:
                return collection


@pytest.fixture
def server():
    server = FakeDockstore()
    thread = threading.Thread(target=server.serve_forever, kwargs={"poll_interval": 0.01}, daemon=True)
    thread.start()
    yield server
    server.shutdown()
    server.server_close()
    thread.join()


@pytest.fixture
def desired(workflows_dir):
    desired, errors = check_config(CONFIG, workflows_dir, TRS_ORG)
    assert errors == []
    return desired


def test_repository_config_puts_every_workflow_in_a_collection():
    # The same check the pull request job runs, on the real file and workflows
    desired, errors = check_config(load_config(), dockstore_collections.WORKFLOWS_DIR, "iwc-workflows")
    assert errors == []
    assert desired["github.com/iwc-workflows/rnaseq-pe/main"] == ["transcriptomics"]


def test_most_specific_directory_wins(desired):
    assert desired == {
        entry("haploid"): ["variant-calling"],
        entry("artic", "pe"): ["Covid", "variant-calling"],
        entry("artic", "se"): ["Covid", "variant-calling"],
        # Replaces the parent's list, doesn't add to it
        entry("consensus"): ["Covid"],
        entry("lstm"): ["machine-learning"],
    }


def test_assignment_covers_nested_directories():
    assert resolve({"microbiome": ["Microbiome"]}, "microbiome/pathogen-identification/nanopore") == ["Microbiome"]
    # A directory that merely starts with the same letters isn't covered
    assert resolve({"micro": ["Microbiome"]}, "microbiome/binning") is None


def test_workflow_without_collection_is_an_error(workflows_dir):
    add_repo(workflows_dir, "imaging/segmentation")
    desired, errors = check_config(CONFIG, workflows_dir, TRS_ORG)
    (error,) = errors
    assert error.startswith("workflows/imaging/segmentation is in no collection: add `imaging: [<collection>]`")
    assert entry("segmentation") not in desired


@pytest.mark.parametrize(
    "path, value, message",
    [
        (("assignments", "variant-calling"), ["variant_calling"], "names 'variant_calling', which isn't under collections"),
        (("assignments", "variant-calling"), [], "variant-calling needs a list of at least one collection"),
        (("assignments", "variant-calling"), "variant-calling", "variant-calling needs a list of at least one collection"),
        (("assignments", "epigenetics"), ["Covid"], "no workflow in workflows/epigenetics"),
        (("collections", "ml"), {"displayName": "Machine Learning", "topic": "ML"}, "'ml' isn't a name Dockstore accepts"),
        (("collections", "machine_learning"), {"displayName": "ML!", "topic": "ML"}, "isn't a name Dockstore accepts"),
        (("collections", "Covid"), {"displayName": "SARS-COV-2 / Covid", "topic": "Covid"}, "Covid needs a displayName"),
        (("collections", "Covid"), {"displayName": "SARS-COV-2"}, "Covid needs a topic"),
        (("collections", "Covid"), {"displayName": "SARS-COV-2", "topic": "x" * 256}, "Covid needs a topic"),
        # Dockstore's pattern is ASCII only
        (("collections", "Covid"), {"displayName": "Génomique", "topic": "Covid"}, "Covid needs a displayName"),
        (("collections", "Covid"), "SARS-COV-2", "Covid needs a displayName and a topic"),
    ],
)
def test_config_mistakes_are_reported(workflows_dir, path, value, message):
    config = copy.deepcopy(CONFIG)
    section, key = path
    config[section][key] = value
    _, errors = check_config(config, workflows_dir, TRS_ORG)
    assert any(message in error for error in errors), errors


def test_dry_run_needs_no_token_and_writes_nothing(server, desired, capsys):
    before = server.memberships()
    sync(CONFIG, desired, Dockstore(server.api))
    assert server.writes == []
    assert server.memberships() == before
    output = capsys.readouterr().out
    assert "create collection machine-learning (Machine Learning)" in output
    assert f"add {entry('artic', 'se')} to Covid" in output
    assert "Dry run: 4 change(s) not made" in output


def test_apply_adds_what_is_missing(server, desired, capsys):
    sync(CONFIG, desired, Dockstore(server.api, TOKEN), apply=True)
    assert server.memberships() == {
        # retired isn't in the repository any more; without prune it stays
        "variant-calling": sorted([entry("haploid"), entry("retired"), entry("artic", "pe"), entry("artic", "se")]),
        "Covid": sorted([entry("artic", "pe"), entry("artic", "se"), entry("consensus")]),
        # Created, but lstm isn't published yet, so there is nothing to put in it
        "machine-learning": [],
    }
    created = server.collections["machine-learning"]
    assert (created["displayName"], created["topic"]) == ("Machine Learning", "Workflows that train models")
    output = capsys.readouterr().out
    assert f"::warning::Not published on Dockstore yet, machine-learning has to wait for a later run: {entry('lstm')}" in output
    assert f"extra: {entry('retired')} is in variant-calling" in output


def test_apply_is_idempotent_and_picks_up_late_entries(server, desired, capsys):
    dockstore = Dockstore(server.api, TOKEN)
    sync(CONFIG, desired, dockstore, apply=True)
    writes = list(server.writes)
    sync(CONFIG, desired, dockstore, apply=True)
    assert server.writes == writes
    assert "Nothing to change" in capsys.readouterr().out

    # Dockstore registers the new workflow; the next run puts it in its collection
    server.published[entry("lstm")] = 6
    sync(CONFIG, desired, dockstore, apply=True)
    assert server.memberships()["machine-learning"] == [entry("lstm")]


def test_prune_removes_what_the_config_does_not_list(server, desired):
    # A single version of consensus was added to variant-calling by hand
    server.collections["variant-calling"]["entries"].append(
        {"entryPath": entry("consensus"), "id": 4, "versionName": "v0.1"}
    )
    sync(CONFIG, desired, Dockstore(server.api, TOKEN), apply=True, prune=True)
    assert server.memberships()["variant-calling"] == sorted(
        [entry("haploid"), entry("artic", "pe"), entry("artic", "se")]
    )
    # consensus stays where the config puts it
    assert entry("consensus") in server.memberships()["Covid"]


def test_prune_leaves_alone_what_the_config_does_not_speak_for(server, desired):
    # A collection kept by hand, and another organization's workflow in one of ours
    foreign = "github.com/someone-else/tool/main"
    server.published[foreign] = 8
    server.collections["hand-picked"] = server.collection(12, "hand-picked", [entry("haploid")])
    server.collections["Covid"]["entries"].append({"entryPath": foreign, "id": 8, "versionName": None})
    sync(CONFIG, desired, Dockstore(server.api, TOKEN), apply=True, prune=True)
    assert server.memberships()["hand-picked"] == [entry("haploid")]
    assert foreign in server.memberships()["Covid"]
    assert entry("retired") not in server.memberships()["variant-calling"]


def test_refused_entry_does_not_hold_up_the_others(server, desired, capsys):
    # artic/pe sorts before artic/se; Dockstore refuses the first
    server.refused.add(2)
    assert sync(CONFIG, desired, Dockstore(server.api, TOKEN), apply=True) == 1
    assert entry("artic", "pe") not in server.memberships()["variant-calling"]
    assert entry("artic", "se") in server.memberships()["variant-calling"]
    assert entry("artic", "se") in server.memberships()["Covid"]
    assert "::error::POST" in capsys.readouterr().out


def test_prune_dry_run_writes_nothing(server, desired, capsys):
    before = server.memberships()
    sync(CONFIG, desired, Dockstore(server.api, TOKEN), prune=True)
    assert server.writes == []
    assert server.memberships() == before
    assert f"remove {entry('retired')} from variant-calling" in capsys.readouterr().out


def test_rejected_token_fails_the_run(server, desired, capsys):
    before = server.memberships()
    # The collection that couldn't be created and the three adds
    assert sync(CONFIG, desired, Dockstore(server.api, "expired"), apply=True) == 4
    assert server.memberships() == before
    assert "returned 401" in capsys.readouterr().out


def test_failed_read_stops_the_sync(server, desired):
    config = {**CONFIG, "organization": "no-such-organization"}
    with pytest.raises(DockstoreError, match="returned 404"):
        sync(config, desired, Dockstore(server.api, TOKEN), apply=True)
    assert server.writes == []


def test_duplicate_assignment_is_refused(tmp_path):
    path = tmp_path / "dockstore-collections.yml"
    path.write_text("assignments:\n  virology: [Virology]\n  imaging: [Imaging]\n  virology: [Covid]\n")
    with pytest.raises(yaml.YAMLError, match="found more than once: virology"):
        load_config(path)


def test_apply_without_token_fails_before_touching_dockstore(monkeypatch, capsys):
    monkeypatch.delenv("DOCKSTORE_TOKEN", raising=False)
    assert dockstore_collections.main(["sync", "--apply"]) == 1
    assert "--apply needs a Dockstore token" in capsys.readouterr().out
