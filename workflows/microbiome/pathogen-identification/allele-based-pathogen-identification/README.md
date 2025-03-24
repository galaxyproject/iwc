# Allele-based Pathogen Identification

This workflow identifies pathogens using an allelic approach, detecting Single Nucleotide Polymorphisms (SNPs) to track emerging variants, i.e. markers showing evolutionary histories of homogeneous strains. This process includes SNP calling, aimed at identifying novel pathogen strains and elucidating discrepancies compared to reference sequences, thereby facilitating the tracking of emerging variants. Within this workflow, both variants and SNPs are discerned, serving as crucial elements for subsequent pathogen identification and variant tracking purposes.

## Input Datasets
- Collection of Pre-Processed Sequenced reads of all samples, ready for further analysis with the other workflows, in a `fastqsanger or fastqsanger.gz` format, the output of **Nanopore Preprocessing** workflow.
- A reference genome to the tested pathogen.

## Output Datasets
- VCF files indicating identified variants and SNPs, BAM files with mapping results, and Tabular files with mapping depth and coverage calculations.

If you're unsure how to use this workflows, or if you want to see it in action with test datasets, it is included in our detailed training material for foodborne pathogen detection and tracking. You can find step-by-step instructions and practical examples in the following [GTN tutorial](https://training.galaxyproject.org/training-material/topics/microbiome/tutorials/pathogen-detection-from-nanopore-foodborne-data/tutorial.html)
