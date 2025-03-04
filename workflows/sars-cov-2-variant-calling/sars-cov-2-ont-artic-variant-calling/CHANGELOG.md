# Changelog

## [0.3.2] - 2023-11-20

- Fix author in dockstore
- Use ncbi link instead of googleapis for fastq

## [0.3.1] - 2021-12-13

### Added
- Added GitHub Actions workflow. No functional changes.

## [0.3] - 2021-09-22

### Changed

This version changes the way variants get called and and how key call
statistics are calculated:

- Switch to medaka_variant version 1.3.2+galaxy1 for extracting variants from
  medaka consensus data.

  This new version of the tool is more robust against input data peculiarities
  at the VCF annotation stage:

  * it doesn't fail on empty BAM input
  * it doesn't crash on variant calls of unusually high quality that previously
    resulted in math domain errors when trying to calculate PHRED scores from
    very small error probabilities.

  This tool update also means that key INFO fields (DP, DP4, AF) are
  now based on calculations carried out by medaka tools annotate instead of by
  custom code using samtools mpileup. This has the following consequences:

  * the tool can now emit variant calls at complex sites with > 1 lengths of
    both the REF and the ALT allele, which were previously dropped
  * the workflow became more complex; to account for shortcomings of medaka
    tools annotate, the variant call statistics of regular variants and of
    primer binding site variants have to be determined in separate runs of the
    tool
  * All key INFO fields (DP, DP4, AF) will change slightly in this version of
    the workflow

This version also adds some of the changes around trimming of primer sequences,
which have been introduced into version 0.3 of the PE Illumina worflow for
amplicon data before:

- Update ivar trim to version 1.3.1
- Run ivar trim as the last mapped reads processing step before variant
  calling, i.e., after left-alignment of indels

and:

- Rename the output of the ivar trim step to "Fully processed reads for
  variant calling (primer-trimmed, realigned reads)" like the corresponding
  output of the PE Illumina workflow
- Fix a typo in the allowed input formats for the collection of sequenced
  reads, which caused fastqsanger.gz data to undergo an implicit and
  unnecessary decompression step.

### Added

- Add a step to filter out failed datasets before flattening the Qualimap BamQC
  data for use by MultiQC.

  Qualimap BamQC fails on empty BAM input and trying to flatten the resulting
  collection containing failed datasets would cause the invocation of the
  workflow to fail.

## [0.2.1] - 2021-07-23

### Added

Added RO-Crate metadata file. No functional changes.

## [0.2]

- Apply the strand-bias filter only after variant annotation with snpEff. By
  producing fully annotated VCFs with and without filtering, downstream
  workflows can easily be switched between filtered/unfiltered input data

## [0.1]

- Initial version of COVID-19: variation analysis on ARTIC ONT data workflow
