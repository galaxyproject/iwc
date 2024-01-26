# Velocyto on 10X data

These workflows simply run velocyto. There are 2 workflows because one can be easily run after the 'fastq-to-matrix-10x' workflows (Velocyto-on10X-from-bundled). The other can be easily run from uploaded datasets (Velocyto-on10X-filtered-barcodes).

## Input datasets

- BAM files with CB and UB: A collection of BAM. It accepts BAM from cellranger or STARsolo with the CB and UB tags (if you use the fastq-to-matrix-10x workflows these tags are automatically included).
- filtered barcodes (only for Velocyto_on10X_filtered_barcodes workflow): A collection of filtered barcodes (this is what will be used by velocyto). 'Filtered' means that these barcodes have been identified as potential cells. It should not be the whole list of 3 million possible barcodes from cellranger.
- filtered matrices in bundle (only for Velocyto_on10X_from_bundled workflow): A collection of filtered matrices as bundled (like the one which comes from the fastq-to-matrix-10x workflows): A collection with as many items as samples. For each sample, the item is a list with 3 datasets (barcodes, genes, matrix). The workflow will then extract the items which have the 'barcodes' identifier.
- gtf file: A file with annotations where exons are and how they are grouped into genes.

## Processing

- If you provided matrices, the first step is to extract barcodes.
- For both cases velocyto cli is run to get a loom file per sample with spliced and unspliced counts.
