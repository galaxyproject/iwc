# Genome assembly with Flye workflow


## Inputs

Sequencing reads in format:
fasta, fasta.gz, fastq, fastq.gz, fastqsanger.gz or fastqsanger


## What does the workflow do

- Assembles the reads with the tool Flye
- Summarizes the statistics with the tool Fasta statistics
- Report with the tool Quast
- Renders the assembly graph with the tool Bandage


## Settings

Run as-is or change parameters at runtime

For example:
- change the Flye option of "mode" to the correct sequencing type
- change the Quast option for "Type of organism" to correct taxon
 


## Outputs

- Flye assembly output - four files: fasta, gfa for bandage, graph_dot file, assembly info
- Fasta statistics
- Bandage image
- Quast report
