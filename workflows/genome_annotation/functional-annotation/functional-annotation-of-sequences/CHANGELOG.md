# Changelog

## [0.6] - 2026-10-26

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/iuc/collection_element_identifiers/collection_element_identifiers/0.0.2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/collection_element_identifiers/collection_element_identifiers/0.0.3`
- `toolshed.g2.bx.psu.edu/repos/bgruening/interproscan/interproscan/5.59-91.0+galaxy3` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/interproscan/interproscan/1.2`
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_awk_tool/9.5+galaxy3` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_awk_tool/9.11+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/kegg_pathways_completeness/kegg_pathways_completeness/1.3.0+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/kegg_pathways_completeness/kegg_pathways_completeness/1.4.4+galaxy0`

## [0.5] - 2026-10-20

### Added
- Embed the eggNOG-mapper annotation abundance-table workflow from IWC PR #1390 and expose its 14 per-annotation tables and combined table.
- Enable abundance-table generation by default, with a boolean control to disable it and automatic skipping when eggNOG annotation is disabled.
- Use nested single-boolean execution gates so both conditions are configurable in the Galaxy workflow editor.
- Test enabled, explicitly disabled and InterProScan-only configurations while retaining the existing annotation and pathway-completeness checks.

## [0.4] - 2026-09-23

### Fixed
- Correct the changeset revisions of `map_param_value` and `filter_tabular` to installable revisions

### Changed
- Update authors and add the FAIRyMAGs consortium as author
- Add a README to the workflow

## [0.3] - 2026-03-27

- Set a parameter from Add toolshed.g2.bx.psu.edu/repos/iuc/kegg_pathways_completeness/kegg_pathways_completeness/1.3.0+galaxy0 to true to have a second and more detailed per contig output

## [0.2] - 2026-02-07

- Change the input to a collection such that multiple sequences can be run in parallel
- Add a subworkflow that allows to run eggNOG with different types of sequences (protein, CDS, genome and metagenome).
- Add the option that eggNOG and/or InterProScan can be skipped
- Add the option to swap the input type for InterProScan
- Add toolshed.g2.bx.psu.edu/repos/iuc/kegg_pathways_completeness/kegg_pathways_completeness/1.3.0+galaxy0 to calculate the pathway completeness with KOs coming from eggNOG
- Change name of the workflow since now it is not specific for proteins anymore

## [0.1] - 2024-12-04

Initial version of the Functional annotation of protein sequence Workflow.
