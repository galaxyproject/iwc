# Standard scRNA-seq Workflow using Scanpy and Anndata

## Inputs dataset

- The workflow needs 4 files as input
    - A singl-cell count matrix file in Matrix Market Exchange format
    - A cell barcodes file with a single barcode in each line. The barcodes should correspond to the cells in the matrix file
    - A genes/feature tabular file with gene ids and gene symbols

## Processing

- The workflow creates an **Anndata** object from the given input files.
- Quality control performed. Cells are filtered by number of genes expressed, cells with high mitochondial content are removed.
- Then counts are normlized and scaled
- PCA is used for dimensionality reduction and 50 PCs are computed. Various plots are generated to inspect the PCA and PCA loadings that helps in chodeterminingnumber of  PCs to keep for further analysis.
- Clustering is performed by computing a neighbourhood graph, and then using **louvain** algorithm. neighborhood graph is embeded into UMAP and plotted.
- Marker genes are identified using **Wilcoxon rank sum test**. Marker genes expressions are visualized in various plots.
- Optionally, louvain clusters can be annotated with cell types based on the marker genes.

## Outputs

- Final output is an Anndata object with annotations of louvain clusters.
- Some informative plots from QC to end results