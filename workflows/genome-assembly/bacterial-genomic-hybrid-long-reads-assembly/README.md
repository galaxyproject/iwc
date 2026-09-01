# Bacterial genome assembly and annotation to hybrid long reads assembly

This workflow use paired-end illumina fastq(.gz) files and long-read (tested on nanopore) input (fastq.gz) and make some analysis to assembly bacterial genomes and annotate genomes to extract antimicrobial informations.

The main steps are:
1. Quality control and trimming
2. Taxonomic assignation on trimmed data
3. Assembly and polishing raw reads to a final contig fasta file
4. Quality control of the assembly
5. Genomic annotation:
    - Genomic annotation
    - Integron identification
    - Plasmid gene identification
    - Inserted Element (IS) detection
    - Antimicrobial resistance gene identification
    - Virulence gene identification

## Tools used
1. Quality control and trimming
    - fastp QC control and trimming for short reads
    - FastQC and filtlong for QC and trimming of long reads
2. Taxonomic assignation on long read data
    - kraken2 assignation
    - bracken to restimate abundance to the species level
    - recentrifuge to make a krona chart    
3. Assembly raw reads to a final contig fasta file
    - flye and polipolish to use the illumina reads
4. Quality control of the assembly
    - Quast
    - Bandage to plot assembly graph
    - Refseqmasher to identify the closed reference genome
5. Genomic annotation:
    - Genomic annotation: Bakta
    - Integron identification: IntegronFinder2
    - Plasmid gene identification: Plasmidfinder
    - Inserted Element (IS) detection: ISEScan
    - Antimicrobial resistance gene identification: staramr to blast against resfinder and plasmidfinder database
    - Virulence gene identification: abricate with VFDB_A database

The multiQC tool is used to aggregate all QC result into only 1 report.



## inputs

1. Paired-end illumina rax reads in fastq(.gz) format.
2. Single long read in fastq(.gz) format.

## Outputs
1. Quality control:
    - quality report
    - trimmed raw reads
2. Taxonomic assignation:
    - Tabular report of identified species
    - Tabular file with assigned read to a taxonomic level
    - Krona chart to illustrate species diversity of the sample
3. Assembly:
    - polished assembly with contigs in fasta
    - Mapped read on assembly in bam format
    - Graph assembly in gfa format
4. Quality of Assembly:
    - Assembly report
    - Assembly Graph
    - Tabular result of closed reference genomes
5. Genomic annotation:
    - Genomic annotation:
        - genome annotation in tabular, gff and several other formats
        - annotation plot
        - nucleotide and protein sequences identified
        - summary of genomic identified elements
    - Integron identification:
        - integron identification in tabular format and a summary
    - Plasmid gene identification :
        - plasmid gene identified and associated blast hits
    - Inserted Element (IS) detection :
        - IS element list in tabular format
        - is hits in fasta format
        - ORF hits in protein and nucleotide fasta format
        - IS annotation gff format
    - Antimicrobial resistance gene identification
        - AMR gene list
        - MLST typing
        - Plasmid gene identification
        - Blast hits
    - Virulence gene identification
        - Gene identification in tabular format
