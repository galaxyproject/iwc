# (Capture) Hi-C Processing: FASTQ to Balanced Cool Files

This can also be used for Hi-ChIP experiments, in that case the output with `matrix with iced values` is ignored and the matrix to use is `matrix with raw values`.

## Input datasets

- The workflow needs a list of dataset pairs of fastqsanger.

## Input values

- genome name: suggested from the bowtie2 indices, it is used to map and build the list of bins.
- restriction enzyme: Restriction enzyme used e.g. A^GATCT,BglII. The '^' is used to express where the enzyme cuts.
- No fill-in: If you used a biotin fill-in protocol, put this to false, else, put it to true.
- minimum MAPQ: Filtering to apply to pairs you want to keep in your matrix, set it to 0 to not apply filtering (HiCUP already filter for uniquely mapped or MAPQ30).
- Bin size in bp: Used to generate your first matrix but you will be able to rerun the subworkflow `hic_tabix_to_cool_cooler` to get other resolutions.
- Interactions to consider to calculate weights in normalization step: this is a parameter for the last correction step (ICE).

For the region capture workflow:

- chromosome, start and end positions of the capture region

For the Hi-C workflow:

- region to use in pyGenomeTracks to check the matrices.

## Processing

- Reads are processed with HiCUP which comprises these steps:
  - Truncation of reads for the religation motif
  - Mapping of mates independently with bowtie2
  - Pairing the mates when both mates are uniquely mapped or MAPQ30
  - Filtering the pairs for undigested, self-ligated...
  - Removing duplicates
- The output BAM file is converted to medium juicer format: `<readname> <str1> <chr1> <pos1> <frag1> <str2> <chr2> <pos2> <frag2> <mapq1> <mapq2>` where str = strand (0 for forward, anything else for reverse) and pos is the middle of the fragment.
- The pairs are filtered for MAPQ if specified.
- For the region capture Hi-C workflow the pairs are filtered for both mates in the captured region.
- The filtered pairs are sorted and indexed with cooler_csort.
- The pairs are loaded into a matrix of the given resolution and balanced with cooler.
- A final plot is made with pyGenomeTracks using the balanced matrices on the region provided or the capture region.

## Subworkflows

There are 2 subworkflows: `hic_tabix_to_cool_cooler` and `hic_fastq_to_pairs_hicup.ga`.

### hic_tabix_to_cool_cooler

This first subworkflow can be used to generate matrices to different resolutions using one of the output of the full workflow (`valid pairs filtered and sorted`).

If the dataset are still in galaxy (format: juicer_medium_tabix.gz), the workflow can be run directly.

If the dataset is not anymore in galaxy, you need to upload and specify the datatype as: juicer_medium_tabix.gz

### hic_fastq_to_pairs_hicup

The second subworkflow has no real reason to be launched by itself except for QC tests.

If you want to run the first subworkflow from these results:

- You first need to filter the pairs (`valid pairs in juicebox format MAPQ filtered`) for the capture region if relevent using the tool Filter1 (**Filter** data on any column using simple expressions) with the condition `(c3=='chr2' and c4<180000000 and c4>170000000) and (c7=="chr2" and c8<180000000 and c8>170000000)` if your capture region is chr2:170000000-180000000.
- Then you need to run cooler_csort (**cooler csort with tabix** Sort and index a contact list.) with as input the `valid pairs in juicebox format MAPQ filtered` or the output of the previous step and for "Format of your input file" use "Juicer Medium Format".

The output of `cooler_csort` can be used as input of the first subworkflow.
