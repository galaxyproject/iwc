---
description: Review a PR against the IWC reviewer checklist
---

You are reviewing a pull request to the IWC (Intergalactic Workflow Commission) repository.

## Your Task

1. Fetch the PR using the `gh` command to get:
   - PR title and description
   - List of changed files
   - The actual file changes (diff)

2. Review the PR changes against the FOR REVIEWERS checklist from `.github/PULL_REQUEST_TEMPLATE.md`:
   - [ ] .dockstore.yml: file is present and aligned with creator metadata in workflow. ORCID identifiers are strongly encouraged in creator metadata. The .dockstore.yml file is required to run tests
   - [ ] Workflow is sufficiently generic to be used with lab data and does not hardcode sample names, reference data and can be run without reading an accompanying tutorial.
   - [ ] In workflow: annotation field contains short description of what the workflow does. Should start with `This workflow does/runs/performs … xyz … to generate/analyze/etc …`
   - [ ] In workflow: workflow inputs and outputs have human readable names (spaces are fine, no underscore, dash only where spelling dictates it), no abbreviation unless it is generally understood. Altering input or output labels requires adjusting these labels in the the workflow-tests.yml file as well
   - [ ] In workflow: `name` field should be human readable (spaces are fine, no underscore, dash only where spelling dictates it), no abbreviation unless generally understood
   - [ ] Workflow folder: prefer dash (`-`) over underscore (`_`), prefer all lowercase. Folder becomes repository in [iwc-workflows organization](https://github.com/iwc-workflows) and is included in TRS id
   - [ ] Readme explains what workflow does, what are valid inputs and what outputs users can expect. If a tutorial or other resources exist they can be linked. If a similar workflow exists in IWC readme should explain differences with existing workflow and when one might prefer one workflow over another
   - [ ] Changelog contains appropriate entries
   - [ ] Large files (> 100 KB) are uploaded to zenodo and location urls are used in test file

3. For each checklist item:
   - Determine if it's applicable to this PR (some items may not apply to all PRs)
   - Check if the requirement is met
   - Provide specific feedback with file paths and line numbers where relevant
   - If checking requires reading file contents, use the Read tool to examine the files

4. **IMPORTANT - Check workflow_outputs labels:**
   - In the .ga workflow file, look for ALL `workflow_outputs` sections in each step
   - Each workflow_outputs entry has a `label` field that should be human-readable
   - Check that these labels follow the same naming rules: spaces are fine, no underscores, dashes only where spelling dictates
   - Example of INCORRECT: `"label": "multiqc_html_report"` (has underscores)
   - Example of CORRECT: `"label": "MultiQC HTML report"` (human-readable, spaces)
   - Also verify these labels match what's used in the test file (*-tests.yml)
   - Report ALL instances where workflow_outputs labels use underscores or abbreviations

5. **Check grammar and consistency in naming:**
   - When technical terms are used as compound adjectives (modifying another noun), they should be singular
   - Examples:
     - CORRECT: "short-read quality control" (short-read is an adjective modifying "quality control")
     - INCORRECT: "short-reads quality control" (plural form as adjective)
     - CORRECT: "single-cell RNA-seq" (single-cell is an adjective)
     - INCORRECT: "single-cells RNA-seq"
   - Check this consistency across: folder name, workflow name, README title, and file names
   - When the term itself is the noun (not modifying another word), plural can be appropriate:
     - "quality control of short reads" (reads is the noun here) - this is fine

6. Provide a summary with:
   - ✅ Items that pass
   - ⚠️  Items that need attention
   - ℹ️  Items that are not applicable
   - Overall recommendation (approve, request changes, or needs discussion)

## Usage

The PR number or URL should be provided as an argument to the command.
Example: `/review 1234` or `/review https://github.com/galaxyproject/iwc/pull/1234`
