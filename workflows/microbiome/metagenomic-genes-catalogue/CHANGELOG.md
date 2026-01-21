# Changelog

## [1.2] - 2025-01-13

### Automatic update

* `toolshed.g2.bx.psu.edu/repos/recetox/table_pandas_rename_column/table_pandas_rename_column/2.2.3+galaxy0` should be updated to `toolshed.g2.bx.psu.edu/repos/recetox/table_pandas_rename_column/table_pandas_rename_column/2.2.3+galaxy1`

### Changed

* Contig IDs become uniquely named immediately after assembly using the sample name with the `Add input name as column tool`.
* Contig IDs are retrieved without CDS information so that information on the entire contig is retrieved, not just the CDS of antibiotic resistance genes.
* The results from eggnogmapper and mmsesq2taxonomy are filtered on a unique set of contig IDs corresponding to those where an antibiotic resistance gene is detected.

### Added

* Addition of a Boolean variable allowing users to choose whether they want a global gene catalog analysis or one specific to antibiotic resistance.
* Added retrieval of contig IDs for antibiotic resistance and virulence genes retrieved with starAMR and ABRicate.

## [1.1] - 2025-12-08

### Automatic update

- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_cat/9.5+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_cat/9.5+galaxy2`
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_awk_tool/9.5+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_awk_tool/9.5+galaxy2`
- `toolshed.g2.bx.psu.edu/repos/iuc/seqkit_translate/seqkit_translate/2.10.0+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/seqkit_translate/seqkit_translate/2.12.0+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/krakentools_kreport2krona/krakentools_kreport2krona/1.2+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/krakentools_kreport2krona/krakentools_kreport2krona/1.2.1+galaxy0`

## [1.0] - 2025-10-14

- First release
