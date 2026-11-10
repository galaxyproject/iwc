import json
import shutil
from pathlib import Path

import pytest
import yaml

import workflow_manifest
from create_mermaid import load_native_workflow, workflow_to_mermaid_diagrams

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
    workflow_manifest.stage_workflow_file(str(DATA / "cat.ga"), None, "cat-main")
    assert [p.name for p in output_dir.iterdir()] == ["cat-main.ga"]
    assert (output_dir / "cat-main.ga").read_bytes() == (DATA / "cat.ga").read_bytes()


@pytest.mark.parametrize("suffix", [".gxwf.yml", ".gxwf.yaml"])
def test_format2_is_staged_as_converted_ga_and_original(tmp_path, output_dir, suffix):
    source = tmp_path / f"cat{suffix}"
    shutil.copy(DATA / "cat.gxwf.yml", source)
    definition = load_native_workflow(str(source))
    workflow_manifest.stage_workflow_file(str(source), definition, "cat-main")
    assert json.loads((output_dir / "cat-main.ga").read_text()) == definition
    assert (output_dir / f"cat-main{suffix}").read_bytes() == source.read_bytes()


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

    (repo_details,) = workflow_manifest.find_and_load_compliant_workflows(
        str(tmp_path / "workflows")
    )
    (workflow,) = repo_details["workflows"]
    assert workflow["definition"]["name"] == "Concatenate fixture"
    assert [t["doc"] for t in workflow["tests"]] == ["fixture test"]
