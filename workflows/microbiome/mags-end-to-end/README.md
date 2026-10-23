# Metagenome-Assembled Genomes (MAGs) end-to-end analysis

This workflow runs a complete short- and long-read metagenome analysis, from raw reads to annotated MAGs:

1. quality control and host/contaminant removal of the short reads,
2. optional quality control and host/contaminant removal of long reads,
3. assembly, binning, bin refinement and dereplication of the MAGs,
4. optional taxonomic, genome and functional annotation of the MAGs.

Each analysis is an embedded workflow, so the steps, tools and parameters are visible at every stage.

## Embedded workflows

| Stage | Workflow |
| --- | --- |
| Short-read quality control and trimming | [`short-read-quality-control-and-trimming`](../../read-preprocessing/short-read-qc-trimming/) |
| Short-read host or contamination removal | [`host-or-contamination-removal-on-short-reads`](../host-contamination-removal/host-contamination-removal-short-reads/) |
| Long-read quality control and contaminant filtering | [`Nanopore Pre-processing`](../pathogen-identification/nanopore-pre-processing/) |
| Long-read host or contamination removal | [`host-or-contamination-removal-on-long-reads`](../host-contamination-removal/host-contamination-removal-long-reads/) |
| MAG generation | [`MAGs generation`](../mags-building/) |
| MAG taxonomy annotation | [`MAGs taxonomy annotation`](../mags-taxonomy-annotation/) |
| MAG genome annotation | [`MAG Genome Annotation Parallel`](../mag-genome-annotation-parallel/) |
| MAG functional annotation | [`Functional annotation of sequences`](../../genome_annotation/functional-annotation/functional-annotation-of-sequences/) |

The embedded copies are kept in sync with the standalone workflows; the standalone versions are the right choice when only one part of the analysis is needed.

## 1. Reads, quality control and host removal

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

## 2. Assembly, binning and MAG selection

The *Metagenome-Assembled Genomes (MAGs) generation* workflow runs the main analysis:

- `Choose Assembler`: MEGAHIT assembles the short reads, metaSPAdes assembles them with the long reads, and `Custom Assembly` uses the assemblies in `Custom assemblies` (one per sample, identifiers matching the reads).
- `Sample metadata`, `Use grouping?` and `Sample grouping column` control whether samples are analysed separately, merged into metadata-defined groups, or both.
- `Binning strategy` selects single-coverage binning (each assembly is covered by its own or its group-merged reads), multi-coverage binning (each assembly is covered by all samples) or both. The five binner switches (`Run COMEBin?`, `Run SemiBin?`, `Run CONCOCT?`, `Run MetaBAT2?`, `Run MaxBin2?`) choose which binners contribute candidate bins, and `Bin refinement tool` merges them with Binette and/or DAS Tool.
- `CheckM2 Database`, `Minimum MAG completeness percentage` and `Contamination weight (Binette)` set the bin quality thresholds used before refinement.
- `Minimum MAG length`, `Maximum MAG contamination percentage` and `ANI threshold for dereplication` select the final representative MAGs.

The workflow reports the selected assemblies (`Selected assemblies`, `Assembly quality report`), the refined bins of every coverage strategy, the dereplicated MAGs (`Dereplicated MAGs`), their abundance (`MAG abundance table`), their assembly quality (`MAG assembly quality table`) and a combined report (`MAG quality and abundance report`).

## 3. MAG annotation (optional)

Three annotation workflows run on the dereplicated MAGs. Each can be skipped by setting its switch to `No`; the database names must match databases installed on the Galaxy server.

- *Taxonomy* (`Run taxonomy annotation?`): classified with GTDB-Tk (`GTDB-Tk Database`) and optionally with kMetaShot (`MAGs taxonomic classification with kMetaShot`, `kMetaShot Database`). Outputs: `GTDB-Tk taxonomy summary`, `GTDB to NCBI taxonomy mapping`, `Taxonomy annotation report`.
- *Genome annotation* (`Run genome annotation?`): PlasmidFinder (`Plasmid detection database`), Bakta (`Bacterial genome annotation database`, `Run Bakta`), AMRFinderPlus (`AMRFinderPlus database`), Integron Finder and ISEScan. Outputs: `Bakta gene annotation summary`, `Plasmid detection summary`, `Integron detection summary`, `Insertion sequence summary`, `Genome annotation report`.
- *Functional annotation* (`Run functional annotation?`): eggNOG-mapper (`Run eggNOG + completeness calculation`, `eggNOG mode select`), InterProScan (`Run InterProScan`, `InterProScan mode select`) and KEGG pathway tables. MAGs are nucleotide sequences, so `InterProScan mode select` defaults to `DNA/RNA` and `eggNOG mode select` defaults to `metagenome`. Outputs: `KEGG orthologue table`, `KEGG pathway table`, `eggNOG annotation abundance table`, `InterProScan annotation table`.

## Input summary

| Input | Description |
| --- | --- |
| `Paired-end short reads` | `list:paired` collection, one paired collection per sample (required) |
| `Long reads (Nanopore)` | `list` collection, one dataset per sample (optional) |
| `Long reads provided?` | `Yes` to run the long-read branch |
| `Adapter to remove on forward/reverse reads` | adapter sequences for fastp (optional) |
| `Qualified quality score`, `Minimal read length` | fastp trimming thresholds |
| `Choose Reference Genome`, `Host or contaminant genome (short reads)`, `Host or contaminant genome file (short reads)` | host/contaminant genome for the short reads |
| `Host or contaminant genome (long reads)`, `Long-read mapping profile` | host genome and minimap2 preset for the long reads |
| `Sample metadata`, `Use grouping?`, `Sample grouping column` | sample grouping before assembly and binning |
| `Choose Assembler`, `Minimum length of contigs to output`, `Custom assemblies` | assembly |
| `Binning strategy`, `Run COMEBin?`, `Run SemiBin?`, `Run CONCOCT?`, `Run MetaBAT2?`, `Run MaxBin2?`, `Environment for the built-in model (SemiBin)` | binning |
| `Bin refinement tool`, `CheckM2 Database`, `Minimum MAG completeness percentage`, `Contamination weight (Binette)` | bin refinement |
| `Minimum MAG length`, `Maximum MAG contamination percentage`, `ANI threshold for dereplication` | MAG selection |
| `Run taxonomy annotation?`, `GTDB-Tk Database`, `MAGs taxonomic classification with kMetaShot`, `kMetaShot Database` | taxonomy annotation |
| `Run genome annotation?`, `Plasmid detection database`, `Bacterial genome annotation database`, `AMRFinderPlus database`, `Run Bakta` | genome annotation |
| `Run functional annotation?`, `Run eggNOG + completeness calculation`, `eggNOG mode select`, `Run InterProScan`, `InterProScan mode select` | functional annotation |
