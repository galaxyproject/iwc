Haplotype Interactive Sequence Browser - Descriptive

This workflow makes a preconfigured JBrowse2 genome browser.

Tracks include:
 - Coverage from minimap2 mapping PacBio reads to the haplotype, as a bigwig track
 - Structural variants found by sniffles in the minimap bam, as a vcf track
 - Repeatmasker (Dfam based) repeats as an optional gff3 track
 - Windowmasker (model free) repeats as a bigwig track
 - gfastats sequence N gaps as a bed track
 - seqtk-telo for telomeres as a bed track
 - Mashmap approximate PAF tracks for the two haplotypes
 - Mashmap approximate PAF tracks for any number of closely related species.

Inputs include:
 - Two assembled haplotypes (same contig names) 
 - Optional NCBI gene/rna/protein taxon id and downloaded fasta files 
 - Optional haplotype or reference fasta from two or more closely related species for sequence similarity mapping
 - Optionally run repeatmodeler for repeatmasker


