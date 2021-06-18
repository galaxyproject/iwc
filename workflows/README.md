# Workflows

This directory contains all IWC workflows.

The structure is as follows:

* top-level directories represent categories, e.g., `sars-cov-2-variant-calling`;
* directories right under the top level represent individual workflow repositories, e.g., `sars-cov-2-consensus-from-variation` which will be deployed to https://github.com/iwc-workflows/sars-cov-2-consensus-from-variation;
* workflow repository directories contain:

  * the `.ga` workflow file, e.g., `consensus-from-variation.ga`;
  * a [Planemo](https://github.com/galaxyproject/planemo) test file, with the same name as the workflow file, but with a `-test.yml` extension, e.g., `consensus-from-variation-test.yml`;
  * a `test-data` directory with the test data used by Planemo;
  * a [Dockstore](https://dockstore.org) [metadata file](https://docs.dockstore.org/en/develop/getting-started/github-apps/github-apps.html#workflow-yml-file) named `.dockstore.yml`;
  * a `README.md` and a `CHANGELOG.md` file.


## RO-Crate Metadata

This directory, along with the workflow category directories, contains a Python tool to generate [Workflow Testing RO-Crate](https://crs4.github.io/life_monitor/workflow_testing_ro_crate) metadata files (`ro-crate-metadata.json`). It also contains a requirements file to install the tool's dependencies (mainly [ro-crate-py](https://github.com/ResearchObject/ro-crate-py)):

```
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
python gen_crates.py sars-cov-2-variant-calling
```

The tool expects to find the workflow file and Planemo test file as described above. The `README.md` file is not expected, but it's included in the crate (i.e., listed among the metadata) if found.

The following metadata is not expected, but included in the crate if found in the workflow file:

* `"license"`: a string like `"MIT"`
* `"release"`: a string like `"0.2"`
* `"creator"`: a list of objects like:

```json
[{"class": "Person",
  "identifier": "https://orcid.org/0000-0002-1825-0097",
  "name": "Josiah Carberry"}]
```

With `--zip-dir=DIR_PATH`, the tool will zip each crate (i.e., the workflow repository directory with the `ro-crate-metadata.json` files in it) in the format required by [WorkflowHub](https://workflowhub.eu), and place the archive under `DIR_PATH`.
