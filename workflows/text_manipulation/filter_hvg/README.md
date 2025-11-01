# Filter a tabulare file with top variance features

You can use this workflow to keep the highly variable features in your data.
For example you have a matirx of RNA expression with 10000 genes and you want to keep n number of genes that have the most variance among youe samples.
This workflow will calculate the variance of each gene among the samples, then sorts the genes by the variance and cuts the selected n number of genes.

## Inputs dataset

The workflow need the following inputs:
- **The tabular file:**
    - A tabular file with first column the feature names and first row the sample names.
- **Number of top features:**
    - an integer parameter indicating the number of highly variable feature to return.

## Processing

- The workflow calculates the variance of each feature, sorts the table by the variance and the selects the top n features.

## Contribution

@nilchia wrote the workflow and the tests.