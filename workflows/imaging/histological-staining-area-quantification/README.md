# Histological Staining Area Quantification

## Overview
This workflow quantifies stained tissue areas in brightfield histological images 
using colour deconvolution and automated thresholding. Input images are first 
normalized with CLAHE (Contrast Limited Adaptive Histogram Equalization) to reduce 
staining variability before deconvolution. It is designed for 3-channel stainings 
compatible with the H-E-DAB (HED) colour space, such as Masson's Trichrome (MT) 
and Immunohistochemistry (IHC).

## What does this workflow do?
1. **Stain intensity normalization** (CLAHE) equalizes pixel intensity across images to reduce staining variability.
2. **Colour deconvolution** separates the normalized image into individual stain channels (HED).
3. **Channel splitting and extraction** isolates the target stain channel (default: Channel 2).
4. **Automated thresholding** (Li method) generates a binary mask of stained vs. unstained regions.
5. **Feature extraction** quantifies staining area and intensity per sample.
6. **Output collation** merges all per-sample results into a single tabular file.

## Inputs
- **Format:** TIFF
- **Type:** Brightfield microscopy images (whole slide or pre-cropped ROIs)
- **Structure:** Dataset collection (list) — one image per sample

## Outputs
A tabular file (TSV) with one row per sample:
- `sample_id` — sample identifier
- `label` — pixel label (1 = stained region)
- `mean_intensity` — mean pixel intensity within the stained region
- `area` — total number of stained pixels
- `area_filled` — stained area with internal holes filled
- `total_area` — total pixel count of the input image (width × height)
- `percent_area` — staining area as percentage of total image area

## Compatible stainings

| Staining | Target channel |
|----------|----------------|
| Masson's Trichrome (MT) | Channel 2 |
| Immunohistochemistry (IHC) | Channel 2 (DAB) |

## Notes
- Images must be pre-cropped to the region of interest before use.
- Verify that Channel 2 corresponds to your stain of interest before running.

## Citation
If you use this workflow, please cite it via its WorkflowHub DOI.