# Taxonomy Assignment with QIIME2 

This workflow performs taxonomic assignment for an input OTU/ASV (Operating Taxonomic Unit/Amplicon Sequence Variant) Feature Table and set of amplicon Representative Sequences using QIIME2. The workflow creates and trains a QIIME2 classifier for an input reference taxonomic database (e.g. [HOMD](https://www.homd.org), [SILVA](https://www.arb-silva.de), [PR2](https://pr2-database.org), [UNITE](https://unite.ut.ee)) and uses the trained classifier to assign taxonomy to OTUs/ASVs in the input Feature Table.

## Inputs
  - Feature Table [`biom2`]: OTU table with ASVs in rows and samples in columns containing ASV counts per sample (can be the output from previous QIIME2 or DADA2 processing).
  - Representative Sequences [`fasta`]: File containing sequences for all ASVs detected in the samples (can be the output from previous QIIME2 or DADA2 processing).
  - Reference sequences [`fasta`]: File containing sequences for the chosen reference taxonomy database.
  - Reference taxonomy [`tabular`]: File containing taxonomy assigned to sequences in the reference taxonomy database.
  - Forward Primer Sequence [`text`]: Forward primer sequence (5' -> 3'). Required for **qiime2 feature-classifier extract-reads** (input parameter: `f_primer`). Default value is the primer for the 16S rRNA V3-V4 region (`CCTAYGGGRBGCASCAG`).
  - Reverse Primer Sequence [`text`]: Reverse primer sequence (5' -> 3'). Required for **qiime2 feature-classifier extract-reads** (input parameter: `r_primer`). Default value is the primer for the 16S rRNA V3-V4 region (`GGACTACNNGGGTATCTAAT`).

## Outputs
  - OTU/ASV table [`csv`]: Modified version of input Feature Table with additional column with the assigned taxonomy and assignment confidence for each ASV as additional columns.
  - Feature Table Summary [`html`]: QIIME2 visualisation of the input OTU/ASV Feature Table `biom2` dataset
  - Representative Sequences Summary [`html`]: QIIME2 visualisation of the input Representative Sequences `fasta` dataset
  - Taxonomy Bar Plot [`qzv`]: Interactive bar plot for OTU/ASV table with assigned taxonomy (**this dataset cannot be viewed in Galaxy**; to view this dataset, export it from Galaxy and use a dedicated QIIME2 viewer, e.g. [https://view.qiime2.org/](https://view.qiime2.org/)).

## Processing Steps
  1. Convert all input datasets to QIIME2 artefacts using **qiime2 tools import**.
  2. Summarise the Feature Table and Representative Sequences datasets using **qiime2 feature-table summarize** and **qiime2 feature-table tabulate-seqs**, respectively, and extract `html` visualisations that can be viewed in Galaxy using **QIIME vizualisation extractor**.
  3. Extract reference sequences (for the input reference taxonomy database) for training the feature classifier using **qiime2 feature-classifier extract-reads**.
  4. Train the QIIME2 Naive Bayes feature classifier on the reference database (extracted sequences and taxonomy) using **qiime2 feature-classifier fit-classifier-naive-bayes**.
  5. Run the classifier on the amplicon Representative Sequences to assign taxonomy to the sample ASVs using **qiime2 feature-classifier classify-sklearn**.
  6. Create a summary visualisation of the taxonomy assigned to the sample dataset using **qiime2 taxa barplot**.
  7. Export the assigned taxonomy table from a QIIME2 artefact to `tsv` using **qiime2 tools export**.
  8. Convert the output `tsv` table to `tabular` format using **Convert tabular to CSV** and **Convert CSV to tabular** (requires intermediate conversion to `csv`).
  9. Convert the `biom2` Feature Table to `tabular` using **Convert between BIOM table formats**.
  10. Combine the ASV taxonomy assignment and Feature Table `tabular` datasets using **Remove beginning** and **Join**. 
  11. Convert the combined OTU/ASV table from `tabular` to `csv` format using **Convert tabular to CSV**.

## Contribution

Workflow created by Tristan Reynolds (provided Galaxy and bioinformatics expertise) and Amy Loughman (provided scientific requirements and expertise).
