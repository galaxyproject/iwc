# Goseq GO-KEGG Enrichment Analysis Workflow

## Inputs dataset

The workflow need the following inputs:
- **The DEG file:**
    - A tabular file with first column the gene symbol and second column a boolean value whether the gene is a differentially expressed gene or not. 
- **The gene length file:**
    - A tabular file with first column the gene symbol and second column the gene length of the genes.
    - You can create this file with **[Gene length and GC content](https://usegalaxy.eu/?tool_id=toolshed.g2.bx.psu.edu%2Frepos%2Fiuc%2Flength_and_gc_content%2Flength_and_gc_content%2F0.1.2&version=latest)** tool. You will need a GTF file as input.
    - If you are using **[featureCounts](https://usegalaxy.eu/?tool_id=toolshed.g2.bx.psu.edu%2Frepos%2Fiuc%2Ffeaturecounts%2Ffeaturecounts%2F2.0.6%2Bgalaxy0&version=latest)** you can set `Create gene-length file` to yes and get gene length as separate output.
- **The KEGG file:**
    - A tabular file with first column the Pathway ID and second column the Pathway name like: 
        -   ```
            ID  Name
            01100   Metabolic pathways - mmus
            01200   Carbon metabolism - mmus 
            ```
    - You can get this information from the KEGG database. For example:
        - mouse: https://rest.kegg.jp/list/pathway/mmu
        - human: https://rest.kegg.jp/list/pathway/hsa
- **Genome:** Select one of the available genomes
- **Gene ID format:** Select the format of your input genes (Ensembl, Entrez, or Symbol)
## Processing

- The workflow will do a simple enrichment analysis with taking into account the gene length
- The output will be 3 files `GO table`, `Top ontology plot` and `DE genes in each category` for Cellular Component, Biological Processes, and Molecular Function ontologies and `KEGG table` and `DE genes in each KEGG Pathways`

## Contribution

@nilchia wrote the workflow and the tests.