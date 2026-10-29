# Changelog

## [1.1] - 2026-10-24

- Incorporate the COMEBin 1.1.0+galaxy1 upgrade from IWC PR #1435.
- Replace read interlacing/de-interlacing with native Flatten, Nested Cross Product and Apply Rules operations. Preserve the assembly × read-sample BAM matrix while reusing the original read datasets instead of writing intermediate FASTQ files.
- Replace manual CONCOCT read length with automatic estimation from both mates of all original samples.
- Make all five binners independently optional and enabled by default, with editor-compatible optional-output bridges.
- Enclose workflow tools in a native frame with Markdown documentation.
- Make Binette the first and default bin-refinement choice.
- Expose Binette minimum completeness and contamination weight while preserving the standalone defaults (40 and 2).
- Publish coverage depth matrices for inspection and regression testing.
- Document the absence of an environment selector in SemiBin co mode.
- Disable COMEBin in the CI tests, because it runs the longest of all binners and keeps the test suite close to the CI time limit. The other binners and all refinement outputs remain covered, and the workflow still enables COMEBin by default.
- Reduce the CI test fixture to two mock samples, so the cross-sample alignment matrix stays small and the test runs well within the time limit. Coverage-matrix assertions are updated to the two-sample column count.
- Replace the binner toggles with explicit `Yes`/`No` selections (default: `Yes`), converted to the boolean that gates each binner branch.
- Order the inputs as assemblies, reads, binners, refinement and Binette settings, and group the tools in frames for inputs, coverage, binning and refinement, each with its own explanation.
- Describe what each step does in its annotation instead of repeating the step label, and document every step in its own README section.

## [1.0] - 2026-09-23

- First release
