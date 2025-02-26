# Pox Virus Half-Genome Amplicon Analysis

## Overview

This workflow implements a specialized approach for analyzing pox virus genomes using a half-genome sequencing strategy with Illumina paired-end amplicon data. By processing separate sequencing runs targeting each half of the genome, this workflow resolves the challenging inverted terminal repeat (ITR) regions that characterize pox virus genomes, enabling accurate consensus sequence generation for these large DNA viruses.

## Workflow Process

The pox-virus-half-genome workflow provides:

1. **Split Genome Mapping**
   - Processes Illumina paired-end reads from two separate sequencing runs
   - Maps each half-genome dataset to a correspondingly masked reference
   - Uses BWA-MEM for sensitive alignment of amplicon sequences
   - Employs custom masking strategies to correctly resolve half-genome boundaries
   - Addresses the unique challenges of pox virus genomic architecture

2. **Mapping Integration and Processing**
   - Merges alignment results from both half-genome sequencing runs
   - Resolves overlapping regions between the two halves
   - Creates a unified alignment file covering the complete genome
   - Processes amplicon primer regions using iVar for accurate trimming
   - Ensures proper handling of the terminal repeat regions

3. **Consensus Generation and Analysis**
   - Generates high-quality consensus sequences from the merged alignments
   - Applies appropriate quality thresholds for base calling
   - Resolves ambiguities in the complex terminal repeat regions
   - Produces complete pox virus genome assemblies
   - Enables downstream comparative genomics and variant analysis

## Input Requirements

**Required Inputs:**
- Paired-end Illumina sequencing reads from first half-genome sequencing run
- Paired-end Illumina sequencing reads from second half-genome sequencing run
- Reference genome sequence for the target pox virus
- Amplicon primer scheme bed file defining the tiled amplicon regions
- Sample metadata for proper organization of outputs

## Technical Approach

This workflow builds upon the methodological foundation established in the [SARS-CoV-2 PE Illumina ARTIC iVar Analysis](https://github.com/iwc-workflows/sars-cov-2-pe-illumina-artic-ivar-analysis) workflow, extending it with specialized logic for:
- Split genome mapping strategies
- Handling of the unique pox virus genomic architecture
- Resolving the complex terminal repeat regions
- Merging and integrating data from separate sequencing runs
- Generating complete consensus sequences from half-genome data

## Applications

This specialized pox virus workflow is essential for:
- Genomic surveillance of pox virus outbreaks
- Resolving the challenging ITR regions in pox virus genomes
- Generating complete reference genomes for pox virus isolates
- Tracking transmission chains during outbreaks
- Identifying genomic variants for evolutionary studies
- Supporting public health responses to pox virus emergences

## Output Details

The workflow produces:
- Complete consensus sequences for pox virus genomes
- Combined alignment files integrating both half-genome datasets
- Quality metrics for sequencing and mapping
- Visualization files for coverage and mapping quality assessment
- Standardized outputs suitable for submission to public databases