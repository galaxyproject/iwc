# fake Workflow

## Inputs
- The workflow needs a single input which is a list of dataset pairs of fastqsanger.

## Processing
- The workflow will remove illumina adapters and low quality bases and filter out any read smaller than 15bp
- The filtered reads are mapped with bowtie2 with default parameters
