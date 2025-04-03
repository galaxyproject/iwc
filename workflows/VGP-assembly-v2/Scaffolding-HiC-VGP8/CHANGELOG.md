# Changelog

## [1.4] - 2025-04-03

### Changes 
- Use the option `-5` in bwa-mem2 recommended for Hi-C data
- Remove the `-a` option in bwa-mem2 
- Output gff files from Busco

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/iuc/bwa_mem2/bwa_mem2/2.2.1+galaxy3` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/bwa_mem2/bwa_mem2/2.2.1+galaxy4`

## [1.3] - 2025-03-27

### Changes

- `toolshed.g2.bx.psu.edu/repos/devteam/picard/picard_MergeSamFiles/3.1.1.0` was replaced by `toolshed.g2.bx.psu.edu/repos/iuc/samtools_merge/samtools_merge/1.20+galaxy2` for efficiency
- `toolshed.g2.bx.psu.edu/repos/iuc/bwa_mem2/bwa_mem2/2.2.1+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/bwa_mem2/bwa_mem2/2.2.1+galaxy3`

## [1.2] - 2025-03-17

### Changes

- Remove the unnecessary sorting of alignments by names that was slowing down the workflow.


### Automatic update
- `toolshed.g2.bx.psu.edu/repos/bgruening/gfastats/gfastats/1.3.9+galaxy3` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/gfastats/gfastats/1.3.10+galaxy0`

## [1.1] - 2025-03-10

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/bgruening/gfastats/gfastats/1.3.9+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/gfastats/gfastats/1.3.9+galaxy3`
- `toolshed.g2.bx.psu.edu/repos/lparsons/cutadapt/cutadapt/4.9+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/lparsons/cutadapt/cutadapt/5.0+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_find_and_replace/9.3+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_find_and_replace/9.5+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_awk_tool/9.3+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_awk_tool/9.5+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_sort_header_tool/9.3+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_sort_header_tool/9.5+galaxy0`

## [1.0] - 2025-02-13

### Changes

 - Remove the tool `filter and merge` and replace it by the use of the -SP option in bwa-mem to skip mate rescue and pairing. 
 - Hi-C data are now input as a paired collection
 - Generate lighter `gfa` file without sequences
 
### Updates 

- `toolshed.g2.bx.psu.edu/repos/bgruening/gfastats/gfastats/1.3.9+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/gfastats/gfastats/1.3.9+galaxy2`


## [0.3] - 2025-01-30

### Changes

- Hi-C data are now input as collections
- Add optional trimming of Hi-C data
- Set Metaeuk as Busco gene predictor

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/bgruening/gfastats/gfastats/1.3.6+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/gfastats/gfastats/1.3.9+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/busco/busco/5.5.0+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/busco/busco/5.8.0+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/devteam/column_maker/Add_a_column1/2.0` was updated to `toolshed.g2.bx.psu.edu/repos/devteam/column_maker/Add_a_column1/2.1`
- `toolshed.g2.bx.psu.edu/repos/iuc/pretext_snapshot/pretext_snapshot/0.0.3+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/pretext_snapshot/pretext_snapshot/0.0.4+galaxy0`


## [0.2.8] - 2024-09-12

- Add suffix to the scaffold names corresponding to the haplotype being assembled

## [0.2.7] - 2024-08-13

- Expose Busco lineage database parameter

## [0.2.6] - 2024-08-05

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/iuc/yahs/yahs/1.2a.2+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/yahs/yahs/1.2a.2+galaxy2`

## [0.2.5] - 2024-07-31

- Addition of Workflow report

## [0.2.4] - 2024-05-20

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/iuc/bedtools/bedtools_bamtobed/2.30.0+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/bedtools/bedtools_bamtobed/2.31.1+galaxy0`

## [0.2.3] - 2024-04-01

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_awk_tool/9.3+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_awk_tool/9.3+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_sort_header_tool/9.3+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_sort_header_tool/9.3+galaxy1`

## [0.2.2] - 2024-02-05

### Manual update

- remove tag filtering
- set "Show grid" of Pretext Snapshot to "yes"

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/iuc/pretext_map/pretext_map/0.1.9+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/pretext_map/pretext_map/0.1.9+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/iuc/pretext_snapshot/pretext_snapshot/0.0.3+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/pretext_snapshot/pretext_snapshot/0.0.3+galaxy2`
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_awk_tool/1.1.2` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_awk_tool/9.3+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_sort_header_tool/1.1.1` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_sort_header_tool/9.3+galaxy0`


## [0.2.1] - 2023-11-20

- Fix author in dockstore

## [0.2] - 2023-11-15

### Added

- more descriptive labels for inputs

## [0.1.2] - 2023-11-14

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/iuc/bwa_mem2/bwa_mem2/2.2.1+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/bwa_mem2/bwa_mem2/2.2.1+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/iuc/bellerophon/bellerophon/1.0+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/bellerophon/bellerophon/1.0+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/iuc/yahs/yahs/1.2a.2+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/yahs/yahs/1.2a.2+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/iuc/busco/busco/5.3.2+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/busco/busco/5.4.6+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/datamash_ops/datamash_ops/1.1.0+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/datamash_ops/datamash_ops/1.8+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/ggplot2_point/ggplot2_point/3.4.0+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/ggplot2_point/ggplot2_point/3.4.0+galaxy1`

## [0.1.1] - 2023-10-26

Added tags for better visibility of outputs in the history, and exposure of the BUSCO lineage parameter

## [0.1] - 2023-09-27

Creation of the workflow and tests

