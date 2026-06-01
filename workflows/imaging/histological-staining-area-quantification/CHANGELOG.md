# Changelog

## [0.1.2] - 2026-06-01

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/imgteam/image_info/ip_imageinfo/5.7.1+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/imgteam/image_info/ip_imageinfo/8.0.0+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/imgteam/split_image/ip_split_image/2.3.5+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/imgteam/split_image/ip_split_image/2.3.5+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/iuc/collection_element_identifiers/collection_element_identifiers/0.0.2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/collection_element_identifiers/collection_element_identifiers/0.0.3`

## [0.1.1] - 2026-05-28

### Fixed
- Use bare ORCID identifier in `.dockstore.yml` so Dockstore accepts the author metadata.

## [0.1] - 2026-05-18

### Added
- Initial release of the Histological Staining Area Quantification workflow.
- Quantifies stained tissue area in brightfield IHC/MT images using colour deconvolution and automated thresholding.
- Compatible with Masson's Trichrome (MT) and Immunohistochemistry (IHC) stainings (H-E-DAB colour space).
- Test data available on Zenodo:
  - CD11b IHC ROIs — infarct zone (4-oxo-RA treated): https://doi.org/10.5281/zenodo.20157596
  - CD11b IHC ROIs — border zone (4-oxo-RA treated): https://doi.org/10.5281/zenodo.20158418
  - CD11b IHC ROIs — border and infarct zone (Vehicle/DMSO): https://doi.org/10.5281/zenodo.20271100