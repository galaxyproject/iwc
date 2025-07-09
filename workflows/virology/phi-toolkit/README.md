# PHI Toolkit: Phage Interaction Toolkit

Profiling of bacteriophages is essential in expanding our knowledge of phage-host dynamics. 
The Phage Interaction Toolkit (PHI) is designed to perform an automated and comprehensive identification and profiling of phages within host genomes.
This workflow integrates state-of-the-art phage identification tools with host interaction analysis tools.
The workflow creates a summary of the outputs of these tools allowing for a convenient analysis of host phage interactions:

Tools analysing host:

Genomad: Detection and annotation of mobile genetic elements including prophages.
CheckM2: Assess bacterial genome quality (completeness and contamination).
GTDB-tk: Assignment of taxonomy to bacterial genomes.
DefenseFinder: Scan genomes for known bacterial defense mechanisms such as restriction-modification and CRISPR. 

Tools analysing phages that were identified by Genomad:

Vibrant: Identification, annotation and curation of phage sequences in genomes. Also produces gene calls, annotations and quality assessment.
CheckV: Estimation of genome completeness, contamination of putative viral contigs.
iPHoP: Prediction of phage-host interactions based on signals such as sequence similarity, CRISPR matches and tRNA matches. Identification of potential host taxa.
dRep Compare: Dereplication and comparison of viral genomes. 
ABRIcate: Screen of contigs for antimicrobial resistance or virulence genes.