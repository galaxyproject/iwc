# RNA-seq single-read Workflow

## Inputs dataset

- The workflow needs a list of dataset of fastqsanger.
- As well as a gtf file with genes
- And a gtf file with regions to exclude from normalization in Cufflinks.

  - You can either put an empty file of datatype gtf
  - Or provide a gtf with usually chrM, for example for mm10:

```
chrM	chrM_gene	exon	0	16299	.	+	.	gene_id "chrM_gene_plus"; transcript_id "chrM_tx_plus"; exon_id "chrM_ex_plus";
chrM	chrM_gene	exon	0	16299	.	-	.	gene_id "chrM_gene_minus"; transcript_id "chrM_tx_minus"; exon_id "chrM_ex_minus";
```

## Inputs values

- forward adapter sequence: this depends on the library preparation. Usually classical RNA libraries are Truseq and ISML (relatively new Illumina library) is Nextera. If you don't know, use FastQC to determine if it is Truseq or Nextera. If the read length is relatively short (50bp), there is probably no adapter.
- reference_genome: this field will be adapted to the genomes available for STAR
- awk command to get read counts: STAR will output 3 values for counts depending on the strandness of the library. If you already know in advance the library strandness you can use this to extract only the value corresponding to your library:

  - ``NR>4{print $1"\t"$4}`` for reverse stranded library
  - ``NR>4{print $1"\t"$3}`` for forward stranded library
  - ``NR>4{print $1"\t"$2}`` for unstranded library

## Processing

- The workflow will remove adapters and low quality bases and filter out any read smaller than 15bp
- The filtered reads are mapped with STAR with ENCODE parameters (for long RNA-seq but I use it for short also). STAR is also used to count reads per gene.
- A multiQC is run to have an overview of the QC. This can also be used to get the strandness.
- FPKM values for reads and transcripts are computed with cufflinks using correction for multi-mapped reads.
- The BAM is filtered to keep only uniquely mapped reads (tag NH:i:1).
- Coverage unstranded, and each strand independently is computed with bedtools and normalized to the number of million uniquely mapped reads.
- The three coverage files are converted to bigwig.

### Warning

- The coverage stranded output depends on the strandness of the library:
  - If you have an unstranded library, stranded coverages are useless
  - If you have a reverse stranded library, use the label outside of the parenthesis: `positive (negative) strand coverage` is the positive strand coverage.
  - If you have a forward stranded library, use the label inside the parenthesis: `positive (negative) strand coverage` is the negative strand coverage.

## Contribution

@lldelisle wrote the workflow and the tests.

@nagoue updated the tools, made it work in usegalaxy.org, fixed some best practices.
