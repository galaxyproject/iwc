# Changelog

## [0.2] - 2026-07-20

### Automatic update
- `toolshed.g2.bx.psu.edu/repos/iuc/compleasm/compleasm/0.2.6+galaxy3` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/compleasm/compleasm/0.2.8+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/collection_element_identifiers/collection_element_identifiers/0.0.2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/collection_element_identifiers/collection_element_identifiers/0.0.3`
- `toolshed.g2.bx.psu.edu/repos/iuc/minimap2/minimap2/2.28+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/minimap2/minimap2/2.31+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/devteam/bwa/bwa_mem/0.7.19` was updated to `toolshed.g2.bx.psu.edu/repos/devteam/bwa/bwa_mem/0.7.19+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/iuc/samtools_fixmate/samtools_fixmate/1.22+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/samtools_fixmate/samtools_fixmate/1.22+galaxy3`
- `toolshed.g2.bx.psu.edu/repos/iuc/samtools_merge/samtools_merge/1.22+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/samtools_merge/samtools_merge/1.22+galaxy2`
- `toolshed.g2.bx.psu.edu/repos/iuc/multiqc/multiqc/1.33+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/multiqc/multiqc/1.35+galaxy2`
- `toolshed.g2.bx.psu.edu/repos/iuc/samtools_markdup/samtools_markdup/1.22+galaxy2` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/samtools_markdup/samtools_markdup/1.22+galaxy3`
- `toolshed.g2.bx.psu.edu/repos/devteam/column_maker/Add_a_column1/2.1` was updated to `toolshed.g2.bx.psu.edu/repos/devteam/column_maker/Add_a_column1/2.1+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/iuc/pretext_map/pretext_map/0.2.3+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/pretext_map/pretext_map/0.2.4+galaxy1`
- `toolshed.g2.bx.psu.edu/repos/iuc/pretext_snapshot/pretext_snapshot/0.0.5+galaxy1` was updated to `toolshed.g2.bx.psu.edu/repos/iuc/pretext_snapshot/pretext_snapshot/0.0.7+galaxy0`
- `toolshed.g2.bx.psu.edu/repos/fubar/jbrowse2/jbrowse2/3.7.0+galaxy0` was updated to `toolshed.g2.bx.psu.edu/repos/fubar/jbrowse2/jbrowse2/3.7.0+galaxy1`

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
