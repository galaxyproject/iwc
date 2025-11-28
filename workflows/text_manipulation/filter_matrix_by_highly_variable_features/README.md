# Filter a tabular file with top variance features

You can use this workflow to keep the highly variable features in your data.
For example you have a matrix of RNA expression with 10000 genes and you want to keep n number of genes that have the most variance among your samples.
This workflow will calculate the variance of each gene among the samples, then sorts the genes by the variance and cuts the selected n number of genes.

## Inputs dataset

The workflow need the following inputs:
- **The tabular file:**
    - A tabular file with first column the feature names and first row the sample names.
    - For example:

    |gene	|Sample1|Sample2|Sample3|
    |-------|-------|-------|-------|
    |gene1	|8.99	|9.34	|9.79   |
    |gene2	|5.94	|6.45	|6.08   |
    |gene3	|6.38	|5.67	|6.53   |
    |gene4	|9.63	|8.80	|6.85   |

- **Number of top features:**
    - an integer parameter indicating the number of highly variable feature to return.

## Processing

- The workflow calculates the variance of each feature, sorts the table by the variance and the selects the top n features.
- For example from the matrix above we want to have the expression matrix of top 2 highly variable genes:
    - Calculate variance per row:

    |gene	|Sample1|Sample2|Sample3|variance|
    |-------|-------|-------|-------|--------|
    |gene1	|8.99	|9.34	|9.79   |0.161   |
    |gene2	|5.94	|6.45	|6.08   |0.069   |
    |gene3	|6.38	|5.67	|6.53   |0.211   |
    |gene4	|9.63	|8.80	|6.85   |2.037   |

    - Sort by variance:

    |gene	|Sample1|Sample2|Sample3|variance|
    |-------|-------|-------|-------|--------|
    |gene4	|9.63	|8.80	|6.85   |2.037   |
    |gene3	|6.38	|5.67	|6.53   |0.211   |
    |gene1	|8.99	|9.34	|9.79   |0.161   |
    |gene2	|5.94	|6.45	|6.08   |0.069   |

    - Return top 2 highly variable genes:

    |gene	|Sample1|Sample2|Sample3|
    |-------|-------|-------|-------|
    |gene4	|9.63	|8.80	|6.85   |
    |gene3	|6.38	|5.67	|6.53   |

## Contribution

@nilchia wrote the workflow and the tests.