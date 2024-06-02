# Nanopore _Allele-based Pathogen Identification_

This workflow identifies pathogens using an allelic approach, detecting Single Nucleotide Polymorphisms (SNPs) to track emerging variants, i.e. markers showing evolutionary histories of homogeneous strains. This process includes SNP calling, aimed at identifying novel pathogen strains and elucidating discrepancies compared to reference sequences, thereby facilitating the tracking of emerging variants. Within this workflow, both variants and SNPs are discerned, serving as crucial elements for subsequent pathogen identification and variant tracking purposes.

To perform the mapping step before variant identification, we used the Minimap2 tool, specifically designed for Nanopore reads. If you're working with Illumina data, you can substitute Minimap2 with Bowtie2.

## Input Datasets
- Collection of Pre-Processed Sequenced reads of all samples, ready for further analysis with the other workflows, in a `fastq or fastq.gz` format, the output of **Nanopore _Preprocessing_** workflow.
- A reference genome to the tested pathogen.

## Output Datasets
- VCF files indicating identified variants and SNPs, BAM files with mapping results, and Tabular files with mapping depth and coverage calculations.

This workflow is available for trial through our [GTN tutorial](https://training.galaxyproject.org/training-material/topics/microbiome/tutorials/pathogen-detection-from-nanopore-foodborne-data/tutorial.html)
