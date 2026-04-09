# RNA-seq Variant Discovery (RNAvar)

This workflow is an implementation of a standard RNA-seq variant discovery pipeline. It handles the transition from raw reads to annotated variants using industry-standard tools.

## Workflow Logic
1. **Alignment:** **STAR** in 2-pass mode for high-accuracy splice-aware mapping.
2. **Preprocessing:** **MarkDuplicates** and **GATK4 SplitNCigarReads** to prepare the BAM for variant calling by splitting reads into exon segments.
3. **Recalibration:** **GATK4 BaseRecalibrator** (BQSR) using known polymorphic sites to adjust base quality scores.
4. **Variant Calling:** **GATK4 HaplotypeCaller** with parameters specifically tuned for RNA-seq (e.g., ignoring soft-clipped bases).
5. **Filtering:** **bcftools filter** applying hard filters (`FS > 30.0`, `QD < 2.0`) to reduce false positives.
6. **Annotation:** Functional annotation of variants using **SnpEff** against the hg38 database.

## Inputs
* **Forward Reads (R1)**: Fastq sequencing reads (forward). Supports gzipped (`.gz`) files.
* **Reverse Reads (R2)**: Fastq sequencing reads (reverse). Supports gzipped (`.gz`) files.
* **Reference Genome**: FASTA file of the reference genome (e.g., hg38).
* **Genome Annotation**: GFF3 file containing gene models for splice-aware alignment.
* **Known Variants (dbSNP)**: VCF file of known polymorphisms for base quality score recalibration.
* **Known Indels**: VCF file of known insertions and deletions for base quality score recalibration.

## Outputs
* **Final Annotated Variants**: VCF file containing discovered variants with functional annotations (impact, effect, gene names) from SnpEff.
* **MultiQC Quality Report**: An HTML report aggregating quality metrics from alignment and preprocessing steps.

## Testing and Parity
The workflow is validated against a targeted subset of human RNA-seq data on chromosome 22. It successfully identifies the 54 high-confidence variants required to match the output of the original discovery engine.