# Genes catalogue generation from metagenomic reads

This workflow generates genes catalogue from paired short reads.

The workflow supports assembly using **MEGAHIT**.

## Genes catalogue Annotation and Quality Control

After assembly, CDS are detected from resulting contigs with **Prodigal** and the potential genes are clustered with **MMseqs2linclust**

The following processing steps are then performed:

- **Genes annotation** with Eggnog-mapper
- **Taxonomic Assignment** using MMseqs2taxonomy
- **Assembly Quality Control** via QUAST
- **Abundance Estimation** per sample with CoverM
- **AMR detection** with ABRicate, AMRFinderPlus and starAMR

Specific focus is placed on the functions and taxonomies associated with contigs on which an antibiotic resistance gene is detected.

## Input Requirements

Input reads must be quality-filtered, with host reads removed.

- **Trimmed reads**: Quality-trimmed reads from individual samples, used solely for abundance estimation.
