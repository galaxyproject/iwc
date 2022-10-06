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

### Updating tools

It is recommended to check and update tools with Planemo before import :
```bash
planemo autoupdate my_workflow.ga
```
Then test the updated workflow from inside usegalaxy.* server. Using GTN dataset material is a good start !

### Ensure workflows follow best-practices

Start by opening your workflow in the workflow editor, click on "Workflow Options", select "Best Practices" and apply the suggested improvements. In particular, in order to make the workflow usable, **make sure you specify a license**. Another important field is "Creator", which allows to give proper credit to the author(s). The "Identifier" field of a Creator added as a _person_ should be filled with a fully qualified URI, e.g., https://orcid.org/0000-0002-1825-0097.

![Add Creator GIF](../static/add-creator.gif)

If you add an _organization_ as Creator, you should include a "URL" field pointing to the organization's web site, e.g., https://github.com/galaxyproject/iwc.


### Generate tests

You can either write test cases by hand, or use a workflow invocation to generate a test case:


#### Generate test from a workflow invocation

Create a new directory under one of the directories that represent categories. If no category is suitable you can create a new category directory.
Name the directory that contains your workflow(s) appropriately, as it will become the name of the repository deployed to [iwc-workflows github organization](https://github.com/iwc-workflows).

Execute the workflow on your Galaxy server using the smallest input data you can generate.
Go to the workflow invocations page (User > Workflow Invocations), open the most recent item and find the invocation id:

![Workflow Invocations GUI](../static/wf-invocations.png)

You will also need your Galaxy API key. To copy it, or generate it if you don't have one yet, go to User > Preferences > Manage API Key. Then run:

```
planemo workflow_test_init --from_invocation your_invocation_id_here --galaxy_url https://usegalaxy.eu/ --galaxy_user_key your_api_key_here
```

This will place the workflow and workflow test files in your current working directory.
You may still want to remove test files and edit the test comparisons so that tests
will pass reliably. For example, you could consider using assertions to test the
outputs, rather than comparing the entire output file with test data.


#### Manually write test for workflow

Download the workflow and place it in a new directory under one of the directories that represent categories. If no category is suitable you can create a new category directory.
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

#### Lint your workflow

Note that we've removed the "Paired End Reads" output, since the accession we test is a single end accession.
We can now run `planemo workflow_lint` to make sure the workflow and its test are syntactically correct:

```console
$ planemo workflow_lint parallel-accession-download.ga
Applying linter tests... CHECK
.. CHECK: Tests appear structurally correct for parallel-accession-download.ga
```

#### Add required metadata

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

[RO-Crate](https://doi.org/10.3233/DS-210053) is a format for packaging research artifacts along with their metadata in a machine readable manner. The base RO-Crate specification is complemented by a set of _profiles_ tailored to more specific domains: in particular, [Workflow RO-Crate](https://about.workflowhub.eu/Workflow-RO-Crate/) can be used to package computational workflows, and [Workflow Testing RO-Crate](https://crs4.github.io/life_monitor/workflow_testing_ro_crate) further describes how to add metadata related to workflow testing.

Workflow Testing RO-Crate metadata is automatically generated and added to the workflow repository after a PR is merged, before the repository is deployed to [iwc-workflows](https://github.com/iwc-workflows). RO-Crate metadata is based on [Schema.org](https://schema.org/) annotations in [JSON-LD](https://json-ld.org/) ([example](https://github.com/iwc-workflows/parallel-accession-download/blob/7971b6dc0ee246262a1898e7c7016143ff63007c/ro-crate-metadata.json)). The Workflow Testing RO-Crate representation of the repository ensures its compatibility with the [WorkflowHub](https://workflowhub.eu) registry and the [LifeMonitor](https://www.lifemonitor.eu) workflow health monitoring service.

To ensure that the RO-Crate metadata generation succeeds, make sure you apply the best practices described in the [section on adding workflows](#adding-workflows). In particular, the conversion tool expects to find the workflow file and the Planemo test file; a `README.md` file is not expected, but it will be included if found. The workflow file should specify a `license`, a `release` and one or more `creator`s among its metadata.
