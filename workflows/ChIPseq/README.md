# ChIP Workflow

## Inputs
- The workflow needs a single input which is a list of dataset pairs of fastqsanger.

## Processing
- The workflow will remove illumina adapters and low quality bases and filter out any read smaller than 15bp
- The filtered reads are mapped with bowtie2 with default parameters
- The BAM is filtered to keep only MAPQ30 and concordant pairs
- The peaks are called with macs2 which at the same time generate a coverage.
- The coverage is converted to bigwig
- A multiQC is run to have an overview of the QC

### Warning
- The coverage output is not normalized.
