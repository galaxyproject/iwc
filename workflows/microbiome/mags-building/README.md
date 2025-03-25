# Metagenome-Assembled Genomes (MAGs) Generation  

This workflow generates Metagenome-Assembled Genomes (MAGs) from paired short reads.  

## Workflow Logic  

The workflow supports assembly using **metaSPADES** and **MEGAHIT**.  
For binning, it utilizes four different tools: **MetaBAT2, MaxBin2, SemiBin, and CONCOCT**. The resulting bins are then refined using **Binette**, the successor of metaWRAP.  

## MAGs Annotation and Quality Control  

After binning, the resulting MAGs are **dereplicated** across all input samples based on **CheckM2 quality metrics**. The following processing steps are then performed:  

- **Annotation** with Bakta  
- **Taxonomic Assignment** using GTDB-Tk  
- **Quality Control** via QUAST and CheckM/CheckM2  
- **Abundance Estimation** per sample with CoverM  

All results are consolidated into a single **MultiQC report** for easy analysis.  

## Input Requirements  

- **Quality-Controlled Reads**: Input reads must be quality-filtered, with host reads removed.  
- **Trimmed Sample Paired Reads**: Quality-trimmed reads from individual samples, used solely for abundance estimation.  
- **Trimmed Grouped Paired Reads**: These can be grouped based on the desired MAGs generation approach:  
  - **Individual MAGs Generation**: Use the same input as `Trimmed Sample Paired Reads` to generate MAGs per sample.  
  - **Pooled MAGs Generation (Co-assembly/Binning)**: Merge all sample reads for a fully pooled MAGs approach.  
  - **Grouped MAGs Generation (Co-assembly/Binning)**: Merge samples based on predefined groups.  
  - **Hybrid MAGs Generation**: Combine individual and grouped reads for a mixed approach.  

> **Note**: Merging reads can result in large input files, significantly increasing computational demands—especially during assembly and binning, which may require substantial RAM. Our tests with synthetic samples up to **50 GB** showed feasible performance. For larger datasets, we recommend limiting the approach to **individual or pooled MAGs generation**.  

