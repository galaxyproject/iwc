# SRA manifest to concatenated fastqs

This workflow takes as input a SRA manifest from SRA Run Selector (or a tabular with a header line), downloads all sequencing run data from the SRA and arranges it into per-sample fastq or pairs of fastq datasets.

It will work out the relationship between runs and samples from the user-indicated run and sample columns in the input and will concatenate sequencing run data as needed to obtain per-sample datasets.

## Input dataset

- The workflow needs a single tabular input dataset, which is supposed to list SRA run identifiers in one column and sample names in another, and which needs to have a header line.
- SRA manifests obtained via the SRA Run Selector and turned into tabular format represent valid input.

## Input values

- Column number with SRA run ID

  For manifests obtained through the SRA Run Selector this is column 1

- Column number with sample names

  The number of the column that should be used to assign sequencing runs to samples
  The names in the column will also serve as the labels of datasets in the output collection.
  For manifests obtained through the SRA Run Selector suitable columns might be number 6 (BioSample), 16 (Experiment) or 36 (Sample Name).

## Processing

- The workflow downloads sequencing run data in fastq format with fasterqdump (one job per SRA run ID).
- Run data gets concatenated if it comes from the same sample.

## Outputs

- There are 2 outputs, one with paired-end datasets, one with single-read datasets.

## Limitations

- Special characters in sample names (anything that is not an English alphabet character, digit, underscore, dash, space, dot or comma (`[a-zA-Z0-9_\- \.,]`) will be converted to dashes (`-`).
