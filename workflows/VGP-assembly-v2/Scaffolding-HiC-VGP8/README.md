# Scaffolding with HiC data

This workflow perfoms scaffolding using HiC data with YAHS. It is designed to be run as part of one the VGP analysis trajectories. 
Example of trajectory : 
- VGP1 : Kmer profiling 
- VGP4 : Genome assembly with HiC phasing
- VGP6 : Purge duplicated haplotigs
- VGP8 : Scaffolding with HiC

## Inputs

1. Scaffolded assembly [fasta]
2. Database for busco lineage (recommended: latest)
3. Busco lineage (recommended: vertebrata)
4. Concatenated HiC forward reads [fastq]
5. Concatenated HiC reverse reads [fastq]
6. Restriction enzyme sequence (recommended for VGP data: Arima Hi-C 2.0)
7. Estimated genome size [txt]
8. Haplotype name 


### Outputs

1. Scaffolds in [fasta] and [gfa] format
2. QC: Assembly statistics
3. QC: Nx plot
4. QC: Size plot
5. QC: BUSCO report
6. QC: Pretext Maps before and after scaffolding