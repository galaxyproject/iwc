# Functional annotation of protein sequences Workflow

This workflow uses eggNOG mapper and Interproscan for functional annotation of protein sequences.
It can be used on proteins from any organism.

EggNOG Mapper compares each protein sequence of the annotation to a huge set of ortholog groups from the eggNOG database. In this database, each ortholog group is associated with functional annotation like Gene Ontology (GO) terms or KEGG pathways. When the protein sequence of a new gene is found to be very similar to one of these ortholog groups, the corresponding functional annotation is transfered to this new gene.

InterProScan is a tool that analyses each protein sequence from our annotation to determine if they contain one or several of the signatures from InterPro. When a protein contains a known signature, the corresponding functional annotation will be assigned to it by InterProScan.

## Input dataset
This workflow requires only a input file: a protein sequences file in fasta format.


## Outputs for eggNOG Mapper
The output of this tool is a tabular file, where each line represents a gene from our annotation, with the functional annotation that was found by EggNOG-mapper. It includes a predicted protein name, GO terms, EC numbers, KEGG identifiers, etc.

## Outputs for Interproscan
The output of this tool is both a tabular file and an XML file. Both contain the same information, but the tabular one is more readable for a Human: each line represents a gene from our annotation, with the different domains and motifs that were found by InterProScan.

Each line correspond to a motif found in one of the annotated proteins. The most interesting columns are:
- Column 1: the protein identifier
- Column 5: the identifier of the signature that was found in the protein sequence
- Column 4: the databank where this signature comes from (InterProScan regroups several motifs databanks)
- Column 6: the human readable description of the motif
- Columns 7 and 8: the position where the motif was found
- Column 9: a score for the match (if available)
- Column 12 and 13: identifier of the signature integrated in InterPro (if available). Have a look an example webpage for IPR036859 on InterPro.
- The following columns contains various identifiers that were assigned to the protein based on the match with the signature (Gene ontology term, Reactome, …)
