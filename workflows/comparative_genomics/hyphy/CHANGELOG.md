# Changelog

## [0.2] - 2026-07-02

### Changed
- Replaced single `reference cds` input with `reference GTF` + `reference Fasta` inputs across all HyPhy workflows
  - Enables automated CDS extraction from annotated reference genomes
  - Aligns workflow parameters with BRC Analytics `ASSEMBLY_FASTA_URL` and `GENE_MODEL_URL` variables
- Updated CAPHEINE, HyPhy Core, HyPhy Compare, and HyPhy Preprocessing to version 0.2
- Replaced `denv1_ref_cds.fasta` with `denv1_genome.fasta` (NC_001477.1 full genome) as the reference FASTA test input
- Added `denv1_ref.gtf` with coordinates for two DENV1 CDS regions (capsid protein C and prM)
- Updated test parameter files to use genome FASTA + GTF inputs

## [0.1] - 2026-02-26

### Added
- Initial release of HyPhy workflows for comparative genomics
- CAPHEINE: Combined HyPhy Core and Compare workflow
  - Orchestrates complete HyPhy pipeline with codon-aware preprocessing
  - Optional branch-comparison analyses (CFEL and RELAX)
  - Supports foreground/background branch labeling via regex or explicit list
- HyPhy Core subworkflow
  - Codon-aware preprocessing and alignment
  - Core selection analyses (MEME, PRIME, BUSTED, FEL)
- HyPhy Compare subworkflow
  - Branch-comparison analyses (CFEL and RELAX)
- HyPhy Preprocessing subworkflow
  - Sequence cleanup and codon-aware alignment
- Comprehensive test suite with 4 scenarios for CAPHEINE workflow
- Test data including DENV1 reference CDS and 39 unaligned sequences
