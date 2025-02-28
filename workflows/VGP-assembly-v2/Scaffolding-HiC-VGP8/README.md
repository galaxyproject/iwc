# Hi-C Scaffolding (VGP8)

## Overview

This workflow implements chromosome-scale scaffolding of genome assemblies using Hi-C (chromatin conformation capture) data following the Vertebrate Genome Project (VGP) standards. Using the YAHS software, it leverages three-dimensional chromatin interaction patterns to order and orient contigs into chromosome-level scaffolds, representing the final major scaffolding step in achieving reference-quality genome assemblies.

## Workflow Process

The Scaffolding-HiC-VGP8 workflow provides:

1. **Hi-C Data Processing**
   - Processes raw Hi-C sequencing reads with optional trimming for Arima data
   - Maps reads to draft assembly contigs
   - Filters low-quality interactions and artifacts
   - Generates contact matrices representing three-dimensional chromatin interactions
   - Accounts for restriction enzyme-specific cutting patterns

2. **Chromosome-Scale Scaffolding with YAHS**
   - Clusters contigs based on interaction frequencies
   - Infers chromosome-level groups from interaction patterns
   - Determines optimal order and orientation of contigs within chromosomes
   - Resolves scaffolding conflicts using multiple lines of evidence
   - Generates chromosome-length scaffolds with defined gap intervals

3. **Comprehensive Quality Assessment**
   - Produces Pretext Hi-C contact maps for scaffold validation (before and after)
   - Calculates scaffold continuity metrics (N50, etc.)
   - Performs BUSCO completeness assessment
   - Generates size distribution plots
   - Produces detailed assembly statistics reports

## Input Requirements

**Required Inputs:**
1. **Scaffolded assembly** [GFA format]
2. **Name of the haplotype** (identifier for the assembly)
3. **Hi-C paired reads** [FASTQ]
4. **Trim Hi-C data option** - Select 'yes' to trim 5 bases from read starts (recommended for Arima Hi-C if maps look noisy)
5. **BUSCO database** (recommended: latest)
6. **BUSCO lineage** (recommended: vertebrata)
7. **Restriction enzyme sequence** (recommended for VGP: Arima Hi-C 2.0)
8. **Estimated genome size** [text file]

## Integration with VGP Pipeline

This workflow is designated as VGP8 in the VGP assembly pipeline series and typically follows this trajectory:
- VGP1/VGP2: K-mer profiling
- VGP3/VGP4/VGP5: Genome assembly with phasing
- VGP6: Purging of duplicated haplotigs
- VGP7: Optical map scaffolding (optional)
- VGP8: Hi-C scaffolding (this workflow)
- VGP9: Final decontamination (optional)

## Output Details

The workflow produces:
1. **Scaffolds** in both FASTA and GFA formats
2. **Trimmed Hi-C reads** (if trimming was selected)
3. **Quality control outputs**:
   - Assembly statistics summary
   - Nx continuity plots
   - Scaffold size distribution plots
   - BUSCO completeness assessment report
   - Pretext Hi-C contact maps (before and after scaffolding)

## Applications

The Hi-C scaffolding workflow is essential for:
- Producing chromosome-scale genome assemblies
- Resolving the order and orientation of contigs and scaffolds
- Identifying and correcting potential misassemblies
- Studying three-dimensional genome organization
- Achieving reference-quality assemblies suitable for comprehensive genomic analysis
