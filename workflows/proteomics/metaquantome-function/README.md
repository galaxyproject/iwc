# Creating plots using metaQuantome: Functional enrichment analysis and clustering 

metaQuantome software suite (Easterly et al. 2019) was developed by the Team for quantitative and statistical analysis of metaproteomics data. For taxonomic and functional expression analysis within the microbial community, metaQuantome leverages peptide-level quantitative information to generate visual outputs for data interpretation. It also generates outputs that help in understanding the taxonomic contribution to a selected function as well as functions expressed by selected taxonomic group.

This workflow uses a function file, an intensity file and the metaQuantome databases (NCBI Taxonomy, GO term and ENZYME database) as inputs. Four modules of the metaQuantome suite are used: **expand**,**filter**, **stat** and **visualize**. After the experimental conditions and samples are manually specified, the **expand** module analyzes differentially expressed functions in the samples using the metaQuantome databases to correlate the information in the input files with GO terms, taxa and enzyme classifications. The output file and the manually specified samples are then used in the **filter** module where the expanded terms are filtered to those that are representative of the data according to the user-specified sample parameters. Finally, the **stat** module performs a functional analysis of the filtered data on multiple conditions. The tabular output file is then used as input in the **visualize** module to generate a bar plot and a volcano plot. Users can also generate a PCA plot and a heatmap for cluster analysis.   

***Note:*** The **expand** module of the metaQuantome suite is run in "Functional analysis" mode in this workflow. 

More background on this workflow can be found in the [metaQuantome 2: Function tutorial](https://training.galaxyproject.org/training-material/topics/proteomics/tutorials/metaquantome-function/tutorial.html)


## Inputs dataset

- `Functional metaQuantome file` containing the list of gene onotlogy (GO) terms for each peptide
- `Intensity metaQuantome file` created with peptide quantification tool (e.g. FlashLFQ)
- `metaQuantome databases` (NCBI Taxonomy, GO term and ENZYME database) downloaded
- `metaQuantome: create samples file` to specify the column names used for each experimental group (T2, T4, T7)

## Objectives

- A functional and quantitational analysis of metaproteomic mass spectrometry data