# Changelog

## [0.4] 2024-08-13

### Added

- Workflow report

### Changed

- Expose Busco lineage database parameter
- Fix bug that was causing issues when merging the assembly statistics: The presence of the '#' character caused the tables to join incorrectly, and the numbers did not match the metrics

## [0.3.8] 2024-04-23

### Added

- Add Busco Gff output

## [0.3.7] 2024-04-22

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_awk_tool/9.3+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_awk_tool/9.3+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_easyjoin_tool/9.3+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_easyjoin_tool/9.3+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_cat/9.3+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_cat/9.3+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/iuc/minimap2/minimap2/2.27+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/minimap2/minimap2/2.28+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/merqury/merqury/1.3+galaxy3` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/merqury/merqury/1.3+galaxy4`

## [0.3.6] 2024-03-25

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/iuc/minimap2/minimap2/2.26+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/minimap2/minimap2/2.27+galaxy0`

## [0.3.5] 2024-03-04

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_awk_tool/1.1.2` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_awk_tool/9.3+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_easyjoin_tool/1.1.2` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_easyjoin_tool/9.3+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_cat/0.1.1` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_cat/9.3+galaxy0`

## [0.3.4] 2024-02-15

- Remove tag filtering
- Add merqury histogram outputs

## [0.3.3] 2023-11-20

- Fix author in dockstore

## [0.3.2] - 2023-11-15

### Added

- more descriptive lables for inputs

## [0.3.1] 2023-11-09

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/iuc/minimap2/minimap2/2.24+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/minimap2/minimap2/2.26+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/busco/busco/5.3.2+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/busco/busco/5.4.6+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/datamash_ops/datamash_ops/1.1.0+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/datamash_ops/datamash_ops/1.8+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/merqury/merqury/1.3+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/merqury/merqury/1.3+galaxy3`
- `toolshed.g2.bx.psu.edu/repos/devteam/add_value/addValue/1.0.0` was updated to `toolshed.g2.bx.psu.edu/repos/devteam/add_value/addValue/1.0.1`
- `toolshed.g2.bx.psu.edu/repos/iuc/ggplot2_point/ggplot2_point/3.4.0+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/ggplot2_point/ggplot2_point/3.4.0+galaxy1`

## [0.3] - 2023-11-08

### Added

- Made BUSCO lineage selectable from workflow launch interface

### Changed

- Change BUSCO lineage input parameter name from `Provide lineage for BUSCO (e.g., Vertebrata)` to `Lineage`


## [0.2.0] - 2023-11-07

### Added

- Tag filtering for inputs
- Changed parameters of gfastats for postprocessing of contigs generated with purge_dups. Specfically:
  - "Terminal overlap selection" is set to "Yes"
  - "Generated the initial set of paths" is set to "No"


## [0.1.1] - 2023-11-01

### Added

- More explicit tags for readability


## [0.1] - 2023-10-26

### Added

- Workflow for purging duplication in contigs
