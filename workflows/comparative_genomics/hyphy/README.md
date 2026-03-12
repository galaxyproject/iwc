# HyPhy Workflows for Comparative Genomics

This directory contains Galaxy workflows for running HyPhy (Hypothesis Testing using Phylogenies) selection analysis pipelines on coding sequences.

## Workflows

> **Current scope**: These workflow are tuned for viral analyses. Genes containing internal stop codons or ongoing recombination may produce failures or, worse, yield misleading HyPhy estimates. Treat bacterial/eukaryotic runs with caution unless you have validated inputs.

### 1. CAPHEINE: Combined HyPhy Core and Compare (`capheine-core-and-compare.ga`)

The main workflow that orchestrates the complete HyPhy pipeline, including codon-aware preprocessing and optional branch-comparison analyses. Inspired by the [veg/capheine](https://github.com/veg/capheine) Nextflow implementation, version 1.1.0.

**Inputs:**
- **Reference CDS FASTA** (required): Multi-gene CDS reference file (e.g., from NCBI)
- **Unaligned sequences** (required): List collection of FASTA files, one per sample
- **Foreground regexp** (optional): Regular expression to match foreground sequence names for branch labeling
- **Foreground list** (optional): Dataset with cleaned sequence identifiers for foreground branches

**Behavior:**
- If neither regex nor list is provided → runs Core workflow only
- If regex is provided → derives foreground set from matches and runs Compare module
- If only list is provided → uses it directly for Compare module
- If both are provided → regex takes precedence, list is ignored

**Outputs:**

*Core outputs (always produced):*
- Codon-aware alignments (collection, FASTA)
- Gene trees (collection, Newick)
- HyPhy MEME results (collection, JSON)
- HyPhy PRIME results (collection, JSON)
- HyPhy BUSTED results (collection, JSON)
- HyPhy FEL results (collection, JSON)

*Compare outputs (when foreground info provided):*
- Labeled trees (collection, Newick)
- HyPhy CFEL results (collection, JSON)
- HyPhy RELAX results (collection, JSON)

### 2. HyPhy Core (`hyphy-core.ga`)

Subworkflow for codon-aware preprocessing and core selection analyses.

### 3. HyPhy Compare (`hyphy-compare.ga`)

Subworkflow for branch-comparison analyses (CFEL and RELAX).

### 4. HyPhy Preprocessing (`hyphy-preprocessing.ga`)

Subworkflow for sequence cleanup and codon-aware alignment.

## Test Data

The `test-data/` directory contains:
- `denv1_ref_cds.fasta`: Reference coding sequences from Dengue virus 1
- `foreground_seqs_list.tabular`: Example foreground sequence identifiers
- `unaligned_seqs/`: Directory with 39 unaligned FASTA files for testing

## Running Tests

Tests are defined in `capheine-core-and-compare-tests.yml` with four scenarios:
1. Core only (reference CDS + unaligned sequences)
2. Core + Compare with regex (no foreground list)
3. Core + Compare with foreground list (no regex)
4. Core + Compare with all inputs (regex takes precedence)

## References

- HyPhy: [https://github.com/veg/hyphy](https://github.com/veg/hyphy)
- CAPHEINE Nextflow: [https://github.com/veg/capheine](https://github.com/veg/capheine)
