# Microbiome Analysis workflows for Nanopore datasets

The following workflows can be used directly for any nanopore metagenomics data analysis, pathogen detection and tracking purposes. The workflows can be also adapted to any other sequencing technique.

## Pre-Processing

Before starting any analysis, it is always a good idea to assess the quality of your input data and to discard poor quality base content by trimming and filtering reads.

Generally, we are not interested in the host sequences, rather only those originating from the pathogen itself. It is an important to get rid of all host sequences and to only retain sequences that might include a pathogen, both in order to speed up further steps and to avoid host sequences compromising the analysis.

### Input datasets

- Sequenced Nanopore reads of the sample to be analized in a `fastq or fastq.gz` formate

### Output datasets

- Pre-Processed Sequenced reads ready for the coming analysis with the following workflows in a `fastq or fastq.gz` formate

## Taxonomy Profiling

In this workflow, we identify the different organisms found in our samples by assigning taxonomy levels to the reads starting from the kingdom level down to the species level and visualize the result. It’s important to check what might be the species of a possible pathogen to be found, it gets us closer to the investigation as well as discovering possible multiple pathogenetic infections if any existed.

## Gene based pathogenic identification

With taxonomy profiling, we identified some bacterial species. But we want to be sure they are pathogenic, by looking for genes known to be linked to pathogenicity or to the pathogenecity character of the organim:

- Virulence Factor (VF): gene products, usually proteins, involved in pathogenicity. By identifiying them we can call a pathogen and its severity level

- Antimicrobial Resistance genes (AMR).

    These type of genes have three fundamental mechanisms of antimicrobial resistance that are enzymatic degradation of antibacterial drugs, alteration of bacterial proteins that are antimicrobial targets, and changes in membrane permeability to antibiotics, which will lead to not altering the target site and spread throughput the pathogenic bacteria decreasing the overall fitness of the host.

To look for these genes and determine the strain of the bacteria we are testing for pathogenicity we use Multilocus Sequence Typing approach and dedicated pubMLST datases database:

1. Genome assembly to get contigs, i.e. longer sequences, using metaflye (Kolmogorov et al. 2020) then assembly polishing using medaka consensus pipeline and visualizing the assembly graph using Bandage Image (Wick et al. 2015)
2. Generate an MLST report with MLST tool that scans genomes against PubMLST schemes
3. Generate reports with AMR genes and VF using ABRicate

As outputs, we will get our FASTA and Tabular files to track genes and visualize our pathogenic identification.

## SNP based pathogenic identification

Now we would like to identify pathogens with a third approach based on variant and single nucleotide polymorphisms (SNPs) calling: comparison of reads to a targeted reference genome, and call the differences between sample reads and reference genomes to identify variants.

For example, if we want to check whether our samples include Campylobacter pathogenic strains or not, we will map our samples against the reference genome of the Campylobacter species. Variants in specific positions on the genome are queried to judge if these variations would indicate a pathogen or not.

This approach also allows identification of novel alleles and possible new variants of the pathogen.

Using this approach, we also build the consensus genome of each sample, so we can later build a phylogenetic tree of all samples’ full genomes and have an insight into events that occurred during the evolution of same or different species in the samples.

In this training, we are testing Salmonella enterica, with different strains of which our samples were spiked. So we will now upload to our history the reference genome of S. enterica we originally obtained from the National Center for Biotechnology Information (NCBI) database.


## Pathogen Tracking among all samples

In this workflow, we will aggregate results and use the results from **Gene based pathogenic identification** workflow to help tracking pathogenes among samples by:

1. Drawing a presence-absence heatmap of the identified VF genes within all samples to visualize in which samples these genes can be found.
2. Drawing a phylogenetic tree for each pathogenic gene detected, where we will relate the contigs of the samples together where this gene is found.

With these two types of visualizations we can have an overview of all samples and the genes, but also how samples are related to each other, which common pathogenic genes they share. Given the time of the sampling and the location one can easily identify using these graphs, where and when the contamination has occurred among the different samples.
