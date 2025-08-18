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
- **Fasta reference genome**: a suitable reference genome for your virus provided in FASTA format
- **Reference annotation**: genome annotations of the reference sequence in GTF format. **Please make sure it is matching your reference genome sequence!**
- **Primer scheme** (optional): If provided, indicates ampliconic data and will trigger primer trimming and removal of reads that extend beyond amplicon boundaries.
  **Please make sure the scheme matches your reference sequence and that the format of the dataset is set to bed!**

## Input parameters

- **Supporting read fraction to call variant**: This sets the lower threshold for the fraction of variant-supporting reads needed at a site to call that variant.

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

## Known issues and limitations

- Non-matching reference genome sequence, genome annotation and/or primer scheme

  It is critical for analysis results that the sequence assumed in the genome annotation and, if provided, in the primer scheme input is the same as the reference sequence. Violation of this condition can lead to failures of the workflow run at the SnpEff build or ivar trim (for ampliconic data) steps, but can also cause misannotations of variant effects, wrong primer trimming or inappropriate read elimination before variant calling and consensus building in seemingly successful workflow runs.

- Failing pimer trimming for ampliconic data

  This is usually caused by one of the following issues with your **primer scheme input**:

  - The format of the primer scheme dataset in your history is not set to **bed**, but to e.g. *interval*.

    You either selected the wrong format when uploading the data, or you had Galaxy autodetect the format and it wasn't recognized as bed.
    Please change the dataset format manually in this case and rerun the WF.

  - The primer scheme might not be fully parseable by Galaxy's ivar trim wrapper.

    In particular, the tool applies the regular expression pattern:
    `.*_(?P<amplicon_number>\d+).*_(?P<primer_orientation>L(?:EFT)?|R(?:IGHT)?)` to the primer names in column 4 of the primer scheme to deduce amplicon names and primer orientation. This means that it will be able to parse primer names like the following correctly:
    ``nCoV-2019_1_LEFT`` (parsed as forward primer of amplicon 1), ``400_2_out_R`` (parsed as reverse primer of amplicon 2), ``QIAseq_163-2_LEFT`` (parsed as forward primer of amplicon 163) or `177e6ebb_0_LEFT_0` (parsed as one of several alternative forward primers of amplicon 177e6ebb),
    but more exotic names might fail parsing.

    If parsing of the primer names is the issue, then you need to edit the names on column 4 of your primer scheme file to pass the regular expression pattern.

- Failure to annotate all translation products in complex viral genes

  This generic workflow can currently, at the annotation step, not handle all ways in which your virus may produce several translation products from a single viral gene. Alternative translation products resulting from ribosomal slippage or polymerase stuttering will, for example, not be annotated in the *SnpEff-annotated variants* and the *Combined variant report for all samples* outputs of the workflow.
  For other translation products stemming from, for example, the use of alternative start codons or alternative ribosomal entry points, successful annotation will depend on the details of how those products are represented in your *Reference annotation* input.

  When running the workflow for the first time with a new *Reference annotation*, always check carefully the predicted effects on genes, transcripts and proteins in the *SnpEff-annotated variants* and the *Combined variant report for all samples* outputs to understand virus and annotation-file specific problems and limitations before basing your interpretation on those reports.
