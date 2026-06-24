# Changelog

## [0.1] - 2026-04-16

### Added

- Initial release of KMIndex / Logan SRA Hit Retrieval workflow
- K-mer based sequence search against Logan unitig indexes
- Automatic SRA accession identification from search results
- Parallel download of matching SRA runs
- Separate outputs for paired-end and single-end reads
- Configurable search parameters:
  - Minimum shared k-mer proportion (default: 0.5)
  - Z-value for k-mer extension sensitivity (default: 6)
  - Maximum number of hits to download
- Comprehensive workflow documentation in README
- Test suite with sample query sequence
