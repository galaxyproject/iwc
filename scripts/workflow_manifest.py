import os
import json
import yaml
from create_mermaid import walk_directory


def read_contents(path: str):
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        print(f"No {os.path.basename(path)} at {path}")
    except Exception as e:
        print(
            f"Error reading file {path}: {e}"
        )


def find_and_load_compliant_workflows(directory):
    """
    Find all .dockstore.yml files in the given directory and its subdirectories.
    Read the contents of these files and add the path of the file to the content.
    Return a list of all collected data.

    """
    workflow_data = []
    for root, _, files in os.walk(directory):
        if ".dockstore.yml" in files:
            try:
                dockstore_path = os.path.join(root, ".dockstore.yml")
                with open(dockstore_path) as f:
                    workflow_details = yaml.safe_load(f)
                workflow_details["path"] = root
                workflow_data.append(workflow_details)

                # Now inspect the details which are something like this:
                # version: 1.2
                # workflows:
                # - name: Velocyto-on10X-from-bundled
                #   subclass: Galaxy
                #   publish: true
                #   primaryDescriptorPath: /Velocyto-on10X-from-bundled.ga
                #   testParameterFiles:
                #   - /Velocyto-on10X-from-bundled-tests.yml
                #   authors:
                #   - name: Lucille Delisle
                #     orcid: 0000-0002-1964-4960
                # - name: Velocyto-on10X-filtered-barcodes
                #   subclass: Galaxy
                #   publish: true
                #   primaryDescriptorPath: /Velocyto-on10X-filtered-barcodes.ga
                #   testParameterFiles:
                #   - /Velocyto-on10X-filtered-barcodes-tests.yml
                #   authors:
                #   - name: Lucille Delisle
                #     orcid: 0000-0002-1964-4960

                for workflow in workflow_details["workflows"]:
                    # For each listed workflow, load the primaryDescriptorPath
                    # file, which is the actual galaxy workflow.
                    # strip leading slash from primaryDescriptorPath if present -- these are relative.
                    workflow_path = os.path.join(
                        root, workflow["primaryDescriptorPath"].lstrip("/")
                    )
                    try:
                        with open(workflow_path) as f:
                            workflow["definition"] = json.load(f)
                    except Exception as e:
                        print(
                            f"No workflow file: {os.path.join(root, workflow['primaryDescriptorPath'])}: {e}"
                        )

                    # load readme, changelog and diagrams
                    workflow["readme"] = read_contents(os.path.join(root, "README.md"))
                    workflow["changelog"] = read_contents(os.path.join(root, "CHANGELOG.md"))
                    workflow["diagrams"] = read_contents(f"{os.path.splitext(workflow_path)[0]}_diagrams.md")
                    dirname = os.path.dirname(workflow_path).split("/")[-1]
                    workflow["trsID"] = f"#workflow/github.com/iwc-workflows/{dirname}/{workflow['name'] or 'main'}"

                    workflow_test_path = f"{workflow_path.rsplit('.ga', 1)[0]}-tests.yml"
                    if os.path.exists(workflow_test_path):
                        with open(workflow_test_path) as f:
                            tests = yaml.safe_load(f)
                        workflow["tests"] = tests
                    else:
                        print(f"no test for {workflow_test_path}")

            except Exception as e:
                print(f"Error reading file {os.path.join(root, '.dockstore.yml')}: {e}")

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


if __name__ == "__main__":
    walk_directory("./workflows")
    workflow_data = find_and_load_compliant_workflows("./workflows")
    write_to_json(workflow_data, "workflow_manifest.json")
