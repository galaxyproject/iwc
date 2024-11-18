# Clinical Metaproteomics 1: Database Generation
Metaproteomics involves the large-scale identification and analysis of all proteins expressed by microbiota. However, analyzing clinical samples using metaproteomics is complicated by the presence of abundant human (host) proteins, which can obscure the detection of less abundant microbial proteins.

To overcome this challenge, we developed a metaproteomics workflow using tandem mass spectrometry (MS/MS) and bioinformatics tools on the Galaxy platform. This workflow enables the characterization of metaproteomes in clinical samples.

The first step in this workflow is the Database Generation process. The Galaxy-P team has created a workflow that compiles a large database by downloading protein sequences of known disease-causing microorganisms. From this extensive database, a compact, relevant database is then created using the Metanovo tool.
A GTN has been developed for this workflow. [https://training.galaxyproject.org/training-material/topics/proteomics/tutorials/clinical-mp-4-quantitation/tutorial.html](https://training.galaxyproject.org/training-material/topics/proteomics/tutorials/clinical-mp-1-database-generation/tutorial.html)

## Inputs dataset

### Search Databases (FASTA)
- `HUMAN_SwissProt_Protein_Database.fasta`
- `Species_UniProt_FASTA.fasta`
- `Contaminants_(cRAP)_Protein_Database.fasta`
### MSMS files
- `PTRC_Skubitz_Plex2_F10_9Aug19_Rage_Rep-19-06-08.mgf`
- `PTRC_Skubitz_Plex2_F11_9Aug19_Rage_Rep-19-06-08.mgf`
- `PTRC_Skubitz_Plex2_F13_9Aug19_Rage_Rep-19-06-08.mgf`
- `PTRC_Skubitz_Plex2_F15_9Aug19_Rage_Rep-19-06-08.mgf`

## Input Values
For Metanovo 
- Peptide Length
- Variable modifications
- Labeled element

## Processing
- Merge all the resultant FASTA files
