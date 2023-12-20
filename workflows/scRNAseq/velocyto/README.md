# Velocyto on 10X data

This workflow simply run velocyto.

## Input datasets

- BAM files with CB and UB: A collection of BAM. It accepts BAM from cellranger or STARsolo with the CB and UB tags (if you use the fastq-to-matrix-10x workflows these tags are automatically included).
- gtf file: A file with annotations where exons are and how they are grouped into genes.
- filtered barcodes or filtered matrices in bundle: This input accepts two type of inputs.
    - A collection of filtered barcodes (this is what will be used by velocyto). 'Filtered' means that these barcodes have been identified as potential cells. It should not be the whole list of 3 million possible barcodes from cellranger.
    - A collection of filtered matrices as bundled (like the one which comes from the fastq-to-matrix-10x workflows). The workflow will then extract the items which have the 'barcodes' identifier.

## Input value

- provide filtered matrices in bundle instead of collection of filtered barcodes:
    - Set 'true' if you provided a collection where each item is a collection where each item is a list of 3 datasets: matrix, barcodes and genes (for example, if you used the fastq-to-matrix-10x workflows).
    - Set 'false' if you provided a collection where each item is a tabular or tsv or txt with filtered barcodes.

## Processing

- If you provided matrices, the first step is to extract barcodes.
- For both cases velocyto cli is run to get a loom file per sample with spliced and unspliced counts.
