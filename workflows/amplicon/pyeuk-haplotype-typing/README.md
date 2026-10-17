# PyEuk amplicon haplotype typing

Types a cohort of targeted-amplicon specimens from their reads against a **known** amplicon
panel, and stratifies them with the PyEuk cluster sweep, without a curated allele or haplotype
catalogue. The workflow is panel- and species-agnostic: it has been run unchanged on the CDC
*Cyclospora* 8-marker panel and on a *Cryptosporidium* 18S species-mixture titration.

Every clustering result is reported as a **cluster sweep**: the range of group counts the data
support, whether that count is determined, and the reproducible *stable cores*, rather than one
forced number. The workflow uses the PyEuk tool suite (Bioconda `pyeuk` 0.8.1).

If you do not have a panel FASTA for your amplicons, first run the
[PyEuk amplicon panel inference](https://github.com/galaxyproject/iwc/tree/main/workflows/amplicon/pyeuk-panel-inference) workflow on your reads and a
reference genome, and use its derived panel as the input here.

## Steps

1. Index the amplicon panel once with bwa-mem2 and map every specimen's paired reads to the
   whole panel.
2. Keep MAPQ ≥ 20 proper pairs (`samtools view -q 20 -f 2 -F 3852`).
3. Define analysis windows once for the whole cohort, sized per amplicon from the cohort's own
   aligned-fragment lengths. Windows must be identical for every specimen, otherwise the
   columns of the sheet would not correspond across rows.
4. For each specimen, call window haplotypes from reads that span a window end to end. Each
   haplotype is then an observation on one molecule rather than an inference across molecules,
   which separates a mixture from a single strain carrying the same mutations.
5. Assemble all calls into a specimen-by-haplotype sheet.
6. Compute weighted identity-by-state distances and the cluster sweep with PyEuk.

## Inputs

| Input | Description |
| --- | --- |
| Paired-end reads | `list:paired` collection of adapter/quality-trimmed FASTQ, one pair per specimen. The element identifier is the specimen id and must match `[A-Za-z0-9_.-]+`. |
| Amplicon panel | FASTA of the amplicon reference sequences. Haplotype names are differences from these sequences, so keep the panel fixed when comparing runs. |
| Maximum window length | Upper bound on window length in bp (default 100; 0 = no cap). Shorter windows are spanned by more reads; on a *Cryptosporidium* titration, 100 bp windows resolved every mixture, while at 250 bp both 75:25 mixtures collapsed to a single haplotype. Window length trades linkage against sequencing error and is worth checking per panel. |
| Minimum spanning reads per window | Minimum spanning reads for a window to be called (default 30). A mixture of k genotypes needs about k times the depth of a clonal sample to clear it. Calibrated on *Cyclospora*; sweep it again for other panels. |
| Minimum haplotype frequency | Minimum fraction of spanning reads carrying a whole haplotype string (default 0.05). Lower it (e.g. 0.005) to detect low-frequency components. |
| Minimum reads per haplotype | Minimum supporting reads per haplotype (default 10). This is the noise control when the frequency gate is lowered. |
| Project distances onto the positive semidefinite cone | Off by default. Guarantees a Euclidean embedding for Ward linkage but compresses the closest pairs. Consider it together with the `distance` tree cut method. |
| Tree cut method | `count` (default) picks k groups from the largest merge-height gap, which suits closed investigations. `distance` cuts at a fixed dissimilarity and allows singletons, which suits surveillance where most cases are unrelated. |
| Linkage distance threshold | Optional. The cut height for the `distance` method. When unset, it is calibrated from the data. |
| Minimum locus completeness | Minimum fraction of loci a specimen must have called to enter the distance matrix (default 0.1). Panel-dependent. |

## Outputs

| Output | Description |
| --- | --- |
| Filtered alignments | Per-specimen filtered, coordinate-sorted BAM. |
| Haplotype windows | BED of the windows the cohort was typed on. Haplotype names only have meaning relative to these intervals. |
| Window haplotype calls | Per-specimen haplotype calls with read counts and frequencies. |
| Haplotype sheet | Specimens × observed haplotypes presence/absence sheet. An empty locus block means *not called*; the reference-identical haplotype is `=`. |
| Haplotype map | Sheet column → window, interval and content-derived haplotype string. |
| Long-format haplotype calls | Calls with read frequencies. Mixtures are visible here. |
| Distance matrix | Pairwise specimen distances. |
| Clusters | Cluster assignment per specimen. |
| Cluster sweep | JSON cluster sweep: supported count range, whether it is determined, and stable cores. |
| Cluster sweep report | Self-contained HTML report of the sweep. |

## Relation to other IWC amplicon workflows

The DADA2, QIIME2 and MGnify amplicon workflows profile the taxonomic composition of microbial
communities (16S/18S/ITS). This workflow instead types individual specimens of one organism
across a multi-locus amplicon panel and asks how the specimens are related, for example for
outbreak stratification.

Upstream: https://github.com/spond/pyeuk
