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
"""

import argparse
import json
import os
import shutil
from pathlib import Path

# pip install 'rocrate==0.4.0'
from rocrate.rocrate import ROCrate
from rocrate.model.person import Person
from rocrate.model.entity import Entity

# Defaults
OWNER = "galaxyproject"
REPO = "iwc"
GH_WORKFLOW = "workflow_test.yml"
TARGET_OWNER = "iwc-workflows"
GH_API_URL = "https://api.github.com"
PLANEMO_VERSION = ">=0.74.4"
PLANEMO_TEST_SUFFIXES = ["-tests", "_tests", "-test", "_test"]
PLANEMO_TEST_EXTENSIONS = [".yml", ".yaml", ".json"]


def get_wf_id(crate_dir):
    ids = [_.name for _ in os.scandir(crate_dir) if _.name.endswith(".ga")]
    if not ids:
        raise RuntimeError(".ga workflow file not found")
    return ids[0]


def get_planemo_id(crate_dir, wf_id):
    tag, _ = os.path.splitext(wf_id)
    for suffix in PLANEMO_TEST_SUFFIXES:
        for ext in PLANEMO_TEST_EXTENSIONS:
            planemo_id = f"{tag}{suffix}{ext}"
            planemo_source = Path(crate_dir) / planemo_id
            if planemo_source.is_file():
                return planemo_id, planemo_source
    raise RuntimeError(f"Planemo test file not found in {crate_dir}")


def handle_creator(ga_json, crate, workflow):
    try:
        gh_creators = ga_json["creator"]
    except KeyError:
        return
    ro_creators = []
    for c in gh_creators:
        is_person = c.get("class").lower() not in {"organisation", "organization"}
        id_ = c.get("identifier") if is_person else c.get("url")
        name = c.get("name")
        if not id_ and not name:
            continue
        properties = {"name": name} if name else {}
        if is_person:
            creator = Person(crate, identifier=id_, properties=properties)
        else:
            # no explicit Organization in ro-crate-py model yet
            properties["@type"] = "Organization"
            creator = Entity(crate, identifier=id_, properties=properties)
        ro_creators.append(creator)
    if ro_creators:
        crate.add(*ro_creators)
        workflow["creator"] = ro_creators


def make_crate(repo_dir_entry, target_owner, resource, planemo_version):
    crate_dir = repo_dir_entry.path
    wf_id = get_wf_id(crate_dir)
    planemo_id, planemo_source = get_planemo_id(crate_dir, wf_id)
    crate = ROCrate(gen_preview=False)
    wf_source = Path(crate_dir) / wf_id
    with open(wf_source) as f:
        code = json.load(f)
    workflow = crate.add_workflow(wf_source, wf_id, main=True,
                                  lang="galaxy", gen_cwl=False)
    handle_creator(code, crate, workflow)
    workflow["name"] = code.get("name", repo_dir_entry.name)
    try:
        workflow["version"] = code["release"]
    except KeyError:
        pass
    wf_url = f"https://github.com/{target_owner}/{repo_dir_entry.name}"
    workflow["url"] = crate.root_dataset["isBasedOn"] = wf_url
    try:
        crate.root_dataset["license"] = code["license"]
    except KeyError:
        pass
    readme_source = Path(crate_dir) / "README.md"
    if readme_source.is_file():
        crate.add_file(readme_source, "README.md")
    suite = crate.add_test_suite(identifier="#test1")
    crate.add_test_instance(suite, GH_API_URL, resource=resource,
                            service="github", identifier="test1_1")
    crate.add_test_definition(suite, source=planemo_source,
                              dest_path=planemo_id, engine="planemo",
                              engine_version=planemo_version)
    crate.metadata.write(crate_dir)


def main(args):
    if args.zip_dir:
        zip_dir = Path(args.zip_dir)
        zip_dir.mkdir(parents=True, exist_ok=True)
    resource = f"repos/{args.owner}/{args.repo}/actions/workflows/{args.workflow}"
    for root in args.root:
        for entry in os.scandir(root):
            if not entry.is_dir():
                continue
            print(f"processing {entry.path}")
            if args.no_overwrite and (Path(entry.path) / "ro-crate-metadata.json").is_file():
                print("  crate exists, not overwriting")
            else:
                make_crate(entry, args.target_owner, resource, args.planemo_version)
            if args.zip_dir:
                # if args.no_overwrite, zip existing crates
                path = zip_dir / f"{entry.name}.crate"
                archive = shutil.make_archive(path, "zip", entry.path)
                print(f"  archived as {archive}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawTextHelpFormatter
    )
    parser.add_argument("root", metavar="ROOT_DIR", help="top-level directory",
                        nargs="*", default=[os.getcwd()])
    parser.add_argument("--owner", metavar="STRING", default=OWNER,
                        help="owner of the github workflow that runs the tests")
    parser.add_argument("--repo", metavar="STRING", default=REPO,
                        help="repository that contains the github workflow")
    parser.add_argument("--workflow", metavar="STRING", default=GH_WORKFLOW,
                        help="github workflow file name (basename)")
    parser.add_argument("--target-owner", metavar="STRING", default=TARGET_OWNER,
                        help="target github owner for repository deployment")
    parser.add_argument("--planemo-version", metavar="STRING", default=PLANEMO_VERSION,
                        help="planemo version required to test the workflows")
    parser.add_argument("--zip-dir", metavar="DIR_PATH",
                        help="create Workflow RO-Crate zip archives in this directory")
    parser.add_argument("--no-overwrite", action="store_true",
                        help="do not overwrite existing crates")
    main(parser.parse_args())
