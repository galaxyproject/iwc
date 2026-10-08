# SameStr-based shared strain detection from paired-end metagenomic data

This workflow processes paired-end shotgun metagenomic reads from several samples and finds
strains they share, for example strains transmitted from a donor to a recipient after a faecal
microbiota transplant, or strains persisting in one person over time. It uses
[SameStr](https://github.com/danielpodlesny/samestr)
([Podlesny et al. 2022, *Microbiome*](https://doi.org/10.1186/s40168-022-01251-w)), which compares
single-nucleotide variant (SNV) profiles of species-specific marker genes between samples.

It performs the following steps:

- **Preprocessing**: quality trimming (Trimmomatic) and host read removal (Bowtie2) with KneadData.
- **Taxonomic profiling and marker-based alignment**: MetaPhlAn 4 or mOTUs, depending on the
  selected database, profiles each sample and aligns its reads to the profiler's marker genes.
- **Strain detection**:
  - SameStr Convert turns each sample's marker alignments into per-clade SNV profiles.
  - SameStr Merge and SameStr Filter combine them across samples and keep high-confidence variants.
  - SameStr Stats, Compare and Summarize compute pairwise Maximum Variant Profile Similarity (MVS)
    scores and call shared strains.

## Inputs

- **Paired-end reads**: a `list:paired` collection of FASTQ files (`fastqsanger` or
  `fastqsanger.gz`), one element per sample. Strains are compared between samples, so provide at
  least two.
- **Preprocessing: Trimmomatic adapter set**: the adapter sequences Trimmomatic clips (default `NexteraPE`).
- **Preprocessing: Host reference genome**: the Bowtie2 index of the host genome whose reads are
  removed (default `hg38`, human).
- **MetaPhlAn database** and **mOTUs database**: both are optional, and the database you select
  decides which profiler runs. Select exactly one:
  - with neither selected, the workflow fails;
  - with both selected, both profilers run, but SameStr uses only the MetaPhlAn results.
- **SameStr database**: the SameStr marker database. It must be built from the same profiler
  database as the one selected above (the same MetaPhlAn or mOTUs database version).
- **SameStr Convert / Filter / Summarize parameters**: the alignment, variant, position, sample
  and similarity thresholds of the SameStr steps. The defaults are SameStr's own defaults, and
  each input's help text describes it.

## Outputs

- **Taxonomic profile**: the taxonomic profile of each sample, from MetaPhlAn (or mOTUs if no
  MetaPhlAn database was selected).
- **SameStr SNV profile statistics**: one table per clade with the marker coverage and variant
  statistics of each sample.
- **Strain events**: one row per sample pair and clade. It gives the MVS similarity, the number of
  overlapping positions, and the call: `shared_strain` if the pair shares the strain,
  `other_strain` if it carries different strains.
- **Taxon counts**: for each sample, the number of taxa detected at each rank from kingdom to clade.
- **Strain co-occurrence table**: for each sample pair, the number of taxa shared at each rank,
  the number of shared strains, and the number of clades analyzed at strain level.
