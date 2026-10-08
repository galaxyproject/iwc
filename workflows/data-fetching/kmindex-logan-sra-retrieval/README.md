# KMIndex / Logan SRA Hit Retrieval

## Overview

Search a query sequence against a KMIndex/Logan index and rapidly download matching SRA runs into your Galaxy history.

This workflow uses k-mer–based matching for fast identification of highly similar sequences.

## Inputs

- **Query sequence** (FASTA) — nucleotide sequence to search
- **Index to query** — KMIndex/Logan database to search against
- **Max hits to download** — maximum number of SRA runs to retrieve
- **Minimum shared k-mer proportion** (0.0–1.0, default: 0.5) — threshold for match inclusion
- **Z-value** (k-mer extension factor, default: 6) — controls k-mer matching sensitivity

## Outputs

- **Accession list** (TXT) — list of downloaded SRA IDs
- **Paired-end reads** (collection) — paired FASTQ files from matching runs
- **Single-end reads** (collection) — single FASTQ files from matching runs

## Parameter Tips

**More stringent** (fewer, closer matches):
- ↑ shared k-mer proportion

**More permissive** (more, broader matches):
- ↓ shared k-mer proportion

**Z-value**:
- Higher → more specific, may miss distant matches
- Lower → more sensitive, may include weaker matches

## When to Use KMIndex / Logan

Use this workflow when you need:
- Fast searches at scale
- Exact or near-exact matches
- Minimal parameter tuning

Use the LexicMap workflow if you need:
- Approximate matching (mismatches/gaps)
- Sensitivity to divergent sequences
- BLAST-like alignment scoring

## Rule of thumb

- High similarity → use KMIndex / Logan
- Unknown or divergent sequences → use LexicMap

## Notes

- Designed for speed; less sensitive to divergent sequences than alignment-based methods
- Very low thresholds may return weak or spurious matches
- Outputs are split into paired-end and single-end collections for downstream use
