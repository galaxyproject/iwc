# IWC Workflows Collection

This directory contains the complete collection of curated Galaxy workflows maintained by the Intergalactic Workflow Commission.

## Repository Structure

The workflows are organized in a hierarchical structure:

### Top Level: Scientific Domains
* Each top-level directory represents a scientific domain or analytical category
* Examples include: `sars-cov-2-variant-calling`, `proteomics`, `genome-assembly`

### Second Level: Individual Workflows
* Each subdirectory represents a specific workflow that will be deployed as its own repository
* Example: `sars-cov-2-consensus-from-variation` → https://github.com/iwc-workflows/sars-cov-2-consensus-from-variation
* **Naming convention**: Use lowercase with hyphens (`-`) to separate words

### Workflow Directory Contents
Each workflow directory must contain:

* **Workflow File(s)**: At least one `.ga` Galaxy workflow file (e.g., `consensus-from-variation.ga`)
* **Test File(s)**: Corresponding [Planemo test files](https://planemo.readthedocs.io/en/latest/test_format.html) with `-tests.yml` extension (e.g., `consensus-from-variation-tests.yml`)
* **Documentation**:
  * `README.md` - Workflow description, usage instructions, and requirements
  * `CHANGELOG.md` - Version history and modifications
* **Metadata**: [Dockstore metadata file](https://docs.dockstore.org/en/develop/getting-started/github-apps/github-apps.html#workflow-yml-file) (`.dockstore.yml`)
* **Test Data**: Optional `test-data` directory containing datasets used for testing

## Contributing Workflows

### Eligibility Requirements

The IWC focuses on production-grade workflows that enable scientists to analyze their own datasets. To be eligible for inclusion:

1. **Generalizability**: Workflows must be sufficiently generic to accommodate user-provided data
2. **Self-contained**: Users should be able to run the workflow without modifications
3. **Production-ready**: Workflows should be thoroughly tested and reliable

While not required, we strongly encourage:
- Links to relevant [Galaxy Training Network tutorials](https://training.galaxyproject.org/)
- Clear documentation explaining parameter choices and expected inputs/outputs

**Important**: If your workflow accompanies a tutorial, ensure it does not contain hard-coded references to tutorial-specific datasets. Users should be able to substitute their own data without needing to modify the workflow structure.

### Contribution Workflow

Follow these steps to contribute your Galaxy workflow to the IWC collection:

#### Step 1: Prepare Your Workflow

Start with a functional workflow developed in a Galaxy instance. Before submission, ensure your workflow:
- Uses the latest tool versions available
- Includes comprehensive metadata (license, creators, etc.)
- Has been tested with real data

#### Step 2: Update Tool Versions

Ensure your workflow uses current tool versions by:

**Option A: Update within Galaxy**
1. Open your workflow in Galaxy
2. Click "Workflow Options" → "Upgrade Workflow"

![Update workflow in Galaxy interface](../static/update_workflow.png)

**Option B: Update using Planemo**
1. Download your workflow (.ga file)
2. Run the Planemo update command:
```bash
planemo autoupdate <workflow.ga>
```

#### Step 3: Apply Best Practices

Ensure your workflow follows Galaxy's best practices:

1. In your Galaxy instance, open your workflow
2. Click "Workflow Options" → "Best Practices" 
3. Apply the suggested improvements

**Critical Metadata Requirements:**

* **License**: Every workflow must have a specified license to be usable
* **Creator Information**: 
  * For individuals: Include name and identifier (preferably ORCID)
  * For person type creators: The "Identifier" field should contain a fully qualified URI (e.g., https://orcid.org/0000-0002-1825-0097)
  * For organizations: Include name and URL (e.g., https://github.com/galaxyproject/iwc)

![Adding creator information](../static/add-creator.gif)


#### Step 4: Create Workflow Tests

Testing is a critical but challenging component of workflow submission. While we still accept workflows without tests, having proper tests will significantly accelerate the review and publication process.

There are two approaches to generating tests:
1. Write test cases manually
2. Generate test cases from a workflow invocation (recommended)

**Input Test Datasets**

For test data, consider these sources:
* **Galaxy Training Network (GTN)**: If your workflow relates to a GTN tutorial, use the tutorial's dataset
* **Custom Dataset**: Create a minimal test dataset following [this guide](https://training.galaxyproject.org/training-material/topics/contributing/tutorials/create-new-tutorial/tutorial.html#get-a-toy-dataset)
* **Permanent Dataset URL**: For reproducibility, consider publishing your test dataset to Zenodo

#### Option A: Generate Tests from a Workflow Execution

This approach converts an actual workflow execution into a test case:

1. **Prepare Directory Structure**:
   * Create a directory for your workflow under the appropriate category
   * If no suitable category exists, create a new one
   * Use lowercase hyphenated names (e.g., `my-new-workflow`)

2. **Run Your Workflow**:
   * Execute your workflow in Galaxy using minimal test data
   * Use the smallest viable input dataset to keep tests efficient

3. **Find the Workflow Invocation ID**:
   * Navigate to the Workflow Invocations page:
     * Galaxy version < 24.0: User > Workflow Invocations
     * Galaxy version 24.0: Data > Workflow Invocations
     * Galaxy version ≥ 24.1: Activity bar > Workflow Invocations
   * Open your recent workflow execution
   * Locate the invocation ID

   ![Workflow Invocations Interface](../static/wf-invocations.png)

   * Alternative: Extract the ID from the URL
     * Example: In `https://usegalaxy.org/workflows/invocations/be5c48c113145dd5?from_panel=true`, the ID is `be5c48c113145dd5`

4. **Generate Test Files**:
   * Generate your Galaxy API key (User > Preferences > Manage API Key)
   * Run the Planemo command:
   ```bash
   planemo workflow_test_init --from_invocation <your_invocation_id> --galaxy_url <your_galaxy_instance_url> --galaxy_user_key <your_api_key>
   ```

5. **Optimize Test Files**:
   * Review and edit generated test files for reliability
   * Consider using [assertions](https://docs.galaxyproject.org/en/latest/dev/schema.html#tool-tests-test-output-assert-contents) instead of full file comparisons for large outputs
   * Examine existing test files in the repository for examples

#### Option B: Manually Write Workflow Tests

If you prefer to write tests manually:

1. **Prepare Directory Structure**:
   * Create a directory for your workflow in the appropriate category
   * Use lowercase hyphenated names for all directories
   * Download and place your workflow file (.ga) in this directory

2. **Generate Test Template**:
   * Use Planemo to create a starter test file:
   ```bash
   planemo workflow_test_init <your_workflow_file.ga>
   ```

3. **Example Test Template**:
   * For a workflow like `parallel-accession-download.ga`, this generates:
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

4. **Complete the Test File**:
   * Replace placeholder values with actual test data paths
   * Define expected outputs and comparison methods
   * Refer to the [Planemo test format documentation](https://planemo.readthedocs.io/en/latest/test_format.html)

5. **Example Completed Test**:
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

This example shows a completed test for a workflow that downloads sequence data from accession numbers, demonstrating how to specify input files and validate outputs.

#### Step 5: Validate Your Workflow

After creating your workflow and tests, validate everything with these quality checks:

**Workflow Linting**

Run Planemo's linting tool to check for structural issues:

```bash
planemo workflow_lint your-workflow-file.ga
```

Successful output should look like:
```
Applying linter tests... CHECK
.. CHECK: Tests appear structurally correct for your-workflow-file.ga
```

**Testing on a Galaxy Instance**

Before submitting your PR, test your workflow against a live Galaxy instance:

```bash
planemo test --galaxy_url <galaxy_server_url> --galaxy_user_key <your_api_key> <workflow.ga>
```

**Debugging Test Issues**

If your tests fail, you can validate and fix them against your original workflow execution:

```bash
planemo workflow_test_on_invocation --galaxy_url <galaxy_server_url> --galaxy_user_key <your_api_key> <workflow-tests.yml> <invocation_id>
```

**Important Note about Reference Data**

If your workflow uses built-in reference data (genomes, indexes, etc.):
* The CI environment uses CVMFS for reference data
* Browse available reference data at http://datacache.galaxyproject.org/
* Ensure your workflow uses reference data available in this system 

#### Step 6: Add Required Metadata Files

Your workflow submission requires several key metadata files:

**1. Dockstore Metadata**

Generate the Dockstore configuration file from your workflow directory:

```bash
planemo dockstore_init .
```

This creates a `.dockstore.yml` file with metadata needed for [Dockstore](https://dockstore.org/organizations/iwc) registration.

**2. Documentation Files**

Create two essential documentation files:

* **README.md**: Brief description of the workflow, its purpose, inputs, outputs, and usage
* **CHANGELOG.md**: Version history following the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format

**3. Version Information**

Add a version to your workflow by manually editing the .ga file to include a release tag:

```diff
     ],
     "format-version": "0.1",
     "license": "MIT",
+    "release": "0.1",
     "name": "Parallel Accession Download",
     "steps": {
         "0": {
```

#### Step 7: Submit Your Workflow

With all files prepared, you're ready to contribute:

1. Commit your files to your fork of the IWC repository
2. Open a pull request with a clear description of your workflow
3. Respond to any feedback from reviewers

**Need Help?**

If you encounter any difficulties during this process, don't hesitate to:
* Ask for help in the [IWC Gitter channel](https://gitter.im/galaxyproject/iwc)
* Open an issue in the [IWC repository](https://github.com/galaxyproject/iwc)

### Advanced: Multiple Workflows in a Repository

You have flexibility in organizing your workflow submissions:

#### Option 1: Multiple Directories (Recommended)
Create separate directories for each workflow, each with its own complete set of files.

#### Option 2: Multiple Workflows in a Single Directory

If you choose to include multiple workflows in the same directory, be aware of these important considerations:

- **Versioning**: All workflows in the directory share a single CHANGELOG.md and must maintain the same version number
- **WorkflowHub Integration**: 
  - WorkflowHub treats only one workflow as the "main" workflow
  - Additional workflows are considered "subworkflows"
  - Dockstore, however, will publish each workflow listed in the .dockstore.yml file as a main workflow
- **Workflow Selection**: 
  - To control which workflow is designated as the main workflow in WorkflowHub
  - Create a `.workflowhub.yml` file manually with the appropriate configuration

## Additional Technical Information

### RO-Crate Metadata Integration

IWC workflows are automatically packaged with machine-readable metadata using the [RO-Crate](https://doi.org/10.3233/DS-210053) format. This provides several important benefits:

**What is RO-Crate?**
- A standardized format for packaging research artifacts with rich metadata
- Enables workflow discovery, reuse, and validation
- Uses [Schema.org](https://schema.org/) annotations in [JSON-LD](https://json-ld.org/) format
- Example: [View a workflow's RO-Crate metadata](https://github.com/iwc-workflows/parallel-accession-download/blob/7971b6dc0ee246262a1898e7c7016143ff63007c/ro-crate-metadata.json)

**IWC's RO-Crate Implementation**
- IWC uses specialized profiles:
  - [Workflow RO-Crate](https://about.workflowhub.eu/Workflow-RO-Crate/) for workflow packaging
  - [Workflow Testing RO-Crate](https://crs4.github.io/life_monitor/workflow_testing_ro_crate) for test metadata

**Automated Process**
- RO-Crate metadata is automatically generated after your PR is merged
- Generated before deployment to [iwc-workflows](https://github.com/iwc-workflows)
- Ensures compatibility with [WorkflowHub](https://workflowhub.eu) and [LifeMonitor](https://www.lifemonitor.eu)

**Requirements for Successful Generation**
- The workflow must follow all best practices described in this guide
- Critical elements that must be present:
  - Workflow file (.ga)
  - Planemo test file (-tests.yml)
  - `license` field in workflow metadata
  - `release` field in workflow metadata
  - One or more `creator` entries

### Automated Workflow Updates

IWC workflows benefit from an automated update system that ensures they remain compatible with the latest Galaxy tool versions.

#### How Automatic Updates Work

The update process runs weekly through a GitHub Actions workflow:

1. **Update Detection**
   - The [automated update system](https://github.com/planemo-autoupdate/autoupdate/blob/main/.github/workflows/autoupdate.yml) scans all IWC workflows
   - For each workflow directory (e.g., `workflows/data-fetching/parallel-accession-download`):
     - Checks whether an update PR already exists
     - Runs `planemo autoupdate` to identify available tool updates
     - Uses a [skip list](https://github.com/planemo-autoupdate/autoupdate/blob/main/galaxyproject_iwc_skip_list) to exclude certain tools

2. **Update Application**
   - When tool updates are found, the workflow is automatically updated
   - Parameter values are preserved when they exist in the same section with the same name
   - The `CHANGELOG.md` is automatically updated with:
     - New version number and date
     - List of changes under an "Automatic update" heading

3. **Pull Request Creation**
   - For workflows with changes, the system:
     - Creates a new PR (if none exists)
     - Updates an existing PR (if one exists)
     - Takes no action if a PR with the same title was previously closed

#### Troubleshooting Updates

If your workflow isn't being updated despite newer tool versions being available:

1. **Check Update Actions**
   - Review the [autoupdate action logs](https://github.com/planemo-autoupdate/autoupdate/actions)
   - Errors in one workflow update can sometimes block updates to other workflows

2. **Check for Closed PRs**
   - A closed PR titled "Updating [workflow] from [version] to [version]" will prevent automatic updates
   - If you find such a PR, leave a comment requesting it be reopened

3. **Report Issues**
   - Report any persistent update problems in the IWC Matrix channel
