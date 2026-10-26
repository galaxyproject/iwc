# Metagenome-Assembled Genomes (MAGs) Generation

This workflow assembles metagenomic short reads with optional long reads, bins the assemblies with five binners, refines the bins with DAS Tool and/or Binette, and reports dereplicated MAGs with their quality and abundance.

This workflow can be used on its own or integrated into other workflows. It is part of a **suite of workflows for end-to-end MAG generation and annotation** (check the [FAIRyMAGs repository](https://github.com/usegalaxy-eu/FAIRyMAGs) for the complete suite and its capabilities). A dedicated [learning pathway](https://galaxyproject.github.io/training-material/learning-pathways/mags.html) provides detailed guidance on how to use it.

This workflow:

1. [Groups reads using different possible strategies](#step-1-read-grouping),
2. [Assembles metagenomic short reads with optional long reads](#step-2-assembly-and-assembly-selection),
3. [Bins the assemblies with five binners](#step-3-binning),
4. [Refines the bins with DAS Tool and/or Binette](#step-4-bin-refinement),
5. [Filters MAGs by quality and dereplicates them](#step-5-mag-quality-filtering-and-dereplication),
6. [Generates abundance estimates and reports](#step-6-abundance-and-reports).

## Inputs

The form starts with the reads, then the assembly options, the sample grouping, the binning and refinement settings, and finally the MAG selection thresholds.

### Reads

- **Trimmed reads** (required): the original samples as a `list:paired` collection.
- **Trimmed Nanopore reads** and **Trimmed PacBio reads** (optional): two independent original-read `list` collections. Long reads are used only by metaSPAdes.

Reads must be quality-filtered with host reads removed. Prepare short reads with [Short Read QC & Trimming](https://iwc.galaxyproject.org/workflow/short-read-qc-trimming-main) and [Host Contamination Removal (Short Reads)](https://iwc.galaxyproject.org/workflow/host-contamination-removal-short-reads-main). Prepare long reads with [Nanopore Pre-processing](https://iwc.galaxyproject.org/workflow/nanopore-pre-processing-main) and [Host Contamination Removal (Long Reads)](https://iwc.galaxyproject.org/workflow/host-contamination-removal-long-reads-main).

### Assembly

- **Choose Assembler**: `MEGAHIT` (default), `metaSPAdes` or `Custom Assembly`.
- **Custom Assemblies**: required only with `Custom Assembly`; a `list` of assemblies, one per selected sample or group.
- **Minimum length of contigs to output** (default: 200).

### Sample grouping

- **Use grouping?**:
  - `Use original samples` (default): bin each sample on its own reads.
  - `Use grouping`: merge the reads of the samples that belong to the same group before assembly and binning.
  - `Use grouping and original samples`: run both, using grouped reads where they exist and original reads otherwise.
- **Metadata** and **Sample grouping column** (default: `group`): the table that defines the groups.
  - Metadata is optional, but it is the only way to define explicit groups. Without it, the grouping tool merges all samples into one group.
  - Use distinct sample and group names, and avoid underscores in group names, because of the pinned `fastq_groupmerge` (`1.0.2+galaxy0`) output discovery pattern.

### Binning and refinement

- **Binning strategy**: `Single-coverage binning (own/merged reads)` (default), `Multi-coverage binning (all samples)` or `Both`.
- **Run COMEBin**, **Run SemiBin?**, **Run CONCOCT?**, **Run MetaBAT2?** and **Run MaxBin2?** (default: enabled): enable or skip each binner. Keep at least one binner enabled.
- **Environment for the built-in model (SemiBin)** (default: `global`): the pretrained model used by SemiBin in single-coverage mode.
- **Bin refinement tool**: `Binette` (default), `DAS Tool` or `Both`.
- **CheckM2 Database**: the reference database Binette uses to assess bin quality.
- **Minimum MAG completeness percentage** (default: 75) and **Contamination weight (Binette)** (default: 2): the Binette settings used in both coverage branches.

### MAG selection thresholds

- **Minimum MAG length** (default: 50000),
- **Maximum MAG contamination percentage** (default: 25),
- **ANI threshold for dereplication** (default: 0.95).

These thresholds select the representative MAGs after CheckM2 assessment.

## Step 1: Read grouping

Grouping merges the reads of samples that belong to the same experimental group, so that a group can be assembled and binned as one sample. It is done separately for short reads, nanopore reads and PacBio reads.

- **Original mode** keeps every sample separate.
- **Grouped mode** merges the reads of each metadata-defined group.
- **Hybrid mode** keeps both: grouped reads where a group exists, original reads otherwise.
- Empty, sample-matched files stand in for missing long reads, so that a run without long reads keeps the same sample structure.

**Group short and long reads consistently**: use the same metadata table and the same grouping column for all read types. The workflow groups each read type on its own and then matches the results by identifier, so the groups must have the same names; otherwise the grouped long reads cannot be paired with the grouped short reads of the same group.

## Step 2: Assembly and assembly selection

Each selected sample or group is assembled into one assembly.

- **MEGAHIT** assembles short reads only.
- **metaSPAdes** can additionally use the grouped or per-sample nanopore and PacBio reads.
- **Custom Assembly** takes your own assemblies instead of running an assembler.

The selected assemblies are then checked with QUAST, and the assembly with the best statistics is kept as the assembly to bin.

**Custom assemblies must follow the selected samples.** Provide one FASTA per selected sample or group, in the same order, with identifiers matching the selected reads. Binning and coverage rely on this correspondence.

**Per-sample assemblies do not become a co-assembly.** Grouping merges reads, not assemblies. If your reads are grouped, supply one assembly per group, or let the workflow assemble the group; it does not combine five per-sample FASTAs into one co-assembly. If you want bins from a co-assembly, provide that co-assembly as a single element.

## Step 3: Binning

Binning splits each assembly into candidate genome bins. Five binners are available: CONCOCT, MaxBin2, MetaBAT2, SemiBin and COMEBin. Each uses a different combination of contig composition, coverage and marker genes, and each is optional.

The binning strategy decides which reads provide the coverage:

- **Single-coverage binning (own/merged reads)** (default): each assembly is mapped against its own original sample or group-merged reads. A co-assembly therefore has one pooled coverage profile in this branch.
- **Multi-coverage binning (all samples)**: every assembly is mapped against all original per-sample read sets, even when the assembly was built from grouped reads. Each sample keeps its own coverage profile.
- **Both**: run both branches and keep the union of their refined bins. Conflicting flattened identifiers receive `_#` suffixes.

A member-restricted alternative, which would map only the samples belonging to each co-assembly, is **not implemented**; it is different from both pooled single coverage and all-sample multi coverage. There is no automatic fallback between strategies.

The multi-coverage branch builds its assembly × read-sample matrix with native Flatten, Nested Cross Product and Apply Rules operations. These reuse the original read datasets instead of writing interlaced or de-interlaced FASTQ files, so intermediate read storage drops; the number of mapping jobs and BAM files still grows as assemblies × samples.

A binner set to `No` is skipped, and its candidate results are replaced by empty collections, so the refinement steps keep their structure. Raw binner outputs are only available for binners that ran.

CONCOCT read length is computed automatically from both input mates: total sequence length divided by total read count, rounded to the nearest integer. Single-coverage uses the selected or group-merged reads, multi-coverage uses all original samples. No manual read length is needed.

## Step 4: Bin refinement

Refinement reconciles the candidate bins of the individual binners into a final, non-redundant set, separately in each coverage branch.

- **DAS Tool** scores the contig-to-bin assignments of all enabled binners and selects a non-redundant set of bins.
- **Binette** evaluates the candidate FASTA bins with CheckM2 and refines them with the selected completeness and contamination settings.
- **Both** runs DAS Tool and Binette.

The parent merges the selected refiner outputs within each coverage branch, then merges the branches.

## Step 5: MAG quality filtering and dereplication

The refined bins of all samples and groups are pooled and assessed with CheckM2.

- CheckM2 does not report quality for degenerate or very short bins. The workflow therefore keeps only assessed bins before dereplication: the quality table is reduced to its identifier column, and the bin collection is filtered to that list. A single unassessed bin can then not abort dereplication and the downstream steps.
- **dRep** dereplicates the assessed MAGs with the selected minimum length, maximum contamination and ANI thresholds, and selects one representative per species-level cluster.

## Step 6: Abundance and reports

- **CoverM** estimates the abundance of each representative MAG in the original samples, and the per-sample tables are combined into one table.
- **CheckM**, **CheckM2** and **QUAST** assess the quality of the representative MAGs, and the assembly-quality tables are combined into one table.
- All results are collected in a single **MultiQC report**.

Genome annotation and taxonomic annotation are not part of this workflow. Use the dedicated workflows instead:

- [MAG Genome Annotation](https://iwc.galaxyproject.org/workflow/mag-genome-annotation-parallel-main)
- [MAGs Taxonomy Annotation](https://iwc.galaxyproject.org/workflow/mags-taxonomy-annotation-main)
- [Functional Annotation of Sequences](https://iwc.galaxyproject.org/workflow/functional-annotation-of-sequences-main)
- [AMR Gene Detection](https://iwc.galaxyproject.org/workflow/amr_gene_detection-main)

## Outputs

The workflow returns the final MAG tables (quality, abundance, MultiQC report) together with intermediate outputs you can inspect:

- **Coverage depth matrices**, one per assembly and coverage branch.
- **Raw bins** of each enabled binner, per assembly.
- **Refined bins** of each coverage branch, plus the selected and dereplicated MAGs.

The coverage depth matrices come from `jgi_summarize_bam_contig_depths`. Their first three columns are `contigName` (contig identifier), `contigLen` (contig length) and `totalAvgDepth` (average depth across the input BAM files). They are followed by one depth/variance column pair per BAM file: one pair for single coverage, and one pair per original sample for multi coverage.

## Optional modifications

Some modifications can be made in the workflow editor for specific use cases:

- **Compare binners and refiners**: add CheckM/CheckM2 after each binner or refiner and compare completeness, contamination and number of bins.
- **Differential abundance**: compare MAG abundance between sample groups with MaAsLin2.
- **Comparison with a catalogue**: download MAGs for similar samples from [MGnify genomes](https://www.ebi.ac.uk/metagenomics/browse/genomes) and compare them with yours, e.g. with dRep.

## Workflow structure

This workflow embeds smaller workflows as sub-workflow steps and adds shared inputs and downstream analysis. The embedded workflows perform:

- paired short-read grouping,
- Nanopore grouping,
- PacBio grouping,
- assembly and assembly selection,
- single-coverage binning,
- multi-coverage binning.

Refiner reconciliation, MAG quality assessment, dereplication, abundance estimation and reporting run after these subworkflows. The two binning workflows are also available independently ([single-sample binning](../single-sample-binning/), [multi-sample binning](../multi-sample-binning/)). Each stage is enclosed in a workflow-editor frame with a short explanation.

## Citation

When publishing results, cite the FAIRyMAGs workflow suite ([preprint, doi:10.64898/2026.07.31.741430](https://doi.org/10.64898/2026.07.31.741430)) and the tools used in your analysis. Record the workflow version and Galaxy server so the analysis can be reproduced.

## Funding

This workflow was developed as part of the [**FAIRyMAGs** project](https://elixir-europe.org/how-we-work/scientific-programme/science/bfsp/fairymags), funded as a commissioned service of the [**Biodiversity, Food Security and Pathogens (BFSP) ELIXIR Scientific Programme 2024–2028**](https://elixir-europe.org/how-we-work/scientific-programme/science/bfsp).

The project was also supported by the **European Galaxy Server**, funded by the German Federal Ministry of Education and Research (BMBF; 031 A538A de.NBI-RBC) and the **Ministry of Science, Research and the Arts Baden-Württemberg (MWK)** within the framework of **LIBIS/de.NBI Freiburg**.

## Talks and Posters

* **ELIXIR All Hands Meeting 2025:** [Slides](https://f1000research.com/slides/14-595)
* **Galaxy Community Conference 2026 (GCC2026):** [Poster and Talk](https://zenodo.org/records/21128145)
* **HAL 2026:** [Publication](https://hal.science/hal-05724928)
* **FAIRyMAGs - a series of FAIR Galaxy workflows for the generation of metagenome assembled genomes** [Preprint](https://doi.org/10.64898/2026.07.31.741430)
