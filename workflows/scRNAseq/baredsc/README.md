# Single-Cell Mixture Analysis: baredSC Log-Normalized Models

These workflows allow to run a baredSC analysis from a table with counts in a single click. It uses models from 1 to N Gaussians and combine them. It uses the logNorm scale, 100 bins for 1 dimension and 25 bins on each axis in 2 dimensions.

## Inputs dataset

- Both workflows need a tabular dataset where each row is a cell. The tabular needs to have a header line with column names. There must be at least two columns: 'nCount_RNA' and another one with the counts for the gene(s) of interest. A way to get such table in R from a Seurat object (`seurat.obj`) is:

```r
my.genes <- c("Hoxa13", "Hoxd13")
df <- cbind(seurat.obj[[]], # This will give you all metadata including nCount_RNA
            FetchData(seurat.obj, slot = "counts", vars = my.genes))

write.table(df, "input_for_baredSC.txt", quote = F, sep = "\t", row.names = F)
```

## Inputs values

For the 1D:

- Gene name: The name of the column with the counts of your gene of interest.
- Maximum value in logNorm: The maximum value to explore in PDF. This value should be large enough so the PDF is at 0 at this value.
- Maximum number of Gaussians to study: All models between models with 1 Gaussians to models with this number of Gaussians will be combined.

For the 2D:

- Gene name for x axis: The name of the column with the counts of your gene in x axis.
- Gene name for y axis: The name of the column with the counts of your gene in y axis.
- maximum value in logNorm for x-axis: The maximum value to explore in PDF in the x axis. This value should be large enough so the PDF is at 0 at this value.
- maximum value in logNorm for y-axis: The maximum value to explore in PDF in the y axis. This value should be large enough so the PDF is at 0 at this value.
- Maximum number of Gaussians to study: All models between models with 1 2D-Gaussians to models with this number of 2D-Gaussians will be combined.
- compute p-value: Whether you want to get a p-value. As a consequence, less samples than available will be used for plots as p-value computation requires to have independent samples.

## Processing

- The workflow will generate paramater values from 1 to the maximum number of Gaussians to study.
- baredSC_1d or baredSC_2d is run for each of these number of Gaussians
- All models are combined into a single result.
