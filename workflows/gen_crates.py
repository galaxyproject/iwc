# Copyright (c) 2021-2022 CRS4
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
import yaml
from planemo.context import PlanemoContext
from planemo.shed import find_raw_repositories
from planemo.ci import filter_paths
from rocrate.rocrate import ROCrate
from rocrate.model.person import Person
from rocrate.model.entity import Entity

try:
    from yaml import CLoader as Loader
except ImportError:
    from yaml import Loader

THIS_DIR = Path(__file__).absolute().parent

GH_WORKFLOW = "workflow_test.yml"
TARGET_OWNER = "iwc-workflows"
GH_API_URL = "https://api.github.com"
PLANEMO_VERSION = f">={planemo.__version__}"
HUB_URL = "https://workflowhub.eu"
HUB_API_KEY = os.getenv("HUB_API_KEY")
HUB_CFG_NAME = ".workflowhub.yml"
HUB_CFG_VERSION = "0.1"
HUB_API_HTTP_HEADERS = {
    "Content-type": "application/vnd.api+json",
    "Accept": "application/vnd.api+json",
    "Accept-Charset": "ISO-8859-1",
}
DOCKSTORE_CFG_NAME = ".dockstore.yml"
DOCKSTORE_CFG_VERSION = "1.2"
LM_URL = "https://api.lifemonitor.eu"
LM_API_KEY = os.getenv("LM_API_KEY")
CI_WORKFLOW = THIS_DIR / "wftest.yml"


class HubClient:
    def __init__(self, base_url=HUB_URL, api_key=HUB_API_KEY):
        if not api_key:
            raise RuntimeError(
                "No API key set for WorkflowHub. "
                "Please set the HUB_API_KEY environment variable"
            )
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({"authorization": f"Token {api_key}"})
        self._wf_id_to_name = {
            _["id"]: _["attributes"]["title"] for _ in self.get("/workflows")
        }
        self._proj_map = {
            _["attributes"]["title"]: _["id"] for _ in self.get("/projects")
        }
        self._wf_maps = {}

    def request(self, method, endpoint, payload=None):
        kwargs = {"headers": HUB_API_HTTP_HEADERS}
        if payload:
            kwargs["json"] = payload
        r = self.session.request(method, self.base_url + endpoint, **kwargs)
        r.raise_for_status()
        return r.json()["data"]

    def get(self, endpoint, payload=None):
        return self.request("GET", endpoint, payload=payload)

    def post(self, endpoint, payload=None):
        return self.request("POST", endpoint, payload=payload)

    def put(self, endpoint, payload=None):
        return self.request("PUT", endpoint, payload=payload)

    def patch(self, endpoint, payload=None):
        return self.request("PATCH", endpoint, payload=payload)

    def delete(self, endpoint, payload=None):
        return self.request("DELETE", endpoint, payload=payload)

    def resolve_proj(self, proj_name):
        try:
            return self._proj_map[proj_name]
        except KeyError:
            raise RuntimeError(f'"{proj_name}" project not found on {self.base_url}')

    def resolve_wf(self, proj_id, wf_name):
        try:
            m = self._wf_maps[proj_id]
        except KeyError:
            data = self.get(f"/projects/{proj_id}")
            wf_ids = [_["id"] for _ in data["relationships"]["workflows"]["data"]]
            self._wf_maps[proj_id] = m = {self._wf_id_to_name[_]: _ for _ in wf_ids}
        return m.get(wf_name)

    def upload_crate(self, crate, proj_id, wf_id=None):
        endpoint = f"{self.base_url}/workflows"
        if wf_id:
            endpoint = f"{endpoint}/{wf_id}/create_version"
        with open(crate, "rb") as f:
            payload = {
                "ro_crate": (Path(crate).name, f),
                "workflow[project_ids][]": (None, proj_id),
            }
            r = self.session.post(endpoint, files=payload)
        r.raise_for_status()
        return r.json()["data"]

    def update_wf_name(self, wf_id, wf_name):
        payload = {
            "data": {"id": wf_id, "type": "workflows", "attributes": {"title": wf_name}}
        }
        return self.patch(f"/workflows/{wf_id}", payload=payload)

    def update_wf_access(self, wf_id, proj_id):
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
                                "access": "edit",
                            }
                        ],
                    }
                },
            }
        }
        return self.patch(f"/workflows/{wf_id}", payload=payload)


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


def get_wf_records(repo_dir):
    cfg_path = repo_dir / DOCKSTORE_CFG_NAME
    if not cfg_path.is_file():
        raise RuntimeError(f"{cfg_path} not found")
    with open(cfg_path, "rt") as f:
        cfg = yaml.load(f, Loader=Loader)
    assert str(cfg["version"]) == DOCKSTORE_CFG_VERSION
    return cfg["workflows"]


def add_workflow(
    crate_dir, crate, wf_record, target_owner, planemo_version, main=False
):
    wf_id = wf_record["primaryDescriptorPath"].lstrip("/")
    wf_source = crate_dir / wf_id
    if not wf_source.is_file():
        return
    with open(wf_source) as f:
        code = json.load(f)
    workflow = crate.add_workflow(
        wf_source, wf_id, main=main, lang="galaxy", gen_cwl=False
    )
    handle_creator(code, crate, workflow)
    workflow["name"] = wf_name = f"{crate_dir.name}/{wf_record['name']}"
    if main:
        crate.root_dataset["name"] = wf_name
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
    readme_source = crate_dir / "README.md"
    if readme_source.is_file():
        crate.add_file(readme_source, "README.md")
    for i, planemo_id in enumerate(wf_record.get("testParameterFiles", [])):
        planemo_id = planemo_id.lstrip("/")
        planemo_source = Path(crate_dir) / planemo_id
        if not planemo_source.is_file():
            continue
        suite_id = f"#test_{wf_record['name']}_{i + 1}"
        instance_id = f"{suite_id}_1"
        suite = crate.add_test_suite(identifier=suite_id, main_entity=workflow)
        resource = f"repos/{target_owner}/{crate_dir.name}/actions/workflows/{CI_WORKFLOW.name}"
        crate.add_test_instance(
            suite,
            GH_API_URL,
            resource=resource,
            service="github",
            identifier=instance_id,
        )
        crate.add_test_definition(
            suite,
            source=planemo_source,
            dest_path=planemo_id,
            engine="planemo",
            engine_version=planemo_version,
        )


def make_crate(crate_dir, target_owner, planemo_version):
    crate = ROCrate(gen_preview=False)
    wf_records = get_wf_records(crate_dir)
    for i, r in enumerate(wf_records):
        main = i == 0
        add_workflow(crate_dir, crate, r, target_owner, planemo_version, main=main)
    crate.metadata.write(crate_dir)


def find_repos(paths, exclude=()):
    """\
    Find all workflow directories below each path in ``paths``.

    Same as ``planemo ci_find_repos``.
    """
    ctx = PlanemoContext()
    kwargs = dict(
        recursive=True, fail_fast=True, chunk_count=1, chunk=0, exclude=exclude
    )
    raw_repos = [_.path for _ in find_raw_repositories(ctx, paths, **kwargs)]
    return [Path(_) for _ in filter_paths(ctx, raw_repos, path_type="repo", **kwargs)]


def get_proj_and_wf(repo_dir, hub_url=HUB_URL):
    cfg_path = Path(repo_dir) / HUB_CFG_NAME
    if not cfg_path.is_file():
        raise RuntimeError(f"{cfg_path} not found")
    with open(cfg_path, "rt") as f:
        cfg = yaml.load(f, Loader=Loader)
    assert str(cfg["version"]) == HUB_CFG_VERSION
    sel = [_ for _ in cfg["registries"] if _["url"].rstrip("/") == hub_url.rstrip("/")]
    if not sel:
        raise RuntimeError(f"no entry for {hub_url} in {cfg_path}")
    entry = sel[0]
    return entry.get("project"), entry.get("workflow")


def get_hub_link(hub_api_wf):
    attrs = hub_api_wf["attributes"]
    vmap = {_["version"]: _["url"] for _ in attrs["versions"]}
    return vmap[attrs["latest_version"]]


def upload_to_lm(hub_client, proj_name, wf_name, lm_url=LM_URL):
    if not LM_API_KEY:
        raise RuntimeError(
            "No API key set for LifeMonitor. "
            "Please set the LM_API_KEY environment variable"
        )
    proj_id = hub_client.resolve_proj(proj_name)
    wf_id = hub_client.resolve_wf(proj_id, wf_name)
    print(f"  WorkflowHub id: {wf_id}")
    if wf_id is None:
        raise RuntimeError(
            f"'{wf_name}' not found in '{proj_name}' on {hub_client.base_url}"
        )
    s = requests.session()
    s.headers.update({"ApiKey": LM_API_KEY})
    # get registry uuid
    response = s.get(f"{lm_url}/registries")
    response.raise_for_status()
    registries = response.json()
    sel = [
        _
        for _ in registries["items"]
        if _["uri"].rstrip("/") == hub_client.base_url.rstrip("/")
    ]
    try:
        hub_uuid = sel[0]["uuid"]
    except IndexError:
        raise RuntimeError(f"{hub_client.base_url} not known to {lm_url}")
    # submit workflow to LifeMonitor
    wf = hub_client.get(f"/workflows/{wf_id}")
    payload = {
        "identifier": wf_id,
        "name": wf_name,
        "version": str(wf["attributes"]["latest_version"]),
        "public": True,
    }
    response = s.post(f"{lm_url}/registries/{hub_uuid}/workflows", json=payload)
    if response.status_code == 409:
        print("  workflow already exists in LifeMonitor")
    else:
        response.raise_for_status()
        print(f"  uploaded to LifeMonitor as {response.json()['uuid']}")
    return response


def main(args):
    junk = []
    if args.upload_to_hub and not args.zip_dir:
        args.zip_dir = tempfile.mkdtemp(prefix="iwc_")
        junk.append(args.zip_dir)
    if args.zip_dir:
        zip_dir = Path(args.zip_dir)
        zip_dir.mkdir(parents=True, exist_ok=True)
    args.hub_url = args.hub_url.rstrip("/")
    if args.upload_to_hub or args.upload_to_lm:
        client = HubClient(base_url=args.hub_url)
    for repo in find_repos(args.root, exclude=args.exclude):
        print(f"processing {repo}")
        if args.no_overwrite and (repo / "ro-crate-metadata.json").is_file():
            print("  crate exists, not overwriting")
        else:
            target_ci_workflow = repo / ".github" / "workflows" / CI_WORKFLOW.name
            target_ci_workflow.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(CI_WORKFLOW, target_ci_workflow)
            make_crate(repo, args.target_owner, args.planemo_version)
        if args.zip_dir:
            # if args.no_overwrite, zip existing crates
            path = zip_dir / f"{repo.name}.crate"
            archive = shutil.make_archive(path, "zip", repo)
            print(f"  archived as {archive}")
            if args.upload_to_hub:
                proj_name, wf_name = get_proj_and_wf(repo, hub_url=args.hub_url)
                if args.hub_project:
                    proj_name = args.hub_project
                if proj_name is None:
                    raise RuntimeError(
                        f"no WorkflowHub project specified for {args.hub_url}"
                    )
                proj_id = client.resolve_proj(proj_name)
                wf_id = client.resolve_wf(proj_id, wf_name)
                new_workflow = not wf_id
                data = client.upload_crate(archive, proj_id, wf_id=wf_id)
                wf_id = data["id"]
                if new_workflow:
                    data = client.update_wf_access(wf_id, proj_id)
                if wf_name and wf_name != data["attributes"]["title"]:
                    client.update_wf_name(wf_id, wf_name)
                print(f"  uploaded to WorkflowHub as {get_hub_link(data)}")
        if args.upload_to_lm:
            proj_name, wf_name = get_proj_and_wf(repo, hub_url=args.hub_url)
            if args.hub_project:
                proj_name = args.hub_project
            if proj_name is None or wf_name is None:
                raise RuntimeError(f"Can't get project and workflow name for {repo}")
            upload_to_lm(client, proj_name, wf_name, lm_url=args.lm_url)
    for d in junk:
        shutil.rmtree(d)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawTextHelpFormatter
    )
    parser.add_argument(
        "root",
        metavar="ROOT_DIR",
        help="top-level directory",
        nargs="*",
        default=[os.getcwd()],
    )
    parser.add_argument(
        "--exclude",
        metavar="PATH",
        nargs="*",
        default=(),
        help="paths to exclude while searching for workflow repos",
    )
    parser.add_argument(
        "--workflow",
        metavar="STRING",
        default=GH_WORKFLOW,
        help="github workflow file name (basename)",
    )
    parser.add_argument(
        "--target-owner",
        metavar="STRING",
        default=TARGET_OWNER,
        help="target github owner for repository deployment",
    )
    parser.add_argument(
        "--planemo-version",
        metavar="STRING",
        default=PLANEMO_VERSION,
        help="planemo version required to test the workflows",
    )
    parser.add_argument(
        "--zip-dir",
        metavar="DIR_PATH",
        help="create Workflow RO-Crate zip archives in this directory",
    )
    parser.add_argument(
        "--no-overwrite", action="store_true", help="do not overwrite existing crates"
    )
    parser.add_argument(
        "--upload-to-hub", action="store_true", help="upload crates to WorkflowHub"
    )
    parser.add_argument(
        "--hub-url",
        metavar="STRING",
        default=HUB_URL,
        help="WorkflowHub URL for crate upload",
    )
    parser.add_argument(
        "--hub-project",
        metavar="STRING",
        help="WorkflowHub project for crate upload (default: get from .workflowhub.yml)",
    )
    parser.add_argument(
        "--upload-to-lm", action="store_true", help="upload workflows to LifeMonitor"
    )
    parser.add_argument(
        "--lm-url", metavar="STRING", default=LM_URL, help="LifeMonitor submission URL"
    )
    main(parser.parse_args())
