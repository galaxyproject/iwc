# Scaffolding with HiC data

This workflow performs genome assembly scaffolding using HiC data with YAHS. It is designed to be run as part of the VGP analysis trajectories, but can be used on any assembly in GFA format with Hi-C data. To generate a GFA from a fasta assembly, you can use the gfastats tool in Galaxy.  

Example of VGP trajectory : 
- VGP1: Kmer profiling 
- VGP4: Genome assembly with HiC phasing
- VGP6: Purge duplicated haplotigs
- VGP8: Scaffolding with HiC

## Inputs

1. Genome assembly [gfa]
2. Haplotype being scaffolded (Will be added to scaffold names: e.g. `>scaffold_01_H1`)
3. HiC reads paired collection [fastq]
5. Trim Hi-C data? If `yes`, trim five bases at the beginning of each read. Use with Arima Hi-C data if the Hi-C map looks "noisy" and the reads haven't been trimmed before. 
6. Minimum Mapping Quality [int] (Default:20). Minimum mapping quality for Hi-C alignments. Set to 0 if you want no filtering.  
6. Database for busco lineage (recommended: latest)
7. Busco lineage (recommended for VGP data: vertebrata)
8. Restriction enzyme sequence (recommended for VGP data: Arima Hi-C 2.0)
9. Estimated genome size [txt] (Output from the contigging workflows 3,4, or 5). A simple text file containing the estimated genome size as an integer. E.g. `2288021`


### Outputs

1. Scaffolds in [fasta] and [gfa] format with the haplotype in the scaffold names.
2. If you selected `yes` for Hi-C trimming, the trimmed collections of Hi-C reads.
3. QC: Assembly statistics.
4. QC: Hi-C duplications statistics.
5. QC: Nx plot.
6. QC: Size plot.
7. QC: Compleasm report.
8. QC: Pretext Maps before and after scaffolding.
9. QC: Statistics on Hi-C alignements before and after scaffolding
