# Clinical Metaproteomics 4: Quantitation

Quantitative proteomics is crucial for many important purposes. It allows researchers to measure and compare the levels of proteins or peptides in biological samples. This provides valuable insights into biomarker discovery, comparative analysis, and differential expression studies. Quantitative proteomics also helps in understanding the functional roles of proteins, the composition of protein complexes, and the effects of drugs on protein expression in pharmacological studies. Additionally, it serves as a quality control measure by validating initial protein identifications and providing data normalization for increased accuracy. The quantitative data are essential for hypothesis testing, and systems biology, and have clinical relevance in areas such as disease diagnosis, prognosis, and therapeutic decision-making. In summary, the quantitation workflow in proteomics is essential for understanding the complexities of protein expression and regulation, and it facilitates a wide range of biological and clinical applications.

In this current workflow, we perform Quantification using the MaxQuant tool. A GTN has been developed for this workflow.
https://training.galaxyproject.org/training-material/topics/proteomics/tutorials/clinical-mp-4-quantitation/tutorial.html

## Inputs dataset

- `RAW MSMS datasets` in RAW dataset collection 
- `Quantitation_Database_for_MaxQuant` in Fasta (protein sequences for database searching)
- `Experimental-Design Discovery MaxQuant` in Tabular Format 

## Inputs values

For MaxQuant 
- Peptide Length
- Variable modifications
- Labeled element


## Processing

- extract microbial proteins and peptides using Select and Cut
- Grouping duplicates using the Group tool
