# Changelog

## [0.1] - 2026-05-27

### Added

- Initial release of the PGGB pangenome build workflow.
- Steps: PanSN rename (mapped over a strain FASTA collection)
  → FASTA collection concat → PGGB → odgi stats.
- Outputs the smoothed GFA1 (gzipped), odgi `.og` binary graph,
  2D layout (`.og.lay`), layout/viz PNGs, run log, optional VCF
  via `vg deconstruct`, graph stats TSV, and MultiQC HTML report
  collating odgi stats + viz across the build.
- Validated end-to-end on the 8-strain *Plasmodium vivax* v3
  reference pangenome (~25 Mb haploid genomes; runtime ~28 min
  on 16 cores); graph nucleotide length within 2.7 % of the v2
  native reference build. Also exercised on PGGB's own
  DRB1-3123 CI fixture (12 HLA haplotypes, 50 KB).
