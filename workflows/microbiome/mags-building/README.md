## Metagenome-Assembled Genomes (MAGs) Generation

This workflow generates Metagenome-Assembled Genomes (MAGs) from paired short reads and optional long reads.
The use of long reads is only supported for assembly with **metaSPADES**.
Dereplicated MAGs for the complete input sample set are reported.

## Workflow Logic

The workflow supports assembly using **metaSPADES** and **MEGAHIT**.
For binning, it utilizes five different tools: **MetaBAT2, MaxBin2, SemiBin, COMEBin, and CONCOCT**. The resulting bins are then refined using **Binette**, the successor of metaWRAP.

## MAGs Annotation and Quality Control

After binning, the resulting MAGs are **dereplicated** across all input samples based on **CheckM2 quality metrics** using **dRep**. The following processing steps are then performed:

* **Quality Control** via QUAST and CheckM/CheckM2
* **Abundance Estimation** per sample with CoverM

In previous versions, genome annotation and taxonomic annotation were also performed. This can now be done with dedicated and more comprehensive IWC workflows if needed:

* [MAG Genome Annotation](https://iwc.galaxyproject.org/workflow/mag-genome-annotation-parallel-main)
* [MAGs Taxonomy Annotation](https://iwc.galaxyproject.org/workflow/mags-taxonomy-annotation-main)
* [Functional Annotation of Sequences](https://iwc.galaxyproject.org/workflow/functional-annotation-of-sequences-main)
* [AMR Gene Detection](https://iwc.galaxyproject.org/workflow/amr_gene_detection-main)

All results are consolidated into a single **MultiQC report**.

## Input Requirements

Input reads must be quality-filtered, with host reads removed.\nSee other MAG workflows in IWC for quality filtering and host removal.

**Short reads:**

* QC: [Short Read QC & Trimming](https://iwc.galaxyproject.org/workflow/short-read-qc-trimming-main)
* Host removal: [Host Contamination Removal (Short Reads)](https://iwc.galaxyproject.org/workflow/host-contamination-removal-short-reads-main)

**Long reads:**

* QC: [Nanopore Pre-processing](https://iwc.galaxyproject.org/workflow/nanopore-pre-processing-main)
* Host removal: [Host Contamination Removal (Long Reads)](https://iwc.galaxyproject.org/workflow/host-contamination-removal-long-reads-main)

**Workflow input:**

* **Trimmed reads**: Quality-trimmed reads from individual samples.
* **Trimmed reads from grouped samples**: These reads need to be grouped based on the desired MAGs generation approach. The tool [fastq_groupmerge](toolshed.g2.bx.psu.edu/repos/iuc/fastq_groupmerge/fastq_groupmerge/1.0.1+galaxy0) can be used to perform the grouping. Long reads and short reads must be grouped using the same logic.

* **Individual MAGs Generation**: Use the same input as `Trimmed Reads` to generate MAGs per sample.
* **Pooled MAGs Generation (Co-assembly/Binning)**: Merge all reads into one file for a fully pooled MAGs approach.
* **Grouped MAGs Generation (Co-assembly/Binning)**: Merge samples based on predefined groups.
* **Hybrid MAGs Generation**: Combine individual and grouped reads for a mixed approach.

**Note**: Merging reads can result in large input files, significantly increasing computational demands\u2014especially during assembly and binning, which may require substantial RAM. Our tests with synthetic samples up to **50 GB** showed feasible performance. For larger datasets, we recommend limiting the approach to **individual or pooled MAGs generation**.

## Optional Modifications

Some modifications can be made via the workflow editor for specific use cases:

* Compare binners/bin refinement: add CheckM/CheckM2 to each binner/refiner and compare completeness, contamination, and number of bins.
* Optionally use DAS Tool instead of Binette (our benchmark showed that Binette produces better MAGs on average).
* Downstream: compare differential abundance of MAGs in your samples based on metadata using Maaslin2.
* Downstream: compare your MAGs to a catalogue of MAGs for similar samples. Download desired MAGs from [MGnify genomes](https://www.ebi.ac.uk/metagenomics/browse/genomes) and query your MAGs via the [MGnify API](https://www.ebi.ac.uk/metagenomics/browse/genomes?browse-by=mag-search); download the genomes and compare in Galaxy, e.g., using dRep.