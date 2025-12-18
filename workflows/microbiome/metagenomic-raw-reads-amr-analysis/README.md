# Raw read AMR analysis from metagenomic data

From metagenomics short-read data, this workflow performs taxonomic profiling, predicts Antibiotic Resistance Genes (ARGs), and standardizes ARG annotations.

## Raw read Annotation

Directly from metagenomics short-reads after quality control and host/contamination removal, the following processing steps are performed:

* **Taxonomic Profiling** using Sylph and Sylph-tax
* **Antibiotic Resistance Genes (ARGs) prediction** with Groot and deepARG
* **ARG annotations normalization to the ARO** with argNorm

## Input Requirements

Input reads must be short reads that have been quality-filtered, with host/contaminant reads removed. They should be in fastqsanger(.gz) inside a paired collection.

