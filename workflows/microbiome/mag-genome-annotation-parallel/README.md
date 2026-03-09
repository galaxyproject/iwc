# MAG Genome Annotation Parallel

This workflow performs parallel annotation of Metagenome-Assembled Genomes (MAGs). Annotation is performed using Bakta, Integron Finder, PlasmidFinder, and ISEScan, with Bakta being optional. Bakta provides general annotation of bacterial genomes by predicting genes, coding sequences, and RNAs. Integron Finder detects integrons and their structural components, including integrases, attC recombination sites, and gene cassettes. PlasmidFinder identifies plasmid replicon sequences to determine whether contigs originate from plasmids and to classify plasmid types. ISEScan detects insertion sequences (IS elements), which are small transposable elements that can mediate genome rearrangements and facilitate horizontal gene transfer. 
The workflow is targeted torwards prokarytoic genomes, annotations for archaea will likely miss genomic features.
It processes multiple genome assemblies simultaneously and produces standardized annotation outputs, summary tables, and integrated quality reports.

## Workflow Logic
The workflow takes a collection of MAG genome assemblies as input and runs genome annotation in parallel for each genome.
Annotation outputs are then reformatted, normalized, and merged across all genomes to produce unified result files.

The core logic includes:

- Parallel processing of all input MAGs
- Automated annotation per genome
  - **Bakta:**
    - Annotated genome files (e.g., GFF3, GenBank)
    - Predicted coding sequences (CDS)
    - tRNA annotations
    - rRNA annotations
    - tmRNA annotations
    - Other ncRNA annotations and regions
    - Pseudogene annotations
    - sORF annotations
    - CRISPR array annotations
    - Genome gap detection
    - Origin of replication (oriC/oriT) annotation

  - **Integron Finder:**
    - Detected integrons and integrase genes
    - attC recombination sites
    - Gene cassette annotations
    - Tables detailing positions, sequences, and potential antibiotic resistance genes
    - Visualizations of integron structure and gene cassette organization

  - **PlasmidFinder:**
    - Identified plasmid replicon sequences
    - Plasmid type classification for contigs
    - Tabular files with detected plasmids, replicon families, sequence coverage, and confidence scores
    - Summary statistics of plasmid content per genome or assembly

  - **ISEScan:**
    - Detected insertion sequences (IS elements)
    - Locations, family and subgroup annotations
    - Predicted transposase genes
    - Summary tables of IS element distribution
    - Visualizations showing IS density or genomic context relative to coding sequences
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