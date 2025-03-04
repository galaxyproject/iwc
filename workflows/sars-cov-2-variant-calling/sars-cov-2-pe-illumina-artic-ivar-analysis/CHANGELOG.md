# Changelog

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
