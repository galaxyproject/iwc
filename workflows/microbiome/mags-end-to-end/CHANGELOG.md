# Changelog

## [0.1] - 2026-10-22

### Added
- Synchronize the embedded MAG-generation workflow with the version merged in IWC PR #1454 (MaxBin2 2.2.7+galaxy7 with per-sample abundance files, SemiBin 2.5.0+galaxy0, metaSPAdes 4.3.0+galaxy3 run per sample or group, Metagenomic Assembly 1.3), and reconnect the renamed `Run COMEBin?` input.
- Synchronize short-read QC, short-read host removal and Nanopore preprocessing with their merged releases, and reconnect the redesigned MAG-generation dependency by input label.
- Test one light case (custom assemblies, MetaBAT2 + Binette, dereplication, genome annotation with Bakta disabled) with run-stable assertions only, as the dRep representative between near-identical samples varies between runs.
- Update the embedded MAG Genome Annotation Parallel workflow to merged release 0.7, with ToolDistillator disabled internally and no exposed control.
- Document the subworkflow dependencies and upstream-first update order.
- End-to-end workflow covering short-read quality control and host removal, optional long-read preprocessing and host removal, MAG generation with assembly, binning and dereplication, and optional taxonomy, genome and functional annotation of the MAGs
- Embedded copies of the component workflows so that every step and parameter stays visible
- Empty sample-matched long-read fallbacks, so the same workflow supports runs with and without long reads

- Preserve collection structure inside skipped long-read preprocessing and remove null placeholders before selecting sample-matched empty files
- Correct the case-sensitive output label for the short-read host-removal report
- Report the CheckM and CheckM2 bin quality tables under the matching section titles in the aggregated MultiQC report
- Pin the embedded Porechop and MEGAHIT copies to installable Tool Shed revisions
- Pin the embedded Porechop and Column join copies in Nanopore Preprocessing to installable Tool Shed revisions
