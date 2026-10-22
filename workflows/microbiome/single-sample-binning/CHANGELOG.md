# Changelog

## [1.0] - 2026-10-20

- Replace manual CONCOCT read length with automatic estimation from both input mates.
- Make all five binners independently optional and enabled by default, with editor-compatible optional-output bridges.
- Enclose workflow tools in a native frame with Markdown documentation.
- Make Binette the first and default bin-refinement choice.
- Expose Binette minimum completeness and contamination weight while preserving the standalone defaults (40 and 2).
- Expose the supported SemiBin single-mode environment selector.
- Publish coverage depth matrices for inspection and regression testing.
- Disable COMEBin in the CI tests, because it runs the longest of all binners and keeps the test suite close to the CI time limit. The other binners and all refinement outputs remain covered, and the workflow still enables COMEBin by default.
- Replace the binner toggles with explicit `Yes`/`No` selections (default: `Yes`), converted to the boolean that gates each binner branch.
- Order the inputs as assemblies, reads, binners, SemiBin environment, refinement and Binette settings, and group the tools in frames for inputs, coverage, binning and refinement, each with its own explanation.
- Describe what each step does in its annotation instead of repeating the step label, and document every step in its own README section.
- First release
