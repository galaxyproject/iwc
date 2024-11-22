# Clinical Metaproteomics 3: Verification
This workflow uses the PepQuery tool to verify peptides discovered with the clinical metaproteomics discovery workflow.
The PepQuery tool outputs verified peptides that can be used to generate a verified protein database that can be used for the clinical metaproteomics quantitation workflow.

More background on this workflow can be found in the [Clinical Metaproteomics 3: Verification tutorial](https://training.galaxyproject.org/training-material/topics/proteomics/tutorials/clinical-mp-3-verification/tutorial.html)

## Inputs datasets

### Tabular Input Files
- SGPS peptide report
- MaxQuant Peptide report
- Distinct Peptides for PepQuery

### Search Databases (FASTA)
- Uniprot HUMAN database
- cRAP

### MSMS files
The tandem MS/MS files can be downloaded via Zenodo. These MS/MS input files are pilot datasets from Papanicolaou test samples from healthy, benign and ovarian cancer patients. 

## Input Values
For PepQuery:
- Search Tolerances
- Digestion Enzyme
- Peptide Length
- Modifications

## Processing
Extract protein sequences for the verified peptides.
