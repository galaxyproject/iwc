# Metagenomic Community Profiling

This workflow performs taxonomic profiling on metagenomic short-read quality-controlled and host/contaminant removed data by running multiple profilers in parallel, standardizing their outputs and generating visualizations through interactive Krona plots and aggregated MultiQC reports.

## Inputs

### Reads

- **Metagenomic Reads after Quality Control and Host/Contamination Removal**: a paired collection (`list:paired`) of metagenomic short reads in `fastqsanger` or `fastqsanger.gz` format. Reads must already be quality controlled and cleaned from host/contaminant reads, for example with the IWC *Host or contamination removal on short reads* workflow. One list element is expected per sample; the element identifiers are used as sample names in all generated profiles and reports.

### Reference databases and parameters

All database inputs are text parameters. Their value is the identifier of a database installed on the Galaxy server, as listed in the corresponding tool form (the workflow form only offers the identifiers accepted by the connected tool). The values used in the workflow tests are given as examples.

- **Reference Taxonomy Database for Kraken2**: identifier of a Kraken2 database (e.g. `k2_minusb_20210517`). Kraken2 classifies each read against this database. The details of the content of the  pre-built RefSeq databases can be found in [Ben Langmead's AWS indexes](https://benlangmead.github.io/aws-indexes/k2).
- **Reference Taxonomy Database for Bracken**: identifier of a Bracken k-mer distribution (e.g. `k2_minusb_20210517`). It must have been built from the same Kraken2 database as above; otherwise, the Bracken abundance re-estimation is not valid. Bracken distributions are also built for a given read length, which should match the length of the input reads.
- **Taxonomic Level for Abundance Re-estimation for Bracken**: rank at which Bracken re-estimates abundances. One of `D` (domain), `P` (phylum), `C` (class), `O` (order), `F` (family), `G` (genus), `S` (species, default), `S1` (subspecies 1) or `S2` (subspecies 2).
- **Reference Taxonomy Database for MetaPhlAn**: identifier of a MetaPhlAn marker gene database (e.g. `mpa_vJan21_TOY_CHOCOPhlAnSGB_202103-23012026`). The test uses a toy database; for real analyses, a full CHOCOPhlAn SGB database should be used.
- **Reference Database for Sylph**: identifier of a Sylph genome sketch database (`.syldb`, e.g. `sylph_downloaded_12122025_OceanDNA-c200-v0.3.syldb`).
- **Reference Taxonomy Metadata for Sylph**: identifier of the sylph-tax taxonomy metadata (e.g. `sylph_tax_downloaded_08112025`). It links the genomes of the Sylph database to a taxonomy, so it must correspond to the selected Sylph database (e.g. GTDB metadata for a GTDB genome database).
- **NCBI Taxonomy for Kraken2/Bracken taxpasta** and **NCBI Taxonomy for MetaPhlAn taxpasta**: version of the NCBI taxonomy dump (e.g. `2024-06-05`) that taxpasta uses to add taxon names, ranks and lineages to the standardized profiles. Ideally, it should match the NCBI taxonomy version used to build the corresponding profiler database. The same value is usually given for both inputs.

## Workflow Overview

1. **Taxonomy Profiling** using

   - **Kraken2** (k-mer approach) with abundance re-estimation with **Bracken**
   - **MetaPhlAn** (marker-based approach)
   - **sylph** (k-mer approach)

2. **Standardization** of Kraken2/Bracken and MetaPhlAn outputs using **TaxPasta**

3. **Visualization** using
   - **Krona** to generate interactive, hierarchical plots for exploring taxonomy profiles.
   - **MultiQC** for aggregated HTML report for cross-sample and cross-tools comparisons

## Outputs

- Taxonomic profiles (Kraken2, Kraken2 + Bracken, MetaPhlAn, sylph)
- Standardized taxonomy tables (TaxPasta)
- Krona interactive plots
- MultiQC HTML report

## Comparison with similar workflows

- **Taxonomy Profiling and Visualisation with Krona** (`microbiome/pathogen-identification`): runs Kraken2 only, on preprocessed (Nanopore) reads, and visualizes the result with Krona. It is designed as a step of the foodborne pathogen detection workflows. Use it when a single, fast Kraken2 profile per sample is enough. Use this workflow when working with short reads and when you want to compare several profilers (k-mer and marker-based), obtain Bracken-corrected abundances, standardized tables that can be combined across samples, and a cross-sample, cross-tool MultiQC report.
- **Metagenomics Taxonomic and Antibiotic Resistance Gene (ARG) Profiling** (`microbiome/metagenomic-raw-reads-amr-analysis`): profiles taxonomy with Sylph only and focuses on antibiotic resistance gene prediction. Use it when ARG profiling is the main goal.
- **MAGs taxonomy annotation** (`microbiome/mags-taxonomy-annotation`): assigns taxonomy to assembled metagenome-assembled genomes, not to reads.
