# Changelog

## [0.1] - 2026-04-18

### Added

- Initial release of LexicMap SRA Hit Retrieval workflow
- BLAST-like sequence search against LexicMap indexes
- Automatic SRA accession identification from search results
- Parallel download of matching SRA runs
- Separate outputs for paired-end and single-end reads
- Configurable search parameters:
  - Minimum percent identity (default: 70%)
  - Minimum alignment length (default: 50 bp)
  - Maximum E-value (default: 10)
  - Optional query and genome coverage thresholds
  - Maximum number of hits to download
- Comprehensive workflow documentation in README
- Test suite with sample query sequence
