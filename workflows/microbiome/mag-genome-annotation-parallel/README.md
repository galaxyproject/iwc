# MAG Genome Annotation Parallel

This workflow performs parallel annotation of Metagenome-Assembled Genomes (MAGs).
It processes multiple genome assemblies simultaneously and produces standardized annotation outputs, summary tables, and integrated quality reports.

## Workflow Logic
The workflow takes a collection of MAG genome assemblies as input and runs genome annotation in parallel for each genome.
Annotation outputs are then reformatted, normalized, and merged across all genomes to produce unified result files.

The core logic includes:

- Parallel processing of all input MAGs
- Automated annotation per genome
- Standardization of annotation formats
- Merging and collapsing results across samples/genomes

## Annotation and Reporting
After annotation, the workflow performs structured post-processing and reporting:

- Genome annotation (per-MAG, in parallel)
- Output normalization and reformatting
- Merging of annotation results into consolidated tables
- Summary statistics generation
- Integrated reporting using MultiQC

All outputs are consolidated into a single MultiQC report providing a global overview of annotation completeness, gene content, and processing metrics across all genomes.

## Input Requirements
MAG assemblies (FASTA format) provided as a collection in Galaxy.

## Expected Outputs

- Per-MAG annotation files
- Standardized annotation tables
- Merged genome annotation matrices
- Summary statistics files
- A unified MultiQC report for all genomes