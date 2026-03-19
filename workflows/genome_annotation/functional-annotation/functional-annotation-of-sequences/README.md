# Functional annotation of protein or DNA sequences Workflow

This workflow utilizes eggNOG mapper and InterProScan for the functional annotation of protein or DNA sequences.
It can be used on proteins or DNA from any organism.

EggNOG Mapper compares each protein sequence (or translated DNA sequence when nucleotide input is provided) of the annotation to a huge set of ortholog groups from the eggNOG database. In this database, each ortholog group is associated with functional annotations like Gene Ontology (GO) terms or KEGG pathways. When the protein sequence of a new gene is found to be very similar to one of these ortholog groups, the corresponding functional annotation is transferred to this new gene.

InterProScan is a tool that analyses each protein sequence (or translated DNA sequence when nucleotide input is provided) from our annotation to determine if it contains one or several of the signatures from InterPro. When a protein contains a known signature, the corresponding functional annotation will be assigned to it by InterProScan.

## Input dataset
This workflow requires a galaxy collection of type list with at least one file in fasta format.

## Outputs for eggNOG Mapper
The output of this tool is a tabular file, where each line represents a gene from our annotation, with the functional annotation that was found by EggNOG-mapper. It includes a predicted protein name, GO terms, EC numbers, KEGG identifiers, etc.

## Outputs for Interproscan
The output of this tool is both a tabular file and an XML file. Both contain the same information, but the tabular one is more readable for a Human: each line represents a gene from our annotation, with the different domains and motifs that were found by InterProScan.

Each line corresponds to a motif found in one of the annotated proteins. The most interesting columns are:

- Column 1: the protein identifier
- Column 5: the identifier of the signature that was found in the protein sequence
- Column 4: the database where this signature comes from (InterProScan regroups several motif databases)
- Column 6: the human-readable description of the motif
- Columns 7 and 8: the position where the motif was found
- Column 9: a score for the match (if available)
- Columns 12 and 13: identifier of the signature integrated in InterPro (if available). Have a look at an example webpage for IPR036859 on InterPro.
- The following columns contain various identifiers that were assigned to the protein based on the match with the signature (Gene ontology term, Reactome, …)

## Output for KEGG Pathways completeness
This tool calculates the completeness of metabolic pathways based on KEGG Orthologs (KOs) obtained from eggNOG annotations. In addition to estimating pathway completeness, the tool assigns each contig to the corresponding pathway and reports the pathway name and class. It also lists the KOs detected on the contig as well as the KOs that are missing for the pathway, enabling users to assess how close the pathway is to being complete.