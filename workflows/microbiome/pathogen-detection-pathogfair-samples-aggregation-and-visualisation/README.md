# Pathogen Detection: _PathoGFAIR Samples Aggregation and Visualisation_

In this workflow, we will aggregate results and use the results from 3 workflows (**Nanopore _Preprocessing_**, **_Gene-based Pathogen Identification_** and **Nanopore _Allele-based Pathogen Identification_**) to help track pathogens among samples and visualise all performed analysis by:

1. Drawing a presence-absence heatmap of the identified VF genes within all samples to visualise in which samples these genes can be found.
2. Drawing a phylogenetic tree for each pathogenic genes detected, where we will relate the contigs of the samples together where this gene is found.
3. Plotting QC reads, host reads, mapping coverage and depth, and SNP analysis.

With these types of visualisations, we can have an overview of all samples and the genes, but also how samples are related to each other, which common pathogenic genes they share. Given the time of the sampling and the location one can easily identify using these graphs, where and when the contamination has occurred among the different samples.

This workflow is available for trial through our [GTN tutorial](https://training.galaxyproject.org/training-material/topics/microbiome/tutorials/pathogen-detection-from-nanopore-foodborne-data/tutorial.html)
