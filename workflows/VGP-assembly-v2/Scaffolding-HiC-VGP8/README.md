# Scaffolding with HiC data

This workflow performs genome assembly scaffolding using HiC data with YAHS. It is designed to be run as part of the VGP analysis trajectories, but can be used on any assembly in GFA format with Hi-C data. To generate a GFA from a fasta assembly, you can use the gfastats tool in Galaxy.  

Example of VGP trajectory : 
- VGP1: Kmer profiling 
- VGP4: Genome assembly with HiC phasing
- VGP6: Purge duplicated haplotigs
- VGP8: Scaffolding with HiC

## Inputs

1. Species Name [text] Name of the species being assembled.
2. Assembly Name [text] Name of the assembly.
3. Genome assembly [gfa]
4. Haplotype being scaffolded (Will be added to scaffold names: e.g. `>scaffold_01_H1`)
5. HiC reads paired collection [fastq]
6. Trim Hi-C data? If `yes`, trim five bases at the beginning of each read. Use with Arima Hi-C data if the Hi-C map looks "noisy" and the reads haven't been trimmed before.
7. Minimum Mapping Quality [int] (Default:20). Minimum mapping quality for Hi-C alignments. Set to 0 if you want no filtering.
8. Database for Compleasm lineage (recommended: latest)
9. Compleasm lineage (recommended for VGP data: vertebrata)
10. Restriction enzyme sequence (recommended for VGP data: Arima Hi-C 2.0)
11. Estimated genome size [txt] (Output from the contigging workflows 3,4, or 5). A simple text file containing the estimated genome size as an integer. E.g. `2288021`


### Outputs

1. Scaffolds in [fasta] and [gfa] format with the haplotype in the scaffold names.
2. If you selected `yes` for Hi-C trimming, the trimmed collections of Hi-C reads.
3. QC: Assembly statistics.
4. QC: Hi-C duplications statistics on contigs and scaffolds.
5. QC: Pairtools MultiQC stats on contigs and scaffolds.
6. QC: Nx plot.
7. QC: Size plot.
8. QC: Compleasm summary and full table.
9. QC: Pretext Maps before and after scaffolding.
10. QC: Statistics on Hi-C alignements before and after scaffolding
