# Changelog

## [0.2] - 2026-10-19

### Changed
- RepeatMasker takes its repeat families from a Dfam library installed through the `repeatmasker_famdb` data table. Two new required inputs select the library ("Dfam library") and the species or clade to take families for ("Repeat source species"). The RepeatMasker Conda package no longer ships a Dfam library, so the previous version could not run.

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/bgruening/repeat_masker/repeatmasker_wrapper/4.1.5+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/repeat_masker/repeatmasker_wrapper/4.2.4+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/csbl/repeatmodeler/repeatmodeler/2.0.4+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/csbl/repeatmodeler/repeatmodeler/2.0.5+galaxy0`

## [0.1] - 2023-09-21

Initial version of the RepeatMasking workflow for genomic sequencing data.
