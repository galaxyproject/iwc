# Assembly Polishing with Long Reads

## Overview

This workflow implements an iterative assembly polishing strategy using long-read sequencing data to improve the accuracy of genome assemblies. By leveraging the same long reads used for initial assembly, this process corrects base-level errors, improves consensus accuracy, and resolves ambiguities to produce a higher-quality final assembly.

## Workflow Process

The Assembly-Polishing-with-Long-Reads workflow provides:

1. **Initial Read Mapping**
   - Maps long sequencing reads back to the draft assembly using minimap2
   - Optimized for different long-read technologies (PacBio, ONT)
   - Generates precise alignment files for polishing
   - Accounts for technology-specific error profiles

2. **Iterative Polishing with Racon**
   - Implements a four-round polishing strategy for progressive improvement
   - Uses Racon consensus tool designed specifically for long-read data
   - Corrects systematic errors in draft assemblies
   - Improves per-base accuracy through multiple refinement cycles
   - Corrects homopolymer errors common in long-read assemblies

3. **Multi-iteration Refinement**
   - First iteration: Initial draft assembly → Polished assembly 1
   - Second iteration: Polished assembly 1 → Polished assembly 2
   - Third iteration: Polished assembly 2 → Polished assembly 3
   - Fourth iteration: Polished assembly 3 → Final polished assembly
   - Each iteration builds upon previous improvements for maximum accuracy

## Input Requirements

**Sequencing Reads**
- Long-read sequencing data in one of these formats:
  - FASTQ (.fastq)
  - Compressed FASTQ (.fastq.gz)
  - Galaxy-specific FASTQ formats (.fastqsanger.gz or .fastqsanger)
- Data from PacBio or Oxford Nanopore sequencing platforms

**Draft Assembly**
- Initial genome assembly in FASTA format
- Typically generated from the same long-read dataset

**Technology-Specific Settings**
- For "minimap settings for long reads" parameter:
  - PacBio CLR reads: use `map-pb`
  - PacBio HiFi/CCS reads: use `map-hifi`
  - Oxford Nanopore reads: use `map-ont`

## Applications

This polishing workflow is essential for:
- Improving draft assemblies prior to annotation
- Correcting sequencing errors in long-read assemblies
- Enhancing consensus accuracy for reference genome projects
- Preparing assemblies for submission to public databases
- Resolving ambiguities in repetitive regions
- Achieving reference-quality genome assemblies

