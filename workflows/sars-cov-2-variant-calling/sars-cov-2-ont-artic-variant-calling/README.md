COVID-19: variation analysis on ARTIC ONT data
----------------------------------------------

This workflow for ONT-sequenced ARTIC data is modeled after the alignment/variant-calling steps of the [ARTIC pipeline](https://artic.readthedocs.io/en/latest/). It performs, essentially, the same steps as that pipeline’s minion command, i.e. read mapping with minimap2 and variant calling with medaka. Like the Illumina ARTIC workflow it uses ivar for primer trimming. Since ONT-sequenced reads have a much higher error rate than Illumina-sequenced reads and are therefor plagued more by false-positive variant calls, this workflow does make no attempt to handle amplicons affected by potential primer-binding site mutations.

