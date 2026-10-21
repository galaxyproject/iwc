# Short-read quality control and trimming

Before starting any analysis, it is always a good idea to assess the quality of the input data and to discard poor-quality base content by trimming and filtering reads.

This workflow can be used on its own or integrated into other workflows. For example, it is part of a **suite of workflows for end-to-end metagenome-assembled genome (MAG) generation** (check [FAIRyMAGs repository](https://github.com/usegalaxy-eu/FAIRyMAGs) for the complete workflow suite and its capabilities).
A dedicated [learning pathway](https://galaxyproject.github.io/training-material/learning-pathways/mags.html) provides detailed guidance on how to use this workflow.

This workflow takes paired-end Illumina (**short-reads**) fastq(.gz) files and executes the following steps:
1. Quality control and trimming using **fastp**
2. Aggregation of the quality control reports using **MultiQC**

## Input Datasets

- A list of paired datasets corresponding to paired-end raw reads in `fastqsanger` or `fastqsanger.gz` format.
- Qualified quality score: The quality value that a base is qualified to have.
- Minimal read length: Reads shorter than this value will be discarded.
- [Optional] Adapter to remove on forward reads and reverse reads

## Output Datasets

- A list of paired datasets corresponding to paired-end **trimmed** reads in `fastqsanger` or `fastqsanger.gz`, ready for further analysis.
- List of `JSON` reports of fastp for each sample that could be used as inputs for extra MultiQC
- MultiQC report in HTML

## Funding

This workflow was developed as part of the [**FAIRyMAGs** project](https://elixir-europe.org/how-we-work/scientific-programme/science/bfsp/fairymags), funded as a commissioned service of the [**Biodiversity, Food Security and Pathogens (BFSP) ELIXIR Scientific Programme 2024–2028**](https://elixir-europe.org/how-we-work/scientific-programme/science/bfsp).

The project was also supported by the **European Galaxy Server**, funded by the German Federal Ministry of Education and Research (BMBF; 031 A538A de.NBI-RBC) and the **Ministry of Science, Research and the Arts Baden-Württemberg (MWK)** within the framework of **LIBIS/de.NBI Freiburg**.
