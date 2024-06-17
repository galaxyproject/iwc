# Quality and Contamination control workflow for paired end data (v1.0)

This workflow uses paired-end illumina fastq(.gz) files and executes the following steps:
1. Quality control and trimming
    - **fastp** QC control and trimming
2. Taxonomic assignation on trimmed data
    - **Kraken2** assignation
    - **Bracken** to re-estimate abundance to the species level
    - **Recentrifuge** to make a krona chart
3. Aggregating outputs into a single JSON file
    - **ToolDistillator** to extract and aggregate information from different tool outputs to JSON parsable files

## Inputs

1. Paired-end illumina raw reads in fastq(.gz) format.

## Outputs

1. Quality control:
    - quality report
    - trimmed raw reads
2. Taxonomic assignation:
    - Tabular report of identified species
    - Tabular file with assigned read to a taxonomic level
    - Krona chart to illustrate species diversity of the sample
3. Aggregating outputs:
    - JSON file with information about the outputs of **fastp**, **Kraken2**, **Bracken**, **Recentrifuge** 
