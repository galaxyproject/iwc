# Vertebrate Genome Project in Galaxy

## VGP pipeline

The VGP pipeline is composed of:
    
- Five main workflows

1. Quality control and parameter estimation. It provides a kmer coverage database and an estimation of parameters that will be useful in the genome assembly process.
2. Phased assembly with Hifiasm
3. Purging of duplications and overlap from the phased assembly
4. Scafolding using Bionano optical mapping (optional)
5. Scafolding using HiC data
    
- Two secondary workflows to correct the assembly purging by using custom cutoffs

1. Custom Purging of duplications and overlap from the primary assembly
2. Custom Purging of duplications and overlap from the alternate assembly

- Four export workflows to AWS VGP repository

1. Phased assembly export
2. Purged assembly export
3. Bionano scaffolding export
4. Hi-C Scafolding export

> Note: For more details about the workflows steps by steps, which parameters to use, and how to understand the results, read our
[VGP assembly pipeline tutorial](https://training.galaxyproject.org/training-material//topics/assembly/tutorials/vgp_genome_assembly/tutorial.html)