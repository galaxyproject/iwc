# QIIME2 import workflows


## Available workflows

Import of fastqsanger.gz data into QIIME artifact files.

Available for:

- paired / single end data
- demultiplexed / multiplexed data (the former according to the EMP protocol)

For data that is multiplexed with another protocol the Galaxy cutadapt tool can be use.

## Inputs

- Single end or paired end reads in fastq format.
- For demultiplexed data all datasets must be in a single (flat) collection
  (also paired data).

### Demultiplexed data

- Demultiplexed data must follow the naming scheme `.+_.+_R[12]_001\.fastq\.gz`.
  Any lane information (in the form of `L[0-9][0-9][0-9]_`) in the dataset names
  is automatically removed.

### Mulmultiplexed data

- Multiplexed data in a single or two fastq.gz dataset(s)
- Barcodes as fastq.gz file
- Metadata (a table describing the samples) and a metadata parameter (the name of the column that contains the barcode sequences)
- A boolean determining if there reverse complement of the barcode sequences shoul dbe used

## Processing

For demultiplexed data

1. Lane information is removed from the collection identifiers (using `Extract element identifiers`, `Regex Find And Replace` and `Relabel identifiers`)
2. Import of sequence data using `qiime2 tools import` with `Casava One Eight Laneless Per Sample Directory Format`
3. Prepare visualisation dataset with `qiime2 demux summarize`

For multiplexed data

1. Import sequences and metadata with `qiime2 tools import` as `EMP Paired End Directory Format` and `Immutable Metadata Format`, resp.
2. Demultiplex the sequences with `qiime2 demux emp-paired`/`paired` (using sequences and metadata information)
3. Prepare visualisation dataset with `qiime2 demux summarize`


## Outputs

- Sequence data in `qza` format
- A corresponding qiime visualization file in `qzv` format

## TODOs

- The import workflows for multiplexed data currently first convert the metadata into qza and require the user to enter a column as free text. If Galaxy allows for data-column workflow parameters this step can be removed.