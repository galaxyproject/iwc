import re
import shutil
from pathlib import Path

import pytest
import yaml

import workflow_manifest
from site_config import load_site_config
from create_mermaid import (
    load_expanded_format2,
    load_native_workflow,
    workflow_to_mermaid_diagrams,
)

DATA = Path(__file__).parent / "data"


def test_format2_loads_like_its_native_twin():
    # cat.gxwf.yml is gxwf-to-format2's export of cat.ga
    native = load_native_workflow(str(DATA / "cat.ga"))
    format2 = load_native_workflow(str(DATA / "cat.gxwf.yml"))
    # The definition fields the website reads
    for key in ("name", "annotation", "release", "license", "creator", "uuid", "tags"):
        assert format2[key] == native[key], key
    assert [s.get("tool_id") for s in format2["steps"].values()] == [
        s.get("tool_id") for s in native["steps"].values()
    ]
    assert all(isinstance(s["tool_state"], str) for s in format2["steps"].values())


def test_ga_is_read_as_json(tmp_path):
    # PyYAML would read this float as the string "1e-05"
    path = tmp_path / "float.ga"
    path.write_text('{"name": "float", "steps": {}, "value": 1e-05}')
    assert load_native_workflow(str(path))["value"] == 1e-05


@pytest.mark.parametrize("name", ["packed.gxwf.yml", "import-parent.gxwf.yml"])
def test_subworkflows_are_inlined(name):
    workflow = load_native_workflow(str(DATA / name))
    (step,) = [s for s in workflow["steps"].values() if s["type"] == "subworkflow"]
    inner_steps = step["subworkflow"]["steps"].values()
    assert [s["tool_id"] for s in inner_steps if s["type"] == "tool"] == ["cat1"]
    workflow_to_mermaid_diagrams(workflow)


@pytest.fixture
def output_dir(tmp_path, monkeypatch):
    out = tmp_path / "out"
    out.mkdir()
    monkeypatch.setattr(workflow_manifest, "OUTPUT_DIR", str(out))
    return out


def test_native_workflow_is_staged_verbatim(output_dir):
    workflow_manifest.stage_workflow_file(str(DATA / "cat.ga"), "cat-main.ga")
    assert [p.name for p in output_dir.iterdir()] == ["cat-main.ga"]
    assert (output_dir / "cat-main.ga").read_bytes() == (DATA / "cat.ga").read_bytes()


@pytest.mark.parametrize(
    "name", ["cat.gxwf.yml", "import-parent.gxwf.yml", "packed.gxwf.yml"]
)
def test_format2_is_staged_as_one_self_contained_file(output_dir, name):
    workflow_manifest.stage_workflow_file(str(DATA / name), "cat-main.gxwf.yml")
    staged = output_dir / "cat-main.gxwf.yml"
    assert [p.name for p in output_dir.iterdir()] == [staged.name]
    # output_dir has no import-child.gxwf.yml, so this only loads if nothing is
    # left to resolve
    assert load_expanded_format2(str(staged)) == load_expanded_format2(str(DATA / name))


@pytest.mark.parametrize(
    "source, workflow_file, test_file",
    [
        ("cat.ga", "cat-main.ga", "cat-main-tests.yml"),
        ("cat.gxwf.yml", "cat-main.gxwf.yml", "cat-main.gxwf-tests.yml"),
        ("cat.gxwf.yaml", "cat-main.gxwf.yml", "cat-main.gxwf-tests.yml"),
    ],
)
def test_staged_tests_are_where_planemo_looks(source, workflow_file, test_file):
    # planemo test drops only the last extension to find the tests
    assert workflow_manifest.staged_file_names(source, "cat-main") == (
        workflow_file,
        test_file,
    )


def write_repo(workflows_dir, relative_path):
    repo = workflows_dir / relative_path
    repo.mkdir(parents=True)
    shutil.copy(DATA / "cat.ga", repo / "cat.ga")
    # Written here rather than committed, for the reason given in the test below
    (repo / ".dockstore.yml").write_text(
        yaml.safe_dump(
            {
                "version": 1.2,
                "workflows": [
                    {"name": "main", "subclass": "Galaxy", "publish": True, "primaryDescriptorPath": "/cat.ga"}
                ],
            }
        )
    )


def load_collections(tmp_path, monkeypatch, fallback, dockstore_collections):
    workflows_dir = tmp_path / "workflows"
    write_repo(workflows_dir, "variant-calling/curated")
    write_repo(workflows_dir, "variant-calling/uncurated")
    write_repo(workflows_dir, "epigenetics/uncurated-too")
    write_repo(workflows_dir, "no-category")
    monkeypatch.setattr(
        workflow_manifest,
        "get_dockstore_details",
        lambda trs_id: ({"id": 1}, [], dockstore_collections if "/curated/" in trs_id else []),
    )
    config = {**load_site_config({}), "collectionFallback": fallback}
    repos = workflow_manifest.find_and_load_compliant_workflows(
        str(workflows_dir), repo_root=str(tmp_path), site_config=config
    )
    return {repo["path"]: repo["workflows"][0]["collections"] for repo in repos}


def test_collections_come_only_from_dockstore_by_default(tmp_path, monkeypatch):
    assert load_collections(tmp_path, monkeypatch, "none", ["Variant Calling"]) == {
        "./workflows/variant-calling/curated": ["Variant Calling"],
        "./workflows/variant-calling/uncurated": [],
        "./workflows/epigenetics/uncurated-too": [],
        "./workflows/no-category": [],
    }


def test_directory_fallback_fills_missing_collections(tmp_path, monkeypatch):
    assert load_collections(tmp_path, monkeypatch, "directory", ["Genome Assembly"]) == {
        # Dockstore's answer wins when there is one
        "./workflows/variant-calling/curated": ["Genome Assembly"],
        "./workflows/variant-calling/uncurated": ["Variant Calling"],
        "./workflows/epigenetics/uncurated-too": ["Epigenetics"],
        "./workflows/no-category": [],
    }


def test_format2_repo_is_loaded_with_its_tests(tmp_path, monkeypatch):
    # .dockstore.yml is written here rather than committed: planemo treats any
    # directory holding one as a workflow repository to lint and test
    repo = tmp_path / "workflows" / "lab" / "cat"
    repo.mkdir(parents=True)
    shutil.copy(DATA / "cat.gxwf.yml", repo / "cat.gxwf.yml")
    (repo / ".dockstore.yml").write_text(
        yaml.safe_dump(
            {
                "version": 1.2,
                "workflows": [
                    {
                        "name": "main",
                        "subclass": "Galaxy",
                        "publish": True,
                        "primaryDescriptorPath": "/cat.gxwf.yml",
                    }
                ],
            }
        )
    )
    # Planemo's naming: drop only the last extension
    (repo / "cat.gxwf-tests.yml").write_text(
        yaml.safe_dump(
            [
                {
                    "doc": "fixture test",
                    "job": {
                        "input dataset": {
                            "class": "File",
                            "location": "https://example.org/input.txt",
                            "filetype": "txt",
                        },
                        "local dataset": {"class": "File", "path": "test-data/in put.txt"},
                    },
                    "outputs": {},
                }
            ]
        )
    )
    monkeypatch.setattr(
        workflow_manifest, "get_dockstore_details", lambda trs_id: ({"id": 1}, [], [])
    )
    lab_config = {
        **load_site_config({}),
        "trsOrg": "iwc-lab-workflows",
        "rawDataBase": "https://raw.githubusercontent.com/galaxyproject/iwc-lab/main/",
    }

    # An absolute --workflows outside the cwd, as a second site's build passes
    (repo_details,) = workflow_manifest.find_and_load_compliant_workflows(
        str(tmp_path / "workflows"), repo_root=str(tmp_path), site_config=lab_config
    )
    (workflow,) = repo_details["workflows"]
    assert repo_details["path"] == workflow["repoPath"] == "./workflows/lab/cat"
    assert workflow["trsID"] == "#workflow/github.com/iwc-lab-workflows/cat/main"
    assert workflow["iwcID"] == "cat-main"
    assert workflow["tests"][0]["job"]["local dataset"]["location"] == (
        "https://raw.githubusercontent.com/galaxyproject/iwc-lab/main/workflows/lab/cat/test-data/in%20put.txt"
    )
    assert workflow["definition"]["name"] == "Concatenate fixture"
    assert workflow["workflowFile"] == "cat-main.gxwf.yml"
    assert workflow["testFile"] == "cat-main.gxwf-tests.yml"
    assert [t["doc"] for t in workflow["tests"]] == ["fixture test"]


@pytest.mark.parametrize(
    "trs_id, trs_org, expected",
    [
        ("#workflow/github.com/iwc-workflows/amplicon/dada2", "iwc-workflows", "amplicon-dada2"),
        # The org's name also shows up inside the repository name or the host
        ("#workflow/github.com/lab/my-lab/main", "lab", "my-lab-main"),
        ("#workflow/github.com/lab/my-lab/other", "lab", "my-lab-other"),
        ("#workflow/github.com/com/tools/main", "com", "tools-main"),
    ],
)
def test_safe_identifier_drops_only_the_org_prefix(trs_id, trs_org, expected):
    assert workflow_manifest.create_safe_identifier(trs_id, trs_org) == expected


def site_slugs(collection):
    # The two ways the website turns a collection name into a URL: the page
    # route in collection/[slug].astro and navigateToCollection in utils
    route = collection.lower().replace(" ", "-")
    link = re.sub(r"[^a-z0-9-]", "", re.sub(r"\s+", "-", collection.lower()))
    return route, link


@pytest.mark.parametrize(
    "directory, expected",
    [
        ("variant-calling", "Variant Calling"),
        ("genome_annotation", "Genome Annotation"),
        ("chip--seq", "Chip Seq"),
        ("single.cell", "Single Cell"),
    ],
)
def test_directory_collection_links_to_its_own_page(directory, expected):
    collection = workflow_manifest.directory_collection(f"workflows/{directory}/repo", "workflows")
    assert collection == expected
    route, link = site_slugs(collection)
    assert route == link


def test_workflows_outside_the_repo_root_are_refused(tmp_path):
    # Paths relative to the repo root would start with ../ and every GitHub
    # and test-data link built from them would be broken
    write_repo(tmp_path / "lab" / "workflows", "variant-calling/cat")
    (tmp_path / "iwc").mkdir()
    with pytest.raises(ValueError, match="isn't inside"):
        workflow_manifest.find_and_load_compliant_workflows(
            str(tmp_path / "lab" / "workflows"), repo_root=str(tmp_path / "iwc"), site_config=load_site_config({})
        )
