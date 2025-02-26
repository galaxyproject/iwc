# Scaffolding with HiC data

This workflow perfoms scaffolding using HiC data with YAHS. It is designed to be run as part of one the VGP analysis trajectories. 
Example of trajectory : 
- VGP1 : Kmer profiling 
- VGP4 : Genome assembly with HiC phasing
- VGP6 : Purge duplicated haplotigs
- VGP8 : Scaffolding with HiC

## Inputs

1. Scaffolded assembly [gfa]
2. Name of the haplotype
3. HiC reads paired collection [fastq]
5. Trim Hi-C data? If `yes` Trim 5 bases at the beginning of each read. Use with Arima Hi-C data if the Hi-C map looks "noisy". 
6. Database for busco lineage (recommended: latest)
7. Busco lineage (recommended: vertebrata)
8. Restriction enzyme sequence (recommended for VGP data: Arima Hi-C 2.0)
9. Estimated genome size [txt]


### Outputs

1. Scaffolds in [fasta] and [gfa] format
2. If you selected `yes` for Hi-C trimming, the trimmed collections of Hi-C reads
3. QC: Assembly statistics
4. QC: Nx plot
5. QC: Size plot
6. QC: BUSCO report
7. QC: Pretext Maps before and after scaffolding
