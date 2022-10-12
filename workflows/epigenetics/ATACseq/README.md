# ATACseq Workflow

This workflow is highly concordant with the corresponding training material.
You can have more information about ATAC-seq analysis in the [slides](https://training.galaxyproject.org/training-material/topics/epigenetics/tutorials/atac-seq/slides.html) and the [tutorial](https://training.galaxyproject.org/training-material/topics/epigenetics/tutorials/atac-seq/tutorial.html).

## Inputs dataset

- The workflow needs a single input which is a list of dataset pairs of fastqsanger.

## Inputs values

- reference_genome: this field will be adapted to the genomes available for bowtie2 and the genomes available for bedtools slopbed (dbkeys table)
- effective_genome_size: this is used by macs2 and may be entered manually (indications are provided for heavily used genomes)

## Processing

- The workflow will remove nextera adapters and low quality bases and filter out any read smaller than 15bp.
- The filtered reads are mapped with bowtie2 allowing dovetail and fragment length up to 1kb.
- The BAM is filtered to keep only MAPQ30, concordant pairs and pairs outside of the mitochondria.
- The PCR duplicates are removed with Picard.
- The BAM is converted to BED to enable macs2 to take both pairs into account.
- The peaks are called with macs2 which at the same time generates a coverage file.
- The coverage file is converted to bigwig
- The amount of reads 500bp from summits and the total number of reads are computed if further normalization is wanted.
- Other QC are performed:
  - A histogram with fragment length is computed.
  - The evaluation of percentage of reads to chrM or MT is computed.
- A multiQC is run to have an overview of the QC.

### Warning

- The coverage output is not normalized.
- We are aware that the fact that a common reference file is used for bowtie2 and bedtools slopbed reduces the number of reference possible. Talk to your administrator if this brakes your research.
