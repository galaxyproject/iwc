# Single-sample binning workflow

This workflow turns metagenomic assemblies into metagenomic bins with five binners (CONCOCT, MaxBin2, MetaBAT2, SemiBin and COMEBin), using the coverage of each sample's own reads, and refines the bins with DAS Tool and/or Binette.

It is the binning part of the [MAGs generation workflow](../mags-building/), extracted as its own workflow so that MAG generation and other workflows can reuse it instead of maintaining their own copy (check the [FAIRyMAGs repository](https://github.com/usegalaxy-eu/FAIRyMAGs) for the complete workflow suite and its capabilities).
A dedicated [learning pathway](https://galaxyproject.github.io/training-material/learning-pathways/mags.html) provides detailed guidance on MAG generation in Galaxy, including the binning tools used here.

## How single-sample binning works

Each assembly is binned with the coverage of its own reads. Compared with [multi-sample binning](../multi-sample-binning/), which maps the reads of every sample against the assemblies of all samples, this workflow needs far fewer mapping jobs and much less storage, but the binners cannot use abundance patterns across samples, so the bins are usually somewhat worse.

Use single-sample binning when:

- there are many samples,
- the samples come from unrelated environments, or
- storage is limited.

Prefer multi-sample binning when resources allow and the samples come from related environments.

## Inputs

- **Assemblies**: a `list` collection of assemblies from any assembler (e.g. MEGAHIT or metaSPAdes).
- **Paired-end reads**: a `list:paired` collection with one element per sample.
  - Reads should be quality-trimmed and host-removed, e.g. with the IWC [short-read quality control](../../read-preprocessing/short-read-qc-trimming/) and [host contamination removal](../host-contamination-removal/host-contamination-removal-short-reads/) workflows.
  - Reads and assemblies are paired by position, not by element identifier: both collections must have the same number of elements, in the same order (e.g. sorted the same way).
  - The sample names become the coverage columns of the binners.
- **Run COMEBin?**, **Run SemiBin?**, **Run CONCOCT?**, **Run MetaBAT2?** and **Run MaxBin2?** (default: `Yes`): enable or skip each binner independently.
  - Keep at least one binner enabled.
  - COMEBin is the most time- and resource-consuming binner.
- **Environment for the built-in model (SemiBin)** (default: `global`): the pretrained model environment used by SemiBin in single-sample mode.
- **Bin refinement tool** (default: `Binette`): `Binette`, `DAS Tool` or `Both`.
- **CheckM2 Database**: the CheckM2 reference database Binette uses to assess bin quality.
- **Minimum MAG completeness percentage** (default: 40): the minimum bin completeness used by Binette. It does not filter DAS Tool output.
- **Contamination weight (Binette)** (default: 2): the contamination penalty used in Binette's scoring.

## Step 1: Coverage

This step produces the coverage information every binner needs.

1. Bowtie2 maps each sample's reads against its own assembly, and Samtools sorts the alignments by coordinate.
2. Contig depths are summarised with `jgi_summarize_bam_contig_depths`, which yields one coverage matrix per assembly.
3. CONCOCT additionally needs the coverage of its contig fragments, which is computed separately, and the mean read length, which is estimated from both mates of every sample with SeqKit statistics. The estimate is the read-count-weighted mean (total bases divided by total reads), not an average of the per-sample means. No manual read length is required.
4. COMEBin expects each sample's alignments nested in a collection, which is prepared here.

## Step 2: Binning

Each assembly is binned separately by every enabled binner.

| Binner | Inputs used |
| --- | --- |
| SemiBin | Contig composition and coverage, with the selected pretrained model environment |
| CONCOCT | Contig fragments, their coverage table and the estimated read length; fragment clusters are merged back to contigs |
| MetaBAT2 | Contig composition and coverage |
| MaxBin2 | Contig composition, coverage and marker genes |
| COMEBin | Deep-learning binning from contig sequence and coverage; optional |

A binner set to `No` is skipped, and its candidate results are replaced by empty collections so that the refinement steps keep their structure. Raw binner outputs are only available for binners that ran.

## Step 3: Refinement

The candidate bins are refined with one or both refinement tools:

- **DAS Tool** scores the contig-to-bin assignments of all enabled binners and selects a non-redundant set of bins.
- **Binette** evaluates the candidate FASTA bins with CheckM2 and refines them with the selected completeness and contamination settings.

## Outputs

- **Coverage depth matrices**: one depth table per assembly, with the coverage of that assembly's own reads.
- **CONCOCT bins**, **MaxBin2 bins**, **MetaBAT2 bins**, **SemiBin bins** and **COMEBin bins** (when COMEBin ran): one list of bins per assembly.
- **DAS Tool bins**, **DAS Tool summary** and **DAS Tool contigs2bin report** (when DAS Tool ran): the refined bins, a per-bin summary of completeness and redundancy based on single-copy genes, and the contig-to-bin assignments.
- **Binette bins**, **Binette input bin quality reports** and **Binette final bin quality report** (when Binette ran): the refined bins, the CheckM2 quality of the bins from each binner, and the CheckM2 quality of the final bins.

## Why use this workflow

Binning is a separate workflow here, so it can be reused by larger analysis pipelines without copying or rewiring it.

- It keeps the binning parameters and outputs visible and controllable.
- It can be combined with different upstream and downstream workflows, e.g. taxonomic classification, genome annotation, functional analysis or benchmarking.
- It avoids duplicating binning logic inside every pipeline that needs it.

The IWC [MAGs generation workflow](https://iwc.galaxyproject.org/workflow/mags-building-main/) is the comprehensive alternative: it assembles reads, bins with multiple tools, dereplicates the MAGs and reports their quality and abundance in one workflow. Use it when you want MAGs and their evaluation without a specialised downstream workflow, and use this binning workflow when binning is one component of a larger analysis.

When this workflow is used as a sub-workflow, the parent workflow can restrict its options, for example by fixing the **Bin refinement tool** parameter so that users can only run one specific refinement tool.

## Funding

This workflow was developed as part of the [**FAIRyMAGs** project](https://elixir-europe.org/how-we-work/scientific-programme/science/bfsp/fairymags), funded as a commissioned service of the [**Biodiversity, Food Security and Pathogens (BFSP) ELIXIR Scientific Programme 2024–2028**](https://elixir-europe.org/how-we-work/scientific-programme/science/bfsp).

The project was also supported by the **European Galaxy Server**, funded by the German Federal Ministry of Education and Research (BMBF; 031 A538A de.NBI-RBC) and the **Ministry of Science, Research and the Arts Baden-Württemberg (MWK)** within the framework of **LIBIS/de.NBI Freiburg**.
