# Vertebrate Genome Project in Galaxy

Assembly and analysis workflows developed within the Vertebrates Genome Project framework. These 
pipelines incorporate specialized methods for high-quality genome assembly, haplotype phasing, and 
chromosome-scale scaffolding to generate reference-quality vertebrate genome sequences

## VGP pipeline assembly trajectories

The VGP pipeline comprises ten workflows depending on the data available for the genome assembly.

Trajectories for contiging:

- Pacbio HiFi: Solo Assembly
- Pacbio HiFi + parental Illumina: Trio Assembly
- Pacbio HiFi + HiC Data: Assembly with HiC phasing

Scaffolding can be performed using Bionano optical maps and/or Hi-C data.

## VGP pipeline workflows

- Quality control and parameter estimation for Solo assembly. It provides a kmer coverage database and an estimation of parameters that will be useful in the genome assembly process.
- Quality control and parameter estimation for Trio assembly.
- Solo assembly with Hifiasm
- Assembly with Hi-C phasing
- Trio Assembly
- Purging of duplications and overlap from the phased assembly
- Scafolding using Bionano optical mapping (optional)
- Scafolding using HiC data
- Decontamination
- Mitogenome assembly

> Note: For more details about the workflows steps by steps, which parameters to use, and how to understand the results, read our VGP assembly pipeline tutorial
