# Workflows

This directory contains all IWC workflows.

The structure is as follows:

* top-level directories represent categories, e.g., `sars-cov-2-variant-calling`;
* directories right under the top level represent individual workflow repositories, e.g., `sars-cov-2-consensus-from-variation` which will be deployed to https://github.com/iwc-workflows/sars-cov-2-consensus-from-variation;
* workflow repository directories contain:

  * the `.ga` workflow file, e.g., `consensus-from-variation.ga`;
  * a [Planemo test file](https://planemo.readthedocs.io/en/latest/test_format.html), with the same name as the workflow file, but with a `-test.yml` extension, e.g., `consensus-from-variation-test.yml`;
  * a `test-data` directory with the test data used by Planemo;
  * a [Dockstore](https://dockstore.org) [metadata file](https://docs.dockstore.org/en/develop/getting-started/github-apps/github-apps.html#workflow-yml-file) named `.dockstore.yml`;
  * a `README.md` and a `CHANGELOG.md` file.

## Adding workflows

Start by opening your workflow in the workflow editor, click on "Workflow Options", select "Best Practices" and apply the suggested improvements. You can then download the workflow and place it in a new directory under one of the directories that represent categories. If no category is suitable you can create a new category directory.
Name the directory that contains your workflow(s) appropriately, as it will become the name of the repository deployed to [iwc-workflows github organization](https://github.com/iwc-workflows).
You can then generate a template planemo test file. Here we generate a test file for the workflow parallel-accession-download.ga.

```bash
planemo workflow_test_init parallel-accession-download.ga
```

This generates the file parallel-accession-download-tests.yml:

```yaml
- doc: Test outline for parallel-accession-download.ga
  job:
    Run accessions:
      class: File
      path: todo_test_data_path.ext
  outputs:
    Paired End Reads:
      class: ''
    Single End Reads:
      class: ''
```

We now need to provide inputs and outputs. You can find details about the test format in the [planemo documentation](https://planemo.readthedocs.io/en/latest/test_format.html).
For this example workflow the final parallel-accession-download-tests.yml might look like this:

```yaml
- doc: Test download of single end accession
  job:
    Run accessions:
      class: File
      path: test-data/input_accession_single_end.txt
  outputs:
    Single End Reads:
      element_tests:
        SRR044777:
          file: test-data/SRR044777_head.fastq
          decompress: true
          compare: contains
```

Note that we've removed the "Paired End Reads" output, since the accession we test is a single end accession.
We can now run `planemo workflow_lint` to make sure the workflow and its test are syntactically correct:

```console
$ planemo workflow_lint parallel-accession-download.ga
Applying linter tests... CHECK
.. CHECK: Tests appear structurally correct for parallel-accession-download.ga
```

We now need to generate a `.dockstore.yml` file that contains metadata needed for [Dockstore](https://dockstore.org/organizations/iwc).
`planemo dockstore_init` operates on a directory of workflows. If your current working directory contains the workflow(s) run

```console
$ planemo dockstore_init .

```

to generate a `.dockstore.yml` file.

We now only need a README.md file that briefly describes the workflow and a CHANGELOG.md file
that lists changes, additions and fixed. Please follow the formatting and principles proposed on [keepachangelog.com](https://keepachangelog.com/en/1.0.0/).

We currently do not have a user interface within Galaxy to define release versions, so you have to manually set a `release: "0.1"` key value pair in the workflow.ga file.
With a text editor of your choice make this change:

```diff
     ],
     "format-version": "0.1",
     "license": "MIT",
+    "release": "0.1",
     "name": "Parallel Accession Download",
     "steps": {
         "0": {
```

At this point you can commit the new files and open a pull request.
If you are encountering difficulties at any point don't hesitate to ask for help on [gitter](https://gitter.im/galaxyproject/iwc).

## RO-Crate Metadata

This directory, along with the workflow category directories, contains a Python tool to generate [Workflow Testing RO-Crate](https://crs4.github.io/life_monitor/workflow_testing_ro_crate) metadata files (`ro-crate-metadata.json`). It also contains a requirements file to install the tool's dependencies (mainly [ro-crate-py](https://github.com/ResearchObject/ro-crate-py)):

```bash
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
