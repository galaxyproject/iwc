# Mitogenome Assembly Workflow (VGP0)

## Overview
The Mitogenome-Assembly-VGP0 workflow assembles and annotates complete mitochondrial genomes from PacBio HiFi sequencing data. This workflow is part of the Vertebrate Genome Project (VGP) pipeline and follows VGP standards for mitochondrial genome assembly.

## Purpose
Mitochondrial genomes are important for:
- Evolutionary and phylogenetic studies
- Population genetics
- Species identification
- Understanding maternal inheritance patterns
- Complementing nuclear genome assemblies

This workflow automates the process of extracting, assembling, and annotating complete mitochondrial genomes from whole-genome sequencing data.

## Workflow Steps

1. **Reference Identification**
   - Uses the provided species name to query NCBI databases
   - Finds and downloads the closest available mitochondrial reference genome
   - Prepares both FASTA and GenBank format references

2. **Mitochondrial Read Filtering**
   - Identifies mitochondrial reads from the PacBio HiFi dataset
   - Filters reads that match the reference mitochondrial genome

3. **Assembly with MitoHiFi**
   - Assembles filtered reads into a complete mitochondrial genome
   - Circularizes the mitogenome when possible
   - Uses vertebrate mitochondrial genetic code (code 2) for annotation

4. **Annotation and Visualization**
   - Annotates mitochondrial genes, tRNAs, and rRNAs
   - Generates a visualization of the annotated mitogenome
   - Produces coverage statistics and plots

5. **Output Preparation**
   - Compresses the final mitogenome FASTA file for storage

## Inputs
- **Collection of PacBio Data**: PacBio HiFi reads in FASTA format
- **Species name**: Latin name of the target species (used for reference lookup)
- **Email address**: Required for NCBI database queries

## Outputs
- **mitogenome_fasta**: The assembled mitochondrial genome sequence
- **mitogenome_genbank**: Annotated mitogenome in GenBank format
- **mitogenome_annotation**: Visualization of gene annotations on the mitogenome
- **mitogenome_coverage**: Coverage plot of the assembled mitogenome
- **contigs_stats**: Statistics about the assembled contigs

## Usage Notes
- This workflow is optimized for PacBio HiFi data
- The species name should be as specific as possible for better reference matching
- If an exact species match is not available, the workflow will use the closest related species
- Default parameters are set to vertebrate mitochondrial genetic code (2)

## VGP Compliance
This workflow is tagged as "VGP" and "Reviewed", indicating it meets Vertebrate Genome Project standards and has been reviewed for quality.

## Citation
If using this workflow, please cite MitoHiFi and the Vertebrate Genome Project.

Formenti G, Rhie A, Walenz BP, et al. Complete vertebrate mitogenomes reveal widespread repeats and gene duplications. Genome Biol. 2021;22(1):120.