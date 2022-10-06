# CUT&RUN Workflow

## Inputs
- The workflow needs a single input which is a list of dataset pairs of fastqsanger.

## Processing
- The workflow will remove illumina adapters and low quality bases and filter out any read smaller than 15bp
- The filtered reads are mapped with bowtie2 allowing dovetail and fragment length up to 1kb
- The PCR duplicates are removed with Picard
- The BAM is converted to BED to enable macs2 to take both pairs into account
- The peaks are called with macs2 which at the same time generate a coverage.
- The coverage is converted to bigwig
- A multiQC is run to have an overview of the QC

### Warning
- The coverage output is not normalized.
