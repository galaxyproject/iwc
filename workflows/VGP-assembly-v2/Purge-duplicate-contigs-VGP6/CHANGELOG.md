# Changelog

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
