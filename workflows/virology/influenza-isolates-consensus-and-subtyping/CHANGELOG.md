# Changelog

## [0.2] - 2025-05-02

### Changed

Aaron Kolbecher, in the course of his Master thesis, discovered several
edge-cases in which the previous version of the workflow would fail. The
corresponding fixes listed below make the workflow much more robust and ready
for use in high-throughput scenarios.

- Added processing logic for handling diverse VAPOR failures.

  Note: As a limitation of the new logic elements in the "References per segment"
  collection can no longer contain colons (`:`) in their identifiers.

- Improved subtyping report to handle cases of undetermined HA and/or NA subtypes.

  The subtyping report will now contain H? and/or N? for unresolved subtypes.

- Added logic for skipping multiple-sequence alignment of a genome segment if a
  consensus sequence for that segment could be generated for only a single
  sample (instead of causing a MAFFT error).

- Added logic for skipping phylogenetic analysis with IQ-Tree for segments for
  which fewer than three samples yielded a consensus sequence (instead of
  causing an IQ-Tree error).

  Note: IQ-Tree can still fail if a consensus sequence consists of Ns only.

- No longer assume eight genome segments, but autodetect the number of segments
  from the reference collection.

  This makes it simpler to adapt the workflow to influenza species with seven
  instead of eight segments, and makes it usable with partial reference
  collections, for example if the purpose is to generate consensus sequences
  only for certain segments of interest.

- Added Aaron as a co-author of the workflow.

- Changed license to AGPL-3.0-or-later.

### Updated tools

- `toolshed.g2.bx.psu.edu/repos/iuc/fastp/fastp/0.23.4+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/fastp/fastp/0.24.1+galaxy0`.
- `toolshed.g2.bx.psu.edu/repos/devteam/bwa/bwa_mem/0.7.18` was updated to `toolshed.g2.bx.psu.edu/repos/devteam/bwa/bwa_mem/0.7.19`.
- `toolshed.g2.bx.psu.edu/repos/iuc/samtools_view/samtools_view/1.15.1+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/samtools_view/samtools_view/1.20+galaxy3`.
- `toolshed.g2.bx.psu.edu/repos/iuc/qualimap_bamqc/qualimap_bamqc/2.2.2d+galaxy3` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/qualimap_bamqc/qualimap_bamqc/2.3+galaxy0`.
- `toolshed.g2.bx.psu.edu/repos/iuc/ivar_consensus/ivar_consensus/1.4.3+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/ivar_consensus/ivar_consensus/1.4.4+galaxy0`.
- `toolshed.g2.bx.psu.edu/repos/rnateam/mafft/rbc_mafft/7.520+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/rnateam/mafft/rbc_mafft/7.526+galaxy1`.
- `toolshed.g2.bx.psu.edu/repos/iuc/snipit/snipit/1.2+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/snipit/snipit/1.6+galaxy0`.
- `toolshed.g2.bx.psu.edu/repos/iuc/iqtree/iqtree/2.3.3+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/iqtree/iqtree/2.4.0+galaxy0`.
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_find_and_replace/9.3+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_find_and_replace/9.5+galaxy0`.

## [0.1] - 2025-01-09

First release.
