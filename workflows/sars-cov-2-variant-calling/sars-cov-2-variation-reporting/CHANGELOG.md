# Changelog

## [0.2] 2022-02-11

### Changed

- Altered the exact meaning of the user-supplied AF and DP_ALT thresholds

  The AF threshold is now compared against (DP4[2] + DP4[3]) / DP, i.e. the
  unbiased AF based on all bases at the site instead of against the AF reported
  by the variant caller (which in the case of lofreq would consider only
  variant-supporting bases >= the caller's --min-bq in the numerator).

  Conversely, the DP_ALT threshold is now compared against DP * AF (as reported
  by the variant caller), i.e. in the case of lofreq as the caller will
  consider only bases with >= --min-bq base quality.

- Reported AF values in the by-sample and the by-variant reports are now
  unbiased AF values calculated from (DP4[2] + DP4[3]) / DP as explained above.

  The by-sample report reports the original AF value provided by the variant
  caller in an additional AFcaller column.

- Tile colors in the variant frequency summary plot are now based on unbiased
  AF values.

- An extra step removing potential called variants with a caller-reported
  DP of 0 has been added to avoid division by zero errors in the calculation
  of unbiased AF values.

### Fixed

- Reverted the autoupdated wrapper version change for the snpsift tools

  The autoupdate script had problems sorting their non-standard version strings
  correctly and downgraded these wrappers instead of upgrading them

- Made sure only a single changeset revision of the text_processing tools is
  used in the workflow.

## [0.1.3] 2022-02-04

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/iuc/snpsift/snpSift_filter/4.3+t.galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/snpsift/snpSift_filter/4.3.0`
- `toolshed.g2.bx.psu.edu/repos/iuc/snpsift/snpSift_extractFields/4.3+t.galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/snpsift/snpSift_extractFields/4.3.0`
- `toolshed.g2.bx.psu.edu/repos/nml/collapse_collections/collapse_dataset/4.2` was updated to `toolshed.g2.bx.psu.edu/repos/nml/collapse_collections/collapse_dataset/5.1.0`
- `toolshed.g2.bx.psu.edu/repos/devteam/column_maker/Add_a_column1/1.5` was updated to `toolshed.g2.bx.psu.edu/repos/devteam/column_maker/Add_a_column1/1.6`

## [0.1.2] 2021-12-13

### Added
- Added GitHub Actions workflow. No functional changes.

## [0.1.1] 2021-07-23

### Added

Added RO-Crate metadata file. No functional changes.

## [0.1]

- Initial version of COVID-19: variation analysis reporting
