# Purge Duplicates - One Haplotype (VGP6b)

## Overview

This specialized workflow implements the selective purging of duplicate contigs from a single haplotype assembly in the Vertebrate Genome Project (VGP) pipeline. It applies purge_dups methodology to remove redundancy from one assembly while leaving a second assembly unmodified, providing flexibility for cases where only one haplotype requires purging.

## Workflow Process

The Purging-duplicates-one-haplotype-VGP6b workflow provides:

1. **Targeted Duplication Detection**
   - Focuses purging operations on a single specified haplotype assembly
   - Identifies haplotypic duplications and overlapping contigs
   - Maps HiFi reads to assess coverage patterns indicative of duplications
   - Uses k-mer statistics to distinguish true duplications from other genomic features
   - Generates visual representations of detected duplications

2. **Selective Purging and Refinement**
   - Removes identified duplications from the targeted haplotype only
   - Leaves the second haplotype assembly unchanged
   - Maintains all original sequences in the unmodified assembly
   - Generates a purged assembly with reduced redundancy
   - Produces both FASTA and GFA formats for the purged assembly

3. **Comparative Quality Assessment**
   - Evaluates both purged and unmodified assemblies with consistent metrics
   - Performs BUSCO completeness assessment on both assemblies
   - Conducts k-mer based QC with Merqury for validation
   - Calculates comprehensive assembly statistics
   - Generates continuity plots and size distributions for both assemblies

## Input Requirements

**Required Inputs:**
1. **GenomeScope model parameters** [TXT] (from k-mer profiling workflow)
2. **HiFi long reads** - trimmed [FASTQ] (from contigging workflow)
3. **Assembly to purge** (e.g., hap1) [FASTA] (from contigging workflow)
4. **K-mer database** [meryldb] (from k-mer profiling workflow)
5. **Assembly to leave unmodified** (for comparative statistics) [FASTA]
6. **Estimated Genome Size** [TXT]
7. **BUSCO database** (recommended: latest)
8. **BUSCO lineage** (recommended: vertebrata)
9. **Name of unaltered assembly** (identifier)
10. **Name of purged assembly** (identifier)

## Integration with VGP Pipeline

This workflow is designated as VGP6b in the VGP assembly pipeline series and:
- Provides an alternative to the standard VGP6 workflow when selective purging is needed
- Follows initial contigging steps (VGP3, VGP4, or VGP5)
- Precedes scaffolding with Bionano (VGP7) and Hi-C data (VGP8)
- Offers flexibility for processing assemblies with different characteristics

## Output Details

The workflow produces:
1. **Purged assembly** (the targeted haplotype) in both FASTA and GFA formats
2. **Unmodified assembly** (unchanged reference) in original format
3. **Quality control outputs for both assemblies**:
   - BUSCO completeness reports
   - Merqury QC reports
   - Comprehensive assembly statistics
   - Nx continuity plots
   - Contig size distribution plots

## Applications

This selective purging workflow is valuable for:
- Cases where only one haplotype assembly requires duplicate removal
- Scenarios with asymmetric assembly quality between haplotypes
- Experimental comparison of purged vs. unpurged assembly characteristics
- Targeted improvement of a specific assembly while preserving another
- Meeting VGP standards for reference-quality assemblies with flexibility for special cases