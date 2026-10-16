# Changelog

## [0.4] - 2026-03-04

### Changed

The pangolin lineage assignment step will no longer use the latest pangolin-data version downloaded from the web at workflow run time (this feature has been removed from the latest version of the pangolin Galaxy tool).
Instead users can now select a pangolin-data version from the ones cached on their Galaxy server, or they can choose to go with the version of pangolin-data provided by the pangolin Galaxy wrapper (currently, this is v1.37 of pangolin-data).

### Updated tools

- `toolshed.g2.bx.psu.edu/repos/iuc/pangolin/pangolin/4.3+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/pangolin/pangolin/4.3.4+galaxy3`.
- `toolshed.g2.bx.psu.edu/repos/iuc/fastp/fastp/0.23.2+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/fastp/fastp/1.1.0+galaxy0`.

  With this tool update fastp gets executed with the --dont_eval_duplication
  option, i.e. the fastp report will no longer contain the duplicate estimate
  for the raw reads.
  An estimate of duplicated reads based on mapping results is still available
  as part of the "QC reports for mapping results" workflow output.

- `toolshed.g2.bx.psu.edu/repos/devteam/bwa/bwa_mem/0.7.17.2` was updated to `toolshed.g2.bx.psu.edu/repos/devteam/bwa/bwa_mem/0.7.19`.
- `toolshed.g2.bx.psu.edu/repos/iuc/ivar_trim/ivar_trim/1.4.2+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/ivar_trim/ivar_trim/1.4.4+galaxy1`.
- `toolshed.g2.bx.psu.edu/repos/iuc/ivar_variants/ivar_variants/1.4.2+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/ivar_variants/ivar_variants/1.4.4+galaxy0`.
- `toolshed.g2.bx.psu.edu/repos/iuc/ivar_consensus/ivar_consensus/1.4.2+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/ivar_consensus/ivar_consensus/1.4.4+galaxy0`.
- `toolshed.g2.bx.psu.edu/repos/devteam/samtools_stats/samtools_stats/2.0.4` was updated to `toolshed.g2.bx.psu.edu/repos/devteam/samtools_stats/samtools_stats/2.0.8`.
- `toolshed.g2.bx.psu.edu/repos/iuc/samtools_view/samtools_view/1.15.1+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/samtools_view/samtools_view/1.22+galaxy1`.
- `toolshed.g2.bx.psu.edu/repos/iuc/qualimap_bamqc/qualimap_bamqc/2.2.2d+galaxy3` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/qualimap_bamqc/qualimap_bamqc/2.3+galaxy0`.
- `toolshed.g2.bx.psu.edu/repos/iuc/multiqc/multiqc/1.11+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/multiqc/multiqc/1.33+galaxy0`.
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_sed_tool/1.1.1` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_sed_tool/9.5+galaxy3`.
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_cat/0.1.1` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_cat/9.5+galaxy3`.

## [0.3.1] - 2025-04-28

### Added
- Added testParameterFiles entry to .dockstore.yml

## [0.3] - 2022-11-22

- update all tools:
  - fastp from 0.20.1 to 0.23.2
  - bwa_mem from 0.7.17.1 to 0.7.17.2
  - samtools_stats from 2.0.2 to 2.0.4
  - samtools_view from 1.9 to 1.15.1
  - ivar_trim from 1.3.1 to 1.4.2
  - ivar_variants from 1.3.1 to 1.4.2
  - ivar_consensus from 1.3.1 to 1.4.2
  - multiqc from 1.9 to 1.11
  - pangolin from 3.1.14 to 4.3
  - nextclade from 1.4.1 to 2.7.0

## [0.2.3] - 2022-05-25

### Changed
- Changed creator ORCID to absolute URI

## [0.2.2] - 2021-12-13

### Added
- Added GitHub Actions workflow. No functional changes.

## [0.2.1] - 2021-11-04

### Added
- Added .workflowhub.yml

## [0.2] - 2021-10-13

### Changed

- Upgrade pangolin to 3.1.14 
  - this is a bugfix release that addresses problems with commas in sequence IDs
- Upgrade nextclade to 1.4.1
  - nextclade has a new way of dealing with the nextclade database, so it is now downloaded using nextclade itself
  - the latest release supports detecting and reporting frameshifts
  - version 1.4.1 fixes a problem with formatting columns that was present in previous versions
- A header line is now part of the tabular reports produced by both pangolin and nextclade
- The aligned primer-trimmed reads BAM and the multi-fasta combined consensus genomes datasets are no longer hidden as part of the workflow execution

## [0.1] - 2021-06-20

- Initial version of SARS-CoV-2 Illumina Amplicon pipeline - iVar based for IWC
