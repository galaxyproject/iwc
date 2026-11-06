# PyEuk amplicon panel inference

Reconstructs an amplicon **panel** FASTA from targeted-amplicon reads and a reference genome,
for cohorts where no curated panel is available. The derived panel is a drop-in input for the
[PyEuk amplicon haplotype typing](https://github.com/galaxyproject/iwc/tree/main/workflows/amplicon/pyeuk-haplotype-typing) workflow.

Targeted-amplicon reads do not spread over the genome. They pile up on the amplified regions
as sharp coverage peaks against an empty background. After mapping the reads to the reference
genome, each peak is an amplicon, and its genome sequence is the panel entry. The peak
threshold is data-adaptive (a fraction of the run's own maximum depth), so it does not need
retuning across datasets. The workflow uses the PyEuk tool suite (Bioconda `pyeuk` 0.8.1).

## Steps

1. Index the reference genome once with bwa-mem2 and map every specimen's paired reads to it.
2. Keep MAPQ ≥ 20 proper pairs, dropping unmapped, secondary, QC-fail, duplicate and
   supplementary reads.
3. Call coverage peaks over a sample of the BAMs with PyEuk `derive-panel`, using the peak
   depth, length, merge-gap and padding inputs, and extract each peak's sequence from the genome.

## Inputs

| Input | Description |
| --- | --- |
| Paired-end reads | `list:paired` collection of adapter/quality-trimmed FASTQ, one pair per specimen. A representative subset of the cohort is enough; `derive-panel` samples up to 20 BAMs. |
| Reference genome | FASTA of the genome the amplicons come from (not a panel). |
| Minimum peak depth fraction | A peak must reach this fraction of the run's maximum depth (default 0.01). The effective threshold is the larger of this and the minimum peak depth. Being relative to the run's own maximum, it rarely needs retuning. |
| Minimum peak depth | Absolute depth floor a peak must clear (default 30 reads). Raise it for deep runs with off-target background. |
| Minimum peak length | Peaks shorter than this are discarded (default 80 bp). Keep it below the shortest expected amplicon. |
| Peak merge gap | Peaks closer than this are joined into one entry, bridging a coverage dip inside an amplicon (default 25 bp). Keep it below the spacing of neighbouring amplicons, or they merge. |
| Peak padding | Extend each peak by this many bases at both ends before extracting its sequence (default 0 bp). |

## Outputs

| Output | Description |
| --- | --- |
| Derived amplicon panel | FASTA with one entry per coverage peak (`ampl_01`, `ampl_02`, …). |
| Coverage peaks | BED of the peak coordinates on the genome. |
| Coverage peaks QC | Per-peak QC table (depth, length, coordinates). |

Upstream: https://github.com/spond/pyeuk
