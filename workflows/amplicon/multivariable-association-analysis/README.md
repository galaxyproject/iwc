# Multivariable Association Analysis of Amplicon Data

This workflow performs downstream analysis of processed amplicon sequencing
data, starting from a phyloseq object (ASV/OTU abundance table and taxonomy)
and a matching sample metadata table. It covers sequencing-control QC,
contaminant identification and removal with Decontam, batch-effect correction
with MMUPHin, taxonomic agglomeration and multivariable association analysis
with MaAsLin3.

## Relationship to other IWC amplicon workflows

This workflow starts where the amplicon processing workflows stop. Reads can
first be processed with workflows such as DADA2 or with tools such as Lotus2
to obtain a phyloseq object. Use this workflow to analyse that phyloseq object
together with the sample metadata.

## Inputs

- **Phyloseq object**: ASV/OTU abundance table with a 7-rank taxonomy
  (Kingdom, Phylum, Class, Order, Family, Genus, Species).
- **Metadata**: tabular sample metadata with a header line. The first column
  must contain the sample identifiers, matching the sample names in the
  phyloseq object.
- **Negative-control column number (0 = none)**: metadata column with binary
  `0`/`1` values, where `1` marks a negative control sample. Enter `0` if the
  data has no negative controls; Decontam and the negative-control QC are then
  skipped.
- **Positive-control column number (0 = none)**: metadata column with binary
  `0`/`1` values, where `1` marks a positive control sample. Enter `0` if the
  data has no positive controls.
- **Batch-ID column number (0 = none)**: metadata column with the batch
  identifier used by MMUPHin. Enter `0` to skip batch-effect correction.
- **MaAsLin3 model formula**: formula using metadata column names, without the
  leading `~` (for example `disease + age`). See the
  [MaAsLin3 tutorial](https://www.bioconductor.org/packages/release/bioc/vignettes/maaslin3/inst/doc/maaslin3_tutorial.html) for
  the syntax.
- **MaAsLin3 reference level**: reference for a categorical variable, written
  as `variable,reference`.
- **MaAsLin3 maximum significance (q-value)**, **normalization**,
  **transformation** and **q-value correction**: passed to both MaAsLin3 runs.

## What the workflow does

1. Negative controls, if provided, are used by Decontam to identify and remove
   contaminant ASVs. QC heatmaps and ordinations of the control samples are
   produced before and after decontamination.
2. Negative- and positive-control samples are removed, giving the
   analysis-ready data.
3. The workflow then splits into two independent branches:
   - **MMUPHin batch-effect correction** produces a batch-corrected ASV table
     and phyloseq object for use in any further analysis.
   - **MaAsLin3** is run on the analysis-ready data *before* batch correction,
     both at ASV level and after agglomeration to genus level. MaAsLin3 models
     covariates directly, so to account for batch effects, add the batch
     variable to the MaAsLin3 model formula instead of using the MMUPHin
     output.

## Outputs

- Decontam plots and control-QC heatmaps and ordinations (only when the
  corresponding controls are provided).
- Analysis-ready phyloseq object (controls and contaminants removed, before
  batch correction).
- MMUPHin batch-corrected ASV table, phyloseq object and diagnostic plot (only
  when a batch column is provided).
- MaAsLin3 results at ASV level and at genus level: all results, significant
  features and a summary plot.
- Volcano plot of the ASV-level MaAsLin3 results.
