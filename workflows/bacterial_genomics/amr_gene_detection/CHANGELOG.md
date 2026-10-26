# Changelog

## [1.1.10] - 2026-10-26

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/iuc/multiqc/multiqc/1.35+galaxy4` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/multiqc/multiqc/1.35+galaxy5`

## [1.1.9] - 2026-10-19

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/iuc/staramr/staramr_search/0.11.0+galaxy3` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/staramr/staramr_search/0.12.3+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/amrfinderplus/amrfinderplus/3.12.8+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/amrfinderplus/amrfinderplus/4.2.7+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/abricate/abricate/1.0.1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/abricate/abricate/1.4.0+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/1.0.4+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/1.0.7+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/multiqc/multiqc/1.33+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/multiqc/multiqc/1.35+galaxy4`
- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/1.0.4+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/1.0.7+galaxy0`

### Fixed
- Rename the ABRicate `#FILE` header for MultiQC with Replace Text (`tp_replace_in_line`) instead of Column Regex Find And Replace, which could not run on a header-only report (no virulence genes found).
- Point the `multiqc_html_report` workflow output at MultiQC's `html_report` output. It named a non-existent output, so the report was never exposed.

## [1.1.8] 2026-03-15

- added MultiQC to collect all tabular files and create a HTML report of them
- added a column regex operation to remove the ignore sign of ABRicate output header to make it usable for MulitQC 

## [1.1.7] 2025-12-01

### Automatic update

- `toolshed.g2.bx.psu.edu/repos/iuc/fastp/fastp/0.26.0+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/fastp/fastp/1.0.1+galaxy3`
- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/1.0.0+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/1.0.4+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/1.0.0+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/1.0.4+galaxy0`

### Removed

* Remove some Tooldistillator input because the main information is not found in these files

## [1.1.6] 2025-06-18

### Manual update

- `toolshed.g2.bx.psu.edu/repos/nml/staramr/staramr_search/0.10.0+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/staramr/staramr_search/0.11.0+galaxy3`
- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/0.9.1+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/1.0.0+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/0.9.1+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/1.0.0+galaxy1`
- Adds 2 input parameters : StarAMR database and species selection (PointFinder)
- Changes output name/tag for Tooldistillator
- Fixes syntax and parameter errors

## [1.1.5] 2024-10-21

### Automatic update

- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/0.9.1+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/0.9.1+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/0.9.1+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/0.9.1+galaxy1`

## [1.1.4] - 2024-10-11

### Manual update

- Changed input parameters to select databases in WFs. Use "Attempt restriction based on connections" instead of "Provide list of suggested values".

## [1.1.3] - 2024-09-30

### Automatic update

- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/0.9+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/0.9.1+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/0.9+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/0.9.1+galaxy0`

## [1.1.2] - 2024-09-19

### Manual update

- Change percent identity threshold for Resfinder blast results in StarAMR from 98.0% to 90.0%

## [1.1.1] - 2024-07-08

### Automatic update

- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/0.8.5.0+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/0.9+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/0.8.5.0+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/0.9+galaxy0`

## [1.1] - 2024-06-24

### Automatic update

- `toolshed.g2.bx.psu.edu/repos/nml/staramr/staramr_search/0.10.0+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/nml/staramr/staramr_search/0.10.0+galaxy1`

## [1.0] - 05-06-2024
