# MAGs Taxonomy Annotation

This workflow generates taxonomic annotations for MAGs using GTDB-Tk and kMetaShot. With the integration of additional tools, MAGs also receive corresponding taxonomic classifications from NCBI.

This workflow is part of a **suite of workflows for end-to-end metagenome-assembled genome (MAG) generation**. See the [FAIRyMAGs repository](https://github.com/usegalaxy-eu/FAIRyMAGs) for the complete workflow suite and its capabilities.
A dedicated [learning pathway](https://galaxyproject.github.io/training-material/learning-pathways/mags.html) provides detailed guidance on how to use this workflow.

## Workflow logic
The workflow first runs GTDB-Tk and kMetaShot (optional) to generate a summary file. From this file, it extracts the GTDB lineage for each MAG and reformats it so that the GTDB–NCBI mapping tool can translate GTDB names into their corresponding NCBI names. These NCBI names are then passed to another tool, which resolves them into the corresponding NCBI taxIDs.

In parallel, an additional text-processing step extracts the taxonomic rank from the GTDB-Tk annotation. Finally, all collected information is merged into a single file with the following five columns:

- BinID
- GTDB name
- Taxonomic rank
- NCBI name
- NCBI taxID

## Input
This workflow takes a dataset collection (a Galaxy collection of type list) containing MAGs produced by binners (e.g. MetaBAT2, dRep) in FASTA format.

## Output
This workflow produces the following main outputs: 

- GTDB-Tk summary file(s)
- kMetaSHot summary file (optional)
- GTDB–NCBI mapping file(s)
- NCBI name-to-taxID mapping file(s)
- A complete merged table containing all mappings
- MultiQC HTML report with GTDB-Tk and the full mapping table as input as well as kMetaShot if run

## Funding

This workflow was developed as part of the [**FAIRyMAGs** project](https://elixir-europe.org/how-we-work/scientific-programme/science/bfsp/fairymags), funded as a commissioned service of the [**Biodiversity, Food Security and Pathogens (BFSP) ELIXIR Scientific Programme 2024–2028**](https://elixir-europe.org/how-we-work/scientific-programme/science/bfsp).

The project was also supported by the **European Galaxy Server**, funded by the German Federal Ministry of Education and Research (BMBF; 031 A538A de.NBI-RBC) and the **Ministry of Science, Research and the Arts Baden-Württemberg (MWK)** within the framework of **LIBIS/de.NBI Freiburg**.

## Talks and Posters

* **ELIXIR All Hands Meeting 2025:** [Slides](https://f1000research.com/slides/14-595)
* **Galaxy Community Conference 2026 (GCC2026):** [Poster and Talk](https://zenodo.org/records/21128145)
* **HAL 2026:** [Publication](https://hal.science/hal-05724928)
* **FAIRyMAGs - a series of FAIR Galaxy workflows for the generation of metagenome assembled genomes** [Preprint](https://doi.org/10.64898/2026.07.31.741430)