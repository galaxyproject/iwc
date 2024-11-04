# Goseq GO-KEGG Enrichment Analysis Workflow

## Inputs dataset

The workflow need the following inputs:
- The DEG file:
    - A tabular file with first column the gene symbol and second column a boolean value whether the gene is a differentially expressed gene or not. 
- The gene length file:
    - A tabular file with first column the gene symbol and second column the gene length of the genes.
- The KEGG file:
    - A tabular file with first column the Pathway ID and second column the Pathway name like: 
        -   ```
            ID  Name
            01100   Metabolic pathways - mmus
            01200   Carbon metabolism - mmus 
            ```
 
## Processing

- The workflow will do a simple enrichment analysis with taking into account the gene length
- The output will be 3 files `GO table`, `Top ontology plot` and `DE genes in each category` for Cellular Component, Biological Processes, and Molecular Function ontologies and `KEGG table` and `DE genes in each KEGG Pathways`

### Warning

- This workflow uses mm10 reference genome

## Contribution

@nilchia wrote the workflow and the tests.