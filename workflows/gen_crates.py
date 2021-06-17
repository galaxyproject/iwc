# Copyright (c) 2021 CRS4
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

"""\
Generate RO-Crate metadata for workflow repositories.

Assumes a two-tier directory structure where:

- the top-level directory represents a workflow category, e.g.,
  `sars-cov-2-variant-calling`;
- level 2 directories represent individual workflow repositories, e.g.,
  `sars-cov-2-consensus-from-variation`.

Level 2 directories are expected to contain:

- the `.ga` workflow file, e.g., `consensus-from-variation.ga`;
- a [Planemo](https://github.com/galaxyproject/planemo) test file with the
  same name as the workflow file, but with a `-test.yml` extension, e.g.,
  `consensus-from-variation-test.yml`;
- a `README.md` file.
"""

import argparse
import json
import os
import pathlib

# pip install 'rocrate==0.4.0'
from rocrate.rocrate import ROCrate

GH_URL = "https://api.github.com"
GH_RESOURCE = "repos/galaxyproject/iwc/actions/workflows/workflow_test.yml"

PLANEMO_VERSION = ">=0.74.3"


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


def process_repo(repo_dir_entry):
    crate_dir = repo_dir_entry.path
    wf_id = get_wf_id(crate_dir)
    planemo_id, planemo_source = get_planemo_id(crate_dir, wf_id)
    crate = ROCrate(gen_preview=False)
    wf_source = pathlib.Path(crate_dir) / wf_id
    with open(wf_source) as f:
        code = json.load(f)
    author = [_["name"] for _ in code["creator"]]
    if len(author) == 1:
        author = author[0]
    workflow = crate.add_workflow(wf_source, wf_id, main=True,
                                  lang="galaxy", gen_cwl=False)
    workflow["name"] = code["name"]
    workflow["version"] = code["release"]
    crate.root_dataset["author"] = author
    wf_url = f"https://github.com/iwc-workflows/{repo_dir_entry.name}"
    workflow["url"] = crate.root_dataset["isBasedOn"] = wf_url
    crate.root_dataset["license"] = code["license"]
    readme_source = pathlib.Path(crate_dir) / "README.md"
    assert readme_source.is_file()
    crate.add_file(readme_source, "README.md")
    suite = crate.add_test_suite(identifier="#test1")
    crate.add_test_instance(suite, GH_URL, resource=GH_RESOURCE,
                            service="github", identifier="test1_1")
    crate.add_test_definition(suite, source=planemo_source,
                              dest_path=planemo_id, engine="planemo",
                              engine_version=PLANEMO_VERSION)
    crate.metadata.write(crate_dir)


def main(args):
    for root in args.root:
        for entry in os.scandir(root):
            if not entry.is_dir():
                continue
            process_repo(entry)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawTextHelpFormatter
    )
    parser.add_argument("root", metavar="ROOT_DIR", help="top-level directory",
                        nargs="*", default=[os.getcwd()])
    main(parser.parse_args())
