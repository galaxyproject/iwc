# Pox Virus Illumina Amplicon Workflow for half-genomes sequencing data

This workflow generates consensus sequences from Illumina PE-sequenced ARTIC data of pox virus samples.

It requires that all samples have been sequenced in two halves in two separate sequencing runs, and utilizes this property to resolve the inverted terminal repeat (ITR) sequences of pox virus genomes.

The workflow uses BWA-MEM for mapping the reads from each half-genome sequencing run to a correspondingly masked version of the reference genome, merges the resulting two read mappings, and uses iVar for primer trimming and consensus sequence generation.

Conceptually, this workflow builds on https://github.com/iwc-workflows/sars-cov-2-pe-illumina-artic-ivar-analysis and adds the logic for the split genome mapping and merging of the results.