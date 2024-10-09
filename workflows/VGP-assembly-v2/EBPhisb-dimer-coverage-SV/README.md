## Purpose
Workflow to prepare a custom JBrowse2 interactive browser from VGP sized assemblies and data.

Inputs:

Two haplotype assembly fasta
PacBio reads as fastqsanger
Optional external annotation fasta such as NCBI by taxon ID if available
Optional closely related species reference or assembly haplotype fasta for sequence similarity mapping

Outputs:

20 browser tracks and a combined reference fasta to allow tracks from both haplotypes to be viewed together.
Each haplotype has an independently derived
 - Telomere bed
 - Gaps bed
 - Repeats GFF or bigwig
 - Structural Variants as VCF from Sniffles

Haplotype sequence similarity is displayed as "sequence synteny" tracks using Mashmap PAF for a range of
settings for minimum match lengths and minimum percentage identity. 
Mashmap is run on optional closely related species sequences if provided, for additional PAF tracks.
JBrowse allows dotplots to be easily created and explored for visually comparing PAF tracks by contig. 




