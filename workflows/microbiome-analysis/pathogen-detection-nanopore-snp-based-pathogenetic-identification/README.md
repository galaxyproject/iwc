# SNP based pathogenic identification

Now we would like to identify pathogens with another approach based on variant and single nucleotide polymorphisms (SNPs) calling: comparison of reads to a targeted reference genome, and call the differences between sample reads and reference genomes to identify variants.

For example, if we want to check whether our samples include Campylobacter pathogenic strains or not, we will map our samples against the reference genome of the Campylobacter species. Variants in specific positions on the genome are queried to judge if these variations would indicate a pathogen or not.

This approach also allows identification of novel alleles and possible new variants of the pathogen.

Using this approach, we also build the consensus genome of each sample, so we can later build a phylogenetic tree of all samples’ full genomes and have an insight into events that occurred during the evolution of same or different species in the samples.

In this training, we are testing Salmonella enterica, with different strains of which our samples were spiked. So we will now upload to our history the reference genome of S. enterica we originally obtained from the National Center for Biotechnology Information (NCBI) database.
