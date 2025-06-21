# End-to-End Tissue Microarray Image Analysis with Galaxy-ME

Use this workflow when you have raw, unprocessed cycle images that need full preprocessing before analysis.

## Input datasets

- Collection of raw cycle images (TIFF/OME-TIFF): Ensure that the list is ordered in cycle order (ex: cycle_1.tiff, cycle_2.tiff, etc.)
- Markers file (CSV): A comma-separated file with `marker_names` in the third column

    - Example markers file:

```
round,channel,marker_name
0,0,DAPI_1
0,1,CD3
0,2,CD45
0,3,CD8
1,4,DAPI_2
1,5,PANCK
1,6,SMA
1,7,ECAD
...
```


- Phenotype file (CSV): A comma-separated Scimap phenotyping file that maps hierarchical cell phenotypes to markers

    - For an example phenotype workflow, see our [tutorial](https://training.galaxyproject.org/training-material/topics/imaging/tutorials/multiplex-tissue-imaging-TMA/tutorial.html) and the [Scimap documentation](https://scimap-doc.readthedocs.io/en/latest/tutorials/scimap-tutorial-cell-phenotyping/).


## Input values

All input values have been preset in the workflow and are optimized for cyclic immunofluorescence images captured using a Rarecyte slide scanner. Some important assumptions are made:

- Channel used as a reference for registration (ASHLAR): `0`
- Channel used for nuclear segmentation (Mesmer): `0`
- Image resolution (microns per pixel): `0.65`

The workflow should be imported and edited if these values are not suitable for your datasets.

## Processing

For more detailed information, see our [tutorial on the Galaxy Training Network](https://training.galaxyproject.org/training-material/topics/imaging/tutorials/multiplex-tissue-imaging-TMA/tutorial.html)

- Tile-to-tile illumination differences are corrected in the unstitched input raw cycle images using **Basic Illumination**
- A whole-slide OME-TIFF image is generated via stitching and registration with **ASHLAR**. Channel names are assigned at this step using the input markers file
- TMA cores are segmented and cropped into individual images, producing a collection of TIFFs using **UNetCoreograph**. All subsequent steps are run as batch processing across the collection of core datasets
- The output of **UNetCoreograph** is a generic TIFF, and must be converted back to OME-TIFF using the **Convert Image** tool, and channels can be renamed using the **Rename OME-TIFF channels** utility
- Nuclear segmentation is performed using **Mesmer**, producing a nuclear mask in TIFF format for each core image
- Cell/nuclear features (mean marker intensities, spatial coordinates, and morphological measurements) are quantified using **MCQUANT**, producing a CSV table of cells (rows) x features (columns)
- The quantification table is converted to anndata format (h5ad), a common datatype used by most single-cell and spatial analysis packages
- Automated cell phenotyping is performed using **Scimap** (see *Warning* section about GMM-based phenotyping)
- Finally, **Vitessce** dashboards combine interactive image viewing with linked single-cell analysis components to allow for integrated initial data exploration

## Warning

In this workflow, we perform automated GMM-based cell phenotyping using Scimap. The Scimap tool also accepts manual gates, which can be determined using the **GateFinder** tool. This method is highly recommended, as **most** markers are not well suited for GMM-based thresholding. The automated GMM-based thresholding can work well for highly abundant markers that show a strong bimodal distribution; otherwise, it should be used primarily as a means of generating an initial starting point for gating and cell phenotyping.

For more warnings and context, see our tutorial linked above.


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

- Peng, T., K. Thorn, T. Schroeder, L. Wang, F. J. Theis et al., 2017 A BaSiC tool for background and shading correction of optical microscopy images. Nature Communications 8: 10.1038/ncomms14836
- Wolf, F. A., P. Angerer, and F. J. Theis, 2018 SCANPY: large-scale single-cell gene expression data analysis. Genome Biology 19: 10.1186/s13059-017-1382-0
- Stringer, C., T. Wang, M. Michaelos, and M. Pachitariu, 2020 Cellpose: a generalist algorithm for cellular segmentation. Nature Methods 18: 100–106. 10.1038/s41592-020-01018-x
- Greenwald, N. F., G. Miller, E. Moen, A. Kong, A. Kagel et al., 2021 Whole-cell segmentation of tissue images with human-level performance using large-scale data annotation and deep learning. Nature Biotechnology 40: 555–565. 10.1038/s41587-021-01094-0
- Schapiro, D., A. Sokolov, C. Yapp, Y.-A. Chen, J. L. Muhlich et al., 2021 MCMICRO: a scalable, modular image-processing pipeline for multiplexed tissue imaging. Nature Methods 19: 311–315. 10.1038/s41592-021-01308-y
Virshup, I., S. Rybakov, F. J. Theis, P. Angerer, and F. A. Wolf, 2021 anndata: Annotated data. 10.1101/2021.12.16.473007
- Muhlich, J. L., Y.-A. Chen, C. Yapp, D. Russell, S. Santagata et al., 2022 Stitching and registering highly multiplexed whole-slide images of tissues and tumors using ASHLAR (A. Valencia, Ed.). Bioinformatics 38: 4613–4621. 10.1093/bioinformatics/btac544
- Palla, G., H. Spitzer, M. Klein, D. Fischer, A. C. Schaar et al., 2022 Squidpy: a scalable framework for spatial omics analysis. Nature Methods 19: 171–178. 10.1038/s41592-021-01358-2
- Yapp, C., E. Novikov, W.-D. Jang, T. Vallius, Y.-A. Chen et al., 2022 UnMICST: Deep learning with real augmentation for robust segmentation of highly multiplexed images of human tissues. Communications Biology 5: 10.1038/s42003-022-04076-3
- Zhang, W., I. Li, N. E. Reticker-Flynn, Z. Good, S. Chang et al., 2022 Identification of cell types in multiplexed in situ images by combining protein expression and spatial information using CELESTA. Nature Methods 19: 759–769. 10.1038/s41592-022-01498-z
- Nirmal, A. J., and P. K. Sorger, 2024 SCIMAP: A Python Toolkit for Integrated Spatial Analysis of Multiplexed Imaging Data. Journal of Open Source Software 9: 6604. 10.21105/joss.06604
