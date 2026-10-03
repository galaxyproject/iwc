# Viral detection from bulk metagenomes

## Overview

This workflow identifies viral contigs from metagenomic assemblies using **geNomad** and performs downstream analyses including **taxonomy**, **functional annotation**, **binning**, **host prediction**, and **coverage estimation**.

---

## Inputs

- **Assembled contigs** (FASTA, collection)
- **Trimmed paired-end reads** (list:paired)

### Requirements

- Reads must be quality-controlled (trimmed, adapters removed)
- Host contamination should be removed

---

## Workflow steps

### 1. Viral contig prediction
Viral sequences are identified from assembled contigs using **geNomad**.

### 2. Provirus detection and refinement
**CheckV** is used to identify proviruses. Extracted proviruses are re-analysed with **geNomad**.

### 3. Merging viral predictions
Viral contigs from both geNomad runs are combined.

### 4. Clustering and dereplication
Redundant sequences are removed using **MMseqs2** clustering.

### 5. Quality assessment and filtering
**CheckV** is used to assess sequence quality. Only sequences classified as:

- Complete  
- High-quality  
- Medium-quality  

are retained for downstream analysis.

### 6. Host prediction
Viral contigs are analysed using **iPHoP**.

### 7. Functional annotation
Viral genomes are annotated using **Pharokka**.

### 8. Coverage estimation
Reads are mapped using **Bowtie2** and coverage is calculated with **CoverM**.

### 9. Viral genome binning (vMAGs)
Viral contigs and coverage profiles are used by **vRhyme** to recover viral genomes.

---

## Outputs

- Viral contigs (geNomad)
- Taxonomy annotations
- Gene annotations
- Nonredundant viral sequences
- CheckV quality reports
- Filtered viral contigs
- Host predictions (iPHoP)
- Functional annotations (Pharokka)
- Coverage table (CoverM)
- vMAG bins (vRhyme)

---

## Notes

- Only **medium- and high-quality sequences** are used for biological interpretation

---

## License

MIT License