# VGP Workflow #1

This workflow produces a Meryl Database and Genomescope plots that will be used to determine parameters for following workflows, and assess the quality of genome assemblies.

## VGP Pipeline

The Collaboration between the [VGP](https://vertebrategenomesproject.org/) lead to the creation of a set of workflows dedicated to hybrid genome assembly. The pipeline inclide de following workflows:
-   Creation of kmer count histograms with Meryl
-   Hifi Long Read phased assembly with Hifiasm
-   Scaffolding with Bionano Mapping data (Optional)
-   Scaffolding with HiC data


### Inputs

-   Collection of Hifi long reads in fastq Format.

### Outputs

-   Meryl Database of kmer counts
-   GenomeScope
    -   Linear plot
    -   Log plot
    -   Transformed linear plot
    -   Transformed log plot
