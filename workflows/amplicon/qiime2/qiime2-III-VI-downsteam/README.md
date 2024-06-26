# QIIME2 workflows

## Available workflows

- III-V Downstream analyses: III) reconstruct a taxonomy for diversity analysis, IV) rarefaction analysis, V) taxonomic analysis.
- VI: Computation of diversity metrics and estimations

Analogous to the procedures described in the Parkinson’s Mouse Tutorial: https://docs.qiime2.org/2024.5/tutorials/pd-mice/

## Inputs

The two workflows have two inputs in common 

- Feature table: Count data
- Metadata: Metadata table

and the following extra inputs

III-V

- Representative sequences: Representative (ASV) sequences
- Minimum depth: Lower limit of the sampling depth for the alpha rarefaction analysis
- Maximum depth: Upper limit of the sampling depth for the alpha rarefaction analysis
- SEPP fragment insertion reference: used for the reconstruction of the phylogenetic tree
- Taxonomic classifier: The classifier to assign taxonomic information to the ASVs

VI:

Sampling depth: For the metric calculation (should be based on the rarefaction analysis done in IV)
Target metadata parameter: that should be used for beta diversity calculations
Rooted Tree: for instance the tree computed in III

## Processing

III-V

- Phylogenetic tree generation using `qiime2 fragment-insertion sepp`
- Alpha rarefaction analysis using `qiime2 diversity alpha-rarefaction`
- Taxonomic classification using `qiime2 feature-classifier classify-sklearn` and compute barplot and tabular output

VI: 

- compute alpha and beta diversity metrics using `qiime2 diversity core-metrics-phylogenetic`
- organize these metrics in 4 collections:
  1. Distance matrix collection (weighted and unweighted unifrac, jaccard and bray curtis)
  2. PCoA collection (same as the distance matrices)
  3. Emperor plot collection (same as the distance matrices)
  4. Richness and evenness collection (rarefied table, faith pd vector observed features vector, shannon vector, evenness vector)
- get visualization for alpha diversity:
  - Pielou's eveness
  - Observed features
  - Shannons diversity index
- get visualization for beta diversity
  - Jaccard distance matrix
  - Bray curtis distance matrix
  - Unifrac distance metrix 

## Outputs

III-V:

- Phylogenetic tree
- Rarefaction curve
- Taxonomic classification (as qza, barplot and table)

VI:

- Four collections containing: distance matrix, PCoA, Emperor plots, Richness and evenness
- Visualization for alpha diversity: Pielou's eveness, Observed features, Shannons diversity index
- Visualization for beta diversity: Jaccard, Bray curtis, Unifrac