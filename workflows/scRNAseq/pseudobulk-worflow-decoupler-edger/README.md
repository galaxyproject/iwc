# Pseudobulk-edgeR workflows


## Inputs

- deCoupler: Source AnnData (`h5ad`).
    - Parameter: Pseudobulk: Fields to merge / optional 
    - Parameter: Group by column / has to be given
    - Parameter: Sample key column / has to be given
    - Parameter: Name your raw count layer / has to be given
    - Parameter: Factor Field / has to be given
- edgeR:
    - Sanitzed Count Matrix
    - Sanitized Factor File
    - Cleaned Gene Annotations file
    - Parameter: Formula for linear model / has to be given
    - Contrast file / has to be given
- Volcano Plot:
    - Input (`tabular`) file with genesymbol, logFC, Pvalue and FDR columns.

## Processing

Sanitzation steps after decoupler:
- Sanitize Matrix and Factors(`tabular`): finds [ --+*^]+ and replace with -
- Remove start, end with (`tabular`): A column that may affect EdgeR and DESeq2.
- Sanitize First Factor for leading digits (`tabular`): Finds ^([0-9])(.+) and replace it with GG_\\1\\2
- Get Contrast labels
- Replace text
- Split Contrasts
- Contrasts as Parameters: Plot title
- Select columns for volcano plot using (`Remove columns`) from DEG edgeR (`Table`)output.


## Outputs

  - Pseudobulk_count_matrix (`tabular`)
  - Pseudobulk Plot (`png`)
  - Filtered by expression (`png`)
  - Table DEG
  - Results (`HTML`) File and plots for download within the output as (`png`)
  - Volcano plot (`PDF`)
