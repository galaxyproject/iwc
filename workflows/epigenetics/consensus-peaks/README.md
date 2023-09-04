# Consensus peaks Workflow

The goal of this workflow is to get a list of confident peaks with summits from two replicates.

## Inputs dataset

- The workflow needs a single input which is a list of datasets with 2 BAM (or BED) where PCR duplicates have been removed.

## Inputs values

- effective_genome_size: this is used by MACS2 and may be entered manually (indications are provided for heavily used genomes).
- bin_size: this is the bin sized used to compute the average of normalized profiles. Large values will allow to have a smaller output file but with less resolution while small values will increase computation time and size of the output file to produce a more resolutive bigwig.

## Strategy summary

Here is a generated example to highlight the strategy:
![strategy](./strategy.png)

## Processing

- The workflow will:
  - first part:
    - call peaks and compute normalized coverage on each BAM (or BED) individually
    - average normalized profiles
    - compute the intersection between both peaks
  - second part:
    - subset both BAM (or BED) to get the same number of reads
    - call peaks on both subsetted BAM combined
  - finally, keep only peaks from the second part that have summits overlapping the intersection of the first part.
