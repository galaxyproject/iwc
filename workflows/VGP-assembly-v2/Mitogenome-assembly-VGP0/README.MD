# Mitogenome Assembly (VGP0)

## Overview

This workflow implements the assembly and annotation of complete mitochondrial genomes from PacBio HiFi whole-genome sequencing data, following the Vertebrate Genome Project (VGP) standards. Mitochondrial genomes provide valuable evolutionary and taxonomic information and serve as important quality control metrics for genome sequencing projects, offering insight into sample quality and contamination.

## Workflow Process

The Mitogenome-Assembly-VGP0 workflow provides:

1. **Mitochondrial Read Identification and Extraction**
   - Processes whole-genome PacBio HiFi sequencing data
   - Identifies reads of mitochondrial origin based on sequence similarity
   - Extracts mitochondrial reads from the larger dataset
   - Enriches for circular mitochondrial genome sequences
   - Optimizes coverage for mitogenome assembly

2. **De Novo Assembly and Refinement**
   - Performs specialized assembly optimized for circular mitochondrial genomes
   - Resolves the circular structure of the mitogenome
   - Identifies and resolves repetitive regions
   - Orients the mitogenome according to reference standards
   - Generates a complete, circularized mitochondrial genome sequence

3. **Annotation and Analysis**
   - Identifies mitochondrial genes (protein-coding, rRNA, tRNA)
   - Annotates gene features following standard nomenclature
   - Maps gene positions and orientations
   - Generates comprehensive coverage analysis
   - Produces visual representations of the mitogenome structure and annotation

## Input Requirements

**Required Inputs:**
1. **HiFi long reads** [FASTQ] - Whole-genome sequencing data containing mitochondrial reads
2. **Latin name of a related species** - Used to identify appropriate reference mitogenomes
3. **Email address** - Required for NCBI database query authentication

## Integration with VGP Pipeline

This workflow is designated as VGP0 in the VGP assembly pipeline series and:
- Can be run independently of other VGP workflows
- Serves as a quality control metric for the larger genome assembly
- Provides valuable evolutionary and taxonomic information
- Complements nuclear genome assembly by capturing this essential organellar genome
- Helps identify potential sample issues (contamination, heteroplasmy)

## Output Details

The workflow produces:
1. **Assembly Statistics** - Comprehensive metrics about the assembled mitogenome
2. **Visualization Outputs**:
   - Mitogenome coverage plots showing sequencing depth across the genome
   - Annotated mitogenome maps displaying gene organization
3. **Annotated Sequence Files**:
   - GenBank format file with complete annotation
   - FASTA format file of the assembled mitogenome sequence

## Applications

The mitogenome assembly workflow is valuable for:
- Evolutionary studies and phylogenetic analysis
- Species identification and barcoding
- Assessing sample quality and potential contamination
- Comparative mitogenomics across related species
- Quality control for larger genome sequencing projects
- Providing a complete organellar genome to complement nuclear genome assembly