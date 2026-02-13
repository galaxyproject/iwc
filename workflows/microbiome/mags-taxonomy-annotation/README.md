# MAGs Taxonomy Annotation

This workflow create a taxonomy annotation for MAGs with GTDB-Tk. With the help of some other tools MAGs also get the classification from NCBI.

## Workflow logic
The first step is to run GTDB-Tk to get the summary file from this tool. With this file the workflow can extracted the lineage of of the MAGS and can reformated the text such that the GTDB-NCBI mapping tool can run to map the GTDB name to the according NCBI name. After this tool there is an tool which can map the NCBI names to the according taxID which will be done. On the side there is a text reformat step which will get the rank of the GTDB-Tk annotation. All the gathered information will then be join into one file which has 5 columns:

- BinID
- GTDB name
- taxonomic rank
- NCBI name
- NCBI taxID

## Input
This workflow take a collection, which can be a list of a list, with MAGs created from binners (for example MetaBAT2. dRep etc.) in fasta format.

## Output
This workflow produce 5 main outputs which are:

- GTDB-Tk summary files(s)
- GTDB-NCBI mapping file(s)
- NCBI name to taxID mapping file(s)
- a full table of all mappings joint together
- MultiQC HTML report with GTBD-Tk and the full mapping table as input