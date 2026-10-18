# core genome Multilocus Sequence Typing (cgMLST) of Bacterial Genome workflow

This workflow performs core genome multilocus sequence typing (cgMLST) on contigs corresponding to one bacterial genome to characterize bacterial strains using curated reference schemes by:

1. Assignment of a cgMLST allele profile on contigs using **CoreProfiler** and curated reference schemes (from pubMLST,  BIGSdb, Enterobase, or cgMLST.org) 
2. Extraction and aggregation of outputs into a single JSON file using **ToolDistillator**

## Inputs

1. Contigs of one assembled bacterial genome in FASTA format.

## Outputs

1. core genome MLST (cgMLST) results as:
   - Tabular allele profile for each locus
   - FASTA file of newly detected alleles
   - JSON file with information on temporary alleles
2. Aggregated outputs as a JSON file with information about the outputs of **CoreProfiler**
