# Host or Contamination removal on short-reads

The extraction of microbiome DNA or RNA is usually contaminated by host and human DNA or RNA (but also other contaminant). It is an important to get rid of all host/contamination sequences and to only retain microbiome sequences, both in order to speed up further steps and to avoid host/contamination sequences compromising the analysis.

This workflow takes paired-end Illumina fastq(.gz) files and executes the following steps:
1. Mapping of the reads against a reference genome of the host or contaminant (e.g. human) using **Bowtie 2**
2. Aggregation of the mapping reports using **MultiQC**

## Input Datasets

- A list of paired datasets corresponding to paired-end reads in `fastqsanger` or `fastqsanger.gz` format.
- Reference genome

## Output Datasets

- A list of paired datasets corresponding to paired-end reads without the reads mapping to the reference genomes, in `fastqsanger` or `fastqsanger.gz`.
- List of `JSON` reports of Bowtie2 for each sample that could be used as inputs for extra MultiQC
- MultiQC report of the mapping statistics in HTML

## When to use this workflow

Use this workflow for **short-read paired-end Illumina sequencing data**. For long-read data (Nanopore, PacBio), see the [Host or Contamination removal on long-reads](../host-contamination-removal-long-reads/) workflow.