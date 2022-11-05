# ChIP-seq paired-end Workflow

## Inputs dataset

- The workflow needs a single input which is a list of dataset pairs of fastqsanger.

## Inputs values

- adapters sequences: this depends on the library preparation. If you don't know, use FastQC to determine if it is Truseq or Nextera.
- reference_genome: this field will be adapted to the genomes available for bowtie2.
- effective_genome_size: this is used by MACS2 and may be entered manually (indications are provided for heavily used genomes).

## Processing

- The workflow will remove illumina adapters and low quality bases and filter out any pair with mate smaller than 15bp.
- The filtered reads are mapped with bowtie2 with default parameters.
- The BAM is filtered to keep only MAPQ30 and concordant pairs.
- The peaks are called with MACS2 which at the same time generates a coverage file.
- The coverage is converted to bigwig.
- A MultiQC is run to have an overview of the QC.

### Warning

- The coverage output is not normalized.
- The filtered bam still has PCR duplicates which are removed by MACS2.

## Contribution

@lldelisle wrote the workflow.

@nagoue updated the tools, made it work in usegalaxy.org, fixed the best practices and wrote the tests.
