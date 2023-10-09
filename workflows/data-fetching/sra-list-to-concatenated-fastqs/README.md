# SRA list to concatenated fastqs

This workflow takes as input a SRA list from SRA Run Selector and generate a single fastq or pair of fastq per BioSample (column 6). Then it relabels the collections using the column defined by the user.

## Input dataset

- The workflow needs a single input which is a tabular with first column the SRA number and sixth column an identifier for the sample.

## Input value

- The workflow needs a single input value which is the number of the column that the user want to use to relabel the collection items.

## Processing

- The workflow download fastqs with fasterqdump (one job per sample).
- The fastqs from the same sample are concatenated
- Finally they are relabelled.

## Outputs

- There are 2 outputs, one with paired-end datasets, one with single-read datasets.
