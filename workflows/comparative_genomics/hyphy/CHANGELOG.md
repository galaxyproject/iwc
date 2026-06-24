# Changelog

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
