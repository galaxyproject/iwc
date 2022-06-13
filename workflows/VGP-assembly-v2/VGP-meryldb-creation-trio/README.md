# VGP Workflow #1

This workflow collects the metrics on the properties of the genome under consideration by analyzing the k-mer frequencies. It provides information about the genomic complexity, such as the genome size and levels of heterozygosity and repeat content, as well about the data quality. It uses reads from two parental genomes to partition long reads from the offspring into haplotype-specific k-mer databases.

### Inputs

-   Collection of Hifi long reads in FASTQ format
-   Paternal short-read Illumina sequencing reads in FASTQ format
-   Maternal short-read Illumina sequencing reads in FASTQ format

### Outputs

-   Meryl databases of k-mer counts
    - Child
    - Paternal haplotype
    - Maternal haplotype
-   GenomeScope metrics of child and parental genomes
    -   Linear plot
    -   Log plot
    -   Transformed linear plot
    -   Transformed log plot
    -   Summary
    -   Model
    -   Model parameteres