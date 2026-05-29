# Changelog

## [0.1] - 2026-03-18

### Added
- Initial release of the Post Curation workflow
- Splits curated AGP and combined FASTA by haplotype
- Assigns chromosome names based on scaffold size
- Renames and reorients hap2 chromosomes to match hap1 using mashmap
- Generates Compleasm gene annotation tracks (separate inputs for OrthoDB database version and lineage)
- Generates Hi-C contact maps (Pretext) with coverage, telomere, gap, and gene tracks
- Produces combined gfastats Assembly statistics output, including NG* metrics when an expected genome size is provided
- Exports per-haplotype chromosome assignment tables as CSV
- Supports sex chromosome labeling (Z/W)
- Optional Hi-C read trimming, duplicate removal, and HiFi adapter removal
- Toggles between BWA-MEM2 and BWA-MEM aligners (BWA-MEM for genomes larger than 10 GB)
