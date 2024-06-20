# Changelog

## [0.5.2] 2024-03-05

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/iuc/fastp/fastp/0.23.2+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/fastp/fastp/0.23.4+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/samtools_view/samtools_view/1.9+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/samtools_view/samtools_view/1.15.1+galaxy2`
- `toolshed.g2.bx.psu.edu/repos/devteam/samtools_stats/samtools_stats/2.0.2+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/devteam/samtools_stats/samtools_stats/2.0.5`
- `toolshed.g2.bx.psu.edu/repos/iuc/lofreq_indelqual/lofreq_indelqual/2.1.5+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/lofreq_indelqual/lofreq_indelqual/2.1.5+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/iuc/ivar_trim/ivar_trim/1.3.1+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/ivar_trim/ivar_trim/1.4.2+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/lofreq_call/lofreq_call/2.1.5+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/lofreq_call/lofreq_call/2.1.5+galaxy2`
- `toolshed.g2.bx.psu.edu/repos/iuc/qualimap_bamqc/qualimap_bamqc/2.2.2d+galaxy3` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/qualimap_bamqc/qualimap_bamqc/2.2.2c+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/iuc/ivar_removereads/ivar_removereads/1.3.1+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/ivar_removereads/ivar_removereads/1.4.2+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/multiqc/multiqc/1.11+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/multiqc/multiqc/1.11+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/iuc/bcftools_annotate/bcftools_annotate/1.10` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/bcftools_annotate/bcftools_annotate/1.15.1+galaxy3`
- `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_replace_in_line/1.1.2` was updated to `toolshed.g2.bx.psu.edu/repos/bgruening/text_processing/tp_replace_in_line/9.3+galaxy0`

## [0.5.1] 2023-11-20

- Fix author in dockstore
- Use zenodo link instead of googleapis for fastq in test
- Update output test

## [0.5] - 2022-02-08

### Fixed

- Base selection of variants that should trigger amplicon removal on unbiased
  AF values recalculated from DP4 and DP fields instead of on AF values
  provided by lofreq call.

  https://github.com/CSB5/lofreq/issues/80 means that lofreq-calculated AF
  values are lower bounds of true AFs when bases are excluded from calling
  based on base quality. The extent of AF underestimation depends on the
  fraction of bases with sub-threshold (30 for this workflow) base qualities.

  By recalculating AFs as (DP4[2] + DP4[3]) / DP we are avoiding this issue.
  From this version on we also add a proper description to the header INFO
  line description of the AF field to be explicit about the meaning of lofreq's
  AF value.

### Changed

- Increase/deactivate the default upper AF threshold for biased amplicon detection

  By increasing the default AF threshold to 1.0 amplicon removal now gets
  triggered by default for all primer binding site mutations with unbiased
  (see AF discussion above) AF > 0.1.

  This change is intended to allow removal of amplicons resulting from even
  trace amounts of contamination when the intended target of the amplicon
  primers drops out because of mutations severely impacting primer binding.
  The expectation is that this would either remove contamination-contributed
  variants (like contributed by traces of delta virus in omicron preparations
  in omicron-triggered amplicon dropout regions), or at least cause them
  getting flagged as AmpliconBias calls at the VCF level.
  The exact consequences of this change need to be evaluated, but users can
  restore the previous behavior by reducing the upper AF threshold back to 0.9,
  which will reduce the extent of attempted amplicon removals substantially.

- Make the amplicon bias correction more robust and better interoperable with
  the [Reporting workflow](https://github.com/iwc-workflows/sars-cov-2-variation-reporting).

  First and second (after amplicon removal) round of variant calling are now
  carried out with identical lofreq parameter settings.
  bcftools annotate is then used to carry over the bias-corrected call stats to
  the variant calls obtained in the first round. At the same time, both variant
  call lists are filtered with identical DP and DP_ALT filters and stats of
  filter-passing variants from the first round that fail to pass those filters
  after the second round of calling aretransferred back to the initial
  bcftools annotate output.
  If the DP and DP_ALT thresholds are chosen as in the Reporting workflow (as
  is the case with the default settings), this ensures that no initially called
  variant gets lost as a consequence of amplicon bias correction and that no
  initially filter-passing variant gets filtered out after correction.
  The AmpliconBias INFO flag is used to mark all such variants, for which
  amplicon bias correction was skipped to rescue the call.

- Upgrade the Galaxy wrapper versions of ivar trim and ivar removereads.

  This makes it easy for users to calculate primer amplicon info from suitable
  primer scheme bed files instead of passing the info as a separate file.
  This workflow sticks to the previous behavior to avoid new requirements on
  primer names.
- Upgrade fastp to 0.23.2.
  This update restores plots contained in the tools html output, should
  provide better performance for compressed input data, but also has a moderate
  effect on trimming results.
- Upgrade other tools to their latest versions or wrapper versions:

  - bwa_mem to wrapper version 0.7.17.2
  - lofreq_call to wrapper version 2.1.5+galaxy1
  - multiqc to version 1.11

  None of these are expected to change the variant output produced by the
  workflow.

### Added

- Add a step to filter out failed datasets before flattening the Qualimap BamQC
  data for use by MultiQC.

  Qualimap BamQC fails on empty BAM input and trying to flatten the resulting
  collection containing failed datasets would cause the invocation of the
  workflow to fail.

## [0.4.2] 2021-12-13

### Added

- Added GitHub Actions workflow. No functional changes.

## [0.4.1] 2021-07-23

### Added

Added RO-Crate metadata file. No functional changes.

## [0.4] - 2021-06-16

### Changed

- Upgrade multiqc to 1.9+galaxy1

## [0.3] - 2021-05-19

### Changed

This version brings a number of tweaks to the ivar-dependent steps of the
workflow. Together, these are expected to make variant allele frequency
calculations more precise, in general, and robust in the face of an increasing
number of variants at primer binding sites:

- Upgrade ivar from version 1.2.2 to 1.3.1
  This affects ivar trim and ivar removereads
- Use the newly introduced -f option of ivar trim to exclude read pairs from
  further analysis that extend beyond amplicon boundaries.
  This change should be benefitial for accurate AF calculations in general,
  but in particular for corrected AF values after removal of biased amplicons,
  where aberrant read pairs often represent a larger fraction of the remaining
  reads.
- Run ivar trim only after realignment and addition of indel qualities by
  lofeq. This should make sure that indels close to primer sequences are
  seen as read-internal events.
- Turn the lower and upper thresholds for variant AF that triggers readremoval
  into workflow input parameters and adjust their defaults to trigger read
  removal only in more obvious cases of non-fixed variants.
- Require a minimum depth of coverage for recalled variants after read removal
  of 20 to ensure reliable AF values.
  This change also prevents situations where variants are recalled successfully
  after read removal, but are later excluded from variant reports generated by
  the reporting workflow due to that workflow's min_dp_alt >= 10 filter.

## [0.2]

### Changed

- Turn the AmpliconRemoval variant FILTER into an AmpliconBias INFO flag
- Apply the strand-bias filter only after variant annotation with snpEff. By
  producing fully annotated VCFs with and without filtering, downstream
  workflows can easily be switched between filtered/unfiltered input data

### Fixed

- Make sure the header information about the added flag gets propagated to the
  final VCF

## [0.1]

- Initial version of COVID-19: variation analysis on ARTIC PE data workflow
