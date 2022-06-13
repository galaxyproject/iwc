# VGP Workflow #1

This workflow produces a Meryl database and Genomescope outputs that will be used to determine parameters for following workflows, and assess the quality of genome assemblies. Specifically, it provides information about the genomic complexity, such as the genome size and levels of heterozygosity and repeat content, as well about the data quality.

### Inputs

-   Collection of Hifi long reads in FASTQ format

### Outputs

-   Meryl Database of kmer counts
-   GenomeScope
    -   Linear plot
    -   Log plot
    -   Transformed linear plot
    -   Transformed log plot
    -   Summary
    -   Model
    -   Model parameteres