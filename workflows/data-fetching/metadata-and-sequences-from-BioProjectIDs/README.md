# Metadata and Sequences from BioProject IDs

This workflow takes BioProject IDs as input and is able to retrieve SRA tables and FASTQ files from IDs using pysradb and SRA fetching.
The workflow may be very useful in Meta-analysis and reanalysis scenarios, giving the possibility to collect metadata and data from BioProject IDs of studies with the same design.

## Input

The workflow needs a single txt input file, without header, with the first column reporting one or more BioProject IDs as follows:

````
PRJNA1425250
PRJNA1417619
PRJNA1425251
PRJNA1417617
PRJNA1425252
PRJEB1417616
````

Other input options are booleans related to the *pysradb* tool functioning and can be explained as in its tool help:

- **assay (metadata download)**&emsp;&emsp;&emsp;&emsp;Include assay type in output
- **desc (metadata download)**&emsp;&emsp;&emsp;&emsp;Should sample_attribute be included
- **detailed (metadata download)**&emsp;&emsp;&emsp;&emsp;Display detailed metadata table
- **expand (metadata download)**&emsp;&emsp;&emsp;&emsp;Should sample_attribute be expanded


## Outputs

There are 3 main outputs:

- Data collection for SRA manifest of input BioProject ID(s)
- Data collection for Paired End FASTQ files
- Data collection for Single End FASTQ files