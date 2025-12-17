# core genome Multilocus Sequence Typing (cgMLST) of Bacterial Genome workflow

This workflow uses assembled bacterial genome fasta files (but can be any fasta file) and executes the following steps:

1. cgMLST analysis on contigs
   - **CoreProfiler** to assign cgMLST allele profiles from bacterial genome assemblies using curated reference schemes
2. Aggregating outputs into a single JSON file
   - **ToolDistillator** to extract and aggregate information from different tool outputs to JSON parsable files

## Inputs

1. Assembled bacterial genome in fasta format.

## Outputs

1. core genome MLST (cgMLST) results:
   - Tabular allele profile for each locus
   - FASTA file of newly detected alleles
   - JSON file with information on temporary alleles
2. Aggregating outputs:
   - JSON file with information about the outputs of **CoreProfiler**
