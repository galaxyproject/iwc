# QIIME2 workflows

## Available workflows

Denoising (using `qiime2`'s `dada2` integration for paired / single end data.

## Inputs

- Demultiplexed sequences as a qiime2 aertifact file (`qza`) containing the sequence information.
- Metadata table (`tabular`)
- Truncation length
- Trimming length (optional)

For the paired end workflow the truncation and trimming length for the reverse reads can / has to be given.


## Processing

- Denoising with `qiime2 dada2 denoise-single`/`paired`
- For each of the three outputs (see below) another tool is started to prepare a corresponding qzv file
  - representative sequences `qiime2 feature-table tabulate-seqs `
  - denoising statistics `qiime2 metadata tabulate`
  - summary of the feature table

## Outputs

  - representative sequences 
  - denoising statistics 
  - summary of the feature table (how many sequences are lost in the corresponding steps)
