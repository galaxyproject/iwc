# RNA-seq Variant Discovery (RNAvar)

This workflow is an implementation of a standard RNA-seq variant discovery pipeline. It handles the transition from raw reads to annotated variants using industry-standard tools.

## Workflow Logic
1. **Alignment:** **STAR** in 2-pass mode for high-accuracy splice-aware mapping.
2. **Preprocessing:** **MarkDuplicates** and **GATK4 SplitNCigarReads** to prepare the BAM for variant calling by splitting reads into exon segments.
3. **Recalibration:** **GATK4 BaseRecalibrator** (BQSR) using known polymorphic sites to adjust base quality scores.
4. **Variant Calling:** **GATK4 HaplotypeCaller** with parameters specifically tuned for RNA-seq (e.g., ignoring soft-clipped bases).
5. **Filtering:** **bcftools filter** applying hard filters ($FS > 30.0$, $QD < 2.0$) to reduce false positives.
6. **Annotation:** Functional annotation of variants using **SnpEff** against the hg38 database.

## Testing and Parity
The workflow is validated against a targeted subset of human RNA-seq data on chromosome 22. It successfully identifies the 54 high-confidence variants required to match the output of the original discovery engine.