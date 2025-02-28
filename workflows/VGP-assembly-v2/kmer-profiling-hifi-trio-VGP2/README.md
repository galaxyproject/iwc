# K-mer Profiling for HiFi Trio Data (VGP2)

## Overview

This workflow implements k-mer based analysis of sequencing data from parent-offspring trios for genome size estimation, heterozygosity assessment, and haplotype partitioning. Following the Vertebrate Genome Project (VGP) standards, this workflow provides essential parameters for optimizing downstream trio-based assembly steps and creates haplotype-specific k-mer databases.

## Workflow Process

The kmer-profiling-hifi-trio-VGP2 workflow provides:

1. **K-mer Counting and Trio Analysis**
   - Processes HiFi long reads from offspring and short reads from both parents
   - Generates k-mer frequency histograms for each individual
   - Constructs haplotype-specific k-mer databases for maternal and paternal contributions
   - Partitions offspring reads based on parental k-mer patterns
   - Creates the foundation for trio-based phased assembly

2. **Genome Characteristic Estimation**
   - Calculates accurate genome size estimates for all three individuals
   - Measures heterozygosity levels across the trio
   - Estimates repetitive content proportion in the genome
   - Predicts sequencing error rates from k-mer spectra
   - Provides model parameters for optimizing downstream assembly steps

3. **Visualization and Quality Control**
   - Generates comprehensive GenomeScope profiles for all three individuals
   - Produces linear and logarithmic visualization of k-mer spectra
   - Creates transformed plots for heterozygosity assessment
   - Evaluates sequencing coverage and completeness
   - Identifies potential contamination or data quality issues

## Input Requirements

**Required Inputs:**
- Collection of HiFi long reads from offspring [FASTQ]
- Collection of paternal short-read Illumina sequencing reads [FASTQ]
- Collection of maternal short-read Illumina sequencing reads [FASTQ]
- K-mer length parameter (optimal value typically determined by read characteristics)
- Ploidy setting for the organism

## Output Details

The workflow produces:
- **Meryl k-mer databases** for:
  - Child (offspring)
  - Paternal haplotype
  - Maternal haplotype

- **GenomeScope metrics** for each individual (child and both parents):
  - Linear plot
  - Log plot
  - Transformed linear plot
  - Transformed log plot
  - Statistical summary
  - Fitted model
  - Model parameters

![GenomeScope Profile Example](https://github.com/galaxyproject/iwc/assets/4291636/35282f8e-d021-44f6-8e03-7b58b32d6d00)

## Integration with VGP Pipeline

This workflow is designated as VGP2 in the VGP assembly pipeline series and:
- Serves as a prerequisite for trio-based assembly workflows
- Creates the foundation for parental-based haplotype phasing
- Provides critical parameters for optimizing assembly processes
- Supports quality control of input data before computational-intensive assembly steps
