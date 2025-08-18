# Changelog

## [2.0] - 2025-08-11

### Removed

- Remove quality and contamination control part, this part have been moved to another workflow (quality-and-contamination-control-post-assembly)
- Removal of refseqmasher because the results were no longer useful in this workflow, but similar information can be obtained in another workflow with Kraken2 (quality-and-contamination-control-post-assembly)

## [1.1.8] - 2025-07-21

### Automatic update

- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/0.9.3+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/1.0.0+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/0.9.3+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/1.0.0+galaxy1`

## [1.1.7] - 2025-06-09

### Automatic update

- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/0.9.2+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/0.9.3+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/0.9.2+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/0.9.3+galaxy0`

### Manual update

- Changes QUAST parameter Minimum contig size from `0` to `200` to exclude small contigs (< 200 bp) in the statistics. CheckM2 already has statistics for all contigs (≥ 0 bp)

## [1.1.6] - 2025-05-14

### Automatic update

- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/0.9.1+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/0.9.2+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/0.9.1+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/0.9.2+galaxy0`

### Manual update

- Changes output name/tag for Tooldistillator
- Fixes syntax and parameter errors
- Changes QUAST parameters:
  - Minimum contig size from `500` to `0` to include all contigs (≥ 0 bp) in the statistics
  - Contig size thresholds from `0,1000` to `0,200,500,1000` to provide more detailed statistics (number of contigs and total length) across multiple contig size ranges
- Adds Checkm2 to predict the completeness and contamination

## [1.1.5] - 2024-11-18

### Automatic update

- `toolshed.g2.bx.psu.edu/repos/iuc/quast/quast/5.2.0+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/quast/quast/5.3.0+galaxy0`

## [1.1.4] - 2024-10-21

### Automatic update

- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/0.9.1+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/0.9.1+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/0.9.1+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/0.9.1+galaxy1`

## [1.1.3] - 2024-09-30

### Automatic update

- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/0.9+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/0.9.1+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/0.9+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/0.9.1+galaxy0`

## [1.1.2] - 2024-09-19

### Manual update

- Updated the tool versions manually in the ToolDistillator parameters

## [1.1.1] - 2024-07-08

### Automatic update

- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/0.8.5.0+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator/tooldistillator/0.9+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/0.8.5.0+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/tooldistillator_summarize/tooldistillator_summarize/0.9+galaxy0`

## [1.1] - 2024-06-24

### Automatic update

- `toolshed.g2.bx.psu.edu/repos/iuc/shovill/shovill/1.1.0+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/shovill/shovill/1.1.0+galaxy2`
- `toolshed.g2.bx.psu.edu/repos/iuc/bandage/bandage_info/0.8.1+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/bandage/bandage_info/2022.09+galaxy2`
- `toolshed.g2.bx.psu.edu/repos/iuc/bandage/bandage_image/0.8.1+galaxy4` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/bandage/bandage_image/2022.09+galaxy4`

## [1.0] - 05-06-2024
