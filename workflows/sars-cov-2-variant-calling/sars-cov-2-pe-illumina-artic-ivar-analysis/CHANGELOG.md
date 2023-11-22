# Changelog

## [0.2.3] 2022-05-25

### Changed
- Changed creator ORCID to absolute URI

## [0.2.2] 2021-12-13

### Added
- Added GitHub Actions workflow. No functional changes.

## [0.2.1] 2021-11-04

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
