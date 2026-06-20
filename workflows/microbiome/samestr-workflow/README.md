# SameStr workflow for shared-strain detection in metagenomes

This workflow processes paired-end shotgun metagenomic sequencing reads from multiple samples. It performs the following steps:

- **Preprocessing**: Quality trimming and host read removal using KneadData
- **Taxonomic profiling**: MetaPhlAn4 or mOTUs for taxonomic classification
- **Marker-based alignment**: MetaPhlAn or mOTUs for alignment
- **Strain detection**: SameStr tools identify strains across samples and compute pairwise strain comparisons using Maximum Variant Profile Similarity (MVS) scores.

## Inputs

- **Raw Reads**: A collection of paired-end FASTQ files from one or more samples to compare
- **Run MetaPhlAn**: Boolean parameter (default: true) that enables MetaPhlAn-based strain detection
- **Run mOTUs**: Boolean parameter (default: false) that enables mOTUs-based strain detection

## Outputs

 - **MetaPhlAn results** (if enabled): SNV profile summary statistics, taxon counts, strain events, and co-occurrence tables
 - **mOTUs results** (if enabled): SNV profile summary statistics, taxon counts, strain events, and co-occurrence tables
