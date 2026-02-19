# Metagenomic Community Profiling

This workflow performs taxonomic profiling on metagenomic short-read quality-controlled and host/contaminant removed data using multiple state-of-the-art tools, standardizes the generated outputs, and generates visualizations.

## Inputs

- Paired collection of **FastQ files** containing **metagenomic short-read data** after quality control and host/contamination removal
- **Reference databases** for the different taxonomy profiling tools

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
