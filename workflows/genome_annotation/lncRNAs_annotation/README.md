# lncRNAs annotation workflow

This workflow uses the FEELnc tool to annotate long non-coding RNAs. Before annotating these long non-coding RNAs, StringTie will be used to assemble the RNA-seq alignments into potential trancriptions. The gffread tool provides a genome annotation file in GTF format.

For future analyses, it would be interesting to use an updated annotation containing messenger RNA and long non-coding RNA. The concatenante tool merges the reference annotation with the long non-coding RNA annotation obtained with FEELnc.

FEELnc is a 3-step pipeline: 
- The first FEELnc “filter” step: consists of extracting and filtering out unwanted transcripts and transcripts overlapping the exons of the reference annotation.
- The second step, “codpot”: for coding potential, consists in calculating the coding potential of the transcripts. This step differentiates long non-coding RNAs from potential coding RNAs. 
- The final step, “classifyier”, classifies the new long non-coding RNAs according to the location and direction of transcription of the proximal transcribed RNAs.

## Input dataset for StringTie
StringTie requires two inputs: 
- the RNA-seq alignment in bam format
- the genome annotation file in gff3 format

## Outputs dataset for StringTie
StringTie generates an annotation file in GTF format. This file contains all the assembled transcripts present in the RNAseq data.

## Input dataset for gffread
GFFRead requires an input file: the genome annotaton in gff3 format.


## Outputs dataset for gffread
An output file is generated in gtf format.

## Input dataset for FEELnc
FEELnc requires 3 inputs:
- Transcript assembly in gtf format (corresponding to the StringTie output file) 
- Reference annotation in gft format (corresponding to the gffread output file)
- Genome sequence in fasta format

## Outputs dataset for FEELnc
FEELnc generates 3 output files:
- Long non-coding RNA annotation file in gtf format
- Annotation file for messenger RNAs in gtf format
- Classifier output file: table containing the classification of lncRNAs according to their genomic location in relation to other transcripts


## Input dataset for concatenate
Concatenate requires 2 inputs:
- genome annotation in gtf format
- annotation of long non-coding RNAs in gtf format

## Outputs dataset for concatenate
An output file in GTF format is generated, containing the genome annotation and the annotation of long non-coding RNAs.