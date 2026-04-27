# Changelog

## [0.2] - 2026-04-27

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/iuc/iqtree/iqtree/2.4.0+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/iqtree/iqtree/2.4.0+galaxy2`

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
