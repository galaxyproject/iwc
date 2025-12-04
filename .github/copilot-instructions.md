# GitHub Copilot Instructions for IWC

## Scope
These instructions apply ONLY to changes in the `workflows/` folder.

## Workflow Review Guidelines

When reviewing or suggesting changes to workflows, follow the IWC (Intergalactic Workflow Commission) reviewer checklist:

### 1. .dockstore.yml Requirements
- File must be present in workflow folder
- Authors in .dockstore.yml must match creator metadata in the .ga workflow file
- ORCID identifiers are strongly encouraged for all authors
- File paths must correctly reference the workflow and test files

### 2. Workflow Genericity
- Workflows must be generic enough for use with lab data
- Do NOT hardcode sample names, reference data, or dataset-specific values
- Workflow should be usable without reading an accompanying tutorial
- All parameters should be configurable via inputs

### 3. Annotation Field Format
- Must contain a short description of what the workflow does
- Should start with: `"This workflow does/runs/performs..."`
- Should describe the action and output: `"...to generate/analyze/etc..."`
- Example: `"This workflow performs quality control and trimming on paired-end Illumina fastq files using fastp and aggregates reports with MultiQC"`

### 4. Human-Readable Naming

#### Workflow Inputs and Outputs
- Use human-readable names with spaces (NOT underscores)
- No abbreviations unless generally understood
- Dashes only where spelling dictates
- Examples:
  - ✅ `"Raw reads"`, `"Qualified quality score"`, `"MultiQC report"`
  - ❌ `"raw_reads"`, `"qual_score"`, `"multiqc_report"`

#### workflow_outputs Labels
- In the .ga workflow file, ALL `workflow_outputs` sections must have human-readable labels
- These labels follow the same rules as inputs/outputs
- Examples:
  - ✅ `"label": "MultiQC HTML report"`
  - ❌ `"label": "multiqc_html_report"`
- These labels must match what's used in the test file (*-tests.yml)

#### Workflow Name Field
- Must be human-readable
- Use spaces, no underscores
- Dashes only where spelling dictates
- No abbreviations unless generally understood
- Example: `"Short-read quality control and trimming"`

### 5. Folder and File Naming
- Prefer dash (`-`) over underscore (`_`)
- Use lowercase
- Folder name becomes repository in iwc-workflows organization
- Examples:
  - ✅ `short-read-qc-trimming`, `rna-seq-analysis`
  - ❌ `short_read_QC_trimming`, `RNA_Seq_Analysis`

### 6. Grammar: Compound Adjectives
When technical terms are used as compound adjectives (modifying another noun), they should be singular:
- ✅ `"short-read sequencing"`, `"single-cell analysis"`, `"long-read assembly"`
- ❌ `"short-reads sequencing"`, `"single-cells analysis"`, `"long-reads assembly"`

This applies to:
- Folder names
- File names
- Workflow names
- README titles
- Documentation

Note: When the term is the noun itself, plural is acceptable:
- ✅ `"quality control of short reads"` (reads is the noun)

### 7. README Requirements
Must explain:
- What the workflow does
- What are valid inputs (formats, parameters)
- What outputs users can expect
- If similar workflows exist in IWC, explain differences and when to prefer one over another
- Links to tutorials or resources (if available)

### 8. Changelog
- Must contain appropriate entries for changes
- Follow semantic versioning
- Include date and version number
- Describe what changed in the release

### 9. Test Files
- Large files (> 100 KB) must be uploaded to Zenodo
- Use Zenodo location URLs in test file, not local files
- Test file output names must match workflow_outputs labels exactly
- Example:
  ```yaml
  outputs:
    MultiQC HTML report:  # Matches workflow_outputs label
      asserts:
        has_text:
          text: "expected content"
  ```

## Code Suggestions
When suggesting code for workflows:
- Always check existing patterns in the repository first
- Ensure suggestions follow all naming conventions above
- Verify workflow_outputs labels are human-readable
- Check that test files align with workflow output names
- Validate annotation format starts with "This workflow does/runs/performs"

## Review Comments
When reviewing PRs that modify workflows/:
- Explicitly check each item in the reviewer checklist
- Point out any naming convention violations
- Flag hardcoded values or sample-specific parameters
- Verify test file alignment with workflow outputs
- Check grammar in compound adjectives
