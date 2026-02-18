# Paired-End Variant Calling in Diploid Systems

This workflow performs paired-end read mapping and germline variant calling for
diploid organisms. It takes a collection of Illumina paired-end FASTQ files,
a reference genome in FASTA format, a gene annotation in GTF format, and a
ploidy parameter, and produces annotated variants both as VCF and as a
tab-separated table.

Reads are first quality-trimmed and adapter-removed with fastp. Trimmed reads
are then mapped to the reference genome using BWA-MEM. The resulting
alignments are filtered with Samtools view to retain only properly paired
reads, and PCR duplicates are removed using Picard MarkDuplicates. QC metrics
from fastp, Samtools stats, and MarkDuplicates are aggregated into a single
MultiQC report.

Variant calling is performed with FreeBayes, which operates in haplotype-based
mode on the duplicate-free BAM. The ploidy used for calling is configurable
and defaults to 2 (diploid). The raw VCF output is normalised and
left-aligned with bcftools norm, splitting multi-allelic sites into
individual biallelic records.

Variants are then functionally annotated using SnpEff, with a custom SnpEff
database built on-the-fly from the provided reference FASTA and GTF annotation.
Annotation is restricted to coding and splicing effects (downstream,
intergenic, intronic, UTR, and upstream effects are excluded). The annotated
VCF is subsequently parsed by SnpSift Extract Fields into a flat tabular
format, and per-sample tables are merged into a single file using Collapse
Collection.

## Inputs

Paired Collection: a list:paired dataset collection of Illumina paired-end
reads in fastqsanger or fastqsanger.gz format.

Reference Genome FASTA: the reference genome sequence to use for mapping
and variant calling.

Annotation GTF: a GTF gene annotation file corresponding to the reference
genome, used to build the SnpEff database.

Set Ploidy for FreeBayes Variant Calling: an integer specifying the ploidy
of the organism (default: 2).


## Outputs

report_html (fastp): per-sample HTML quality control report from fastp.

Preprocessing and mapping reports (MultiQC): aggregated HTML QC report
combining fastp, Samtools stats, and Picard MarkDuplicates metrics across
all samples.

SnpEff variants: annotated variants in VCF format, tagged VariantsasVCF.

SnpEff eff reports: HTML summary statistics from SnpEff describing the
distribution of variant effects across functional categories.

Annotated Variants: a merged, tab-separated table of annotated variants
across all samples, tagged VariantsAsTSV. Columns include CHROM, POS,
FILTER, REF, ALT, DP, AF, DP4, SB, and per-effect fields for
impact, functional class, effect type, gene name, codon change, amino acid
change, and transcript ID.