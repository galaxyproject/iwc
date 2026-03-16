# Changelog

## [0.2] - 2026-02-07

- Change the input to a collection such that multiple sequences can be run in parallel
- Add a subworkflow that allows to run eggNOG with different types of sequences (protein, CDS, genome and metagenome). Needs to be in a subworkflow since this option is part of a section.
- Add the option that eggNOG and/or InterProScan can be skipped
- add the option to swap the input type for InterProScan 
- add toolshed.g2.bx.psu.edu/repos/iuc/kegg_pathways_completeness/kegg_pathways_completeness/1.3.0+galaxy0 to calculate the pathway completeness with KOs coming from eggNOG

## [0.1] - 2024-12-04

Initial version of the Functional annotation of protein sequence Workflow.
