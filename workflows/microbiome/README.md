# Microbiome Workflows

The following workflows can be used directly for microbiome data analysis, pathogen detection and tracking purposes. The workflows can be also adapted to any other sequencing technique. 

To learn more about the following workflows and try them with real datasets, please check our tutorial on the Galaxy Training Network [GTN](https://training.galaxyproject.org/training-material/topics/metagenomics/tutorials/pathogen-detection-from-nanopore-foodborne-data/tutorial.html)

## Nanopore _Preprocessing_

Before starting any analysis, it is always a good idea to assess the quality of your input data and to discard poor quality base content by trimming and filtering reads.

Generally, we are not interested in the host sequences, rather only those originating from the pathogen itself. It is important to get rid of all host sequences and to only retain sequences that might include a pathogen, both in order to speed up further steps and to avoid host sequences compromising the analysis.

### Input Datasets

- Collection of sequenced Nanopore reads of all samples to be analized in a `fastq or fastq.gz` formate

### Output Datasets

- Collection of Pre-Processed Sequenced reads of all samples, ready for further analysis with the other workflows, in a `fastq or fastq.gz` formate

- Tables indicating total number of reads before and after host sequences trimming, and the host sequences percentages found in each sample, these tables are needed for visualistion performed in **PathoGFAIR Samples Aggregation and Visualisation** workflow.

## _Taxonomy Profiling_ and Visualisation with Krona

In this workflow, we identify the different organisms found in our samples by assigning taxonomy levels to the reads starting from the kingdom level down to the species level and visualise the result.

It’s important to check what might be the species of a possible pathogen to be found, it gets us closer to the investigation as well as discovering possible multiple pathogenetic infections if any existed.

For taxonomy profiling Kraken2 tool is used along with one of its standard databases available on Galaxy, you can freely choose between Kraken2 different databases based on your input datasets. For visualisation multiple tools can be used, Krona pie chart (as default in this workflow), Phinch interactive tool, Pavian, etc.

## _Gene-based Pathogen Identification_

With taxonomy profiling, we identified some bacterial species. But we want to be sure they are pathogenic, by looking for genes known to be linked to pathogenicity or to the pathogenecity character of the organim:

- Virulence Factor (VF): gene products, usually proteins, involved in pathogenicity. By identifiying them we can call a pathogen and its severity level

- Antimicrobial Resistance genes (AMR).

    These type of genes have three fundamental mechanisms of antimicrobial resistance that are enzymatic degradation of antibacterial drugs, alteration of bacterial proteins that are antimicrobial targets, and changes in membrane permeability to antibiotics, which will lead to not altering the target site and spread throughput the pathogenic bacteria decreasing the overall fitness of the host.

In this workflow we:

1. Perform genome assembly to get contigs, i.e. longer sequences, using metaflye (Kolmogorov et al. 2020) then assembly polishing using medaka consensus pipeline and visualizing the assembly graph using Bandage Image (Wick et al. 2015)
2. Generate reports with AMR genes and VF using ABRicate

As outputs, we get FASTA and Tabular files to track genes and visualise our pathogenic identification through out all samples in **PathoGFAIR Samples Aggregation and Visualisation** workflow.

## Nanopore _Allele-based Pathogen Identification_

Another approach to identifying pathogens is to use an allelic approach by detecting SNPs, i.e. markers showing evolutionary histories of homogeneous strains. This process includes SNP calling, aimed at identifying novel pathogen strains and elucidating discrepancies compared to reference sequences, thereby facilitating the tracking of emerging variants. Within this workflow, both variants and SNPs are discerned, serving as crucial elements for subsequent pathogen identification and variant tracking purposes.

## Pathogen Detection: _PathoGFAIR Samples Aggregation and Visualisation_

In this workflow, we will aggregate results and use the results from 3 workflows (**_Preprocessing_**, **_Gene-based Pathogen Identification_** and **_Allele-based Pathogen Identification_**) to help tracking pathogenes among samples and visualise all performed analysis by:

1. Drawing a presence-absence heatmap of the identified VF genes within all samples to visualize in which samples these genes can be found.
2. Drawing a phylogenetic tree for each pathogenic genes detected, where we will relate the contigs of the samples together where this gene is found.
3. Plotting QC reads, host reads, mapping coverage and depth, and SNP analysis.

With these types of visualisations we can have an overview of all samples and the genes, but also how samples are related to each other, which common pathogenic genes they share. Given the time of the sampling and the location one can easily identify using these graphs, where and when the contamination has occurred among the different samples.
