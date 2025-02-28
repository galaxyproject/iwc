# Fluorescence Nuclei Segmentation and Counting

## Overview

This workflow implements automated detection, segmentation, and quantification of cell nuclei in fluorescence microscopy images. Using robust image processing algorithms, it identifies individual nuclei within complex multicellular images and provides quantitative data on nuclear count and morphology. The workflow is designed to support high-throughput cell-based assays, tissue analysis, and cellular phenotyping applications.

## Workflow Process

The fluorescence-nuclei-segmentation-and-counting workflow provides:

1. **Image Preprocessing and Enhancement**
   - Processes fluorescence microscopy images to optimize signal-to-noise ratio
   - Applies appropriate filters to enhance nuclear boundaries
   - Normalizes intensity variations across the image field
   - Prepares images for reliable segmentation
   - Handles various fluorescence imaging formats

2. **Nuclei Segmentation with Otsu Thresholding**
   - Implements the Otsu thresholding algorithm (Otsu, 1979) for robust object detection
   - Automatically determines optimal intensity threshold for segmentation
   - Identifies individual nuclei even in densely packed regions
   - Separates touching nuclei using watershed algorithms when needed
   - Generates label maps with unique identifiers for each segmented nucleus

3. **Quantification and Visualization**
   - Counts the total number of nuclei in the image
   - Measures morphological parameters for each nucleus
   - Generates visual overlays of segmentation results on original images
   - Provides unique numerical identifiers for each detected nucleus
   - Outputs quantitative data suitable for statistical analysis

![Example Segmentation Result](test-data/overlay_image.png)

## Input Requirements

**Required Input:**
- **`input_image`** - The fluorescence microscopy image to be analyzed
  - Must contain a single channel with nuclei fluorescence
  - Typically DAPI, Hoechst, or other nuclear stains
  - Supports common microscopy file formats (TIFF, PNG, etc.)
  - Resolution should be sufficient to distinguish individual nuclei

## Output Details

The workflow produces three complementary outputs:

1. **`overlay_image`** - Visual verification of segmentation quality
   - Original image overlaid with outlines of detected nuclei
   - Each nucleus annotated with a unique identification number
   - Useful for quality control and visual interpretation
   - Suitable for publication and presentation figures

2. **`objects_count`** - Quantitative results
   - Table with a single column `objects` containing the total count of nuclei
   - Simple format ready for statistical analysis
   - Can be integrated with other quantitative assay data

3. **`label_image`** - Segmentation data for further analysis
   - Complete segmentation map with unique label for each nucleus
   - Preserves spatial relationships between objects
   - Enables additional measurements and spatial analysis
   - Compatible with downstream image analysis tools

## Applications

This nuclei segmentation workflow is valuable for:
- Cell counting in tissue sections or cell cultures
- Nuclear morphology analysis
- Cell proliferation assays
- Cell cycle analysis when combined with intensity measurements
- Toxicity and viability studies
- Genetic screening assays
- Developmental biology studies

## Implementation and Training

This workflow is based on the Galaxy Training Network tutorial on bioimage analysis:
[Introduction to Image Analysis](https://training.galaxyproject.org/training-material/topics/imaging/tutorials/imaging-introduction/tutorial.html)

For more advanced applications and customization of the workflow, refer to:
[Complete Bioimage Analysis Training](https://training.galaxyproject.org/training-material/topics/imaging/)
