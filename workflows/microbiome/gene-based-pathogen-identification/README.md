# _Gene-based Pathogen Identification_

In this workflow, we determine whether the samples are pathogenic or not, by looking for genes known to be linked to pathogenicity or to the pathogenecity character of the organim:

- Virulence Factor (VF): gene products, usually proteins, involved in pathogenicity. By identifiying them we can call a pathogen and its severity level

- Antimicrobial Resistance genes (AMR).

    These type of genes have three fundamental mechanisms of antimicrobial resistance that are enzymatic degradation of antibacterial drugs, alteration of bacterial proteins that are antimicrobial targets, and changes in membrane permeability to antibiotics, which will lead to not altering the target site and spread throughput the pathogenic bacteria decreasing the overall fitness of the host.

In this workflow we:

1. Perform genome assembly to get contigs, i.e. longer sequences, using metaflye (Kolmogorov et al. 2020) then assembly polishing using medaka consensus pipeline and visualizing the assembly graph using Bandage Image (Wick et al. 2015)
2. Generate reports with AMR genes and VF using ABRicate

## Input Datasets
- Collection of Pre-Processed Sequenced reads of all samples, ready for further analysis with the other workflows, in a `fastq or fastq.gz` formate, the output of **_Preprocessing_** workflow.

## Output Datasets
- FASTA and Tabular files to track genes and visualise our pathogenic identification through out all samples.

This workflow is available for trial through our [GTN tutorial](https://training.galaxyproject.org/training-material/topics/microbiome/tutorials/pathogen-detection-from-nanopore-foodborne-data/tutorial.html)