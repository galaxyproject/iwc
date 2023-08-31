# Peaks consensus Workflow

The goal of this workflow is to get a list of confident peaks with summits from two replicates.

## Inputs dataset

- The workflow needs a single input which is a list of datasets with 2 BAM (or BED) where PCR duplicates have been removed.

## Inputs values

- effective_genome_size: this is used by MACS2 and may be entered manually (indications are provided for heavily used genomes).

## Processing

- The workflow will:
  - on the one hand,
    - call peaks on each BAM (or BED) individually
    - compute the intersection between both
  - on the other hand,
    - subset both BAM (or BED) to get the same number of reads
    - call peaks on both subsetted BAM combined
  - finally, keep only peaks from the second part that have summits overlapping the intersection of the first part.
