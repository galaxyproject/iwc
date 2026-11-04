# Changelog

## [1.0] - 2026-10-20

### Breaking changes

- The workflow now takes original short reads and selects grouping, coverage strategy and bin-refiner internally. Existing invocations of the previous interface do not map directly onto the new inputs.

### Added

- Internal grouping selection: original samples, grouped samples, or a hybrid that uses grouped reads where available and original reads otherwise.
- Embedded subworkflows for paired short-read grouping, nanopore grouping, PacBio grouping, assembly (Metagenomic Assembly), single-coverage binning and multi-coverage binning.
- Single-coverage (own/merged reads) and multi-coverage (all samples) coverage strategies, default single.
- Shared bin-refiner selection (DAS Tool, Binette or both), default Binette.
- Coverage depth checkpoints and a grouping/coverage test matrix.

### Changed

- Incorporate the COMEBin 1.1.0+galaxy1 upgrade from IWC PR #1435 in the embedded Multi workflow.
- Replace interlacing/de-interlacing in embedded Multi with native Flatten, Nested Cross Product and Apply Rules operations, preserving all-sample coverage without writing intermediate FASTQ files.
- Carry forward the MAG-generation authorship, FAIRyMAGs learning-pathway, funding and publication documentation from PR #1370, while retaining the modular interface documentation.
- Grouping, coverage strategy and bin-refiner selection now lead the input form; the grouping-column help text is corrected.
- All five binners (including COMEBin) are independently optional and enabled by default.
- CONCOCT read length is derived automatically from both input mates using a read-count-weighted mean.
- Stage tools and embedded workflows are enclosed in native frames with Markdown explanations.
- Give each stage a distinct matching frame/Markdown color, put Binette first in the refiner selector, and clarify that original short reads drive grouping, assembly, coverage and abundance.
- Refiner and coverage outputs are reconciled without retaining skipped-branch placeholders.
- Dereplication is restricted to bins with CheckM2 quality information, so an unassessed degenerate bin cannot abort dRep and the downstream abundance and reporting steps.
- Selected sample structure is preserved when optional long reads are absent, including skipped assembler branches.
- Reduce the CI test fixture to two mock samples, so the cross-sample alignment matrix stays small and every test case runs well within the time limit. Coverage-matrix assertions are updated to the two-sample column counts.
- Reduce the workflow-level test matrix to three cases covering custom assemblies, MEGAHIT and metaSPAdes, original and hybrid read selection, both coverage strategies, nanopore long reads and both refiners, all with COMEBin disabled. Grouped-only mode is not covered by this matrix. The redundant parameter-matrix and per-binner toggle cases are removed; the individual binner controls remain covered by the standalone single- and multi-sample binning workflow tests.
- Put the reads first in the input form, followed by the assembly options, the sample grouping, the binning and refinement settings and the MAG selection thresholds.
- Rename the "Coverage strategies" frame to "Binning", because it encloses the binning step, and describe what each step does in its annotation instead of repeating the step label.
- Embed the released standalone workflows Single-sample binning 1.1, Multi-sample binning 1.1 and Metagenomic Assembly 1.2, step for step. The parent keeps its boolean binner toggles and maps them to the standalone `Yes`/`No` inputs with `map_param_value` adapters, and passes its own completeness default (75) to the binning subworkflows.
- Restructure the README into one introduction per workflow step and explain the parent role, the grouping consistency requirement, the custom-assembly correspondence, the inspectable outputs and the JGI coverage-table fields.

### Fixed

- Correct the installable Tool Shed revision pins for the unchanged CoverM and fastq_groupmerge tool versions.
- The MultiQC CheckM and CheckM2 section titles are wired to the matching inputs; they were swapped in 0.9. The CoverM section name no longer starts with a space.
- Rename the `Run COMEBin` input to `Run COMEBin?`, like the other binner toggles.
- Correct the annotation of the refiner-combining steps: an identifier present in both refiner collections keeps its first copy; no suffix is added.
- The long-read baseline's paired-read identifier is aligned with its nanopore identifier and original expected outputs; all output assertions are retained unchanged.

### Tests

- The custom-assembly and hybrid cases check coverage-table structure. The nanopore case additionally checks assembly sizes, a dereplicated MAG and row-level identifiers in the downstream tables.
- The custom-assembly case checks that a Binette bin reaches the merged refined bins, the dereplicated MAGs and the dRep cluster assignment.
- The hybrid case checks that the merged refined bins contain the same Binette bin from both coverage strategies with `_1` and `_2` suffixes, an unsuffixed bin present in only one strategy, and a suffixed bin that is selected as a dereplicated MAG and appears in the dRep cluster assignment.
- Remove the unused `metadata_mock_community.tsv` test file.

## [0.9] - 2026-10-01

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/iuc/comebin/comebin/1.0.4+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/comebin/comebin/1.1.0+galaxy1`

## [0.8] - 2026-09-23

### Fixed
- Correct the changeset revision of `coverm_genome` to an installable revision

### Changed
- Update authors and add the FAIRyMAGs consortium as author
- Add a README to the workflow

## [0.7] - 2026-08-03

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/iuc/checkm2/checkm2/1.1.0+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/checkm2/checkm2/1.1.0+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/iuc/coverm_genome/coverm_genome/0.8.0+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/coverm_genome/coverm_genome/0.8.0+galaxy1`

## [0.6] - 2026-07-20

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/iuc/collection_element_identifiers/collection_element_identifiers/0.0.2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/collection_element_identifiers/collection_element_identifiers/0.0.3`
- `toolshed.g2.bx.psu.edu/repos/nml/metaspades/metaspades/4.2.0+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/nml/metaspades/metaspades/4.3.0+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/devteam/bowtie2/bowtie2/2.5.4+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/devteam/bowtie2/bowtie2/2.5.5+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/concoct_cut_up_fasta/concoct_cut_up_fasta/1.1.0+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/concoct_cut_up_fasta/concoct_cut_up_fasta/1.1.0+galaxy3`
- `toolshed.g2.bx.psu.edu/repos/devteam/samtools_sort/samtools_sort/2.0.7` was updated to `toolshed.g2.bx.psu.edu/repos/devteam/samtools_sort/samtools_sort/2.0.8`
- `toolshed.g2.bx.psu.edu/repos/iuc/metabat2_jgi_summarize_bam_contig_depths/metabat2_jgi_summarize_bam_contig_depths/2.17+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/metabat2_jgi_summarize_bam_contig_depths/metabat2_jgi_summarize_bam_contig_depths/2.18.23+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/concoct_coverage_table/concoct_coverage_table/1.1.0+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/concoct_coverage_table/concoct_coverage_table/1.1.0+galaxy3`
- `toolshed.g2.bx.psu.edu/repos/iuc/metabat2/metabat2/2.17+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/metabat2/metabat2/2.18.23+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/concoct/concoct/1.1.0+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/concoct/concoct/1.1.0+galaxy3`
- `toolshed.g2.bx.psu.edu/repos/iuc/concoct_merge_cut_up_clustering/concoct_merge_cut_up_clustering/1.1.0+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/concoct_merge_cut_up_clustering/concoct_merge_cut_up_clustering/1.1.0+galaxy3`
- `toolshed.g2.bx.psu.edu/repos/iuc/concoct_extract_fasta_bins/concoct_extract_fasta_bins/1.1.0+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/concoct_extract_fasta_bins/concoct_extract_fasta_bins/1.1.0+galaxy3`
- `toolshed.g2.bx.psu.edu/repos/iuc/binette/binette/1.2.0+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/binette/binette/1.2.1+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_awk_tool/9.5+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_awk_tool/9.5+galaxy3`
- `toolshed.g2.bx.psu.edu/repos/iuc/drep_dereplicate/drep_dereplicate/3.6.2+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/drep_dereplicate/drep_dereplicate/3.7.1+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/coverm_genome/coverm_genome/0.7.0+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/coverm_genome/coverm_genome/0.8.0+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/checkm_lineage_wf/checkm_lineage_wf/1.2.4+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/checkm_lineage_wf/checkm_lineage_wf/1.2.5+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/multiqc/multiqc/1.27+galaxy4` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/multiqc/multiqc/1.35+galaxy2`

## [0.5] - 2026-04-26

### Added

- **metaSPAdes** now can use optional long reads as input

### Changed

- Removed non-main MAGs steps from the workflow (genome annotation, taxonomy annotation); they are now in separate workflows that can be used optionally downstream of the main workflow
- Changed COMEBin to be an optional binner

## [0.4] - 2025-10-07

### Changed

- **metaSPAdes** now supports running in single-assembly mode when individual samples are submitted. Previously, it always performed co-assembly, which is the default tool setting.
- All tools have been updated to their latest versions.

### Added

- **bakta**, **quast** (for the bins), **coverM** results are joined into one overview table each
- For **dRep** also the clustering results are generated.
- Workflow annotations.

## [0.3] - 2025-06-09

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_awk_tool/9.5+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_awk_tool/9.5+galaxy2`

## [0.2] - 2025-05-19

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/nml/metaspades/metaspades/4.1.0+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/nml/metaspades/metaspades/4.2.0+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/binette/binette/1.0.5+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/binette/binette/1.1.1+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/checkm2/checkm2/1.0.2+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/checkm2/checkm2/1.0.2+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/iuc/drep_dereplicate/drep_dereplicate/3.5.0+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/drep_dereplicate/drep_dereplicate/3.6.2+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/iuc/gtdbtk_classify_wf/gtdbtk_classify_wf/2.4.0+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/gtdbtk_classify_wf/gtdbtk_classify_wf/2.4.1+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/bakta/bakta/1.9.4+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/bakta/bakta/1.9.4+galaxy1`

## [0.1] - 2025-04-08

- First release
