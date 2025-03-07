# Single-Cell RNA-seq Preprocessing: 10X Genomics Data to Analysis-Ready Formats

These workflows are inspired by the [training material](https://training.galaxyproject.org/training-material/topics/single-cell/tutorials/scrna-preprocessing-tenx/tutorial.html). The output is in a 'bundle' format with three files (one matrix, one with genes, one with barcodes) which is similar to the cellranger output format, and is compatible with any Read10X function (Seurat or Scanpy). There are 2 types of output collections: either one collection with all matrices, one collection with all genes and one collection with all barcodes (compatible with post processing in galaxy) or a single nested collection with one sub-collection per sample with the 3 files (easier for local downstream analysis).

Both workflows are designed for fastqs from 10X libraries v3. One is for regular 10X library (one library per sample), while the other one is for CellPlex 10X library which allows to multiplex samples using CMOs (see [this blog article](https://www.10xgenomics.com/blog/answering-your-questions-about-sample-multiplexing-for-single-cell-gene-expression)).

## Input datasets

- Specific for each experiment:
    - For both workflows: you need a list of pairs of fastqs with gene expression.
    - For CellPlex: you need in addition a list of pairs of fastqs with CMO.
    - For CellPlex: you need a list of csv which describes samples and CMO used:
        - first column is the sequence and second column is the name
    /!\ The order of samples need to be exactly the same between the collection of fastqs of CMO and the collection of csv.

- Common for all experiments:
    - Gene annotations: A gtf file with gene locations
    - List of barcodes used by 10X. You can download it at https://zenodo.org/record/3457880/files/3M-february-2018.txt.gz

## Input values

- reference genome: this genome needs to be available for STAR
- Barcode Size is same size of the Read: if the length of your R1 of GEX matches the size of cell barcode + UMI set to true. If your R1 contains trailling A, put false.
- number of cells: If you make it too large no cell barcode correction will be performed to demultiplex CMOs.

## Processing
- Gene expression processing:
    - Reads are aligned to the genome, asigned to genes, cell barcode and UMI with STAR Solo
    - MultiQC report the mapping rate and the number of reads attributed to genes
    - The output of STAR Solo is filtered with Droplet Utils to remove cellular barcodes which are probably empty.
    - The output of Droplet Utils is reorganized to be:
```
Main Collection:
    - Sample 1:
        - matrix.mtx
        - barcodes.tsv
        - genes.tsv
    - Sample 2:
        - matrix.mtx
        - barcodes.tsv
        - genes.tsv
...
```
For the CellPlex workflow:
- CMO processing:
    - CITE-Seq Count is used to asign reads and generate a matrix where 'genes' are the CMO and 'unmapped'.
    - Cellular barcodes are translated to match the cellular barcodes of Gene expression see [this article](https://kb.10xgenomics.com/hc/en-us/articles/360031133451-Why-is-there-a-discrepancy-in-the-3M-february-2018-txt-barcode-whitelist-).
    - Reorganize the output with UMI matrices to match the same structure as gene expression matrices.

## Test data

The test dataset has been produced to make it as small as possible in order to make the workflow pass on CI.

- The CMO reads come from [zenodo](https://zenodo.org/records/10229382) and have been sampled to 0.1 with seqtk.
- The GEX reads come from SRR13948489 but have been subsetted to the cells selected in the above zenodo.
