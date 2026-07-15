# correlation of samples on peaks:

## Input datasets

- A collection (list) of peak files.
- A collection (list) of BAM or CRAM files

## Inputs values

- Reference genome: this field will be adapted to the genomes for bedtools sort (dbkeys table)

## Processing

- The workflow will concatenate the list of peak files given as input
- Sorts and merges the concatenated BED file by Chromosome using `bedtools sortBED` and `bedtools mergeBED`, respectively.
- Computes the read coverages for the sorted and merged list of genomic region present in the bed files using `multiBamSummary`.
- Calculate and visualize pairwise correlation values between the read coverages using the tool `plotCorrelation`.
- The workflow produces two outputs:
  - a compressed numpy array containing the raw count of the read coverages (i.e., the output of `multiBamSummary`) in .npz format
  - The same raw count of the read coverages (i.e., the output of `multiBamSummary`) in .tabular format
  - a plot of pairwise correlation values between the read coverages (i.e., the output of `plotCorrelation`).
