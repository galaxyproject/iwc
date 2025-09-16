# Bacterial genome assembly workflow for paired end data

This workflow uses paired-end illumina trimmed reads fastq(.gz) files and executes the following steps:

1. Assembly raw reads to a final contig fasta file
   - **Shovill**
2. Assembly visualization and statistics
   - **Bandage** to plot assembly graph
3. Aggregating outputs into a single JSON file
   - **ToolDistillator** to extract and aggregate information from different tool outputs to JSON parsable files

## Inputs

1. Paired-end illumina trimmed reads in fastq(.gz) format.

## Outputs

1. Assembly:
   - Assembly with contig in fasta
   - Mapped read on assembly in bam format
   - Graph assembly in gfa format
2. Visualization of Assembly:
   - Assembly Graph
   - Assembly report
3. Aggregating outputs
   - JSON file with information about the outputs of **Shovill**, **Bandage**
