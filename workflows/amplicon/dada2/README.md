# Dada2: amplicon analysis for paired end data

## Inputs dataset

- `Paired input data` paired input collection in FASTQ format

## Inputs values

- `Read length forward/reverse reads` length of the forward/reverse reads to which they should be truncated in the filter and trim step
- `Pool samples` pooling may increase sensitivity
- `Reference database` that should be used for taxonomic assignment

## Processing

The workflow follows the steps described in the [dada2 tutorial](https://benjjneb.github.io/dada2/tutorial.html).

As a first step the input collection is sorted. This is important because the dada2 step outputs
a collection in sorted order. If the input collection would not be sorted then the mergePairs step
samples would be mixed up.

- `FilterAndTrim` Quality control by filtering and trimming reads
- `QualityProfile` is called before and after the FilterAndTrim step
- `Unzip Collection` separates forward and reverse reads (the next steps are evaluated separately on forward and reverse reads)
- `learnErrors` learn error rates
- `dada` filter noisy reads
- `mergePairs` merge forward and reverse reads
- `makeSequenceTable` create the sequence table
- `removeBimeraDenovo` remove chimeric sequencs
- `assignTaxonomy` assign taxonomic information from a reference data base

## TODO

Some possibilities to extend/improve the workflow

- output BIOM
- use ASV1, ... in sequence table and taxonomy output, and output additional fasta
- allow to use custom taxonomy / make it optional
