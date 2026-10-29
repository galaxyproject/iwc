# Changelog

## [0.1] - 2026-10-22

### Added
- End-to-end workflow covering short-read quality control and host removal, optional long-read preprocessing and host removal, MAG generation with assembly, binning and dereplication, and optional taxonomy, genome and functional annotation of the MAGs
- Embedded copies of the component workflows so that every step and parameter stays visible
- Empty sample-matched long-read fallbacks, so the same workflow supports runs with and without long reads

### Fixed
- Preserve collection structure inside skipped long-read preprocessing and remove null placeholders before selecting sample-matched empty files
- Correct the case-sensitive output label for the short-read host-removal report
- Report the CheckM and CheckM2 bin quality tables under the matching section titles in the aggregated MultiQC report
- Pin the embedded Porechop and MEGAHIT copies to installable Tool Shed revisions
