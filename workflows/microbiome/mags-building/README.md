# Metagenome-Assembled Genomes (MAGs) Generation

This workflow assembles paired short reads and optional long reads, bins assemblies with multiple coverage strategies, refines the bins, and reports dereplicated MAGs and their quality and abundance.

This workflow can be used on its own or integrated into other workflows. For example, it is part of a **suite of workflows for end-to-end metagenome-assembled genome (MAG) generation** (check [FAIRyMAGs repository](https://github.com/usegalaxy-eu/FAIRyMAGs) for the complete workflow suite and its capabilities).
A dedicated [learning pathway](https://galaxyproject.github.io/training-material/learning-pathways/mags.html) provides detailed guidance on how to use this workflow.

## Modular workflow logic

The parent contains separate embedded workflows for paired short-read grouping,
nanopore grouping, PacBio grouping, assembly and assembly selection, single-coverage
binning, and multi-coverage binning. Refiner reconciliation remains in the parent.
The original downstream quality assessment, dereplication, abundance estimation,
and reporting are retained.

The input form begins with **Use grouping?**, **Binning strategy**, and **Bin refinement tool**. Native frames surround the tools/subworkflows for each stage, with Markdown explanations inside each frame.

## Inputs and grouping

- **Trimmed reads**: original samples as a `list:paired` collection.
- **Trimmed nanopore reads** and **Trimmed PacBio reads**: independent optional
  original-read `list` collections. Long reads are used only by metaSPAdes.
- **Metadata**: optional TSV/CSV with sample identifiers in the first column and
  a grouping column selected by **Sample grouping column** (default `group`).
- **Use grouping?** selects **Use original samples** (default), **Use grouping**,
  or **Use grouping and original samples**. The hybrid union is grouped-first;
  duplicate identifiers keep the grouped entry. Use distinct sample/group names
  to avoid unintended collisions. Group identifiers must not contain underscores
  because of the pinned fastq_groupmerge output discovery pattern.
- With grouping enabled, provide metadata when explicit groups are required.
  The underlying groupmerge tool merges all samples if metadata is absent.
- Group short and long reads consistently. Single-end metadata identifiers refer
  to the input element/file identifiers; paired metadata identifiers refer to
  the pair identifiers. `fastq_groupmerge` is pinned at `1.0.2+galaxy0`.
- Custom assemblies must match the selected original/grouped/hybrid read
  identifiers and order. Five per-sample FASTAs do not become a co-assembly when
  their reads are grouped; assemble the group or supply its genuine assembly.

## Coverage strategies

**Binning strategy** selects:

- **Single-coverage binning (own/merged reads)** (default): each assembly is mapped
  against its corresponding original sample or group-merged reads. A co-assembly
  therefore has one pooled coverage profile in this branch.
- **Multi-coverage binning (all samples)**: every assembly is mapped against all
  original per-sample read sets, including when assembly uses groups. Individual
  sample coverage profiles are retained rather than replaced by merged reads.
- **Both**: run both branches and retain the union of their refined bins; append
  `_#` suffixes for conflicting flattened identifiers before downstream processing.

A member-restricted alternative would map only the individual samples belonging
to each co-assembly. This differs from both pooled single coverage and all-sample
multi coverage and is **not implemented** here. There is no automatic fallback
between the selected binning strategies.

## Refinement controls and outputs

**Bin refinement tool** selects **DAS Tool**, **Binette** (default), or **Both**
for both coverage branches. The parent merges selected refiner outputs per branch
before merging coverage branches. Binette receives parent completeness and
contamination-weight controls. SemiBin's environment selector applies only to
single mode: its co-mode wrapper does not expose that parameter.

**Run COMEBin**, **Run SemiBin?**, **Run CONCOCT?**, **Run MetaBAT2?**, and
**Run MaxBin2?** independently enable each binner; all default to **yes**.
Keep at least one binner enabled. Disabled binners contribute empty candidate
tables rather than blocking the selected refiner.

CONCOCT read length is computed automatically from both input mates: total
sequence length divided by total read count, rounded to the nearest integer.
Single uses selected/group-merged reads; Multi uses all original samples. No
manual read-length input is required.

Published checkpoints include coverage depth matrices and raw/refined bin outputs
for each coverage strategy, in addition to the original downstream results.
Coverage tables have three leading JGI fields followed by coverage/variance pairs:
one pair for single coverage, one pair per original sample for multi coverage.

## MAG quality and dereplication

CheckM2 does not report quality for degenerate or extremely short bins. dRep is therefore restricted to bins that CheckM2 actually assessed: the quality table is reduced to its identifier column and the flattened bin collection is filtered to that list before dereplication. This keeps the genome list and the quality metadata consistent, so a single unassessed bin cannot abort dereplication and the downstream abundance and report steps.

## MAGs Annotation and Quality Control

After binning, the resulting MAGs are **dereplicated** across all input samples based on **CheckM2 quality metrics** using **dRep**. The following processing steps are then performed:

* **Quality Control** via QUAST and CheckM/CheckM2
* **Abundance Estimation** per sample with CoverM

In previous versions, genome annotation and taxonomic annotation were also performed. This can now be done with dedicated and more comprehensive IWC workflows if needed:

* [MAG Genome Annotation](https://iwc.galaxyproject.org/workflow/mag-genome-annotation-parallel-main)
* [MAGs Taxonomy Annotation](https://iwc.galaxyproject.org/workflow/mags-taxonomy-annotation-main)
* [Functional Annotation of Sequences](https://iwc.galaxyproject.org/workflow/functional-annotation-of-sequences-main)
* [AMR Gene Detection](https://iwc.galaxyproject.org/workflow/amr_gene_detection-main)

All results are consolidated into a single **MultiQC report**.

## Input Requirements

Input reads must be quality-filtered, with host reads removed.
See other MAG workflows in IWC for quality filtering and host removal.

**Short reads:**

* QC: [Short Read QC & Trimming](https://iwc.galaxyproject.org/workflow/short-read-qc-trimming-main)
* Host removal: [Host Contamination Removal (Short Reads)](https://iwc.galaxyproject.org/workflow/host-contamination-removal-short-reads-main)

**Long reads:**

* QC: [Nanopore Pre-processing](https://iwc.galaxyproject.org/workflow/nanopore-pre-processing-main)
* Host removal: [Host Contamination Removal (Long Reads)](https://iwc.galaxyproject.org/workflow/host-contamination-removal-long-reads-main)

## Optional Modifications

Some modifications can be made via the workflow editor for specific use cases:

* Compare binners/bin refinement: add CheckM/CheckM2 to each binner/refiner and compare completeness, contamination, and number of bins.
* Downstream: compare differential abundance of MAGs in your samples based on metadata using Maaslin2.
* Downstream: compare your MAGs to a catalogue of MAGs for similar samples. Download desired MAGs from [MGnify genomes](https://www.ebi.ac.uk/metagenomics/browse/genomes) and query your MAGs via the [MGnify API](https://www.ebi.ac.uk/metagenomics/browse/genomes?browse-by=mag-search); download the genomes and compare in Galaxy, e.g., using dRep.

## Funding

This workflow was developed as part of the [**FAIRyMAGs** project](https://elixir-europe.org/how-we-work/scientific-programme/science/bfsp/fairymags), funded as a commissioned service of the [**Biodiversity, Food Security and Pathogens (BFSP) ELIXIR Scientific Programme 2024–2028**](https://elixir-europe.org/how-we-work/scientific-programme/science/bfsp).

The project was also supported by the **European Galaxy Server**, funded by the German Federal Ministry of Education and Research (BMBF; 031 A538A de.NBI-RBC) and the **Ministry of Science, Research and the Arts Baden-Württemberg (MWK)** within the framework of **LIBIS/de.NBI Freiburg**.

## Talks and Posters

* **ELIXIR All Hands Meeting 2025:** [Slides](https://f1000research.com/slides/14-595)
* **Galaxy Community Conference 2026 (GCC2026):** [Poster and Talk](https://zenodo.org/records/21128145)
* **HAL 2026:** [Publication](https://hal.science/hal-05724928)
* **FAIRyMAGs - a series of FAIR Galaxy workflows for the generation of metagenome assembled genomes** [Preprint](https://doi.org/10.64898/2026.07.31.741430)
