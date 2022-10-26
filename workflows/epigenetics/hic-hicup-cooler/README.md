# Hi-C and region capture Hi-C Workflows

This can also be used for Hi-ChIP experiments, in that case the last output is ignored and the matrix to use is `matrix with raw values`.

## Inputs dataset

- The workflow needs a list of dataset pairs of fastqsanger.

## Inputs values

- genome name: suggested from the bowtie2 indices, it is used to map and build the list of bins.
- restriction enzyme: Restriction enzyme used e.g. A^GATCT,BglII. The '^' is used to express where the enzyme cuts.
- No fill-in: If you used a biotin fill-in protocol, put this to false, else, put it to true.
- minimum MAPQ: Filtering to apply to pairs you want to keep in your matrix, set it to 0 to not apply filtering (HiCUP already filter for uniquely mapped or MAPQ30).
- Bin size in bp: Used to generate your first matrix but you will be able to rerun the subworkflow `HiC_tabixToCool_cooler` to get other resolutions.
- Interactions to consider to calculate weights in normalization step: this is a parameter for the last correction step (ICE).

For the region capture workflow:

- chromosome, start and end positions of the capture region

## Processing

- Reads are processed with HiCUP which comprises these steps:
  - Truncation of reads for the religation motif
  - Mapping of mates independently with bowtie2
  - Pairing the mates when both mates are uniquely mapped or MAPQ30
  - Filtering the pairs for undigested, self-ligated...
  - Removing duplicates
- The output BAM file is converted to juicer format: `<readname> <str1> <chr1> <pos1> <frag1> <str2> <chr2> <pos2> <frag2> <mapq1> <mapq2>` where str = strand (0 for forward, anything else for reverse) and pos is the 5' end.
- The pairs are filtered for MAPQ if specified.
- For the region capture Hi-C workflow the pairs are filtered for both mates in the captured region.
- The filtered pairs are sorted and indexed with cooler_csort.
- The pairs are loaded into a matrix of the given resolution and balanced with cooler.
