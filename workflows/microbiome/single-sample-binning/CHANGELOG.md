# Changelog

## [1.2] - 2026-11-13

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/iuc/seqkit_stats/seqkit_stats/2.8.1+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/seqkit_stats/seqkit_stats/2.14.0+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_cat/0.1.0` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_cat/9.11+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/semibin/semibin/2.1.0+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/semibin/semibin/2.5.0+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/mbernt/maxbin2/maxbin2/2.2.7+galaxy6` was updated to `toolshed.g2.bx.psu.edu/repos/mbernt/maxbin2/maxbin2/2.2.7+galaxy7`

## [1.1] - 2026-10-24

- Replace manual CONCOCT read length with automatic estimation from both input mates.
- Make all five binners independently optional and enabled by default, with editor-compatible optional-output bridges.
- Enclose workflow tools in a native frame with Markdown documentation.
- Make Binette the first and default bin-refinement choice.
- Expose Binette minimum completeness and contamination weight while preserving the standalone defaults (40 and 2).
- Expose the supported SemiBin single-mode environment selector.
- Expose coverage depth matrices for inspection and regression testing.
- Disable COMEBin in the CI tests, because it runs the longest of all binners and keeps the test suite close to the CI time limit. The other binners and all refinement outputs remain covered, and the workflow still enables COMEBin by default.
- Replace the binner toggles with explicit `Yes`/`No` selections (default: `Yes`), converted to the boolean that gates each binner branch.
- Order the inputs as assemblies, reads, binners, SemiBin environment, refinement and Binette settings, and group the tools in frames for inputs, coverage, binning and refinement, each with its own explanation.
- Describe what each step does in its annotation instead of repeating the step label, and document every step in its own README section.

## [1.0] - 2026-09-23

- First release
