# BREW3R

![BREW3R logo](https://raw.githubusercontent.com/lldelisle/BREW3R/main/images/logo.png)

BREW3R stands for **B**ulk **R**NA-seq **E**vidence-based **W**orkflow for **3**' UTR **R**eannotation. 

This workflow enables extending an existing gtf downloaded on a public website, like Ensembl, Genecode or UCSC, using *de novo* gene annotation with StringTie on full length bulk RNA-seq.

BREW3R highly relies on a R package called BREW3R.r available on [bioconductor](https://bioconductor.org/packages/release/bioc/html/BREW3R.r.html).

## Input datasets

- The workflow requires an input gtf file which will be extended.
- As well as a collection of BAM files.

## Input values

- strandedness: Must be one of `stranded - forward`, `stranded - reverse` and `unstranded`. For stranded libraries, reverse means that the read is complementary to the coding sequence, forward means that the read is in the same orientation as the coding sequence.
- minimum coverage: Minimum reads per bp coverage to consider for assembly in each de novo assembly (for each BAM file). Default: 10
- minimum FPKM for merge: Minimum FPKM value for a transcript to be included into the merged de novo assembly.

## Processing

- StringTie is called once per input BAM file to compute de novo assembly.
- StringTie is called to merge all outputs of previous steps.
- BREW3R.r is run with the default parameters on the input gtf to extend and the output of StringTie. If the library was unstranded all merged transcripts without orientation that overlaps exons of both strands are not used for the extension.
