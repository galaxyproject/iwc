import os
import json
import yaml


def find_and_load_dockstore_yml(directory):
    """
    Find all .dockstore.yml files in the given directory and its subdirectories.
    Read the contents of these files and add the path of the file to the content.
    Return a list of all collected data.
    """
    workflow_data = []
    for root, _, files in os.walk(directory):
        if ".dockstore.yml" in files:
            try:
                with open(os.path.join(root, ".dockstore.yml")) as f:
                    workflow_details = yaml.safe_load(f)
                workflow_details["path"] = root
                workflow_data.append(workflow_details)
            except Exception as e:
                print(f"Error reading file {os.path.join(root, '.dockstore.yml')}: {e}")
    return workflow_data


def find_readmes(workflow_data):
    """
    Find and read README files for each workflow in the given workflow data.
    """
    for workflow in workflow_data:
        try:
            with open(os.path.join(workflow["path"], "README.md")) as f:
                workflow["readme"] = f.read()
        except Exception as e:
            print(
                f"Error reading file {os.path.join(workflow['path'], 'README.md')}: {e}"
            )
    return workflow_data


def write_to_json(data, filename):
    """
    Write the given data into a JSON file with the given filename.
    """
    try:
        with open(filename, "w") as f:
            json.dump(data, f, indent=4)
    except Exception as e:
        print(f"Error writing to file {filename}: {e}")


workflow_data = find_and_load_dockstore_yml("./workflows")
workflow_data = find_readmes(workflow_data)

write_to_json(workflow_data, "workflow_manifest.json")
