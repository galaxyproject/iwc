# Host or Contamination removal on short-reads

The extraction of microbiome DNA or RNA is usually contaminated by host and human DNA or RNA (but also other contaminant). It is an important to get rid of all host/contamination sequences and to only retain microbiome sequences, both in order to speed up further steps and to avoid host/contamination sequences compromising the analysis.

This workflow is part of a **suite of workflows for end-to-end metagenome-assembled genome (MAG) generation**. See the [FAIRyMAGs repository](https://github.com/usegalaxy-eu/FAIRyMAGs) for the complete workflow suite and its capabilities.
A dedicated [learning pathway](https://galaxyproject.github.io/training-material/learning-pathways/mags.html) provides detailed guidance on how to use this workflow.

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

## Funding

This workflow was developed as part of the [**FAIRyMAGs** project](https://elixir-europe.org/how-we-work/scientific-programme/science/bfsp/fairymags), funded as a commissioned service of the [**Biodiversity, Food Security and Pathogens (BFSP) ELIXIR Scientific Programme 2024–2028**](https://elixir-europe.org/how-we-work/scientific-programme/science/bfsp).

The project was also supported by the **European Galaxy Server**, funded by the German Federal Ministry of Education and Research (BMBF; 031 A538A de.NBI-RBC) and the **Ministry of Science, Research and the Arts Baden-Württemberg (MWK)** within the framework of **LIBIS/de.NBI Freiburg**.

## Talks and Posters

* **ELIXIR All Hands Meeting 2025:** [Slides](https://f1000research.com/slides/14-595)
* **Galaxy Community Conference 2026 (GCC2026):** [Poster and Talk](https://zenodo.org/records/21128145)
* **HAL 2026:** [Publication](https://hal.science/hal-05724928)
* **FAIRyMAGs - a series of FAIR Galaxy workflows for the generation of metagenome assembled genomes** [Preprint](https://doi.org/10.64898/2026.07.31.741430)