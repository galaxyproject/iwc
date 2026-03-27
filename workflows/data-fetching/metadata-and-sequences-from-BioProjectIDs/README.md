# Metadata and Sequences from BioProjectIDs

This workflow takes BioProject IDs as input and is able to retrieve SRA tables and FASTQ files from IDs using pysradb and SRA fetching.
The workflow may be very useful in Meta-analysis and reanalysis scenarios, giving the possibility to collect metadata and data from BioProject IDs of studies with the same design.

## Input

The workflow needs a single tabular input dataset (uploaded as txt file as well), without header, with the first column reporting one or more BioProject IDs.


## Outputs

There are 3 main outputs:

- Data collection for SRA manifest of input BioProject ID(s)
- Data collection for Paired End FASTQ files
- Data collection for Single End FASTQ files