# MAGs Taxonomy Annotation

This workflow generates taxonomic annotations for MAGs using GTDB-Tk. With the integration of additional tools, MAGs also receive corresponding taxonomic classifications from NCBI.

## Workflow logic
The workflow first runs GTDB-Tk to generate a summary file. From this file, it extracts the GTDB lineage for each MAG and reformats it so that the GTDB–NCBI mapping tool can translate GTDB names into their corresponding NCBI names. These NCBI names are then passed to another tool, which resolves them into the corresponding NCBI taxIDs.

In parallel, an additional text-processing step extracts the taxonomic rank from the GTDB-Tk annotation. Finally, all collected information is merged into a single file with the following five columns:

- BinID
- GTDB name
- Taxonomic rank
- NCBI name
- NCBI taxID

## Input
This workflow takes a dataset collection (a Galaxy collection of type list) containing MAGs produced by binners (e.g. MetaBAT2, dRep) in FASTA format.

## Output
This workflow produces the following main outputs:

- GTDB-Tk summary file(s)
- GTDB–NCBI mapping file(s)
- NCBI name-to-taxID mapping file(s)
- A complete merged table containing all mappings
- MultiQC HTML report with GTDB-Tk and the full mapping table as input