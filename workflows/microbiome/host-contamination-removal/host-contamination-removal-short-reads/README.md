# Host or Contamination removal on short-reads

The extraction of microbiome DNA or RNA is usually contaminated by host and human DNA or RNA (but also other contaminant). It is an important to get rid of all host/contamination sequences and to only retain microbiome sequences, both in order to speed up further steps and to avoid host/contamination sequences compromising the analysis.

This workflow can be used on its own or integrated into other workflows. For example, it is part of a **suite of workflows for end-to-end metagenome-assembled genome (MAG) generation** (check [FAIRyMAGs repository](https://github.com/usegalaxy-eu/FAIRyMAGs) for the complete workflow suite and its capabilities).

This workflow takes paired-end Illumina fastq(.gz) files and removes reads from the host or contaminant (e.g. human) with one of three methods, chosen with the **Host removal tool** input:

- **Bowtie2** (default): reads are mapped against the reference genome with **Bowtie 2** and only read pairs that do not align are kept.
- **Deacon**: reads are depleted with **Deacon**, which discards read pairs sharing enough minimizers with the reference index. This is much faster than alignment and, with the `panhuman-1` index, covers human genetic diversity beyond a single reference genome.
- **Deacon then Bowtie2**: Deacon is run first and the remaining reads are mapped with Bowtie 2, for the most complete removal.

For both tools, the reference can be a built-in index or a reference genome (FASTA) from the history. For Deacon, an index is then built from the FASTA with **Deacon index build**.

The Bowtie2 mapping reports are aggregated with **MultiQC**.

## Input Datasets

- A list of paired datasets corresponding to paired-end reads in `fastqsanger` or `fastqsanger.gz` format.
- Host removal tool: `Bowtie2`, `Deacon` or `Deacon then Bowtie2`
- Choose Reference Genome: built-in indexes or a reference genome FASTA from the history
- Built-in Bowtie2 index and built-in Deacon index (e.g. `panhuman-1`): both inputs must be set, but only the index(es) of the selected tool are used
- Reference genome FASTA from the history (optional): used, if selected, by Bowtie2 and to build the Deacon index

## Output Datasets

- `Reads without Host or Contamination`: a list of paired datasets corresponding to paired-end reads without the host or contaminant reads, in `fastqsanger` or `fastqsanger.gz`, whatever the selected tool.
- The Bowtie2 outputs of previous versions (`Contamination Filtered Reads from Local Index` / `from Reference Input`) are kept for compatibility.
- Bowtie2 mapping statistics for each sample, which can be used as inputs for extra MultiQC (Bowtie2 runs only)
- MultiQC report of the mapping statistics in HTML (Bowtie2 runs only)
- `Deacon Summary`: Deacon `JSON` summary for each sample (Deacon runs only)

## When to use this workflow

Use this workflow for **short-read paired-end Illumina sequencing data**. For long-read data (Nanopore, PacBio), see the [Host or Contamination removal on long-reads](../host-contamination-removal-long-reads/) workflow.

## Funding

This workflow was developed as part of the [**FAIRyMAGs** project](https://elixir-europe.org/how-we-work/scientific-programme/science/bfsp/fairymags), funded as a commissioned service of the [**Biodiversity, Food Security and Pathogens (BFSP) ELIXIR Scientific Programme 2024–2028**](https://elixir-europe.org/how-we-work/scientific-programme/science/bfsp).

The project was also supported by the **European Galaxy Server**, funded by the German Federal Ministry of Education and Research (BMBF; 031 A538A de.NBI-RBC) and the **Ministry of Science, Research and the Arts Baden-Württemberg (MWK)** within the framework of **LIBIS/de.NBI Freiburg**.
