# Genome annotation workflow with Maker

This workflow allows to annotate a genome with Maker and to evaluate the quality of the annotation using BUSCO and genome annotation statistics. 

**Maker** is a genome model prediction software that uses ab initio predictors (SANP and Augustus) to improve its predictions. Maker is capable of annotating both prokaryotes and eukaryotes. It works by aligning as much evidence as possible along the genome sequence, then reconciling all these signals to determine likely genetic structures.


To assess the quality of the annotation, different tools will be used:
- **Fasta Statistics** is used to assess the quality of the genome.
- **BUSCO (Benchmarking Universal Single-Copy Orthologs)**: is a tool for assessing the quality of a genome assembly or genome annotation. By comparing the genomes of various more or less related species, the authors have determined sets of orthologous genes that are present in a single copy in (almost) all the species in a clade (Bacteria, Fungi, Plants, Insects, Mammals, etc.). Most of these genes are essential to the life of the organism and should be found in any newly sequenced and annotated genome of the corresponding clade. Using this data, BUSCO is able to assess the proportion of these essential genes (also known as BUSCO) found in a set of (predicted) transcripts or protein sequences. This is a good assessment of the 'completeness' of the annotation.
- **Genome Annotation Statistics**: is a program designed to analyse and provide statistics on genome annotations. This software analyses a GFF3 file.

To improve gene denomination, different tools will be used:
- **gffread**: to extract the predicted protein sequences from the annotation (i.e. the annotation Maker).
- **Map annotation ids**: to automatically assign more readable names.


The final step is to visualise the generated annotation using a genome browser such as **JBrowse**. This browser allows navigation along the chromosomes of the genome and visualisation of the structure of each predicted gene.

## Input dataset for Fasta Statistics
An input file: the genome sequence in fasta format.
## Output dataset forFasta Statistics
The output file is a tabular file with several statistics:
- num_seq: the number of contigs (or scaffold or chromosomes), compare it to expected chromosome numbers
- len_min, len_max, len_N50, len_mean, len_median: the distribution of contig sizes
num_bp_not_N: the number of bases that are not N, it should be as close as possible to the total number of bases (num_bp)

## Input dataset for BUSCO on the genome
An input file: the genome sequence in fasta format.
## Output dataset for BUSCO on the genome
Three outputs are generated:
- A short summary: summarizes the results of BUSCO (see below)
- A full table: lists all the BUSCOs that were searched for, with the corresponding status 
- A table of missing BUSCOs: this is the list of all genes that were not found in the genome

## Input dataset for Maker
Four inputs are required:
- Genome sequence in fasta format
- Protein sequences aligned with the genome in fasta format
- Ab-initio gene prediction
- EST evidences 
## Output dataset for Maker
Three outputs are generated:
- The final annotation: the final consensus gene models produced by Maker
- The evidences: the alignments of all the data Maker used to construct the final annotation (ESTs and proteins that we used)
- A GFF3 file containing both the final annotation and the evidences

## Input dataset for Genome annotation statistics
Two input files are required:
- The final annotation in gff format (i.e. annotation of the genome using Maker)
- The reference genome sequence in fasta format
## Output dataset for Genome annotation statistics
Two output files are generated:
- a file containing graphs in pdf format
- a summary in txt format

## Input dataset for GFFread
In this workflow, GFFRead requires two inputs:
- an annotation file in GFF3 format (i.e. annotation of the genome using Maker)
- the genome sequence in fasta format
## Output dataset for GFFread
In this workflow, a unique output will be generated. This file, in fasta format, contains the protein sequences predicted from the annotation.

## Input dataset for BUSCO on the proteome
An input file: the file in fasta format with the exon sequences from the GFFRead tool
## Output dataset for BUSCO on the proteome
Three outputs are generated:
- A short summary: summarizes the results of BUSCO (see below)
- A full table: lists all the BUSCOs that were searched for, with the corresponding status 
- A table of missing BUSCOs: this is the list of all genes that were not found in the genome

## Input dataset for Map annotation ids
A file is required: the final annotation in gff format (i.e. annotation of the genome using Maker)
## Output dataset for Map annotation ids
Two output files are generated:
- a GFF file
- a tabular file

## Input dataset for JBrowse
JBrowse requires two inputs:
- the genome sequence in fasta format
- the annotation file in gff3 format, generated by Map annotation ids

## Output dataset for JBrowse
An html file is generated for browsing the genome.
