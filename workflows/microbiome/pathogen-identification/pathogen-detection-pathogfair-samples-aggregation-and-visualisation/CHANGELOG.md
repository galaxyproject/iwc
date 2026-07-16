# Changelog

## [0.2] - 2026-07-15

### Changed
- Update fasttree from 2.1.10+galaxy1 to 2.1.10+galaxy3

### Added
- Expose the "Pathogeneic Genes Per Samples" heatmap PNG resolution as a workflow parameter (`heatmap_png_dpi`, default 150); width/height unchanged. The previous hard-coded 1000 dpi produced a ~27.5k px square raster that could exhaust memory; the vector PDF output remains full resolution for high-detail zooming.

## [0.1] - 2024-04-24

First release.
