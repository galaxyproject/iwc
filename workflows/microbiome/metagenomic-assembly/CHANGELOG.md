# Changelog

## [1.3] - 2026-11-11

### Changed
- Update metaSPAdes to 4.3.0+galaxy3 and run it in its new individual mode, which assembles each short-read group in its own job. The steps that nested the reads into per-group lists and filled groups without long reads are removed.
- Long reads are now all or nothing per long-read type: leave the collection empty, or provide one file for every short-read group, with the same identifiers in the same order. Long reads for only a subset of groups are no longer supported, and long reads that do not match the short-read groups stop the workflow even when MEGAHIT or Custom Assembly is selected.

## [1.2] - 2026-10-28

### Fixed
- Fix the MEGAHIT tool pin so the workflow installs from the Tool Shed.

## [1.1] - 2026-10-19

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/iuc/quast/quast/5.3.0+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/quast/quast/5.3.0+galaxy2`

## [1.0] - 2026-09-29

- First release
