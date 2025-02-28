# Comprehensive Repeat Element Analysis Workflow

## Overview

This integrated workflow provides a complete pipeline for identifying, characterizing, and masking repetitive elements in genomic sequences. The workflow combines two powerful tools:

### RepeatModeler
A de novo repeat family identification and modeling package that:
- Identifies novel transposable element (TE) families in genomic sequences
- Uses complementary computational approaches (RECON, RepeatScout, and LtrHarvest/Ltr_retriever)
- Determines repeat element boundaries and family relationships
- Creates custom repeat libraries specific to your genome

### RepeatMasker
A repeat annotation and masking program that:
- Identifies both known and de novo repetitive elements
- Detects low-complexity DNA sequences
- Provides detailed annotation of repetitive content
- Produces masked sequences for downstream analyses like gene prediction

## Workflow Process

### Stage 1: De Novo Repeat Library Construction (RepeatModeler)

**Input:**
- Genome assembly in FASTA format

**Outputs:**
- Summary file (.tbl) with repeat family statistics
- FASTA file containing consensus sequences for identified repeat families

### Stage 2: Repeat Element Annotation and Masking (RepeatMasker)

**Input:**
- Custom repeat library from RepeatModeler output

**Outputs:**
1. **Masked FASTA file** - Genome with repeats masked for downstream analysis
2. **GFF3 annotation file** - Genomic feature annotations in standard format
3. **Repeat content summary table** - Quantitative breakdown of repeat categories
4. **Detailed statistics file** - Comprehensive repeat element statistics
5. **Mutation summary** - Analysis of repeat element divergence patterns

## Applications

This workflow is essential for:
- Pre-processing genomes before gene prediction
- Comparative genomics studies
- Understanding genome evolution through repeat element analysis
- Characterizing novel repeat families in non-model organisms
