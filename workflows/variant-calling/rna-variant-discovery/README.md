# RNA-seq Variant Discovery (RNAvar)

This workflow is a faithful reimplementation of the [nf-core/rnavar](https://nf-co.re/rnavar) pipeline for the Galaxy ecosystem. It handles the transition from raw reads to annotated variants using industry-standard tools and follows the established best practices for RNA-seq variant discovery.

## Workflow Logic
1. **Alignment:** **STAR** in 2-pass mode for high-accuracy splice-aware mapping.
2. **Preprocessing:** **MarkDuplicates** and **GATK4 SplitNCigarReads** to prepare the BAM for variant calling by splitting reads into exon segments.
3. **Recalibration:** **GATK4 BaseRecalibrator** (BQSR) using known polymorphic sites to adjust base quality scores.
4. **Variant Calling:** **GATK4 HaplotypeCaller** with parameters specifically tuned for RNA-seq (e.g., ignoring soft-clipped bases).
5. **Filtering:** **bcftools filter** applying hard filters (`FS > 30.0`, `QD < 2.0`) to reduce false positives.
6. **Annotation:** Functional annotation of variants using **SnpEff** against a selected local database.

## Inputs
* **Forward Reads (R1)**: Fastq sequencing reads (forward). Supports gzipped (`.gz`) files.
* **Reverse Reads (R2)**: Fastq sequencing reads (reverse). Supports gzipped (`.gz`) files.
* **Reference Genome**: FASTA file of the reference genome (e.g., hg38).
* **Genome Annotation**: GFF3 file containing gene models for splice-aware alignment.
* **Known Variants (dbSNP)**: VCF file of known polymorphisms for base quality score recalibration.
* **Known Indels**: VCF file of known insertions and deletions for base quality score recalibration.
* **SnpEff Genome Version**: The name of the locally installed SnpEff database (e.g., hg38).
* **Variant Exclusion Filter**: A bcftools-style expression for hard-filtering variants (default: FS > 30.0 || QD < 2.0).
* **STAR Genome Overhang**: Sequence length around junctions for STAR indexing. Set to (Read Length - 1). For example, use 99 for 100bp reads.

## Outputs
* **Final Annotated Variants**: VCF file containing discovered variants with functional annotations (impact, effect, gene names) from SnpEff.
* **MultiQC Quality Report**: An HTML report aggregating quality metrics from alignment and preprocessing steps.

## Testing and Parity
The workflow is validated against a targeted subset of human RNA-seq data on chromosome 22, sourced from the [nf-core/rnavar test dataset](https://github.com/nf-core/test-datasets/tree/rnavar). It achieves technical parity with the reference discovery engine, identifying 54 high-confidence variants.

## Limitations
Compared to the full [nf-core/rnavar (v1.2.3)](https://nf-co.re/rnavar/1.2.3/docs/usage/) implementation, this Galaxy workflow currently has the following limitations:
* **Sample Handling:** Does not support CSV sample sheets; inputs must be provided as individual datasets or collections.
* **Modularity:** Base recalibration (BQSR) and variant filtering are mandatory steps, whereas they are optional in the original pipeline.
* **Preprocessing:** No current support for UMI-Tools-based deduplication or optional read trimming.
* **Annotation:** Variant annotation is restricted to SnpEff; support for other alternatives is not yet implemented.
* **Performance:** The `GATK4 SplitNCigarReads` step is not parallelized, which may impact runtime on very large datasets compared to the Nextflow execution model.