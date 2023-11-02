# CUT&RUN (and CUT&TAG) Workflow

## Inputs dataset

- The workflow needs a single input which is a list of dataset pairs of fastqsanger.

## Inputs values

- adapter sequences: this depends on the library preparation. Usually CUT&RUN is Truseq and CUT&TAG is Nextera. If you don't know, use FastQC to determine if it is Truseq or Nextera
- reference_genome: this field will be adapted to the genomes available for bowtie2
- effective_genome_size: this is used by macs2 and may be entered manually (indications are provided for heavily used genomes)
- normalize_profile: Whether you want to have a profile normalized as Signal to Million Reads.

## Processing

- The workflow will remove illumina adapters and low quality bases and filter out any read smaller than 15bp
- The filtered reads are mapped with bowtie2 allowing dovetail and fragment length up to 1kb
- The BAM is filtered to keep only MAPQ30 and concordant pairs
- The PCR duplicates are removed with Picard (only from version 0.6)
- The BAM is converted to BED to enable macs2 to take both pairs into account
- The peaks are called with macs2 which at the same time generates a coverage file (normalized or not).
- The coverage file is converted to bigwig
- A multiQC is run to have an overview of the QC
