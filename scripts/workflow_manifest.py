import os
import json
import yaml


def find_dockstore_yml(directory):
    dockstore_dirs = []
    for root, _, files in os.walk(directory):
        if ".dockstore.yml" in files:
            workflow_details = {}
            # read dockstore.yml and add to workflow_details
            with open(os.path.join(root, ".dockstore.yml")) as f:
                # read yaml file with pyyaml
                workflow_details = yaml.safe_load(f)
            # add path to workflow_details
            workflow_details["path"] = root
            dockstore_dirs.append(workflow_details)
    return dockstore_dirs


dockstore_dirs = find_dockstore_yml("./workflows")

with open("workflow_manifest.json", "w") as f:
    json.dump(dockstore_dirs, f, indent=4)
