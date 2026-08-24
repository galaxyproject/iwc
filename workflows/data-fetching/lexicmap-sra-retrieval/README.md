# LexicMap SRA Hit Retrieval

## Overview

Search a query sequence against a LexicMap index and automatically download matching SRA runs into your Galaxy history.

This workflow supports BLAST-like matching with configurable thresholds for identity, alignment length, and significance.

## Inputs

**Required**
- **Query sequence** (FASTA) — nucleotide sequence to search
- **Index to query** — LexicMap database to search against
- **Max hits to download** — maximum number of SRA runs to retrieve
- **Minimum percent identity** (%, default: 70) — minimum sequence identity threshold
- **Minimum alignment length** (bp, default: 50) — minimum alignment length threshold
- **Maximum E-value** (default: 10) — maximum significance threshold

**Optional**
- **Minimum query coverage per alignment** (%) — minimum fraction of query covered per hit
- **Minimum total query coverage per genome** (%) — minimum total coverage across all hits from same genome

## Outputs

- **Accession list** (TXT) — list of downloaded SRA IDs
- **Paired-end reads** (collection) — paired FASTQ files from matching runs
- **Single-end reads** (collection) — single FASTQ files from matching runs

## Parameter Tips

**More stringent** (fewer, higher-confidence hits):
- ↑ identity
- ↑ alignment length
- ↓ E-value
- ↑ coverage thresholds

**More permissive** (more, broader hits):
- ↓ identity
- ↓ alignment length
- ↑ E-value
- ↓/omit coverage thresholds

## When to Use LexicMap

Use this workflow when you need:
- Approximate matching (not exact sequence identity)
- Sensitivity to divergent sequences
- Control over alignment thresholds

Use the KMIndex/Logan workflow if you want:
- Fast, exact or near-exact matches
- High-throughput searches with minimal tuning

## Rule of thumb

- High similarity → use KMIndex / Logan
- Unknown or divergent sequences → use LexicMap

## Notes

- Strict filters may return fewer than the requested number of hits
- Coverage thresholds help avoid short/fragmentary matches
- Outputs are split into paired-end and single-end collections for downstream use
