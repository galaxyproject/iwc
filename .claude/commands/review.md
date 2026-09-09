---
description: Review a PR against the IWC reviewer checklist
---

You are reviewing a pull request to the IWC (Intergalactic Workflow Commission) repository.

## Scope and Policy Sources

This review applies to changes under `workflows/`. If the pull request does not change that directory, report that the workflow review is not applicable.

Read both `.github/PULL_REQUEST_TEMPLATE.md` and `.github/copilot-instructions.md` from the pull request's base branch before reviewing. Apply the union of their workflow-review requirements. If either file has changed in the pull request, distinguish the existing base-branch policy from the proposed policy change and flag any conflict for human discussion.

The checklist below intentionally includes every workflow-review requirement from the Copilot instructions, adds the contributor-checklist items a reviewer can confirm, and adds the execution and reporting procedure for this command.

## Your Task

1. Fetch the pull request using the `gh` command to get:
   - Pull request title and description
   - Base and head revisions
   - List of changed files
   - The actual file changes (diff)

2. Read the changed workflow files and enough existing repository examples to understand the applicable IWC conventions. Do not infer compliance from the diff alone when a requirement depends on the complete contents of a file.

3. Review the changes against every applicable item in this checklist:

   ### .dockstore.yml

   - [ ] A `.dockstore.yml` file is present in the workflow folder. It is required to run tests.
   - [ ] Its authors match the creator metadata in the `.ga` workflow file.
   - [ ] Its workflow and test file paths resolve to the correct files.

   ORCID identifiers for authors are strongly encouraged but not required. Note missing ones as an optional improvement; never as a blocking finding.

   ### License and ownership

   - [ ] The `.ga` workflow file has a `license` field, and the license permits unrestricted use, both educational and commercial.
   - [ ] The workflow folder has an entry in `.github/CODEOWNERS`.

   ### Workflow genericity

   - [ ] The workflow is sufficiently generic for use with lab data.
   - [ ] Sample names, reference data, and dataset-specific values are not hardcoded.
   - [ ] The workflow can be run without reading an accompanying tutorial.
   - [ ] All parameters are configurable through workflow inputs rather than fixed for a particular sample or experiment.

   ### Annotation

   - [ ] The workflow annotation contains a short description of what the workflow does and the result it generates or analyzes.
   - [ ] It starts with wording such as `This workflow does/runs/performs ... to generate/analyze ...`.
   - Example: `This workflow performs quality control and trimming on paired-end Illumina fastq files using fastp and aggregates reports with MultiQC`.

   ### Human-readable naming

   - [ ] Workflow input and output names are human-readable: use spaces instead of underscores, use dashes only where spelling dictates, and avoid abbreviations unless generally understood.
   - [ ] The workflow `name` field follows the same rules.
   - [ ] Every `workflow_outputs` label in every `.ga` workflow step follows the same rules.
   - [ ] Test output names match their corresponding `workflow_outputs` labels exactly.
   - [ ] Changes to input or output labels are reflected in the workflow test file.

   Examples:
   - Correct: `Raw reads`, `Qualified quality score`, `MultiQC report`
   - Incorrect: `raw_reads`, `qual_score`, `multiqc_report`

   ### Folder and file naming

   - [ ] Folder and file names are lowercase and prefer dashes (`-`) over underscores (`_`).
   - [ ] The workflow folder name is suitable as the resulting repository name in the [iwc-workflows organization](https://github.com/iwc-workflows) and as part of the TRS ID.

   Examples:
   - Correct: `short-read-qc-trimming`, `rna-seq-analysis`
   - Incorrect: `short_read_QC_trimming`, `RNA_Seq_Analysis`

   ### Grammar and consistency

   - [ ] Technical terms used as compound adjectives are singular and consistent across folder names, file names, workflow names, README titles, and documentation.

   Examples:
   - Correct: `short-read sequencing`, `single-cell analysis`, `long-read assembly`
   - Incorrect: `short-reads sequencing`, `single-cells analysis`, `long-reads assembly`

   When the term is the noun itself, plural can be appropriate; for example, `quality control of short reads` is correct.

   ### README

   - [ ] The README explains what the workflow does.
   - [ ] It describes valid inputs, including formats and important parameters.
   - [ ] It describes the outputs users can expect.
   - [ ] It links tutorials or other resources when available.
   - [ ] If similar IWC workflows exist, it explains the differences and when a user might prefer each workflow.

   ### Changelog

   - [ ] The changelog has a new entry, and it describes what actually changed rather than restating the version.
   - [ ] The entry heading carries a version number and a date, in the form `## [1.5] - 2026-07-06`.
   - [ ] The size of the version bump matches the scope of the change. A renamed input or output label is not a patch-level change.

   `planemo workflow_lint --iwc` already checks that the `.ga` `release` field matches the changelog version, and IWC CI runs it on every pull request. Read that result rather than re-deriving it: report a lint failure, do not repeat the check by hand.

   ### Test files and data

   - [ ] Files larger than 100 KB are uploaded to Zenodo, and the test file uses their Zenodo location URLs rather than local copies.
   - [ ] Test output names match the `.ga` workflow's `workflow_outputs` labels exactly.

4. Inspect all `workflow_outputs` entries; do not sample them. Report every label with underscores, unclear abbreviations, or a mismatch with the test file.

5. For each checklist item:
   - Determine whether it applies to this pull request.
   - Mark it as passing, needing attention, or not applicable.
   - Cite specific file paths and line numbers for findings whenever possible.
   - Explain what evidence was checked. Do not mark an item as passing when it could not be verified.

6. When suggesting changes:
   - Check existing repository patterns first.
   - Follow all naming conventions above.
   - Keep workflow-output labels and test output names aligned.
   - Preserve the required annotation format.
   - Clearly separate required policy fixes from optional improvements.

7. Provide a summary with:
   - ✅ Items that pass
   - ⚠️ Items that need attention
   - ℹ️ Items that are not applicable or could not be verified
   - An overall advisory recommendation: approve, request changes, or needs discussion

The recommendation is advisory. Do not approve, modify, or merge the pull request.

## Usage

The pull request number or URL should be provided as an argument to the command.
Example: `/review 1234` or `/review https://github.com/galaxyproject/iwc/pull/1234`
