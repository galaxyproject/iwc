# Assembly with HiFi and Hi-C Phasing (VGP4)

## Overview

This workflow implements the generation of a haplotype-resolved genome assembly using PacBio HiFi long reads with Hi-C data for phasing, following the Vertebrate Genome Project (VGP) standards. The approach leverages chromosome conformation capture data from the same individual to separate maternal and paternal haplotypes, producing a diploid representation of the genome without parental sequencing.

## Workflow Process

The Assembly-Hifi-HiC-phasing-VGP4 workflow provides:

1. **Initial Processing and Assembly**
   - Processes high-accuracy PacBio HiFi long reads
   - Performs quality filtering and adapter trimming
   - Assembles contigs with error correction and consensus generation
   - Utilizes Hi-C proximity information for haplotype discrimination
   - Generates initial assembly graph with phase information

2. **Haplotype Phasing and Separation**
   - Processes Hi-C proximity data to identify phase blocks
   - Separates contigs into maternal and paternal haplotypes
   - Resolves phase switches and ambiguities
   - Generates independent assemblies for each haplotype
   - Optimizes assembly structure based on linked reads information

3. **Comprehensive Quality Assessment**
   - Performs BUSCO completeness assessment of both haplotype assemblies
   - Conducts k-mer based QC with Merqury for validation
   - Calculates detailed assembly statistics for both haplotypes
   - Generates continuity (Nx) plots for assembly evaluation
   - Produces size distribution visualizations

## Input Requirements

**Required Inputs:**
1. **HiFi long reads** [FASTQ]
2. **Hi-C forward reads collection** [FASTQ]
3. **Hi-C reverse reads collection** [FASTQ]
4. **K-mer database** [meryldb] (from k-mer profiling workflow)
5. **GenomeScope model parameters** [TXT] (from k-mer profiling workflow)
6. **Name of first assembly** (haplotype identifier)
7. **Name of second assembly** (haplotype identifier)

## Integration with VGP Pipeline

This workflow is designated as VGP4 in the VGP assembly pipeline series and:
- Follows k-mer profiling workflows (VGP1/VGP2)
- Represents a complete contigging solution with integrated phasing
- Can be followed by purge duplicates workflows (VGP6/VGP6b)
- Precedes scaffolding with Bionano (VGP7) and additional Hi-C data (VGP8)
- Provides fully phased assemblies without requiring parental sequencing

## Output Details

The workflow produces:
1. **Haplotype 1 assembly** in both FASTA and GFA formats
2. **Haplotype 2 assembly** in both FASTA and GFA formats
3. **Processed Hi-C data**:
   - Trimmed Hi-C forward reads collection
   - Trimmed Hi-C reverse reads collection
4. **Quality control outputs**:
   - BUSCO completeness reports for both assemblies
   - Merqury QC reports for both assemblies
   - Comprehensive assembly statistics
   - Nx continuity plots
   - Contig size distribution plots

## Applications

This Hi-C phased assembly workflow is valuable for:
- Generating haplotype-resolved assemblies without parental sequencing
- Studying allele-specific expression and regulation
- Investigating structural variation between haplotypes
- Characterizing complex genomic regions that differ between haplotypes
- Meeting VGP standards for reference-quality phased genome assemblies
