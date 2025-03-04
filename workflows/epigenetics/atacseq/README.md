# ATAC-seq Analysis: Chromatin Accessibility Profiling

This workflow is highly concordant with the corresponding training material.
You can have more information about ATAC-seq analysis in the [slides](https://training.galaxyproject.org/training-material/topics/epigenetics/tutorials/atac-seq/slides.html) and the [tutorial](https://training.galaxyproject.org/training-material/topics/epigenetics/tutorials/atac-seq/tutorial.html).

## Inputs dataset

- The workflow needs a single input which is a list of dataset pairs of fastqsanger.

## Inputs values

- reference_genome: this field will be adapted to the genomes available for bowtie2 and the genomes available for bedtools slopbed (dbkeys table)
- effective_genome_size: this is used by macs2 and may be entered manually (indications are provided for heavily used genomes)
- bin_size: this is used when normalization of coverage is performed. Large values will allow to have smaller output files but with less resolution while small values will increase computation time and size of output files to produce more resolutive bigwigs.

## Processing

- The workflow will remove nextera adapters and low quality bases and filter out any read smaller than 15bp.
- The filtered reads are mapped with bowtie2 allowing dovetail and fragment length up to 1kb.
- The BAM is filtered to keep only MAPQ30, concordant pairs and pairs outside of the mitochondria.
- The PCR duplicates are removed with Picard (only from version 0.8).
- The BAM is converted to BED to enable macs2 to take both pairs into account.
- The peaks are called with macs2 which at the same time generates a coverage file.
- The coverage file is converted to bigwig
- The amount of reads 500bp from summits and the total number of reads are computed.
- Two normalizations are computed:
  - By million reads
  - By million reads in peaks (500bp from summits)
- Other QC are performed:
  - A histogram with fragment length is computed.
  - The evaluation of percentage of reads to chrM or MT is computed.
- A multiQC is run to have an overview of the QC.

### Warning

- The `reference_genome` parameter value is used to select references in bowtie2 and bedtools slopbed. Only references that are present in bowtie2 **and** bedtools slopbed are selectable. If your favorite reference genome is not available ask your administrator to make sure that each bowtie2 reference has a corresponding len file for use in bedtools slopbed.
