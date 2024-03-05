# Genome assembly with Flye workflow


## Why use this workflow?

- This is a fairly simple workflow that assembles a genome from long sequencing reads.
- It takes in sequencing reads from PacBio (Hifi or non-Hifi), or Oxford Nanopore.
- If you have PacBio Hifi reads, you may prefer to use a workflow with the assembly tool Hifiasm, such as the those in the suite of VGP workflows. 

## Inputs

Raw sequencing reads from PacBio or Oxford Nanopore in format:
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
