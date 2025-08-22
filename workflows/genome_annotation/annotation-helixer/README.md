# Genome annotation workflow with Helixer

This workflow annotates a genome using Helixer and evaluates the quality of the annotation with BUSCO and Genome Annotation Statistics. GFFRead is used to extract predicted protein sequences, and both BUSCO and OMArk assess proteome quality. The final annotation can be visualized interactively using JBrowse.


**Helixer** is an annotation software with a new and different approach: it performs evidence-free predictions (no need for RNASeq data or sequence aligments), using Graphics Processing Unit (GPU), with a much faster execution time. The annotation is based on the development and use of a cross-species deep learning model. The software is used to configure and train models for ab initio prediction of gene structure. In other words, it identifies the base pairs in a genome that belong to the UTR/CDS/Intron genes.

## Workflow steps
- Genome annotation with **Helixer**
- Extraction of predicted proteins from annotation with **GFFRead**
- Evaluation of annotation
    - **Genome Annotation Statistics**
    - **BUSCO** (on genome and predicted proteins)
- Proteome quality assessment with **OMArk**
- Visualization of annotation with **JBrowse**

## Input data
The ollowing input files are required for the workflow:
- Genome sequence (FASTA format): The genome to be annotated. Used by Helixer, Genome Annotation Statistics, BUSCO, GFFRead, and JBrowse.

## Output data
The workflow generates the following outputs:
- Annotation file (GFF3): Contains the final consensus gene models produced by Helixer.
- BUSCO results: Assess the completeness of the annotation and include:
    - A summary of results.
    - A table of all searched BUSCO genes with their status.
    - A table of missing BUSCO genes.
- Annotation statistics: Summary and graphical analyses of the annotation, produced by Genome Annotation Statistics.
- Protein sequences (FASTA): Predicted from the annotation using GFFRead.
- OMArk report: completeness, consistency, and contamination of the predicted proteome.
- Genome browser visualization (HTML): An interactive genome view produced by JBrowse.