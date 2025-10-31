# Simple variant calling for diploid taxa

Performs variant analysis on paired-end Illumina reads against a reference genome. The workflow uses BWA-MEM for read mapping and FreeBayes for variant calling.

## Inputs

- Paired-end Illumina reads (fastqsanger format)
- Reference genome

## Outputs

- VCF file with called variants
- Quality control reports for preprocessing and mapping

## Processing

- Adapter trimming and quality filtering with fastp
- Read mapping with BWA-MEM
- Alignment filtering to retain only properly paired reads mapped in proper orientation
- PCR duplicate removal with Picard MarkDuplicates
- Variant calling with FreeBayes
