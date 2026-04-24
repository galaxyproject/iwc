# Histological Staining Area Quantification

## Overview
This workflow quantifies stained tissue areas in brightfield histological images 
using colour deconvolution and automated thresholding. It is designed for 
3-channel stainings compatible with the H-E-DAB (HED) colour space, such as 
Masson's Trichrome (MT) and Immunohistochemistry (IHC).

## Inputs
- **Format:** TIFF
- **Type:** Brightfield microscopy images (whole slide or pre-cropped ROIs)
- **Structure:** Dataset collection (list) — one image per sample

## Outputs
A tabular file (TSV) with one row per sample:
- `sample_id` — sample identifier
- `label` — pixel label (1 = stained region)
- `area` — total number of stained pixels
- `mean_intensity` — mean pixel intensity within the stained region
- `percent_area` — staining area as percentage of total image area

## Compatible stainings
| Staining | Target channel |
|----------|---------------|
| Masson's Trichrome (MT) | Channel 2 |
| Immunohistochemistry (IHC) | Channel 2 (DAB) |

## Notes
- Images must be pre-cropped to the region of interest before use.
- Verify that Channel 2 corresponds to your stain of interest before running.

## Citation
If you use this workflow, please cite it via its WorkflowHub DOI.