# Pathogen Tracking among all samples

In this workflow, we will aggregate results and use the results from **Gene based pathogenic identification** workflow to help tracking pathogenes among samples by:

1. Drawing a presence-absence heatmap of the identified Virulence Factor (VF) genes within all samples to visualize in which samples these genes can be found.
2. Drawing a phylogenetic tree for each pathogenic gene detected, where we will relate the contigs of the samples together where this gene is found. To check phylogenetic relations between different VF found genes in all samples

With these two types of visualizations we can have an overview of all samples and the genes, but also how samples are related to each other, which common pathogenic genes they share. Given the time of the sampling and the location one can easily identify using these graphs, where and when the contamination has occurred among the different samples.

The inputs to this workflow are the ABRicate tool output results from running the **Gene based pathogenic identification** workflow, where the tool runs using the Virulence Factor Database (VFDB) identifing all Virulence Factor (VF) genes present in all samples each presented by a tabular showing on which contigs and at which particular locations the genes are found and provides more details about these genes. The second input to the workflow are the contigs of the samples reads created by Metaflye tool also in the **Gene based pathogenic identification** workflow.

The output of the workflow are the Heatmap and Phylogenetic trees as explained above.
