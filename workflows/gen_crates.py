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

Workflow repositories are searched for starting from the specified root
directories (the default is to search below the current directory). Uses the
same searching logic and definition of repository as the ci_find_repos Planemo
command (any directory with a .shed.yml or .dockstore.yml file).

Workflow repositories are expected to contain:

- the .ga workflow file, e.g., "consensus-from-variation.ga";
- a Planemo test file with the same name as the workflow file, but with a
  "-test.yml" extension, e.g., "consensus-from-variation-test.yml".
"""

import argparse
import json
import os
import shutil
import tempfile
from pathlib import Path

import planemo
import requests
from planemo.context import PlanemoContext
from planemo.shed import find_raw_repositories
from planemo.ci import filter_paths
from rocrate.rocrate import ROCrate
from rocrate.model.person import Person
from rocrate.model.entity import Entity

# Defaults
OWNER = "galaxyproject"
REPO = "iwc"
GH_WORKFLOW = "workflow_test.yml"
TARGET_OWNER = "iwc-workflows"
GH_API_URL = "https://api.github.com"
PLANEMO_VERSION = f">={planemo.__version__}"
PLANEMO_TEST_SUFFIXES = ["-tests", "_tests", "-test", "_test"]
PLANEMO_TEST_EXTENSIONS = [".yml", ".yaml", ".json"]
HUB_URL = "https://workflowhub.eu"
HUB_API_KEY = os.getenv("HUB_API_KEY")


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


def make_crate(crate_dir, target_owner, resource, planemo_version):
    wf_id = get_wf_id(crate_dir)
    planemo_id, planemo_source = get_planemo_id(crate_dir, wf_id)
    crate = ROCrate(gen_preview=False)
    wf_source = Path(crate_dir) / wf_id
    with open(wf_source) as f:
        code = json.load(f)
    workflow = crate.add_workflow(wf_source, wf_id, main=True,
                                  lang="galaxy", gen_cwl=False)
    handle_creator(code, crate, workflow)
    workflow["name"] = code.get("name", crate_dir.name)
    try:
        workflow["version"] = code["release"]
    except KeyError:
        pass
    wf_url = f"https://github.com/{target_owner}/{crate_dir.name}"
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


def find_repos(paths, exclude=()):
    """\
    Find all workflow directories below each path in ``paths``.

    Same as ``planemo ci_find_repos``.
    """
    ctx = PlanemoContext()
    kwargs = dict(recursive=True, fail_fast=True, chunk_count=1, chunk=0, exclude=exclude)
    raw_repos = [_.path for _ in find_raw_repositories(ctx, paths, **kwargs)]
    return [Path(_) for _ in filter_paths(ctx, raw_repos, path_type="repo", **kwargs)]


def upload_crate(crate_archive, proj_id, hub_url=HUB_URL):
    # TODO: create new version if workflow exists
    if not HUB_API_KEY:
        raise RuntimeError("No API key set")
    headers = {"authorization": f"Token {HUB_API_KEY}"}
    with open(crate_archive, "rb") as f:
        payload = {
            "ro_crate": (Path(crate_archive).name, f),
            "workflow[project_ids][]": (None, proj_id)
        }
        r = requests.post(hub_url + "/workflows", headers=headers, payload=payload)
    r.raise_for_status()
    # update access policy
    wf_id = r.json()["data"]["id"]
    headers.update({
        "Content-type": "application/vnd.api+json",
        "Accept": "application/vnd.api+json",
        "Accept-Charset": "ISO-8859-1",
    })
    payload = {
        "data": {
            "id": wf_id,
            "type": "workflows",
            "attributes": {
                "policy": {
                    "access": "download",
                    "permissions": [
                        {
                            "resource": {"id": proj_id, "type": "projects"},
                            "access": "edit"
                        }
                    ]
                }
            }
        }
    }
    r = requests.patch(hub_url + f"/workflows/{wf_id}", headers=headers, json=payload)
    r.raise_for_status()
    return r.json()


def main(args):
    junk = []
    if args.upload and not args.zip_dir:
        args.zip_dir = tempfile.mkdtemp(prefix="iwc_")
        junk.append(args.zip_dir)
    if args.zip_dir:
        zip_dir = Path(args.zip_dir)
        zip_dir.mkdir(parents=True, exist_ok=True)
    resource = f"repos/{args.owner}/{args.repo}/actions/workflows/{args.workflow}"
    for repo in find_repos(args.root, exclude=args.exclude):
        print(f"processing {repo}")
        if args.no_overwrite and (repo / "ro-crate-metadata.json").is_file():
            print("  crate exists, not overwriting")
        else:
            make_crate(repo, args.target_owner, resource, args.planemo_version)
        if args.zip_dir:
            # if args.no_overwrite, zip existing crates
            path = zip_dir / f"{repo.name}.crate"
            archive = shutil.make_archive(path, "zip", repo)
            print(f"  archived as {archive}")
            if args.upload:
                proj_id = "33"  # FIXME
                resp = upload_crate(archive, proj_id, hub_url=args.hub_url)
                print(f"  uploaded (id = {resp['data']['id']})")
    for d in junk:
        shutil.rmtree(d)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawTextHelpFormatter
    )
    parser.add_argument("root", metavar="ROOT_DIR", help="top-level directory",
                        nargs="*", default=[os.getcwd()])
    parser.add_argument("--exclude", metavar="PATH", nargs="*", default=(),
                        help="paths to exclude while searching for workflow repos")
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
    parser.add_argument("--upload", action="store_true", help="upload crates to WorkflowHub")
    parser.add_argument("--hub-url", metavar="STRING", default=HUB_URL,
                        help="WorkflowHub URL for crate upload")
    main(parser.parse_args())
