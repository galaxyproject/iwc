# Metagenome-Assembled Genomes (MAGs) Generation  

This workflow generates Metagenome-Assembled Genomes (MAGs) from paired short reads.  
Dereplicated MAGs for the complete input sample set are reported.

## Workflow Logic  

The workflow supports assembly using **metaSPADES** and **MEGAHIT**.  
For binning, it utilizes four different tools: **MetaBAT2, MaxBin2, SemiBin, and CONCOCT**. The resulting bins are then refined using **Binette**, the successor of metaWRAP.  

## MAGs Annotation and Quality Control  

After binning, the resulting MAGs are **dereplicated** across all input samples based on **CheckM2 quality metrics** using **dRep**. The following processing steps are then performed:  

- **Annotation** with Bakta  
- **Taxonomic Assignment** using GTDB-Tk  
- **Quality Control** via QUAST and CheckM/CheckM2  
- **Abundance Estimation** per sample with CoverM  

All results are consolidated into a single **MultiQC report** for easy analysis.  

## Input Requirements  

Input reads must be quality-filtered, with host reads removed. 
See other MAGs workflows in IWC for quality filtering and host removal.

- **Trimmed reads**: Quality-trimmed reads from individual samples.
- **Trimmed reads from grouped samples**: These reads need to be grouped based on the desired MAGs generation approach. The tool [fastq_groupmerge](toolshed.g2.bx.psu.edu/repos/iuc/fastq_groupmerge/fastq_groupmerge/1.0.1+galaxy0) can be used to perform the grouping.  
  - **Individual MAGs Generation**: Use the same input as `Trimmed Reads` to generate MAGs per sample.  
  - **Pooled MAGs Generation (Co-assembly/Binning)**: Merge all reads input one file for a fully pooled MAGs approach.  
  - **Grouped MAGs Generation (Co-assembly/Binning)**: Merge samples based on predefined groups.  
  - **Hybrid MAGs Generation**: Combine individual and grouped reads for a mixed approach.  

> **Note**: Merging reads can result in large input files, significantly increasing computational demands—especially during assembly and binning, which may require substantial RAM. Our tests with synthetic samples up to **50 GB** showed feasible performance. For larger datasets, we recommend limiting the approach to **individual or pooled MAGs generation**.  

## Optional modifications

Some modifications that can be done via the workflow editor for specific use cases:
- Compare binners / bin refinement: add checkM/M2 to each binner / refiner and compare completeness, contamination, n. of bins.
- Optionally use DAS tool instead of Binette (our benchmark showed that Binette produce better MAGs on average).
- Add annotation for Bakta (currently Bakta only reports rRNAs to save resources), other annotations can be selected in the Bakta options.
- Downstream: compare differential abundance of MAGs in your samples based on metadata using maaslin2.
- Downstream: compare your MAGs to a catalogue of MAGs for similar samples. Download desired MAGs e.g. from [MGnify genomes](https://www.ebi.ac.uk/metagenomics/browse/genomes) you can query your MAGs via the [MGnify API](https://www.ebi.ac.uk/metagenomics/browse/genomes?browse-by=mag-search); download the Genomes and compare in Galaxy e.g. using dREP.