# Assembly Decontamination Workflow (VGP9)

## Overview
This workflow is designed to identify and remove contaminant sequences from a genome assembly, including non-target contaminants and mitochondrial sequences. It implements quality control steps vital for generating high-quality genome assemblies according to Vertebrate Genome Project (VGP) standards.

## Purpose
Genome assembly projects often contain DNA from sources other than the target organism, such as:
- Bacterial contamination
- Viral contamination
- Mitochondrial sequences
- Laboratory contaminants

This workflow automatically identifies and removes these contaminant sequences to produce a clean, chromosomal assembly.

## Workflow Steps

1. **Soft and Hard Masking**
   - Performs soft-masking with NCBI BLAST+ dustmasker to identify low-complexity regions
   - Converts soft-masked sequences to hard-masked sequences

2. **Contaminant Identification**
   - Uses Kraken2 to classify sequences against a reference database
   - Identifies non-target contaminants based on taxonomic classification

3. **Mitochondrial Sequence Detection**
   - Performs BLAST against the mitochondrial database (refseq_mitochondrion)
   - Identifies scaffolds likely to contain mitochondrial DNA

4. **Sequence Removal**
   - Generates a list of contaminant and mitochondrial scaffolds
   - Uses gfastats to generate a clean assembly with contaminants removed

## Outputs
- **Kraken2 classification scores**: Taxonomic classification of scaffolds
- **Mitochondrial scaffold list**: Identified mitochondrial sequences
- **Full contaminant + mitochondrial scaffold list**: Combined list of sequences to exclude
- **Final decontaminated assembly**: Clean genome assembly with contaminants removed
- **Contaminants table**: List of identified contaminant sequences

## Usage Notes
- Input requires a scaffolded genome assembly in FASTA format
- Requires selection of an appropriate Kraken2 database for contamination screening
- The workflow tags the mitochondrial sequences separately, allowing for downstream analyses

## VGP Compliance
This workflow is part of the VGP (Vertebrate Genome Project) assembly pipeline and is tagged with "VGP_curated", indicating it meets VGP standards for genome assembly processing.

## Citation
If using this workflow, please cite the Vertebrate Genome Project and the tools used (Kraken2, BLAST+, gfastats).