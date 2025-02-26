# SARS-CoV-2 PE Illumina ARTIC iVar Analysis

## Overview

This workflow implements a comprehensive analysis pipeline for SARS-CoV-2 sequencing data generated using Illumina paired-end amplicon-based approaches with the ARTIC protocol. It focuses on variant calling using the iVar toolkit and enables rapid phylogenetic classification of samples for surveillance and epidemiological applications.

## Workflow Process

The SARS-CoV-2-PE-Illumina-ARTIC-iVar-Analysis workflow provides:

1. **Read Processing and Quality Control**
   - Processes paired-end Illumina sequencing data
   - Performs adapter trimming and quality filtering
   - Maps reads to the SARS-CoV-2 reference genome
   - Generates coverage statistics and quality metrics
   - Implements primer trimming specific to ARTIC amplicon protocols

2. **Variant Calling with iVar**
   - Employs the iVar toolkit specifically designed for viral amplicon data
   - Identifies single nucleotide variants and small indels
   - Applies appropriate filtering for amplicon sequencing artifacts
   - Generates variant calls with quality and depth annotations
   - Produces consensus sequences with configurable quality thresholds

3. **Lineage and Clade Assignment**
   - Performs automated lineage assignment using Pangolin
   - Conducts clade classification with Nextclade
   - Provides phylogenetic contextualization of samples
   - Identifies variants of concern/interest based on current definitions
   - Generates comprehensive reports for surveillance applications

## Methodological Approach

This workflow implements methodologies used by major SARS-CoV-2 genomic surveillance initiatives including:
- COVID-19 Genomics UK Consortium (COG-UK)
- Canadian COVID Genomics Network (CanCOGeN)
- Public health laboratories across multiple countries

It aligns with established protocols implemented in other workflow systems:
- ncov2019-artic-nf (Nextflow)
- covid-19-signal (Snakemake)
- Titan workflow from Theiagen (WDL)

This Galaxy implementation makes these established protocols more accessible through a user-friendly interface while maintaining methodological consistency with global standards.

## Applications

This workflow is designed for:
- Public health genomic surveillance
- Variant monitoring and classification
- Outbreak investigation
- Lineage tracking and epidemiology
- Contribution to global SARS-CoV-2 databases

## Training Resources

This workflow is the subject of a Galaxy Training Network tutorial available at:
- [SARS-CoV-2 Analysis with Galaxy](https://training.galaxyproject.org/training-material/)

## Comparison to Alternative Approaches

This workflow differs from the PE-ARTIC-Variant-Calling workflow in that it:
- Specifically implements the iVar toolkit rather than LoFreq
- Focuses on rapid identification of majority variants
- Emphasizes lineage/clade assignment for surveillance
- Optimizes for speed in public health applications
