# MGnify's amplicon (v5.0) rRNA-prediction subworkflow

Classification and visualization of rRNA sequences based on SSUs and LSUs.

## Input datasets

- **Processed sequences** Post quality control
- **Clan information file** This file lists which models belong to the same clan `wget ftp://ftp.ebi.ac.uk/pub/databases/metagenomics/pipeline-5.0/ref-dbs/rfam_models/ribosomal_models/ribo.claninfo`
- **Covariance models** `wget ftp://ftp.ebi.ac.uk/pub/databases/metagenomics/pipeline-5.0/ref-dbs/rfam_models/ribosomal_models/ribo.cm`

## Processing

This subworkflow executes the following classification and visualization steps:

- **cmsearch** Searches covariance models against a sequence database
- **CMsearch-deoverlap** Removes lower scoring overlaps from cmsearch output files
- **bedtools getfasta**  Extracts sequences from a FASTA file
- **MAPseq** Sequence read classification
- **biom-convert** Converts OTU tables to HDF5 and JSON formats
- **Krona** Generates pie charts out of the OTU tables