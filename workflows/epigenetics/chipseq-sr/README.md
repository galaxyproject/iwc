# ChIP-seq Analysis: Single-End Read Processing

## Inputs dataset

- The workflow needs a single input which is a list of fastqsanger files.

## Inputs values

- Adapter sequence: this optional parameter depends on the library preparation, you can leave it empty if you want fastp to autodetect it.
- Percentage of bad quality bases per read: fastp will discard any read which has more than this percentage of bases with a quality below 30. This depends on your read length.
- Reference genome: this field will be adapted to the genomes available for bowtie2.
- Effective genome size: this is used by MACS2 and may be entered manually (indications are provided for heavily used genomes).
- Normalize profile: Whether you want to have a profile normalized as Signal to Million Reads.

## Processing

- The workflow will remove illumina adapters and filter out any read smaller than 15bp after adapter removal. All reads with too many low quality bases will be discarded.
- The filtered reads are mapped with bowtie2 with default parameters.
- The BAM is filtered to keep only MAPQ30.
- The peaks are called with MACS2 with a fixed extension of 200bp which at the same time generates a coverage file (normalized or not).
- The coverage is converted to bigwig.
- A MultiQC is run to have an overview of the QC.

### Warning

- The filtered bam still has PCR duplicates which are removed by MACS2.
