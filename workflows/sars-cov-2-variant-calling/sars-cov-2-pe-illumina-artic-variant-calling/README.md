COVID-19: variation analysis on ARTIC PE data
---------------------------------------------

The workflow for Illumina-sequenced ampliconic data builds on the RNASeq workflow
for paired-end data using the same steps for mapping and variant calling, but
adds extra logic for trimming amplicon primer sequences off reads with the ivar
package. In addition, this workflow uses ivar also to identify amplicons
affected by primer-binding site mutations and, if possible, excludes reads
derived from such "tainted" amplicons when calculating allele-frequencies
of other variants.
