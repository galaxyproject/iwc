# Changelog

## [0.3] - 2026-07-20

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_sorted_uniq/9.3+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_sorted_uniq/9.5+galaxy3`
- `toolshed.g2.bx.psu.edu/repos/iuc/bedtools/bedtools_getfastabed/2.30.0+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/bedtools/bedtools_getfastabed/2.31.1+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_multijoin_tool/9.3+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_multijoin_tool/9.5+galaxy3`
- `toolshed.g2.bx.psu.edu/repos/iuc/ggplot2_heatmap/ggplot2_heatmap/3.4.0+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/ggplot2_heatmap/ggplot2_heatmap/3.5.1+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_replace_in_column/9.3+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_replace_in_column/9.5+galaxy3`

## [0.2] - 2026-07-15

### Changed
- Update fasttree from 2.1.10+galaxy1 to 2.1.10+galaxy3

### Added
- Expose the "Pathogeneic Genes Per Samples" heatmap PNG resolution as a workflow parameter (`heatmap_png_dpi`, default 150); width/height unchanged. The previous hard-coded 1000 dpi produced a ~27.5k px square raster that could exhaust memory; the vector PDF output remains full resolution for high-detail zooming.

## [0.1] - 2024-04-24

First release.
