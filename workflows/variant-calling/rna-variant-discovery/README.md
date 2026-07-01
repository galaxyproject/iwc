# RNA-seq Variant Discovery (RNAvar)

This workflow is an attempt at a faithful reimplementation of the [nf-core/rnavar](https://nf-co.re/rnavar) pipeline for the Galaxy ecosystem. nf-core rnavar handles the transition from raw reads to annotated variants using industry-standard tools and follows established best practices for RNA-seq variant discovery. This implementation for Galaxy still has a few limitations (see below).

## Workflow Logic
1. **Alignment:** **STAR** in 2-pass mode for high-accuracy splice-aware mapping.
2. **Preprocessing:** **MarkDuplicates** and **GATK4 SplitNCigarReads** to prepare the BAM for variant calling by splitting reads into exon segments.
3. **Recalibration (optional):** **GATK4 BaseRecalibrator** (BQSR) using known polymorphic sites to adjust base quality scores.
4. **Variant Calling:** **GATK4 HaplotypeCaller** with parameters specifically tuned for RNA-seq (e.g., ignoring soft-clipped bases).
5. **Filtering:** called variants are soft-filtered with **bcftools filter** (default filter expression: `FS > 30.0 || QD < 2.0`) to reduce false positives.
6. **Annotation:** Functional annotation of variants using **SnpEff** against a selected local database.

## Inputs
* **Collection of paired-end fastqs**: A collection of paired-end fastq sequencing reads. Supports gzipped (`.gz`) files.
* **Cached reference genome**: Cached reference genome built into the server (e.g., hg38).
* **Genome Annotation**: GTF file containing gene models for splice-aware alignment.
* **STAR Genome Overhang**: Sequence length around junctions for STAR indexing. Set to (Read Length - 1). For example, use 99 for 100bp reads.
* **Perform Base Recalibration**: Whether to run GATK BaseRecalibrator and ApplyBQSR.
* **Known Variants (dbSNP)**: VCF file of known polymorphisms for base quality score recalibration (required only if base recalibration is enabled).
* **Known Indels**: VCF file of known insertions and deletions for base quality score recalibration (required only if base recalibration is enabled).
* **Variant discovery regions**: Optional BED file containing exon regions.
* **Variant Exclusion Filter**: A bcftools-style expression for hard-filtering variants (default: `FS > 30.0 || QD < 2.0`).
* **SnpEff Genome Version**: The name of the locally installed SnpEff database (e.g., hg38).

## Outputs
* **Final Annotated Variants**: VCF file containing discovered variants with functional annotations (impact, effect, gene names) from SnpEff.
* **MultiQC Quality Report**: An HTML report aggregating quality metrics from alignment and preprocessing steps.

## Testing and Parity
The workflow is validated with the included Planemo test case using Saccharomyces cerevisiae (sacCer3) RNA-seq data and produces an annotated VCF containing variants on chrI.

## Limitations
Compared to the full [nf-core/rnavar (v1.2.3)](https://nf-co.re/rnavar/1.2.3/docs/usage/) implementation, this Galaxy workflow currently has the following limitations:
* **Sample Handling:** Does not support CSV sample sheets; inputs must be provided as individual datasets or collections.
* **Modularity:** Base recalibration (BQSR) can be enabled/disabled via workflow parameters, whereas variant filtering is mandatory (the original pipeline allows skipping filtering).
* **Preprocessing:** No current support for UMI-Tools-based deduplication or optional read trimming.
* **Annotation:** Variant annotation is restricted to SnpEff; support for other alternatives is not yet implemented.
* **Performance:** The `GATK4 SplitNCigarReads` step is not parallelized, which may impact runtime on very large datasets compared to the Nextflow execution model.
* **Variant Discovery Regions:** Unlike the nf-core implementation (which automatically constructs an exon BED file from the GFF if omitted), leaving the "Variant discovery regions" input empty in this workflow defaults to standard genomic variant calling instead of forcing RNA-specific calling.
* **Variant Calling Configuration:** The variant calling step does not currently allow configuration of the `--gatk_hc_call_conf` parameter.
* **Filtering:** Filtering uses `bcftools filter` and does not offer clustered SNPs filtering.