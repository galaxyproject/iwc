# Clinical Metaproteomics 2: Discovery

Discovery in clinical metaproteomics is greatly enhanced by using a well-curated database, particularly one generated with the **MetaNovo tool**. This tool creates a manageable and streamlined database by identifying proteins relevant to the dataset, reducing the complexity of downstream analysis. For optimal results, the MetaNovo-generated database can be merged with reviewed proteins from **Human SwissProt** and known contaminants from the **cRAP (common Repository of Adventitious Proteins)** database, resulting in a compact yet comprehensive database of approximately 21,200 protein sequences. This refined database serves as the foundation for peptide identification, where mass spectrometry (MS) data is matched against the database to identify relevant peptides efficiently and accurately. By reducing redundancy and focusing on clinically relevant sequences, this approach improves the discovery of biomarkers and key protein insights, allowing researchers to extract meaningful biological information with reduced noise and false positives. This streamlined process is particularly valuable in clinical studies, where precision and relevance are critical for advancing diagnostics and therapeutic research.

In this current workflow, we perform Discovery using the SearchGUI and MaxQuant tools. A GTN has been developed for this workflow.
[https://training.galaxyproject.org/training-material/topics/proteomics/tutorials/clinical-mp-2-discovery/tutorial.html](https://training.galaxyproject.org/training-material/topics/proteomics/tutorials/clinical-mp-2-discovery/tutorial.html)

## Inputs dataset

- `MSMS datasets` in RAW dataset collection
- `Databases for discovery` in Fasta (protein sequences for database searching)
- `Experimental-Design Discovery MaxQuant` in Tabular Format 

## Inputs values

For MaxQuant and SearchGUI/PeptideShaker 
- Peptide Length
- Variable modifications
- Labeled element


## Processing

- extract microbial proteins and peptides using text formating tools
- Grouping duplicates using the Group tool
