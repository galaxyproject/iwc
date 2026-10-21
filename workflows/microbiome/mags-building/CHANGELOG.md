# Changelog

## [1.0] - 2026-10-20

### Breaking changes

- The workflow now takes original short reads and selects grouping, coverage strategy and bin-refiner internally. Existing invocations of the previous interface do not map directly onto the new inputs.

### Added

- Internal grouping selection: original samples, grouped samples, or a hybrid that uses grouped reads where available and original reads otherwise.
- Embedded subworkflows for paired short-read grouping, nanopore grouping, PacBio grouping, assembly and assembly selection, single-coverage binning and multi-coverage binning.
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
- Reduce the workflow-level test matrix to four cases covering both assemblers (MEGAHIT, metaSPAdes), grouped, original and hybrid read selection, both coverage strategies, nanopore long reads and both refiners, all with COMEBin disabled. The redundant parameter-matrix and per-binner toggle cases are removed; the individual binner controls remain covered by the standalone single- and multi-sample binning workflow tests.

### Fixed

- Correct the installable Tool Shed revision pins for the unchanged CoverM and fastq_groupmerge tool versions.
- The long-read baseline's paired-read identifier is aligned with its nanopore identifier and original expected outputs; all output assertions are retained unchanged.

### Tests

- The short-read baseline's assembly-size, dereplicated-bin-size and merged-QUAST
  expectations are re-baselined to the redesigned workflow's verified outputs.
  The previous values described the pre-1.0 monolithic pipeline and could not hold
  after the intentional interface and pipeline change.

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
