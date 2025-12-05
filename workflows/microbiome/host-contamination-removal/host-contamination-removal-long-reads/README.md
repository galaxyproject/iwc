# Host or Contamination removal on long-reads

The extraction of microbiome DNA or RNA is usually contaminated by host and human DNA or RNA (but also other contaminant). It is an important to get rid of all host/contamination sequences and to only retain microbiome sequences, both in order to speed up further steps and to avoid host/contamination sequences compromising the analysis.

This workflow takes Nanopore fastq(.gz) files and executes the following steps:
1. Mapping of the reads against a reference genome of the host or contaminant (e.g. human) using **Minimap 2**
2. Filtering of the generated BAM using **BAMtools** and **Samtools** to keep only the reads that do not align
3. Generation of mapping statistics using **QualiMap**
4. Aggregation of the mapping statistics using **MultiQC**

## Input Datasets

- A list of datasets corresponding to reads in `fastqsanger` or `fastqsanger.gz` format.
- Reference genome
- Profile for mapping

## Output Datasets

- A list of datasets corresponding to unmapped reads in `fastqsanger` or `fastqsanger.gz`.
- A list of reports of QualiMap for each sample that could be used as inputs for extra MultiQC
- MultiQC report of the mapping statistics in HTML

## When to use this workflow

Use this workflow for **long-read sequencing data** (e.g., Nanopore, PacBio). For short-read Illumina data, see the [Host or Contamination removal on short-reads](../host-contamination-removal-short-reads/) workflow.