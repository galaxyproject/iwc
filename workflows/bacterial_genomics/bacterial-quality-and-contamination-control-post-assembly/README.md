# Bacterial quality and Contamination control post assembly workflow

This workflow uses paired-end illumina fastq(.gz) files and executes the following steps:

1. Genome assembly quality control
   - **Quast** to assess genome quality
   - **Checkm2** to predict the completeness and contamination in an assembly
2. Taxonomic assignment on contigs
   - **Kraken2** assignment
   - **Bracken** to re-estimate abundance to the species level
   - **Recentrifuge** to make a krona chart
3. Aggregating outputs into a single JSON file
   - **ToolDistillator** to extract and aggregate information from different tool outputs to JSON parsable files

## Inputs

1. Fasta as contigs from raw reads assembly.

   Optional : Paired-end illumina raw reads in fastq(.gz) format. (Used with Quast)

## Outputs

1. Genome assembly quality:
   - quality reports
2. Taxonomic assignation:
   - Tabular report of identified species
   - Tabular file with assigned read to a taxonomic level
   - Krona chart to illustrate species diversity of the sample
3. Aggregating outputs:
   - JSON file with information about the outputs of **Quast, Checkm2**, **Kraken2**, **Bracken**, **Recentrifuge**
