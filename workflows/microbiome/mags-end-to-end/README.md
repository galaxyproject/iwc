# Metagenome-Assembled Genomes (MAGs) generation and annotation from raw reads

This workflow generates and annotates Metagenome-Assembled Genomes (MAGs) from raw metagenomic short (and optionally long) reads:

1. Quality control and host/contaminant removal of the short reads,
2. Optional quality control and host/contaminant removal of the long reads,
3. Assembly, binning, bin refinement, quality filtering, and dereplication of the MAGs,
4. [Optional] Taxonomic, genomic, and functional annotation of the MAGs.

Each analysis is an embedded workflow, so the steps, tools and parameters are visible at every stage.

## Embedded workflows

- Quality control and host/contaminant removal
  - [Short-read quality control and trimming](https://iwc.galaxyproject.org/workflow/short-read-qc-trimming-main/)
  - [Short-read host or contamination removal](https://iwc.galaxyproject.org/workflow/host-contamination-removal-short-reads-main/)
  - [Long-read quality control and contaminant filtering](https://iwc.galaxyproject.org/workflow/nanopore-pre-processing-main/)
  - [Long-read host or contamination removal](https://iwc.galaxyproject.org/workflow/host-contamination-removal-long-reads-main/)
- [Assembly, binning, bin refinement, quality filtering, and dereplication of the MAGs](https://iwc.galaxyproject.org/workflow/mags-building-main/)
- Taxonomic, genomic, and functional annotation of the MAGs
  - [MAGs taxonomy annotation](https://iwc.galaxyproject.org/workflow/mags-taxonomy-annotation-main/)
  - [MAG Genome Annotation Parallel](https://iwc.galaxyproject.org/workflow/mag-genome-annotation-parallel-main/)
  - [Functional annotation of sequences](https://iwc.galaxyproject.org/workflow/functional-annotation-of-sequences-main/)

The standalone workflows are the right choice when only one part of the analysis is needed. This draft embeds the pending MAG-generation redesign from IWC PR #1454 rather than the currently published interface; it must be synchronized with that PR and the upstream preprocessing workflows before release.

### Dependency maintenance: update upstream first

This workflow depends on all eight standalone workflows listed above. MAG generation also depends on its own assembly and binning subworkflows, described in its README. Embedded workflows are snapshots, not live references: merging an upstream change does not automatically update this workflow.

Update and validate the affected standalone subworkflow first, and merge that change into IWC before updating its embedded copy here. For assembly or binning changes, update the standalone assembly/binning workflow first, then MAG generation, and finally this end-to-end workflow. Preserve the intended integration settings, check input/output connections and defaults, and rerun the affected integration tests after synchronization. Changes to the internal grouping helpers belong in MAG generation before they are propagated here.

## Inputs

Provide raw `Paired-end short reads` as a `list:paired` collection, with one paired collection per sample. Optional `Long reads (Nanopore)` must be a `list` collection with matching sample identifiers; set `Long reads provided?` to `Yes` to use them. `Sample metadata` defines optional sample groups. Reference genomes and annotation databases must be available on the Galaxy server, or supplied through the corresponding history input where supported.

When supplying Nanopore reads, provide exactly one dataset per short-read sample, with the same identifiers in the same order. Partial long-read collections are not supported by the current positional fallback mapping. For PacBio inputs, use the standalone MAG-generation workflow instead; this end-to-end interface exposes Nanopore only.

**Current database limitation:** the run form still requires installed entries for `Host or contaminant genome (long reads)`, `GTDB-Tk Database`, `kMetaShot Database`, `Plasmid detection database`, `Bacterial genome annotation database` and `AMRFinderPlus database`, even when their branches are disabled. Disabling a branch does not currently remove these run-form requirements.

The run form groups the controls in this order:

- **Quality control and host removal:** reads, adapters, trimming thresholds, host genomes and long-read mapping profile.
- **MAG generation:** grouping, assembly, binners, refinement, quality filtering and dereplication.
- **Optional annotation:** separate taxonomy, genome and functional annotation switches and their databases. All three are disabled by default; set a switch to `Yes` to run that annotation workflow.

## 1. Quality control and host removal

### Short reads

`Paired-end short reads` must be a `list:paired` collection with one paired collection per sample.

The short reads are trimmed by the *Short-read quality control and trimming* workflow: fastp removes adapters and low-quality bases, and MultiQC summarises the read quality. Set `Adapter to remove on forward/reverse reads` if the adapters are known, otherwise fastp detects them. `Qualified quality score` and `Minimal read length` control the trimming.

The trimmed reads are then processed by the *Host or Contamination Removal on Short-Reads* workflow: Bowtie2 maps them against the selected host or contaminant genome and only the unmapped read pairs are kept. Choose `Use a built-in genome index` and give the name of an index installed on the server, or choose `Use a reference genome from the history` and upload the genome in `Host or contaminant genome file (short reads)`.

### Long reads (optional)

Long reads are optional. Upload them as a `list` collection (one dataset per sample) in `Long reads (Nanopore)` and set `Long reads provided?` to `Yes`. The long-read branch then runs:

- *Nanopore Preprocessing*: adapter and quality trimming, read statistics and Kraken2 contaminant filtering;
- *Host or Contamination Removal on Long-Reads*: minimap2 maps the reads against `Host or contaminant genome (long reads)` and only the unmapped reads are kept.

The long-read host genome is given as a built-in genome index, and `Long-read mapping profile` selects the minimap2 preset (`map-ont` for nanopore reads).

When `Long reads provided?` is `No`, the long-read branch is skipped. The workflow creates one empty FASTA per sample, named after the sample identifiers of the short reads. These empty files also give the skipped preprocessing branch a collection structure. Null placeholders from that branch are removed before selecting the empty files for assembly. This keeps the sample structure of the long-read collection consistent, so the same workflow runs with and without long reads.

## 2. Assembly, binning, bin refinement, quality filtering, and dereplication of the MAGs

The *Metagenome-Assembled Genomes (MAGs) generation* workflow:

1. Groups reads using the selected strategy,
2. Assembles metagenomic short reads with optional long reads,
3. Bins the assemblies with the enabled binners,
4. Refines the candidate bins,
5. Filters MAGs by quality and dereplicates them,
6. Generates abundance estimates and reports.

Its input controls are:

- `Choose Assembler`: MEGAHIT assembles the short reads, metaSPAdes assembles them with the long reads, and `Custom Assembly` uses the assemblies in `Custom assemblies` (one per sample, identifiers matching the reads).
- `Sample metadata`, `Use grouping?` and `Sample grouping column` control whether samples are analysed separately, merged into metadata-defined groups, or both.
- `Binning strategy` selects single-coverage binning (each assembly is covered by its own or its group-merged reads), multi-coverage binning (each assembly is covered by all samples) or both. The five binner switches (`Run COMEBin?`, `Run SemiBin?`, `Run CONCOCT?`, `Run MetaBAT2?`, `Run MaxBin2?`) choose which binners contribute candidate bins, and `Bin refinement tool` merges them with Binette and/or DAS Tool.
- `CheckM2 Database`, `Minimum MAG completeness percentage` and `Contamination weight (Binette)` set the bin quality thresholds used before refinement.
- `Minimum MAG length`, `Maximum MAG contamination percentage` and `ANI threshold for dereplication` select the final representative MAGs.

Outputs:

- `Selected assemblies`: the assembly FASTA files chosen for binning.
- `Assembly quality report`: quality statistics for those assemblies.
- Refined bins for each selected coverage strategy and the final `Dereplicated MAGs`.
- `MAG abundance table`, `MAG assembly quality table` and `MAG quality and abundance report`.

## 3. [Optional] Taxonomic, genomic, and functional annotation of the MAGs

Three annotation workflows run on the dereplicated MAGs. They are **optional and disabled by default**: set `Run taxonomy annotation?`, `Run genome annotation?` or `Run functional annotation?` to `Yes` to run one. Each annotation workflow is an embedded copy of a published workflow and is tested in its own workflow test, so a MAG generation run does not need to enable them. The database names must match databases installed on the Galaxy server.

- **Taxonomy annotation** uses GTDB-Tk and optionally kMetaShot.
  - Inputs: `GTDB-Tk Database`, `MAGs taxonomic classification with kMetaShot`, `kMetaShot Database`.
  - Outputs: `GTDB-Tk taxonomy summary`, `GTDB to NCBI taxonomy mapping`, `Taxonomy annotation report`.
- **Genome annotation** uses PlasmidFinder, Bakta, AMRFinderPlus, Integron Finder and ISEScan.
   - Inputs: `Plasmid detection database`, `Bacterial genome annotation database`, `Run Bakta`, `AMRFinderPlus database`.
   - ToolDistillator summaries are disabled in this end-to-end workflow; the underlying genome annotation tools still run when genome annotation is enabled.
  - Outputs: `Bakta gene annotation summary`, `Plasmid detection summary`, `Integron detection summary`, `Insertion sequence summary`, `Genome annotation report`.
- **Functional annotation** uses eggNOG-mapper and InterProScan.
  - Inputs: `Run eggNOG + completeness calculation`, `eggNOG mode select`, `Run InterProScan`, `InterProScan mode select`.
  - Outputs: `KEGG orthologue table`, `KEGG pathway table`, `eggNOG annotation abundance table`, `InterProScan annotation table`.
  - MAGs are nucleotide sequences, so `InterProScan mode select` defaults to `DNA/RNA` and `eggNOG mode select` defaults to `metagenome`.

## Input summary

### 1. Quality control and host removal

| Input | Description |
| --- | --- |
| `Paired-end short reads` | `list:paired` collection, one paired collection per sample (required) |
| `Long reads (Nanopore)` | `list` collection, one dataset per sample (optional) |
| `Long reads provided?` | `Yes` to run the long-read branch |
| `Adapter to remove on forward/reverse reads` | adapter sequences for fastp (optional) |
| `Qualified quality score`, `Minimal read length` | fastp trimming thresholds |
| `Choose Reference Genome`, `Host or contaminant genome (short reads)`, `Host or contaminant genome file (short reads)` | host/contaminant genome for the short reads |
| `Host or contaminant genome (long reads)`, `Long-read mapping profile` | host genome and minimap2 preset for the long reads |

### 2. Assembly, binning, bin refinement, quality filtering, and dereplication of the MAGs

| Input | Description |
| --- | --- |
| `Sample metadata`, `Use grouping?`, `Sample grouping column` | sample grouping before assembly and binning |
| `Choose Assembler`, `Minimum length of contigs to output`, `Custom assemblies` | assembly |
| `Binning strategy`, `Run COMEBin?`, `Run SemiBin?`, `Run CONCOCT?`, `Run MetaBAT2?`, `Run MaxBin2?`, `Environment for the built-in model (SemiBin)` | binning |
| `Bin refinement tool`, `CheckM2 Database`, `Minimum MAG completeness percentage`, `Contamination weight (Binette)` | bin refinement |
| `Minimum MAG length`, `Maximum MAG contamination percentage`, `ANI threshold for dereplication` | MAG selection |

### 3. [Optional] Taxonomic, genomic, and functional annotation of the MAGs

| Input | Description |
| --- | --- |
| `Run taxonomy annotation?`, `GTDB-Tk Database`, `MAGs taxonomic classification with kMetaShot`, `kMetaShot Database` | taxonomy annotation |
| `Run genome annotation?`, `Plasmid detection database`, `Bacterial genome annotation database`, `AMRFinderPlus database`, `Run Bakta` | genome annotation |
| `Run functional annotation?`, `Run eggNOG + completeness calculation`, `eggNOG mode select`, `Run InterProScan`, `InterProScan mode select` | functional annotation |

## Citation

When publishing results, cite the FAIRyMAGs workflow suite ([preprint, doi:10.64898/2026.07.31.741430](https://doi.org/10.64898/2026.07.31.741430)) and the tools used in your analysis. Record the workflow version and Galaxy server so the analysis can be reproduced.

## Funding

This workflow was developed as part of the [**FAIRyMAGs** project](https://elixir-europe.org/how-we-work/scientific-programme/science/bfsp/fairymags), funded as a commissioned service of the [**Biodiversity, Food Security and Pathogens (BFSP) ELIXIR Scientific Programme 2024–2028**](https://elixir-europe.org/how-we-work/scientific-programme/science/bfsp).

The project was also supported by the **European Galaxy Server**, funded by the German Federal Ministry of Education and Research (BMBF; 031 A538A de.NBI-RBC) and the **Ministry of Science, Research and the Arts Baden-Württemberg (MWK)** within the framework of **LIBIS/de.NBI Freiburg**.
