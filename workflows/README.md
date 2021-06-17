# Workflows

This directory contains all IWC workflows.

The structure is as follows:

* top-level directories represent categories, e.g., `sars-cov-2-variant-calling`;
* directories right under the top level represent individual workflow repositories, e.g., `sars-cov-2-consensus-from-variation` which will be deployed to https://github.com/iwc-workflows/sars-cov-2-consensus-from-variation;
* workflow directories contain:

  * the `.ga` workflow file, e.g., `consensus-from-variation.ga`;
  * a [Planemo](https://github.com/galaxyproject/planemo) test file, with the same name as the workflow file, but with a `-test.yml` extension, e.g., `consensus-from-variation-test.yml`;
  * a `test-data` directory with the test data used by Planemo;
  * a [Dockstore](https://dockstore.org) [metadata file](https://docs.dockstore.org/en/develop/getting-started/github-apps/github-apps.html#workflow-yml-file) named `.dockstore.yml`;
  * a [Workflow Testing RO-Crate](https://crs4.github.io/life_monitor/workflow_testing_ro_crate) metadata file named `ro-crate-metadata.json`;
  * a `README.md` and a `CHANGELOG.md` file.


## RO-Crate Metadata

At the top-level, along with the workflow category directories, there is a Python script to (re)generate the RO-Crate metadata file, and a requirements file to install its dependencies (mainly [ro-crate-py](https://github.com/ResearchObject/ro-crate-py)):

```
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
python gen_crates.py
```

The directory also includes a bash script to zip all crates (i.e., the workflow directories with the `ro-crate-metadata.json` files) in the format required by [WorkflowHub](https://workflowhub.eu). Note that the zip files are placed alongside their corresponding crate directories.
