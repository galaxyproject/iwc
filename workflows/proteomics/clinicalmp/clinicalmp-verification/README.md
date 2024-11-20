# Clinical Metaproteomics 3: Verification
In proteomics research, verifying detected peptides is an essential step for reporting accurate peptide detections. This tutorial continues from the clinical metaproteomics discovery workflow, focusing on verifying identified microbial peptides using the PepQuery tool. The PepQuery tool provides an output of verified peptides that can be used to generate a verified protein database that can be used for the next Quantitation workflow.
[https://training.galaxyproject.org/training-material/topics/proteomics/tutorials/clinical-mp-3-verification/tutorial.html](https://training.galaxyproject.org/training-material/topics/proteomics/tutorials/clinical-mp-3-verification/tutorial.html)

## Inputs datasets

### Tabular Input Files
- SGPS peptide report
- MaxQuant Peptide report
- Distinct Peptides for PepQuery

### Search Databases (FASTA)
- Uniprot HUMAN database
- cRAP

### MSMS files
The MGF files can be accessed via Zenodo.
- `PTRC_Skubitz_Plex2_F10_9Aug19_Rage_Rep-19-06-08.mgf`
- `PTRC_Skubitz_Plex2_F11_9Aug19_Rage_Rep-19-06-08.mgf`
- `PTRC_Skubitz_Plex2_F13_9Aug19_Rage_Rep-19-06-08.mgf`
- `PTRC_Skubitz_Plex2_F15_9Aug19_Rage_Rep-19-06-08.mgf`

## Input Values
For PepQuery:
- Search Tolerances
- Digestion Enzyme
- Peptide Length
- Modifications

## Processing
Extract protein sequences for the verified peptides.
