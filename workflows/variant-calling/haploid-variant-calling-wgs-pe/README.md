# Haploid variant calling for whole genome sequencing paired end data

## Inputs dataset

- The workflow needs a list of paired end fastq files
- A GTF containtaing the Gene annotation for the selected haploid genome
- A fasta file for the haploid genome to call variants against

## Processing

- The workflow will remove adapters using fastp
- The filtered reads are aligned with bwa-mem.
- Only properly aligned mate pairs are retained, PCR duplicates are removed.
- Alignments are re-aligned using lofreq viterbi and variants are called with lofreq call.
- Variants are annotated with snpeff eff
