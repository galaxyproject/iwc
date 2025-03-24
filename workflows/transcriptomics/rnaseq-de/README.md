# RNA-Seq Differential Expression Analysis with Visualization

This workflow works only with an experimental setup containing exactly 2 conditions with at least 2 replicates per condition.

## Inputs dataset

- Counts from changed condition: Counts from experimental condition or changed condition. For eg. counts from treatment or knockdown samples.
- Counts from reference condition: Counts from reference condition or base condition. For eg. counts from untreated or wildtype samples.
- Gene Annotaton: The same GTF file used for mapping and quantification. It is used to annotate the DESeq2 results table. Ideally, the GTF file should contain `gene_id`, `gene_biotype` and `gene_name` attributes.

## Inputs values

- Count files have header: Indicate whether your input count files have a header line. Usually, count files generated from featureCounts tool have a header line whereas count files from RNA-STAR do not have.
- Adjusted p-value threshold: All the genes with an adjusted p-value less than this value are considered as differentially expressed. With a value of 0.05, expect 5% of false positives in the differentially expressed genes list. If empty, a default value of 0.05 is used.
- log2 fold change threshold: All the genes with an absolute fold change (regarless of up or down regulation) more than this value are selected. A log2 FC of 3 equals to an absolute fold change of 8 (2³). If empty, a default value of 1.0 is used.

## Processing

- The workflow uses DESeq2 for performing differential expression analysis. In addition to the results table, it also produces normalized counts table.
- The results table is annotated with gene positions, biotypes, gene symbols.
- The annotated results table is further filtered with the input adjusted p-value and log2 fold change thresholds.
- A valcano plot is generated with top 10 significantly differentially expressed genes.
- A heatmap of log trasformed normalized counts and another heatmap of Z-scores is generated.
