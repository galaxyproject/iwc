import os
import json
import yaml
import requests
import re
import shutil
from urllib.parse import quote_plus
from create_mermaid import walk_directory
from planemo.galaxy.workflows import job_template

OUTPUT_DIR = "website/public/data"


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
    date_match = re.search(
        r"##\s*\[[^\]]+\]\s*-\s*(\d{4}-\d{2}-\d{2})", changelog_content
    )

    if date_match:
        return date_match.group(1)
    return None


def process_test_file(workflow_test_path, root):
    with open(workflow_test_path) as f:
        tests = yaml.safe_load(f)
    # Process test dictionary to replace path keys with location keys
    if tests:
        for test in tests:
            for input_item in test["job"].values():
                path_to_location(input_item, root)
    return tests


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
                    workflow['workflow_job_input'] = job_template(workflow_path)
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
                workflow["iwcID"] = create_safe_identifier(trsID)

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
                    print(f"DOI Missing: {trsID}")
                    workflow["doi"] = None

                if not "testParameterFiles" in workflow:
                    print(f"{root}/.dockstore does not contain testParameterFiles. Looking for file...")
                    workflow_test_path = f"{workflow_path.rsplit('.ga', 1)[0]}-tests.yml"
                    if not os.path.exists(workflow_test_path):
                        workflow_test_path = f"{workflow_path.rsplit('.ga', 1)[0]}-test.yml"
                    if os.path.exists(workflow_test_path):
                        print(f"file found at {workflow_test_path}")
                        workflow["tests"] = process_test_file(workflow_test_path, root)
                    else:
                        print(f"Test Missing: {workflow_test_path}")
                else:
                    tests = []
                    for test in workflow["testParameterFiles"]:
                        workflow_test_path = os.path.join(root, test.lstrip("/"))
                        if os.path.exists(workflow_test_path):
                            tests += process_test_file(workflow_test_path, root)
                        else:
                            raise Exception(f"Listed test file doesn't exist: {test}")
                    workflow["tests"] = tests
    return workflow_data


def path_to_location(input_item, root):
    if isinstance(input_item, dict):
        if input_item.get("class") == "File":
            if "path" in input_item:
                if "://" in input_item["path"]:
                    # If the path is a URL, use it directly
                    input_item["location"] = input_item["path"]
                else:
                    # Create location URL from path for downloading files
                    relative_path = os.path.join(root.replace("./", ""), input_item["path"].lstrip("/"))
                    input_item["location"] = f"https://raw.githubusercontent.com/galaxyproject/iwc/main/{relative_path}"
                    del input_item["path"]
            if "filetype" not in input_item:
                # Add filetype if not present
                # TODO: fix up the tests instead of guessing!
                location = input_item["location"]
                if "fastq.gz" in location:
                    filetype = "fastqsanger.gz"
                elif "fastqsanger.gz" in location:
                    filetype = "fastqsanger.gz"
                elif "fastq" in location:
                    filetype = "fastqsanger"
                elif "fasta.gz" in location:
                    filetype = "fasta.gz"
                elif "fasta" in location:
                    filetype = "fasta"
                elif "bam" in location:
                    filetype = "bam"
                elif "vcf" in location:
                    filetype = "vcf"
                elif "tabular" in location:
                    filetype = "tabular"
                elif "txt" in location:
                    filetype = "txt"
                elif "tsv" in location:
                    filetype = "tabular"
                elif "csv" in location:
                    filetype = "csv"
                elif "bed" in location:
                    filetype = "bed"
                else:
                    filetype = "auto"
                    print("Unknown filetype for", location)
                input_item["filetype"] = filetype
        else:
            if input_item.get("class") == "Collection":
                # If it's a directory, we can recursively call this function
                for element in input_item["elements"]:
                    path_to_location(element, root)


def write_to_json(data, filename):
    """
    Write the given data into a JSON file with the given filename.
    """
    try:
        with open(filename, "w") as f:
            json.dump(data, f, indent=4)
    except Exception as e:
        print(f"Error writing to file {filename}: {e}")


def create_safe_identifier(trs_id):
    """
    Generate a safe and pretty filename from the TRS ID, keeping only the IWC-local portion.
    For example, #workflow/github.com/iwc-workflows/amplicon/dada2 becomes amplicon-dada2

    We will also lowercase the slug.
    """
    parts = trs_id.split("iwc-workflows/")
    if len(parts) > 1:
        safe_name = parts[1].replace("/", "-")
    else:
        safe_name = trs_id.replace("#workflow/github.com/", "").replace("/", "-")
    return safe_name.lower()


def stage_workflow_file(source_path, iwc_id):
    """
    Copy a workflow .ga file to the output directory, filed by the iwcID

    Args:
        source_path: Path to the source .ga file
        iwc_id: iwc id to use as the safe filename
    """
    if not os.path.exists(source_path):
        print(f"Workflow file not found: {source_path}")
        return

    safe_filename = f"{iwc_id}.ga"
    dest_path = os.path.join(OUTPUT_DIR, safe_filename)

    try:
        shutil.copy2(source_path, dest_path)
        print(f"Copied workflow file to {dest_path}")
    except Exception as e:
        print(f"Error copying workflow file {source_path} to {dest_path}: {e}")


def stage_workflow_test_file(test_data, iwc_id):
    """
    Copy a workflow -test.yml file to the output directory, filed by the iwcID

    Args:
        test_data: test dict data
        iwc_id: iwc id to use as the safe filename
    """

    safe_filename = f"{iwc_id}-tests.yml"
    dest_path = os.path.join(OUTPUT_DIR, safe_filename)

    if test_data is None or len(test_data) == 0:
        print(f"Not test data found for workflow {iwc_id}.ga")
        return

    with open(dest_path, "w") as test_yaml:
        yaml.dump(test_data, test_yaml, default_flow_style=False)


if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    walk_directory("./workflows")
    workflow_data = find_and_load_compliant_workflows("./workflows")

    index_data = []
    for item in workflow_data:
        for workflow in item["workflows"]:
            # Create summary data for the index file
            summary_data = {
                "name": workflow["name"],
                "trsID": workflow["trsID"],
                "iwcID": workflow["iwcID"],
                "readme": workflow["readme"],
                "updated": workflow["updated"],
                "categories": workflow["categories"],
                "collections": workflow["collections"],
            }
            index_data.append(summary_data)

            # Generate safe filename
            safe_filename = f"{workflow['iwcID']}.json"

            # Write individual workflow file
            filepath = os.path.join(OUTPUT_DIR, safe_filename)
            print(f"Writing workflow to {filepath}")
            write_to_json(workflow, filepath)

    # Write index file
    write_to_json(index_data, os.path.join(OUTPUT_DIR, "index.json"))

    # Stage .ga and test.yml files for the website
    for item in workflow_data:
        for workflow in item["workflows"]:
            workflow_path = os.path.join(
                item["path"], workflow["primaryDescriptorPath"].lstrip("/")
            )
            stage_workflow_file(workflow_path, workflow["iwcID"])
            stage_workflow_test_file(workflow.get('tests', None), workflow["iwcID"])

    # Keep original manifest
    write_to_json(workflow_data, "workflow_manifest.json")
