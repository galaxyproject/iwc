# Vertebrate Genome Project (VGP) Assembly Workflows

## Overview

This collection provides a comprehensive set of workflows for high-quality vertebrate genome assembly following the VGP standards. These workflows enable researchers to generate chromosome-scale, phased genome assemblies using PacBio HiFi, Bionano, and Hi-C data.

## Workflow Components

### Main Assembly Workflows

1. **Quality Control & Parameter Estimation**
   * Performs k-mer analysis on input sequencing data
   * Generates coverage statistics and genome size estimates
   * Provides essential parameters for optimizing downstream assembly steps

2. **Phased Assembly**
   * Utilizes Hifiasm for generating high-quality primary and alternate assemblies
   * Produces haplotype-resolved contigs from PacBio HiFi reads

3. **Purge Duplications**
   * Removes haplotigs and overlaps from the phased assembly
   * Improves assembly accuracy by eliminating redundant sequences

4. **Bionano Optical Map Scaffolding** (optional)
   * Integrates Bionano optical mapping data
   * Increases contiguity by joining contigs into larger scaffolds

5. **Hi-C Scaffolding**
   * Uses chromatin proximity data to achieve chromosome-scale scaffolding
   * Creates the final chromosome-length assembly

### Supporting Workflows

**Custom Purging Workflows**
* Primary assembly purging with custom cutoffs
* Alternate assembly purging with custom cutoffs

**Data Export Workflows**
* Phased assembly export to AWS VGP repository
* Purged assembly export to AWS VGP repository
* Bionano scaffolding export to AWS VGP repository
* Hi-C scaffolding export to AWS VGP repository

## Detailed Documentation

For comprehensive guidance on using these workflows, including parameter selection and results interpretation, please refer to our [VGP Assembly Pipeline Tutorial](https://training.galaxyproject.org/training-material/topics/assembly/tutorials/vgp_genome_assembly/tutorial.html).