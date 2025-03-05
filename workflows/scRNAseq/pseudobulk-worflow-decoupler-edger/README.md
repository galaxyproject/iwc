# Single-Cell Pseudobulk Differential Expression Analysis with edgeR

This workflow uses the decoupler tool in Galaxy to generate pseudobulk counts from an annotated AnnData file obtained from scRNA-seq analysis. Following the pseudobulk step, differential expression genes (DEG) are calculated 
using the edgeR tool. The workflow also includes data sanitation steps to ensure smooth operation of edgeR and minimizing potential issues. Additionally, a Volcano plot tool is used to visualize the results after the DEG 
analysis.

The workflow deposited here is based on an earlier version of the [Persist-SEQ](https://persist-seq.org/)[^1] Pseudo-bulk scRNA-seq pipeline, of which the latest version is available [here](https://usegalaxy.eu/published/workflow?id=c3a11e1ac1aa8383). In terms of core procedures, the main differences with the IWC workflow are that the Persist-SEQ workflow:

[^1]: The PERSIST-SEQ consortium is funded by the Innovative Medicines Initiative (IMI) Joint Undertaking, which receives support from the European Union's Horizon 2020 research and innovation program and EFPIA.

- Is more opinionanted on the downstream enrichment analysis for the cancer biology use case.
- Enables filtering out of seldomly expressed genes (with a configurable threshold) per contrast after DE calling, which reduces poorly supported highly DE genes and improves the signal for downstream enrichment analysis.

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
