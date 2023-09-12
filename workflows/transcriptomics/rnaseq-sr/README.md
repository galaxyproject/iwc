# RNA-seq single-read Workflow

## Inputs dataset

- The workflow needs a list of datasets of fastqsanger.
- As well as a gtf file with genes
- Optional, but recommended: a gtf file with regions to exclude from normalization in Cufflinks.

  - For instance a gtf that masks chrM for the mm10 genome:

```
chrM	chrM_gene	exon	0	16299	.	+	.	gene_id "chrM_gene_plus"; transcript_id "chrM_tx_plus"; exon_id "chrM_ex_plus";
chrM	chrM_gene	exon	0	16299	.	-	.	gene_id "chrM_gene_minus"; transcript_id "chrM_tx_minus"; exon_id "chrM_ex_minus";
```

## Inputs values

- forward adapter sequence: this depends on the library preparation. Usually classical Illumina RNA libraries are Truseq and ISML (relatively new Illumina library) is Nextera. If you don't know, use FastQC to determine if it is Truseq or Nextera. If the read length is relatively short (50bp), there is probably no adapter so it will not impact your results.
- reference_genome: this field will be adapted to the genomes available for STAR
- strandness: For stranded RNA, reverse means that the read is complementary to the coding sequence, forward means that the read is in the same orientation as the coding sequence. This will help you to get from STAR only the counts corresponding to your library preparation. This is also used for the stranded coverage and for FPKM computation with cufflinks/StringTie.
- cufflinks_FPKM: Whether you want to get FPKM with Cufflinks (pretty long)
- stringtie_FPKM: Whether you want to get FPKM/TPM etc... with Stringtie.

## Processing

- The workflow will remove adapters and low quality bases and filter out any read smaller than 15bp.
- The filtered reads are mapped with STAR with ENCODE parameters (for long RNA-seq but I use it for short also). STAR is also used to count reads per gene and generate stranded specific normalized coverage (on uniquely mapped reads).
- A multiQC is run to have an overview of the QC. This can also be used to get the strandness.
- FPKM values for genes and transcripts are computed with cufflinks using correction for multi-mapped reads (this step is optionnal).
- FPKM/TPM values for genes are computed with StringTie (this step is optional).
- The BAM is filtered to keep only uniquely mapped reads (tag NH:i:1).
- Coverage unstranded is computed with bedtools and normalized to the number of million uniquely mapped reads.
- The three coverage files are converted to bigwig.

### Warning

- The coverage stranded output depends on the strandness of the library:
  - If you have an unstranded library, stranded coverages are useless
  - If you have a forward stranded library, the label matches the orientation of reads.
  - If you have a reverse stranded library, `forward` should correspond to genes on the forward strand and uses the reads mapped on the reverse strand. `reverse` should correspond to genes on the reverse strand and uses the reads mapped on the forward strand.

## Contribution

@lldelisle wrote the workflow and the tests.

@nagoue updated the tools, made it work in usegalaxy.org, fixed some best practices.
