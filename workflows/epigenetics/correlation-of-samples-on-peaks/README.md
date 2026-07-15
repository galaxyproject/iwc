# correlation of samples on peaks:

## Input datasets

- A collection (list) of peak files.
- A collection (list) of BAM or CRAM files

## Inputs values

- Percentage of bad quality bases per read: fastp will discard any read which has more than this percentage of bases with a quality below 30. This depends on your read length.
- Reference genome: this field will be adapted to the genomes available for bowtie2 and the genomes available for bedtools slopbed (dbkeys table)

## Processing

- The workflow will concatenate the list of peak files given as input
- Sort and merge them using deeptools.
- Calculates the number of reads per region for each BAM file.
- Sorts and merges the BAM files by Chromosome and other citerials defined using `bedtools sortBED` and `bedtools mergeBED`, respectively.
- Computes the read coverages for the sorted and merged list of genomic region present in the bed files using `multiBamSummary`.
- Calculate and visualize pairwise correlation values between the read coverages using the tool `plotCorrelation`.
- The workflow produces two outputs:
  - a compressed numpy array containing the raw count of the read coverages (i.e., the output of `multiBamSummary`) in .npz format
  - a plot of pairwise correlation values between the read coverages (i.e., the output of `plotCorrelation`).

### Warning

- The `reference_genome` parameter value is used to select references in bowtie2 and bedtools slopbed. Only references that are present in bowtie2 **and** bedtools slopbed are selectable. If your favorite reference genome is not available ask your administrator to make sure that each bowtie2 reference has a corresponding len file for use in bedtools slopbed.