# Identification of expressed proteins in complex bacterial community samples - Metaproteomics data analysis

Metaproteomics is the large-scale characterization of the entire protein complement of environmental microbiota at a given point in time. It has the potential to unravel the mechanistic details of microbial interactions with the host / environment by analyzing the functional dynamics of the microbiome.

This workflow helps to identify expressed proteins from a complex bacterial community sample. For this, MS/MS data generated are matched to peptide sequences provided through a FASTA file using SearchGUI. 

The output file is processed using PeptideShaker by organizing Peptide-Spectral Matches (PSMs) generated from SearchGUI processing and are contained in the SearchGUI archive. This helps to evaluate the confidence of the data, inferring proteins identified from the matched peptide sequences and generating outputs that can be visualized by users to interpret results.

The identified peptides are then used as evidence to infer which organisms are represented in the sample, and what biological functions those peptides and associated proteins suggest are occurring. To match the peptides to proteins and retrieve their taxonomy, UniPept resource is used.

More background on this workflow can be found in the [Metaproteomics tutorial](https://galaxyproject.github.io/training-material//topics/proteomics/tutorials/metaproteomics/tutorial.html)


## Inputs dataset

- `Dataset collection of MGF files` in RAW dataset collection
- `Protein Fasta file` consisting of trimmed peptides, given as a protein database input for Search GUI
- `Gene ontology terms` in Tabular Format 


## Objectives

- A taxonomy and functional analysis of metaproteomic mass spectrometry data