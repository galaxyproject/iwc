# Assembly polishing with Racon workflow


## Inputs

- Sequencing reads in format: fastq, fastq.gz, fastqsanger.gz or fastqsanger
- Genome assembly to be polished, in fasta format

## What does the workflow do

- minimap2 : long reads are mapped to assembly => overlaps.paf.
- overaps, long reads, assembly => Racon => polished assembly 1
- using polished assembly 1 as input; repeat minimap2 + racon => polished assembly 2
- using polished assembly 2 as input, repeat minimap2 + racon => polished assembly 3
- using polished assembly 3 as input, repeat minimap2 + racon => polished assembly 4


## Settings

- Run as-is or change parameters at runtime.
- For the input at "minimap settings for long reads", enter (map-pb) for PacBio reads, (map-hifi) for PacBio HiFi reads, or (map-ont) for Oxford Nanopore reads.

## Outputs

There is one output: the polished assembly in fasta format. 

