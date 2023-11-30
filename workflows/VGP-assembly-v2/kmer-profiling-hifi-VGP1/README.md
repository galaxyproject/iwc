# VGP Workflow #1

This workflow produces a Meryl database and Genomescope outputs that will be used to determine parameters for following workflows, and assess the quality of genome assemblies. Specifically, it provides information about the genomic complexity, such as the genome size and levels of heterozygosity and repeat content, as well about the data quality.

### Inputs

-   A collection of Hifi long reads in FASTQ format
-   *k*-mer length
-   Ploidy

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

 ![image](https://github.com/galaxyproject/iwc/assets/4291636/565238fc-f8a9-46ac-8b31-6276410fa436)
