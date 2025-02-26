# Purge Duplicate Contigs (VGP6)

## Overview

This workflow implements a critical step in the Vertebrate Genome Project (VGP) assembly pipeline that identifies and removes redundant sequences from phased genome assemblies. Using the purge_dups methodology, it detects and eliminates haplotypic duplications and overlaps to produce cleaner haplotype-resolved assemblies optimized for downstream analysis and scaffolding.

## Workflow Process

The Purge-duplicate-contigs-VGP6 workflow provides:

1. **Duplicate Sequence Detection**
   - Identifies contigs representing haplotypic duplications in both primary and alternate assemblies
   - Detects overlapping sequences within each haplotype assembly
   - Maps long reads to assemblies to calculate coverage signatures
   - Uses k-mer patterns to distinguish true duplications from collapsed repeats
   - Generates visualization of duplication patterns

2. **Purging and Assembly Refinement**
   - Removes identified duplications from both haplotype assemblies
   - Maintains the integrity of unique haplotype-specific sequences
   - Generates purged assemblies with reduced redundancy
   - Preserves phasing information while eliminating assembly artifacts
   - Produces both FASTA and GFA formats for downstream analysis

3. **Comprehensive Quality Assessment**
   - Performs BUSCO completeness assessment of both purged assemblies
   - Generates k-mer based QC with Merqury for assembly validation
   - Calculates detailed assembly statistics before and after purging
   - Produces Nx continuity plots
   - Creates size distribution visualizations

## Input Requirements

**Required Inputs:**
1. **HiFi long reads** - trimmed [FASTQ] (from contigging workflow)
2. **Primary Assembly (hap1)** [FASTA] (from contigging workflow)
3. **Alternate Assembly (hap2)** [FASTA] (from contigging workflow)
4. **K-mer database** [meryldb] (from k-mer profiling workflow)
5. **GenomeScope model parameters** [TXT] (from k-mer profiling workflow)
6. **Estimated Genome Size** [TXT]
7. **BUSCO database** (recommended: latest)
8. **BUSCO lineage** (recommended: vertebrata)
9. **Name of first haplotype** (identifier)
10. **Name of second haplotype** (identifier)

## Integration with VGP Pipeline

This workflow is designated as VGP6 in the VGP assembly pipeline series and:
- Follows initial contigging steps (VGP3, VGP4, or VGP5)
- Precedes scaffolding with Bionano (VGP7) and Hi-C data (VGP8)
- Represents a critical quality improvement step for phased VGP reference genomes
- Prepares both haplotype assemblies for efficient scaffolding

## Output Details

The workflow produces:
1. **Purged haplotype 1 assembly** in both FASTA and GFA formats
2. **Purged haplotype 2 assembly** in both FASTA and GFA formats
3. **Quality control outputs**:
   - BUSCO completeness reports for both assemblies
   - Merqury QC reports for both assemblies
   - Comprehensive assembly statistics
   - Nx continuity plots
   - Contig size distribution plots

## Applications

The purge duplicates workflow is essential for:
- Improving the quality of phased genome assemblies
- Removing artifactual duplications from the assembly process
- Enhancing the accuracy of downstream analyses
- Preparing assemblies for efficient scaffolding
- Meeting VGP standards for reference-quality genome assemblies
