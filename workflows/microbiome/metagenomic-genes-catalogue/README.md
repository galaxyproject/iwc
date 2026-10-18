# Genes catalogue generation from metagenomic reads

This workflow generates genes catalogue from paired short reads.

The workflow supports assembly using **MEGAHIT** and assembly quality control via **QUAST**.

## Genes catalogue Annotation and Quality Control

After assembly, CDS are detected from resulting contigs with **Prodigal** 

Then, depending on your choice of Boolean, this will lead to two different analyses :

If the **Boolean is True** for the complete genes catalog:

All the potential genes are clustered with **MMseqs2linclust**

The following processing steps are then performed on the full clustered genes catalogue :

- **Genes annotation** with Eggnog-mapper
- **Taxonomic Assignment** using MMseqs2taxonomy
- **Abundance Estimation** per sample with CoverM
- **AMR detection** with ABRicate, AMRFinderPlus and starAMR

If the **Boolean is False** for the complete genes catalog, a specific focus is placed on the functions and taxonomies associated with contigs on which an antibiotic resistance gene is detected.

This will initiate the construction of a genes catalogue specific to **antibiotic resistance genes (ARGs)**.

1. **AMR detection** with ABRicate, AMRFinderPlus and starAMR is performed on CDS predicted with **Prodigal.**
2. **Taxonomic and functional annotation** will be performed on CDSs present on the same contig as the ARGs catalogue.
3. **Clustering** is then performed on the detected ARGs, followed by **coverage** of this clustered ARGs catalog with the sample reads.

## Input Requirements

Input reads must be quality-filtered, with host reads removed.

- **Trimmed reads**: Quality-trimmed reads from individual samples, used solely for abundance estimation.
