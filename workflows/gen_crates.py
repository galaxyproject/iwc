import json
import os
import pathlib

# https://github.com/ResearchObject/ro-crate-py/tree/8548e74284ad386dbaa72223f46cc6bcdad05efb
from rocrate.rocrate import ROCrate

THIS_DIR = pathlib.Path(__file__).absolute().parent

ROOT = THIS_DIR / "sars-cov-2-variant-calling"

# github actions monitoring not supported yet by life monitor, these may change
GH_URL = "https://api.github.com/repos/galaxyproject/iwc/actions"
GH_RESOURCE = "runs"


def get_wf_id(crate_dir):
    ids = [_.name for _ in os.scandir(crate_dir) if _.name.endswith(".ga")]
    assert len(ids) == 1
    return ids[0]


def get_planemo_id(crate_dir, wf_id):
    tag, _ = os.path.splitext(wf_id)
    planemo_id = f"{tag}-test.yml"
    planemo_source = pathlib.Path(crate_dir) / planemo_id
    assert planemo_source.is_file()
    return planemo_id, planemo_source


# ro-crate-py TODO: support for NOT generating preview
def rm_preview(crate):
    cid = crate.preview.canonical_id()
    crate.default_entities.remove(crate.preview)
    crate.preview = None
    del crate._ROCrate__entity_map[cid]


def main():
    for entry in os.scandir(ROOT):
        if not entry.is_dir():
            continue
        crate_dir = entry.path
        wf_id = get_wf_id(crate_dir)
        planemo_id, planemo_source = get_planemo_id(crate_dir, wf_id)
        crate = ROCrate()
        rm_preview(crate)
        wf_source = pathlib.Path(crate_dir) / wf_id
        with open(wf_source) as f:
            code = json.load(f)
        author = [_["name"] for _ in code["creator"]]
        if len(author) == 1:
            author = author[0]
        test_data_source = pathlib.Path(crate_dir) / "test-data"
        assert test_data_source.is_dir()
        crate.add_dataset(test_data_source, "test-data")
        workflow = crate.add_workflow(wf_source, wf_id, main=True,
                                      lang="galaxy", gen_cwl=False)
        workflow["name"] = code["name"]
        crate.root_dataset["author"] = author
        wf_url = f"https://github.com/iwc-workflows/{entry.name}"
        workflow["url"] = crate.root_dataset["isBasedOn"] = wf_url
        crate.root_dataset["license"] = code["license"]
        crate.add_file(planemo_source, planemo_id)
        readme_source = pathlib.Path(crate_dir) / "README.md"
        assert readme_source.is_file()
        crate.add_file(readme_source, "README.md")
        suite = crate.add_test_suite(identifier="#test1")
        crate.add_test_instance(suite, GH_URL, resource=GH_RESOURCE,
                                service="github", identifier="test1_1")
        crate.metadata.write(crate_dir)


if __name__ == "__main__":
    main()
