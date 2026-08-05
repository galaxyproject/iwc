# SamestrGal for shared-strain detection in metagenomes

This workflow processes paired-end shotgun metagenomic sequencing reads from multiple samples. It performs the following steps:

- **Preprocessing**: Quality trimming and host read removal using KneadData
- **Taxonomic profiling and marker-based alignment**: MetaPhlAn4 or mOTUs for taxonomic classification and marker based alignment
- **Strain detection**: SameStr tools identify strains across samples and compute pairwise strain comparisons using Maximum Variant Profile Similarity (MVS) scores.

## Inputs

- **Raw Reads**: A collection of paired-end FASTQ files from one or more samples to compare
- **Select MetaPhlAn Database**: Optional. Selecting a database runs MetaPhlAn as the taxonomic profiler and marker-based aligner.
- **Select mOTUs Database**: Optional. Selecting a database runs mOTUs as the taxonomic profiler and marker-based aligner.
- At least one of the two databases must be selected, or the workflow will fail. If both are selected, both tools run, but SameStr uses the MetaPhlAn output.

## Outputs

 - **SameStr results**: SNV profile summary statistics, taxon counts, strain events, and co-occurrence tables, generated from MetaPhlAn output if a MetaPhlAn database was selected, otherwise from mOTUs output.