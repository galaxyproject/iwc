# Changelog

## [0.2.3] 2022-02-04

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/iuc/bedtools/bedtools_genomecoveragebed/2.29.2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/bedtools/bedtools_genomecoveragebed/2.30.0`
- `toolshed.g2.bx.psu.edu/repos/iuc/snpsift/snpSift_filter/4.3+t.galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/snpsift/snpSift_filter/4.3.0`
- `toolshed.g2.bx.psu.edu/repos/iuc/snpsift/snpSift_extractFields/4.3+t.galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/snpsift/snpSift_extractFields/4.3.0`
- `toolshed.g2.bx.psu.edu/repos/nml/collapse_collections/collapse_dataset/4.2` was updated to `toolshed.g2.bx.psu.edu/repos/nml/collapse_collections/collapse_dataset/5.1.0`

## [0.2.2] 2021-12-13

### Added
- Added GitHub Actions workflow. No functional changes.

## [0.2.1] 2021-07-23

### Added

Added RO-Crate metadata file. No functional changes.

## [0.2] - 2021-04-30
### Changed
- Lower the default for consensus variant allele frequency threshold to 0.7
  (from 0.8).
  This was empirically determined to capture a relevant number of variants at
  sites that are problematic to call.
- Increase the default variant allele frequency threshold for ambiguous sites
  to 0.25 (from 0.2) to obtain somewhat cleaner consensus sequences.
- Use *SnpSift extract*, instead of *VCFtoTab-delimited* followed by *Cut*, to
  generate required tabular views of variants in one step.
- Eliminate the use of *bedtools MaskFastaBed*, which was redundant with
  specifying masking regions directly at the *bcftools consensus* step.
- Reduce the number of processing steps further by changing result dataset
  types through post-job actions appropriately to avoid implicit conversions,
  and by avoiding a redundant *SnpSift filter* step.

### Fixed
- Deletions are now reliably incorporated into the consensus sequence.
  Before they were, in most cases, N-masked because of low coverage in the
  deleted region.
- Generally, each consensus sequence is now guaranteed to capture all consensus
  variants of its samples as stated in the README, independent of it residing
  in low-coverage regions or not.

## [0.1]

- Initial version of COVID-19: consensus construction
