A comprehensive suite of genomic workflows developed for generating reference-quality vertebrate genome sequences with PacBio HiFi sequencing data. While optimised for vertebrate data, they are suitable for any diploid organism, but some parameter adjustments may be necessary. The framework features specialized methods for high-quality genome assembly, haplotype phasing, and chromosome-scale scaffolding. The VGP pipeline offers flexible assembly trajectories based on available data types (see below) with optional scaffolding using Bionano optical maps and/or Hi-C data.
The complete workflows encompass quality control, parameter estimation, contig assembly, purging of duplications, scaffolding, decontamination, and mitogenome assembly—all optimized within the Galaxy workflow management system. A detailed tutorial is available for guidance on workflow parameters and result interpretation.


## Assembly trajectories


- **Data** : PacBio Hifi 
    - **Recommended trajectory** : VGP1 kmer profiling + VGP3 contigging + VGP6 purging (if VGP3 QC shows duplications)
- **Data** : PacBio Hifi + Hi-C (Most common)
    - **Recommended trajectory** : VGP1 kmer profiling + VGP4 contigging with Hi-C phasing + VGP6(b) purging (if VGP4 QC shows duplications)  + VGP8 Hi-C scaffolding on each haplotype
- **Data** : PacBio Hifi + Hi-C + Bionano 
    - **Recommended trajectory** : VGP1 kmer profiling + VGP3 contigging + VGP6(b) purging (if VGP4 QC shows duplications) + VGP7 Bionano scaffolding + VGP8 Hi-C scaffolding on each haplotype
- **Data** : PacBio Hifi + Parental Illumina + Hi-C (Highest Phasing Quality)
    - **Recommended trajectory** : VGP2 Trio kmer profiling + VGP5 Trio contigging + VGP6(b) purging (if VGP5 QC shows duplications) + VGP8 Hi-C scaffolding on each haplotype
 
For all trajectories : 
- VGP0: Assembly of the mitochondrial genome from PacBio HiFi data. Run at any time.
- VGP9: Decontamination of genome assembly after scaffolding. *Warning*: May not work on genomes where the scaffolds are unusually large. We are working on fixing this.
- PretextMap Generation: Process data for manual curation

## Training Material

- [Using the VGP workflows to assemble a vertebrate genome with HiFi and Hi-C data](https://training.galaxyproject.org/training-material/topics/assembly/tutorials/vgp_workflow_training/tutorial.html)
- [Vertebrate genome assembly using HiFi, Bionano and Hi-C data - Step by Step](https://training.galaxyproject.org/training-material/topics/assembly/tutorials/vgp_genome_assembly/tutorial.html)

## Cite us 

Larivière, D., Abueg, L., Brajuka, N., Gallardo-Alba, C., Grüning, B., Ko, B. J., ... & Formenti, G. (2024). Scalable, accessible and reproducible reference genome assembly and evaluation in Galaxy. *Nature biotechnology*, 42(3), 367-370.
