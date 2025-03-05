# Single-Cell RNA-seq Analysis: Scanpy Preprocessing and Clustering

This workflow follows Scanpy legacy workflow [clustering 3k PBMCs](https://scanpy.readthedocs.io/en/stable/tutorials/basics/clustering-2017.html). For more details on concepts and parameters, please refer to the equivalent Galaxy-based [tutorial](https://training.galaxyproject.org/training-material/topics/single-cell/tutorials/scrna-scanpy-pbmc3k/tutorial.html).

## Inputs

### Input datasets
- This workflow needs 3 files as input
    - A single-cell count matrix file in Matrix Market Exchange format
    - A cell barcodes file with a single barcode in each line. The barcodes should correspond to the cells in the matrix file
    - A genes/features tabular file with gene ids and gene names.
        - Cell Ranger v2 or earlier version call this file as `genes.tsv` and contains two columns:
            - Gene ID (Ensembl gene ID or other identifiers)
            - Gene Name (common gene name or symbol)
        - Cell Ranger v2 or earlier version call this file as `features.tsv` and contains three columns:
            - Feature ID (Ensembl gene ID or other identifiers)
            - Feature Name (common gene name or symbol)
            - Feature Type (e.g., Gene Expression, Antibody Capture, CRISPR Guide Capture, etc.)
### Input parameters
- The following parameters should be configured according to the data.
    - Minimum number of cells expressed per gene. The workflow default is 3.
    - Minimum number of genes expressed per cell. The workflow default is 200.
    - Maximum number of genes expressed per cell. The workflow default is 2500.
    - Size of the local neighborhood. Number of neighbours for computing neighborhood graph. The default is 15.
    - Size of the local neighborhood (aka resolution) in louvain algorithm. The default is 1.

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
- Some informative plots from QC to the end results
