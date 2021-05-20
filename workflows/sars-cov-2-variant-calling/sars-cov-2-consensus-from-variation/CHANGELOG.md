# Changelog

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
