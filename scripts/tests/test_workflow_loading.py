import shutil
from pathlib import Path

import pytest
import yaml

import workflow_manifest
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
                        }
                    },
                    "outputs": {},
                }
            ]
        )
    )
    monkeypatch.setattr(
        workflow_manifest, "get_dockstore_details", lambda trs_id: ({"id": 1}, [], [])
    )

    # An absolute --workflows outside the cwd, as a second site's build passes
    (repo_details,) = workflow_manifest.find_and_load_compliant_workflows(
        str(tmp_path / "workflows"), repo_root=str(tmp_path)
    )
    (workflow,) = repo_details["workflows"]
    assert repo_details["path"] == workflow["repoPath"] == "./workflows/lab/cat"
    assert workflow["definition"]["name"] == "Concatenate fixture"
    assert workflow["workflowFile"] == "cat-main.gxwf.yml"
    assert workflow["testFile"] == "cat-main.gxwf-tests.yml"
    assert [t["doc"] for t in workflow["tests"]] == ["fixture test"]
