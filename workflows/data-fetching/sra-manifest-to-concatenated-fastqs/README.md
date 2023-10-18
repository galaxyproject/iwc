# SRA manifest to concatenated fastqs

This workflow takes as input a SRA manifest from SRA Run Selector (or a tabular with a header line) and generate a single fastq or pair of fastq per sample (present in the SRA manifest with a column of user's choice).

## Input dataset

- The workflow needs a single input which is a tabular with one column with SRA number and one column with sample identifier. The tabular must have a header line.

## Input values

- Column number with SRA ID: Usually it is column 1
- Column number with final identifier: this is the number of the column that the user wants to use to label the collection items.

## Processing

- The workflow download fastqs with fasterqdump (one job per SRA).
- The fastqs from the same sample are concatenated.

## Outputs

- There are 2 outputs, one with paired-end datasets, one with single-read datasets.

## Warning

We assume that the sample name does not contains '___' as this is used to concatenate and then split SRA and sample name.
