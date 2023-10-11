# BaredSC Workflows

These workflows allow to run a baredSC analysis in a single click. It uses models from 1 to N Gaussians and combine them.

## Inputs dataset

- Both workflows need a tabular dataset where each row is a cell. The tabular needs to have a header line with column names. There must be at least two columns: 'nCount_RNA' and another one with the counts for the gene(s) of interest.

## Inputs values

For the 1D:

- Gene name: The name of the column with the counts of your gene of interest.
- Maximum value in logNorm: The maximum value to explore in PDF. This value should be large enough so the PDF is at 0 at this value.
- Maximum number of Gaussians to study: All models between models with 1 Gaussians to models with this number of Gaussians.

For the 2D:


## Processing

- The workflow will generate paramater values from 1 to the maximum number of Gaussians to study.
- baredSC_1d is run for each of these number of Gaussians
- All models are combined into a single result.
