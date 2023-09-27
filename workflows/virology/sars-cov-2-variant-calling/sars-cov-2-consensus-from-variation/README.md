COVID-19: consensus construction
--------------------------------

This workflow aims at generating reliable consensus sequences from variant
calls according to transparent criteria that capture at least some of the
complexity of variant calling.

It takes a collection of VCFs (with DP and DP4 INFO fields) and a collection of
the corresponding aligned reads (for the purpose of calculating genome-wide
coverage) such as produced by any of the variant calling workflows in
https://github.com/galaxyproject/iwc/tree/main/workflows/sars-cov-2-variant-calling
and generates a collection of viral consensus sequences and a multisample FASTA
of all these sequences.

Each consensus sequence is guaranteed to capture all called, filter-passing (as
per the FILTER column of the VCF input) variants found in the VCF of its sample
that reach a user-defined consensus allele frequency threshold.

Filter-failing variants and variants below a second user-defined minimal
allele frequency threshold will be ignored.

Genomic positions of filter-passing variants with an allele frequency in
between the two thresholds will be hard-masked (with N) in the consensus
sequence of their sample.

Genomic positions with a coverage (calculated from the read alignments input)
below another user-defined threshold will be hard-masked, too, unless they are
consensus variant sites.
