# Multiplex tissue image processing and analysis with Galaxy-ME

Use this workflow when you have pre-registered OME-TIFF images that are ready for analysis (no preprocessing needed).

## Overview

This workflow processing and analyzes multiple multiplex tissue imaging datasets by

1. Performing **background subtraction, nuclear segmentation, and feature extraction**
2. Performing hierarchical, GMM-based **cell phenotyping** 
3. Analyzing **multi-sample cell type composition**
4. Quantifying the **spatial arrangment of cell types** in the tissues
5. Exploring the original images with all downstream associated data using **interactive dashboards**

## Input datasets

- Collection of registered OME-TIFF images
- Markers file (CSV) for background subtraction

    - Example markers file:

```
marker_name,background,exposure,remove
DNA_1,,,
Control_A488,,,TRUE
Control_A555,,,TRUE
Control_A647,,,TRUE
DNA_2,,,TRUE
RNA_Pol_II_CTD,Control_A488,,
pERK,Control_A555,,
p53,Control_A647,,
...
```


- Phenotype workflow and manual gate files (CSV): A comma-separated Scimap phenotyping file that maps hierarchical cell phenotypes to markers, and a manual gates file that maps markers to manually-determined thresholds

    - For examples, see our [tutorial](https://training.galaxyproject.org/training-material/topics/imaging/tutorials/multiplex-tissue-imaging-TMA/tutorial.html) and the [Scimap documentation](https://scimap-doc.readthedocs.io/en/latest/tutorials/scimap-tutorial-cell-phenotyping/).

## Inputs values

All input values have been preset in the workflow and are optimized for cyclic immunofluorescence images captured using a Rarecyte slide scanner. Some important assumptions are made: 

- Channel used for nuclear segmentation (Mesmer): `0`
- Image resolution (microns per pixel): `0.65`

The workflow should be imported and edited if these values are not suitable for your datasets. 

## Processing

For more detailed information, see our [tutorial on the Galaxy Training Network](https://training.galaxyproject.org/training-material/topics/imaging/tutorials/multiplex-tissue-imaging-TMA/tutorial.html)

- Nuclear segmentation is performed using **Mesmer**, producing a nuclear mask in TIFF format for each core image
- Cell/nuclear features (mean marker intensities, spatial coordinates, and morphological measurements) are quantified using **MCQUANT**, producing a CSV table of cells (rows) x features (columns)
- The quantification table is converted to anndata format (h5ad), a common datatype used by most single-cell and spatial analysis packages
- Automated cell phenotyping is performed using **Scimap** (see *Warning* section about GMM-based phenotyping)
- **Scimap** and **Squidpy** are used for spatial analysis
- Finally, **Vitessce** dashboards combine interactive image viewing with linked single-cell analysis components to allow for integrated initial data exploration

## Tool developers' documentation

- [MCMICRO](https://mcmicro.org/)
    - Basic Illumination
    - ASHLAR
    - UNetCoreograph
    - MCQuant
- [Mesmer](https://deepcell.readthedocs.io/en/master/)
- [Scimap](https://scimap-doc.readthedocs.io/en/latest/)
- [Vitessce](https://vitessce.io/)


## Tool references

- Greenwald, N. F., G. Miller, E. Moen, A. Kong, A. Kagel et al., 2021 Whole-cell segmentation of tissue images with human-level performance using large-scale data annotation and deep learning. Nature Biotechnology 40: 555–565. 10.1038/s41587-021-01094-0
- Schapiro, D., A. Sokolov, C. Yapp, Y.-A. Chen, J. L. Muhlich et al., 2021 MCMICRO: a scalable, modular image-processing pipeline for multiplexed tissue imaging. Nature Methods 19: 311–315. 10.1038/s41592-021-01308-y
- Virshup, I., S. Rybakov, F. J. Theis, P. Angerer, and F. A. Wolf, 2021 anndata: Annotated data. 10.1101/2021.12.16.473007
- Palla, G., H. Spitzer, M. Klein, D. Fischer, A. C. Schaar et al., 2022 Squidpy: a scalable framework for spatial omics analysis. Nature Methods 19: 171–178. 10.1038/s41592-021-01358-2
- Nirmal, A. J., and P. K. Sorger, 2024 SCIMAP: A Python Toolkit for Integrated Spatial Analysis of Multiplexed Imaging Data. Journal of Open Source Software 9: 6604. 10.21105/joss.06604
