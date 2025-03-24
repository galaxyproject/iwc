import os
import json
import yaml
import requests
import re
from urllib.parse import quote_plus
from create_mermaid import walk_directory


def read_contents(path: str):
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        print(f"No {os.path.basename(path)} at {path}")
    except Exception as e:
        print(f"Error reading file {path}: {e}")


def get_dockstore_details(trsID):
    hash_stripped = trsID.replace("#workflow/", "", 1)
    encoded_id = quote_plus(hash_stripped)

    # Query the top-level details of the workflow
    url_details = f"https://dockstore.org/api/workflows/path/workflow/{encoded_id}/published?include=validations%2Cauthors%2Cmetrics&subclass=BIOWORKFLOW&versionName=main"
    response = requests.get(url_details)

    details = None
    categories = []
    collections = []

    if response.status_code == 200:
        details = response.json()

        entry_id = details.get("id")
        if entry_id:
            # With the ID, request categories
            url_categories = f"https://dockstore.org/api/entries/{entry_id}/categories"
            cat_response = requests.get(url_categories)

            if cat_response.status_code == 200:
                categories_data = cat_response.json()
                for category in categories_data:
                    categories.append(category["displayName"])
            else:
                print(
                    f"Failed to get categories. Status code: {cat_response.status_code}"
                )

            # With the ID, request collections
            url_collections = (
                f"https://dockstore.org/api/entries/{entry_id}/collections"
            )
            collection_response = requests.get(url_collections)

            if collection_response.status_code == 200:
                collections_data = collection_response.json()
                for collection in collections_data:
                    collections.append(collection["collectionDisplayName"])
            else:
                print(
                    f"Failed to get collections. Status code: {collection_response.status_code}"
                )
        else:
            print("No 'id' field found in the top-level data.")
    else:
        print(f"Failed to retrieve details. Status code: {response.status_code}")
    return details, categories, collections


def extract_date_from_changelog(changelog_content):
    """
    Extract the date from the first entry in a CHANGELOG.md file.
    Expected format: ## [version] - YYYY-MM-DD
    """
    if not changelog_content:
        return None

    # Regular expression to match the date pattern in the first changelog entry
    # Looks for patterns like "## [0.13] 2025-01-27" and extracts the date
    date_match = re.search(r"##\s*\[[^\]]+\]\s*-\s*(\d{4}-\d{2}-\d{2})", changelog_content)

    if date_match:
        return date_match.group(1)
    return None


def find_and_load_compliant_workflows(directory):
    """
    Find all .dockstore.yml files in the given directory and its subdirectories.
    Read the contents of these files and add the path of the file to the content.
    Return a list of all collected data.

    """
    workflow_data = []
    for root, _, files in os.walk(directory):
        if ".dockstore.yml" in files:
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
                changelog_content = read_contents(os.path.join(root, "CHANGELOG.md"))
                workflow["changelog"] = changelog_content
                workflow["diagrams"] = read_contents(
                    f"{os.path.splitext(workflow_path)[0]}_diagrams.md"
                )

                # Extract update date from changelog
                update_date = extract_date_from_changelog(changelog_content)
                if update_date:
                    # Convert to ISO format (YYYY-MM-DDT00:00:00)
                    updated_isoformat = f"{update_date}T00:00:00"
                else:
                    updated_isoformat = None
                    print(
                        f"Could not extract date from CHANGELOG.md for {workflow_path}"
                    )

                workflow["updated"] = updated_isoformat

                dirname = os.path.dirname(workflow_path).split("/")[-1]
                trsID = f"#workflow/github.com/iwc-workflows/{dirname}/{workflow['name'] or 'main'}"
                workflow["trsID"] = trsID

                dockstore_details, categories, collections = get_dockstore_details(
                    trsID
                )

                workflow["dockstore_id"] = dockstore_details["id"]
                workflow["categories"] = categories
                workflow["collections"] = collections

                doi_selection = dockstore_details.get("doiSelection")
                concept_dois = dockstore_details.get("conceptDois")

                if doi_selection and concept_dois and doi_selection in concept_dois:
                    workflow["doi"] = concept_dois[doi_selection]["name"]
                else:
                    workflow["doi"] = None

                print(f"DOI: {workflow['doi']}")

                workflow_test_path = f"{workflow_path.rsplit('.ga', 1)[0]}-tests.yml"
                if os.path.exists(workflow_test_path):
                    with open(workflow_test_path) as f:
                        tests = yaml.safe_load(f)
                    workflow["tests"] = tests
                else:
                    print(f"no test for {workflow_test_path}")

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
