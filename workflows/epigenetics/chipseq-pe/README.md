# ChIP-seq Analysis: Paired-End Read Processing

## Inputs dataset

- The workflow needs a single input which is a list of dataset pairs of fastqsanger.

## Inputs values

- Percentage of bad quality bases per read: fastp will discard any read which has more than this percentage of bases with a quality below 30. This depends on your read length.
- Reference genome: this field will be adapted to the genomes available for bowtie2.
- Effective genome size: this is used by MACS2 and may be entered manually (indications are provided for heavily used genomes).
- Normalize profile: Whether you want to have a profile normalized as Signal to Million Fragments.

## Processing

- The workflow will remove illumina adapters using read overlap and filter out any read smaller than 15bp after adapter removal. All reads with too many low quality bases will be discarded.
- The filtered reads are mapped with bowtie2 with default parameters.
- The BAM is filtered to keep only MAPQ30 and concordant pairs.
- The peaks are called with MACS2 which at the same time generates a coverage file (normalized or not).
- The coverage is converted to bigwig.
- A MultiQC is run to have an overview of the QC.

### Warning

- The filtered bam still has PCR duplicates which are removed by MACS2.

## Contribution

@lldelisle wrote the workflow.

@nagoue updated the tools, made it work in usegalaxy.org, fixed the best practices and wrote the tests.
