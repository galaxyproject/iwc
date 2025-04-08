import os
import logging

import requests

from bioblend import galaxy

DOCKSTORE_API_URL = "https://dockstore.org/api/ga4gh/trs/v2/tools"
DOCKSTORE_API_PARAMS = {"organization": "iwc-workflows"}

GALAXIES_TO_UPDATE_CREDENTIALS = [
    {"url": "https://usegalaxy.org", "key": os.getenv("IWC_API_KEY_USEGALAXY_ORG")},
    {"url": "https://usegalaxy.eu", "key": os.getenv("IWC_API_KEY_USEGALAXY_EU")},
    {
        "url": "https://usegalaxy.org.au",
        "key": os.getenv("IWC_API_KEY_USEGALAXY_ORG_AU"),
    },
]

logging.getLogger().setLevel(logging.INFO)

# get all IWC workflows from Dockstore
dockstore_wfs = requests.get(DOCKSTORE_API_URL, params=DOCKSTORE_API_PARAMS).json()

# find the dockstore workflows which are not on Galaxy and install them
for galaxy_credentials in GALAXIES_TO_UPDATE_CREDENTIALS:
    if not galaxy_credentials["key"]:
        logging.error(f"API key not available for {galaxy_credentials['url']}!")
        continue
    gi = galaxy.GalaxyInstance(**galaxy_credentials)

    # get all current workflows on the Galaxy server
    galaxy_wfs = gi.workflows.get_workflows()
    # a hack: we use a dataset which is tagged with the TRS ids of all already published workflows.
    # before installing new workflows, we check if the TRS id is in this list and if not we install.
    # when https://github.com/galaxyproject/galaxy/pull/13376 is available on all servers the workflows
    # will be annotated directly with the TRS ids and we can remove this.
    tagged_dataset = gi.datasets.get_datasets(limit=1, order="create_time-asc")[0]
    newly_installed_wf_trs_ids = []
    logging.info(f"Starting installation on {gi.base_url}...")

    for dockstore_wf in dockstore_wfs:
        for versioned_dockstore_wf in dockstore_wf["versions"]:
            if versioned_dockstore_wf["id"].split(":")[-1] == "main":
                continue  # no point installing non-release versions
            if versioned_dockstore_wf["id"].lstrip("#") not in tagged_dataset["tags"]:
                logging.info(f"Starting installation of {versioned_dockstore_wf['id']}")
                # workflow missing - let's install it
                payload = {
                    "archive_source": "trs_tool",
                    "trs_server": "dockstore",
                    "trs_tool_id": versioned_dockstore_wf["id"].split(":")[0],
                    "trs_version_id": versioned_dockstore_wf["name"],
                    "importable": True,  # we have to set this here due to https://github.com/galaxyproject/galaxy/issues/10683
                }
                trs_import = gi.make_post_request(
                    f"{gi.url}/workflows", payload=payload
                )

                if trs_import["status"] == "success":
                    # Import successful -> all tools must be installed
                    # strip imported from the name and publish
                    imported_wf = gi.workflows.show_workflow(trs_import["id"])
                    gi.workflows.update_workflow(  # fix name and tag with trs ID
                        workflow_id=imported_wf["id"],
                        name=imported_wf["name"].rstrip(
                            " (imported from uploaded file)"
                        )
                        + " (release "  # include release in the name otherwise the user can't find it
                        + versioned_dockstore_wf["id"].split(":")[-1]
                        + ")",
                        published=True,
                    )
                    newly_installed_wf_trs_ids.append(
                        versioned_dockstore_wf["id"].lstrip("#")
                    )  # need to strip the # as it gets converted to 'name:'

                    logging.info(
                        f"Workflow {versioned_dockstore_wf['id']} imported and published successfully."
                    )
                else:
                    # Some tools are missing or there was another failure - log and delete the workflow
                    logging.error(
                        f"Error importing {versioned_dockstore_wf['id']} with message {trs_import.get('message')}"
                    )
                    if trs_import.get("id"):
                        gi.workflows.delete_workflow(trs_import["id"])  # tidy up
            else:
                logging.info(f"{versioned_dockstore_wf['id']} already installed.")

    # add TRS ids of new wfs to tagged_dataset
    logging.info("Recording TRS ids of newly added workflows...")
    gi.histories.update_dataset(
        history_id=tagged_dataset["history_id"],
        dataset_id=tagged_dataset["id"],
        tags=tagged_dataset["tags"] + newly_installed_wf_trs_ids,
    )
    logging.info(f"Installation on {gi.base_url} complete.")
