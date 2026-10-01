# eggNOG-mapper Annotation Abundance Tables

This workflow extracts and consolidates annotation abundance tables (e.g., GO, KEGG) from eggNOG-mapper outputs across a collection of samples. It counts the occurrences of annotation terms in each sample, combines corresponding terms across the collection, and produces both separate tables for each annotation type and one table containing all annotation types.

## Inputs

- **eggNOG-mapper annotations**: a collection (`list`) of tabular eggNOG-mapper output files, with one element per sample. The element identifiers are used as sample names in the generated abundance tables. The files must contain the standard eggNOG-mapper annotation columns, including the eggNOG ortholog group, COG category, GO terms, EC numbers, and KEGG and other database annotations.

The eggNOG-mapper output collection can be generated, for example, with the IWC *Functional annotation of protein or DNA sequences* workflow. This workflow does not run eggNOG-mapper itself; it summarizes existing eggNOG-mapper outputs.

## Workflow Overview

1. **Annotation extraction** from each eggNOG-mapper output using the following annotation columns:

	- eggNOG ortholog groups
	- COG categories
	- Gene Ontology (GO) terms
	- Enzyme Commission (EC) numbers
	- KEGG Orthology (KO) identifiers
	- KEGG pathways
	- KEGG modules
	- KEGG reactions
	- KEGG reaction classes
	- BRITE hierarchies
	- KEGG transporter classification (TC) identifiers
	- CAZy families
	- BiGG reactions
	- PFAM domains

2. **Abundance calculation** by counting each annotation term in every sample, while ignoring missing annotations represented by `-`.

3. **Consolidation** by joining the per-sample tables for each annotation type and combining all annotation types into a single table.

## Outputs

- Separate abundance tables for eggNOG ortholog groups, COG categories, GO terms, EC numbers, KEGG KOs, KEGG pathways, KEGG modules, KEGG reactions, KEGG reaction classes, BRITE hierarchies, KEGG TC identifiers, CAZy families, BiGG reactions, and PFAM domains.
- **eggNOG-mapper annotation abundance table**: a combined table containing all annotation types, their identifiers, and their per-sample abundances.

Outputs for annotation types that are absent from the input data may be empty.

## Comparison with similar workflows

- **Functional annotation of protein or DNA sequences** (`genome_annotation/functional-annotation/functional-annotation-of-sequences`): runs eggNOG-mapper and InterProScan to annotate protein or DNA sequences. Use it when functional annotations must first be generated from sequences; use this workflow afterward to summarize eggNOG-mapper results across samples.
- **Metagenomic genes catalogue** (`microbiome/metagenomic-genes-catalogue`): builds and annotates a metagenomic gene catalogue and can include eggNOG-mapper annotation as part of a broader metagenomic analysis. Use this workflow when you need catalogue construction and downstream gene or resistance analysis, rather than only abundance tables from existing eggNOG-mapper outputs.
