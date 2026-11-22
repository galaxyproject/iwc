#!/usr/bin/env python3
"""
Keep the collections of the IWC organization on Dockstore in step with
workflows/dockstore-collections.yml.

    check   every workflow is in a collection; offline, runs on pull requests
    sync    print what differs on Dockstore; --apply makes the changes
"""

import argparse
import os
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import quote

import requests
import yaml

from site_config import load_site_config

REPO_ROOT = Path(__file__).resolve().parent.parent
WORKFLOWS_DIR = REPO_ROOT / "workflows"
CONFIG_PATH = WORKFLOWS_DIR / "dockstore-collections.yml"
CONFIG_NAME = CONFIG_PATH.relative_to(REPO_ROOT).as_posix()
API = "https://dockstore.org/api"

# What Dockstore accepts when a collection is created, from its OpenAPI schema.
# Checked here so a bad value fails the pull request, not the sync after the merge.
# re.ASCII because Dockstore matches \w and \d against ASCII only.
COLLECTION_NAME = re.compile(r"[a-zA-Z](-?[a-zA-Z\d]){2,89}", re.ASCII)
COLLECTION_DISPLAY_NAME = re.compile(r"[\w ,_\-&()']{3,90}", re.ASCII)
TOPIC_MAX_LENGTH = 255


class DockstoreError(Exception):
    pass


@dataclass(frozen=True)
class Membership:
    collection: str
    entry_path: str
    entry_id: int
    # Set when a single version was added to the collection instead of the entry
    version_name: str | None


class UniqueKeyLoader(yaml.SafeLoader):
    """PyYAML keeps the last of two equal keys, which would silently drop an assignment."""

    def construct_mapping(self, node, deep=False):
        keys = [self.construct_object(key_node, deep=deep) for key_node, _ in node.value]
        duplicates = sorted({str(key) for key in keys if keys.count(key) > 1})
        if duplicates:
            raise yaml.constructor.ConstructorError(
                None, None, f"found more than once: {', '.join(duplicates)}", node.start_mark
            )
        return super().construct_mapping(node, deep=deep)


def load_config(path=CONFIG_PATH):
    with open(path) as f:
        return yaml.load(f, Loader=UniqueKeyLoader)


def find_workflows(workflows_dir, trs_org):
    """
    Yield (directory relative to workflows_dir, Dockstore entry path) for every
    workflow listed in a .dockstore.yml.
    """
    for dockstore_yml in sorted(Path(workflows_dir).rglob(".dockstore.yml")):
        repo_dir = dockstore_yml.parent
        with open(dockstore_yml) as f:
            workflows = yaml.safe_load(f)["workflows"]
        for workflow in workflows:
            # The repository is deployed under the directory's name, the same
            # way workflow_manifest.py builds the trsID
            entry_path = f"github.com/{trs_org}/{repo_dir.name}/{workflow.get('name') or 'main'}"
            yield repo_dir.relative_to(workflows_dir).as_posix(), entry_path


def resolve(assignments, directory):
    """Return the collections of the most specific assignment that covers directory."""
    parts = directory.split("/")
    while parts:
        key = "/".join(parts)
        if key in assignments:
            return assignments[key]
        parts.pop()
    return None


def check_config(config, workflows_dir, trs_org):
    """
    Return ({entry path: [collection names]}, [error messages]).

    All errors are collected, so a contributor sees them in one run.
    """
    if not isinstance(config, dict):
        return {}, [f"{CONFIG_NAME} has to hold organization, collections and assignments"]
    errors = []
    if not isinstance(config.get("organization"), str):
        errors.append("organization has to name the Dockstore organization")
    collections = config.get("collections") or {}
    assignments = config.get("assignments") or {}

    for name, collection in collections.items():
        if not isinstance(collection, dict):
            errors.append(f"collections: {name} needs a displayName and a topic")
            continue
        if not COLLECTION_NAME.fullmatch(str(name)):
            errors.append(
                f"collections: {name!r} isn't a name Dockstore accepts "
                "(3 to 90 letters and digits, single hyphens in between, starting with a letter)"
            )
        display_name = collection.get("displayName")
        if not isinstance(display_name, str) or not COLLECTION_DISPLAY_NAME.fullmatch(display_name):
            errors.append(
                f"collections: {name} needs a displayName of 3 to 90 letters, digits, spaces or , _ - & ( ) '"
            )
        topic = collection.get("topic")
        if not isinstance(topic, str) or not 0 < len(topic) <= TOPIC_MAX_LENGTH:
            errors.append(f"collections: {name} needs a topic of at most {TOPIC_MAX_LENGTH} characters")

    workflows = list(find_workflows(workflows_dir, trs_org))
    directories = {directory for directory, _ in workflows}
    for key, names in assignments.items():
        if not isinstance(names, list) or not names:
            errors.append(f"assignments: {key} needs a list of at least one collection")
            continue
        for name in names:
            if name not in collections:
                errors.append(f"assignments: {key} names {name!r}, which isn't under collections")
        if not any(directory == key or directory.startswith(f"{key}/") for directory in directories):
            errors.append(f"assignments: no workflow in workflows/{key}; was the directory moved or renamed?")

    desired = {}
    for directory, entry_path in workflows:
        names = resolve(assignments, directory)
        if names is None:
            category = directory.split("/")[0]
            errors.append(
                f"workflows/{directory} is in no collection: add `{category}: [<collection>]` "
                f"or `{directory}: [<collection>]` to assignments in {CONFIG_NAME}"
            )
        else:
            desired[entry_path] = names
    return desired, errors


class Dockstore:
    def __init__(self, api=API, token=None):
        self.api = api
        self.session = requests.Session()
        if token:
            self.session.headers["Authorization"] = f"Bearer {token}"

    def _request(self, method, path, **kwargs):
        response = self.session.request(method, f"{self.api}{path}", timeout=60, **kwargs)
        if not response.ok:
            raise DockstoreError(f"{method} {path} returned {response.status_code}: {response.text[:500]}")
        return response

    def organization_id(self, name):
        return self._request("GET", f"/organizations/name/{name}").json()["id"]

    def collections(self, organization_id):
        # Without include=entries every collection comes back empty
        return self._request(
            "GET", f"/organizations/{organization_id}/collections", params={"include": "entries"}
        ).json()

    def published_entry_id(self, entry_path):
        """Return the ID of a published workflow, or None if Dockstore doesn't have it yet."""
        path = f"/workflows/path/workflow/{quote(entry_path, safe='')}/published"
        response = self.session.get(f"{self.api}{path}", timeout=60)
        if response.status_code == 404:
            return None
        if not response.ok:
            raise DockstoreError(f"GET {path} returned {response.status_code}: {response.text[:500]}")
        return response.json()["id"]

    def create_collection(self, organization_id, name, display_name, topic):
        collection = {"name": name, "displayName": display_name, "topic": topic}
        return self._request("POST", f"/organizations/{organization_id}/collections", json=collection).json()["id"]

    def add_entry(self, organization_id, collection_id, entry_id):
        self._request(
            "POST",
            f"/organizations/{organization_id}/collections/{collection_id}/entry",
            params={"entryId": entry_id},
        )

    def remove_entry(self, organization_id, collection_id, entry_id, version_name):
        params = {"entryId": entry_id}
        if version_name:
            params["versionName"] = version_name
        self._request(
            "DELETE", f"/organizations/{organization_id}/collections/{collection_id}/entry", params=params
        )


def sync(config, desired, dockstore, trs_org, apply=False, prune=False):
    """
    Create the collections Dockstore is missing and add the workflows that
    aren't in theirs. Memberships Dockstore has beyond the config are only
    listed, unless prune is set.

    Nothing is written without apply. Returns the number of writes Dockstore
    refused.
    """
    failures = []

    def attempt(write, *args):
        # One entry Dockstore refuses mustn't hold up all the others, today and
        # on every later run
        try:
            return write(*args)
        except DockstoreError as error:
            failures.append(error)
            print(f"::error::{error}")

    organization_id = dockstore.organization_id(config["organization"])
    remote = dockstore.collections(organization_id)
    collection_ids = {collection["name"]: collection["id"] for collection in remote}
    memberships = [
        Membership(collection["name"], entry["entryPath"], entry["id"], entry.get("versionName"))
        for collection in remote
        for entry in collection["entries"]
    ]
    entry_ids = {membership.entry_path: membership.entry_id for membership in memberships}
    present = {(membership.entry_path, membership.collection) for membership in memberships}
    wanted = {(entry_path, name) for entry_path, names in desired.items() for name in names}
    print(
        f"{len(desired)} workflows in the repository; Dockstore organization {config['organization']} "
        f"has {len(remote)} collections holding {len(entry_ids)} entries"
    )

    changes = 0
    for name, collection in config["collections"].items():
        if name in collection_ids:
            continue
        changes += 1
        print(f"create collection {name} ({collection['displayName']})")
        if apply:
            collection_id = attempt(
                dockstore.create_collection, organization_id, name, collection["displayName"], collection["topic"]
            )
            if collection_id is not None:
                collection_ids[name] = collection_id

    for entry_path, name in sorted(wanted - present):
        if entry_path not in entry_ids:
            entry_ids[entry_path] = dockstore.published_entry_id(entry_path)
        if entry_ids[entry_path] is None:
            # Dockstore registers a workflow some time after its first release is
            # deployed. ::warning:: puts it on the run summary, so an entry that
            # never appears gets noticed.
            print(f"::warning::Not published on Dockstore yet, {name} has to wait for a later run: {entry_path}")
            continue
        if apply and name not in collection_ids:
            # Creating the collection failed above
            continue
        changes += 1
        print(f"add {entry_path} to {name}")
        if apply:
            attempt(dockstore.add_entry, organization_id, collection_ids[name], entry_ids[entry_path])

    # Only what the config speaks for: a collection someone keeps by hand, or an
    # entry from another GitHub organization, is none of its business
    extra = sorted(
        (
            membership
            for membership in memberships
            if (membership.entry_path, membership.collection) not in wanted
            and membership.collection in config["collections"]
            and membership.entry_path.startswith(f"github.com/{trs_org}/")
        ),
        key=lambda membership: (membership.entry_path, membership.collection),
    )
    for membership in extra:
        if not prune:
            print(f"extra: {membership.entry_path} is in {membership.collection}, but not in {CONFIG_NAME}")
            continue
        changes += 1
        print(f"remove {membership.entry_path} from {membership.collection}")
        if apply:
            attempt(
                dockstore.remove_entry,
                organization_id,
                collection_ids[membership.collection],
                membership.entry_id,
                membership.version_name,
            )

    if extra and not prune:
        print(f"{len(extra)} extra membership(s) left alone; --prune removes them")
    if not changes:
        print("Nothing to change")
    elif not apply:
        print(f"Dry run: {changes} change(s) not made; --apply makes them")
    return len(failures)


def parse_args(argv=None):
    parser = argparse.ArgumentParser(
        description=f"Keep the Dockstore collections in step with {CONFIG_NAME}.",
    )
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("check", help="Check that every workflow is in a collection. Doesn't use the network.")
    sync_parser = commands.add_parser(
        "sync", help="Compare with Dockstore and print what differs. Changes nothing without --apply."
    )
    sync_parser.add_argument(
        "--apply",
        action="store_true",
        help="Make the changes. $DOCKSTORE_TOKEN has to hold the Dockstore token of a maintainer or admin "
        "of the organization.",
    )
    sync_parser.add_argument(
        "--prune",
        action="store_true",
        help=f"Also take workflows out of collections that {CONFIG_NAME} doesn't put them in. "
        "That includes workflows that were deleted from this repository. Collections the file "
        "doesn't list and entries of other GitHub organizations are left alone.",
    )
    return parser.parse_args(argv)


def main(argv=None):
    args = parse_args(argv)
    try:
        config = load_config()
    except yaml.YAMLError as error:
        print(f"::error::{CONFIG_NAME}: {' '.join(str(error).split())}")
        return 1
    trs_org = load_site_config()["trsOrg"]
    desired, errors = check_config(config, WORKFLOWS_DIR, trs_org)
    if errors:
        for error in errors:
            print(f"::error::{error}")
        return 1
    if args.command == "check":
        print(f"{len(desired)} workflows, all in a collection")
        return 0

    token = os.environ.get("DOCKSTORE_TOKEN")
    if args.apply and not token:
        print("::error::--apply needs a Dockstore token in $DOCKSTORE_TOKEN")
        return 1
    failures = sync(config, desired, Dockstore(token=token), trs_org, apply=args.apply, prune=args.prune)
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
