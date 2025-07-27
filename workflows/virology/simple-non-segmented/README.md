# Variant calling and consensus sequence construction from paired-end sequencing data of simple non-segmented viruses

This workflow performs variant calling and consensus sequence generation for batches of Illumina PE sequenced viruses with uncomplicated and stable genome structure (like e.g. Morbilliviruses).
It can handle both ampliconic and non-ampliconic data. If a primer scheme is provided as optional input, this is taken to indicate ampliconic sequencing data and the scheme will be used as the basis for trimming of primer sequences from mapped reads and for the exclusion of reads mapping beyond amplicon boundaries. Without a primer scheme non-ampliconic data is assumed.

It uses:
- **fastp** for sequenced reads pre-processing,
- **bwa mem** for mapping
- **samtools view** to keep only reads mapped in a proper pair with a mapping quality > 20
- **lofreq viterbi** to realign mapped reads around indels
- **ivar trim** for trimming of primer sequences from mapped reads and read filtering; gets skipped if no *"Primer scheme"* input is provided
- **ivar call** and **ivar consensus** for parallel calling of variants and consensus sequence generation
- **SnpEff** for annotating variant calls with their functional genomic effects on the features declared in the *"Reference annotation"*
- **SnipSift** for extracting information from SnpEff annotated VCFs into tabular variant reports
- **fastp**, **samtools stats**, **Qualimap bamqc** and **MultiQC** for reporting on quality control results

## Input datasets

- **Paired collection of sequencing data**: a list of pairs of sequencing datasets, one fw-/rv-reads pair per sequenced isolate
- **Fasta reference genome**: this must be provided as a list of FASTA datasets, one for each Influenza genome segment to analyze. Each of these datasets should contain all reference sequences of the corresponding segment that you wish to use in the analysis.
- **Reference annotation**:
- **Primer scheme** (optional):

## Input parameters

- **Supporting read fraction to call variant**: This sets the lower threshold for the fraction of variannt-supporting reads needed at a site to call that variant.

  The value can be set to a floating point number between 0.05 (very sensitive calling) and 0.25 (more noise-resistant calling, the default).

  This setting also affects the frequency threshold used for consensus building, which will be set to 0.95 minus the configured value, i.e. with the default setting of 0.25, the most frequent bases at each site will be added up until their combined fraction reaches 0.95 - 0.25 = 0.7 and the IUPAC ambiguity code representing all contributing bases will be used in the consensus.
  With a setting of 0.05, bases will be added up until they reach a combined fraction of 0.95 - 0.05 = 0.9, i.e. IUPAC ambiguity codes will get incorporated with a higher chance.
  In summary, with a higher setting of this parameter the workflow will generate less (but more reliable) variant calls and a cleaner consensus with less ambiguity codes.
 
  **Minimum quality score to consider base for variant calling**: The workflow default for this parameter is 20 and it will be applied to both variant calling and consensus building.

## Outputs:

- **Processed mapped reads (filtered and realigned)**: the filtered and realigned mapped reads in BAM format that serve as input for variant calling and consensus building for **non-ampliconic** data
- **Processed mapped reads (filtered and realigned, primers trimmed)**: the filtered, realigned and primer-trimmed mapped reads in BAM format that serve as input for variant calling and consensus building for **ampliconic** data
- **SnpEff-annotated variants**: a collection of SnpEff-annotated variant calls in vcf format, one dataset per sample in the batch
- **Combined variant report for all samples**: a concatenated, flat tabular report of variants and their annotations from all samples
- **Per-sample consensus genomes**: a collection of consensus sequences in Fasta format, one dataset per sample
- **Combined consensus genomes for all samples**: the consensus sequences of all samples concatenated in multi-Fasta format
- **Quality control report**: report of quality control results from fastp, samtools stats (on the results of mapping with bwa-mem) and Qualimap BamQC (on the filtered mapped reads) aggregated with MultiQC

