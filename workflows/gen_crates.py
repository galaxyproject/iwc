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


def main():
    for entry in os.scandir(ROOT):
        if not entry.is_dir():
            continue
        crate_dir = entry.path
        crate = ROCrate(crate_dir, init=True, load_preview=True)
        ids = [_.id for _ in crate.data_entities if _.id.endswith(".ga")]
        assert len(ids) == 1
        wf_id = ids[0]
        wf_source = pathlib.Path(crate_dir) / wf_id
        with open(wf_source) as f:
            code = json.load(f)
        author = [_["name"] for _ in code["creator"]]
        if len(author) == 1:
            author = author[0]
        workflow = crate.add_workflow(wf_source, wf_id, main=True,
                                      lang="galaxy", gen_cwl=False)
        workflow["name"] = code["name"]
        crate.root_dataset["author"] = author
        crate.root_dataset["isBasedOn"] = "https://github.com/iwc-workflows/{entry.name}"
        crate.root_dataset["license"] = code["license"]
        suite = crate.add_test_suite(identifier="#test1")
        crate.add_test_instance(suite, GH_URL, resource=GH_RESOURCE,
                                service="github", identifier="test1_1")
        crate.metadata.write(crate_dir)


if __name__ == "__main__":
    main()
