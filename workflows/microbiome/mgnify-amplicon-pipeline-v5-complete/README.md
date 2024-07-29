# MGnify's amplicon pipeline (v5.0)

## Input datasets

- **SRA accession list** a File listing the SRA accession IDs
- **Clan information file** This file lists which models belong to the same clan `wget ftp://ftp.ebi.ac.uk/pub/databases/metagenomics/pipeline-5.0/ref-dbs/rfam_models/ribosomal_models/ribo.claninfo`
- **Covariance models** `wget ftp://ftp.ebi.ac.uk/pub/databases/metagenomics/pipeline-5.0/ref-dbs/rfam_models/ribosomal_models/ribo.cm`

## Processing

This pipeline executes the following subworkflows:

- **Quality control - single-end**
- **Quality control - paired-end**
- **rRNA-prediction** Classification and visualization of rRNA sequences based on SSUs and LSUs
- **ITS** Classification and visualization of rRNA sequences based on ITS
- **Summery tables** Generates taxonomic abundance summary tables