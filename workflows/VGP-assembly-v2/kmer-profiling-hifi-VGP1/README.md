# VGP Workflow #1

This workflow produces a Meryl database and Genomescope outputs that will be used to determine parameters for following workflows, and assess the quality of genome assemblies. Specifically, it provides information about the genomic complexity, such as the genome size and levels of heterozygosity and repeat content, as well about the data quality. It also provides statistics on the PacBio Hifi reads. 

## Inputs

1. The name of the species being assembled
2. The Name of the assembly
3. A collection of Hifi long reads in FASTQ format
4. *k*-mer length
5. Ploidy

## Outputs

- Meryl Database of *k*-mer counts
- GenomeScope
    - Linear plot
    - Log plot
    - Transformed linear plot
    - Transformed log plot
    - Summary
    - Model
    - Model parameteres
- RDeval for PacBio Hifi Reads QC
    - Reads statistics
    - HTML report
- Mash QC, heatmap of distance between Hifi datasets
  
