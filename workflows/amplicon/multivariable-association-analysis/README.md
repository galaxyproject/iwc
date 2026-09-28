# Multivariable Association Analysis of Amplicon Data

This workflow performs downstream processing and multivariable association
analysis of amplicon sequencing data starting from an ASV/OTU phyloseq object.

It includes sequencing-control assessment, contaminant identification and
removal, batch-effect correction, taxonomic aggregation, and multivariable
association analysis using MaAsLin3.

## Relationship to other IWC amplicon workflows
This workflow is intended for downstream analysis of processed amplicon data.

Amplicon reads can first be processed using tools such as Lotus2 or using workflows
such as DADA2 to generate a phyloseq object containing ASV/OTU
abundance table, taxonomy information, and sample metadata.
