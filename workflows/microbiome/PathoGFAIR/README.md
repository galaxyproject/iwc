# PathoGFAIR

This workflow groups 5 different workflows in 1: **Nanopore Preprocessing**, **Taxonomy Profiling and Visualization with Krona**, **Gene-based Pathogen Identification**, **Nanopore Allele-based Pathogen Identification** and **Pathogen Detection: PathoGFAIR Samples Aggregation and Visualisation**.

## Input Datasets

- A collection of all sample reads (all in the same sequence file format, e.g.: Fastq, Fastq.gz, Fastqsanger, etc.)
- Reference Genome to the main pathogen of question to the samples
- Reference Genome to the host, where the samples are coming from, Human, Chicken, Cow, etc. 
- (Optional) Samples Profile, based on the lab preparation of the samples during sequencing, there should be a sample profile better than the other, to be chosen as an optional input to Minimap2. e.g. PacBio/Oxford Nanopore

## Output Datasets

All outputs of the previously mentioned workflows that forms PathoGFAIR.
