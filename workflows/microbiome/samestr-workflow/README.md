# SameStr Workflow for Strain-Level Analysis of FMT Samples

This workflow processes paired-end shotgun metagenomic sequencing reads from pre-FMT (recipient), donor, and post-FMT samples. It performs the following steps:

- **Preprocessing**: Quality trimming and host read removal using KneadData
- **Taxonomic profiling**: MetaPhlAn4 or mOTUs for taxonomic classification
- **Marker-based alignment**: MetaPhlAn or mOTUs for alignment
- **Strain detection**: SameStr tools identify strains across samples and compute pairwise strain comparisons using Maximum Variant Profile Similarity (MVS) scores.

## Inputs

- **Raw Reads**: A collection of paired-end FASTQ files (`.fastq.gz`) representing pre-FMT, donor, and post-FMT samples
- **Run MetaPhlAn**: Boolean parameter (default: true) that enables MetaPhlAn-based strain detection
- **Run mOTUs**: Boolean parameter (default: false) that enables mOTUs-based strain detection

## Outputs

- **stats_file**: Summary statistics of SNV profiles per sample
- **taxon_counts**: Taxonomic abundance table
- **strain_events**: Strain-level events detected across samples 
- **cooccurrences**: Strain co-occurrence patterns across samples 
