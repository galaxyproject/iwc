# Hi-C Contact Map Generation for Manual Curation of Genome Assemblies

This workflow generates Hi-C contact maps for diploid genome assemblies in the Pretext format. It includes tracks for:
- **Gene annotations** (Compleasm)
- **PacBio read coverage** and coverage gaps
- **Telomeres** (with flexible pattern detection)
- **Assembly gaps**

The Pretext files can be opened in PretextView for manual curation of genome assemblies.

## Inputs

### Required Inputs

1. **Haplotype 1** [fasta] - Primary haplotype assembly
2. **Will you use a second haplotype?** [boolean] - Set to true for diploid assemblies
3. **Haplotype 2** [fasta] - Secondary haplotype assembly (required if using two haplotypes)
4. **Hi-C reads** [fastq] - Paired collection containing Hi-C data
5. **PacBio reads** [fastq] - Collection of PacBio HiFi reads
6. **Estimated Genome Size** [file] - Single-value file with the estimated genome size in bp; used to switch from BWA-MEM2 to BWA-MEM for genomes larger than 10G

### Assembly Annotation Parameters

7. **Generate gene annotations** [boolean] - Enable/disable Compleasm gene annotation tracks (disable for large genomes to avoid memory issues)
8. **Species Name** [text] - Species identifier for gene annotation
9. **Assembly Name** [text] - Assembly identifier (e.g., toLid)
10. **Lineage for Compleasm** [text] - BUSCO lineage dataset (e.g., vertebrata_odb10, primates_odb10)
11. **Database for Compleasm** [text] - Compleasm database version (default: v5)

### Scaffold Naming Options

12. **Do you want to add suffixes to the scaffold names?** [boolean] - Select yes if scaffold names do not contain haplotype information
13. **First Haplotype suffix** [text] - Suffix for haplotype 1 scaffolds (default: H1)
14. **Second Haplotype suffix** [text] - Suffix for haplotype 2 scaffolds (default: H2)

### Hi-C Processing Options

15. **Do you want to trim the Hi-C data?** [boolean] - If yes, removes 5bp at the end of Hi-C reads (recommended for Arima Hi-C data if the map looks "noisy")
16. **Remove duplicated Hi-C reads?** [boolean] - Remove PCR duplicates from Hi-C alignments using Samtools markdup
17. **Minimum Mapping Quality** [integer] - Minimum MAPQ score for filtered PretextMap (default: 10; set to 0 to keep all mapped reads)

### PacBio Processing Options

18. **Remove adapters from HiFi reads?** [boolean] - Trim adapters from PacBio HiFi reads using Cutadapt

### Telomere Detection

19. **Canonical telomeric pattern** [text] - Expected telomere repeat sequence (default: TTAGGG for vertebrates; use CCCTAA for reverse complement)
20. **Telomeric Patterns to explore (comma-separated), IUPAC allowed** [text] - Additional telomeric patterns to search for (e.g., TTAGGG,CCCTAA)

### Hi-C Map Resolution

21. **Generate high resolution Hi-C maps** [boolean] - Generate high resolution Pretext maps (slower, requires more resources)

### Visualization Options

22. **Bin Size for Bigwig files** [integer] - Resolution for coverage tracks (default: 100; larger values = smaller files but lower resolution)

### JBrowse2 Related Species

23. **Use related species** [boolean] - Include related-species assemblies as additional tracks/alignments in the JBrowse2 instance
24. **Related Species** [fasta.gz collection] - Collection of related-species assemblies (gzipped FASTA) to align against the assembled haplotypes for JBrowse2 visualization

## Outputs

### Assembly Outputs

1. **Assembly for curation** [fasta] - Merged assembly (if two haplotypes used) or single haplotype with optional suffix
2. **Assembly Info** [tabular] - Summary statistics from gfastats
3. **Both Haplotypes merged** [fasta] - Concatenated assembly file

### Gene Annotation Outputs

4. **Compleasm Genes track** [GFF] - Combined gene annotations for Pretext track (if gene annotations enabled)

### Hi-C Alignment Outputs

5. **Merged Hi-C Alignments on Scaffolds** [BAM] - Combined Hi-C read alignments
6. **Precuration Hi-C alignments** [BAM] - Hi-C alignments before filtering
7. **Trimmed Hi-C data** [fastq] - Hi-C reads after adapter trimming (if trimming enabled)
8. **Hi-C duplication stats on Scaffolds** [tabular] - Samtools markdup statistics (if duplicate removal enabled)
9. **Hi-C duplication stats on Scaffolds: MultiQc** [HTML] - MultiQC report of duplicate statistics (if duplicate removal enabled)
10. **Hi-C duplication stats on Scaffolds: Raw** [tabular] - Raw Samtools markdup metrics (if duplicate removal enabled)
11. **Pairtools Multiqc Stats on Scaffolds** [tabular] - Pairtools statistics
12. **Pairtools MultiQc on Scaffolds: Plots** [HTML] - Pairtools MultiQC plots

### PacBio Processing Outputs

13. **HiFi reads without adapters** [fastq] - Adapter-trimmed PacBio reads (if adapter removal enabled)
14. **HiFi reads adapters trimming report** [tabular] - Cutadapt trimming statistics (if adapter removal enabled)

### PacBio Coverage Outputs

15. **BigWig Coverage** [bigwig] - PacBio read coverage track
16. **Coverage Gaps Track** [bedgraph] - Regions with low or no PacBio coverage
17. **Merged HiFi Alignments** [BAM] - Combined PacBio alignments

### Telomere Outputs

18. **Telomere Report** [tabular] - Comprehensive telomere analysis from Teloscope
19. **terminal telomeres** [bedgraph] - All detected telomeric regions
20. **P telomeres bed** [BED] - P-arm (5') telomeres only
21. **Q telomeres Bed** [BED] - Q-arm (3') telomeres only

### Gap Outputs

22. **Gaps Bed** [BED] - Assembly gap coordinates
23. **Gaps Bedgraph** [bedgraph] - Assembly gap track for Pretext

### Assembly Haplotype Outputs

24. **Decontaminated Hap1 with Suffix** [fasta] - Haplotype 1 with suffix applied
25. **Decontaminated Hap2 with Suffix** [fasta] - Haplotype 2 with suffix applied

### Pretext Map Outputs

All Pretext outputs are generated in two versions:
- **With MAPQ filtering** (default MAPQ ≥ 10): Cleaner maps with high-confidence contacts
- **Without filtering (Multimapping)**: Shows all mapped contacts including low-quality alignments

26. **Pretext All tracks** [pretext] - Contact map with all annotation tracks (MAPQ filtered)
27. **Pretext All tracks - Multimapping** [pretext] - Contact map with all tracks (unfiltered)
28. **Pretext Snapshot With tracks** [PNG] - Image of contact map with tracks (MAPQ filtered)
29. **Pretext Snapshot With tracks - Multimapping** [PNG] - Image of contact map with tracks (unfiltered)

### Haplotype Alignment Outputs

30. **Alignments** [PAF] - Haplotype-vs-haplotype (and, if enabled, vs related-species) alignments produced by mashmap, used as JBrowse2 synteny tracks

### JBrowse2 Outputs

Generated depending on whether one or two haplotypes are provided and whether related species are included:

31. **JBrowse2 Single Haplotype** [JBrowse2] - JBrowse2 instance for a single-haplotype assembly
32. **JBrowse2 Single Haplotype with related species** [JBrowse2] - Single-haplotype JBrowse2 instance with related-species alignment tracks
33. **JBrowse2 Hap1 vs Hap2 with no related species** [JBrowse2] - Diploid JBrowse2 instance with Hap1↔Hap2 alignments
34. **JBrowse2 Hap1 and hap2 with related species** [JBrowse2] - Diploid JBrowse2 instance including related-species alignments

## Usage Notes

### When to trim Hi-C data
Enable trimming if you're using Arima Hi-C kits and notice a "noisy" contact map pattern.

### MAPQ filtering
The default MAPQ threshold of 10 removes ambiguously mapped Hi-C contacts, resulting in cleaner contact maps. Compare both filtered and unfiltered outputs to assess mapping quality.

### Choosing Compleasm lineage
Select the most specific lineage available for your species:
- Vertebrates: `vertebrata_odb10`
- Mammals: `mammalia_odb10`
- Primates: `primates_odb10`
- Birds: `aves_odb10`
- See [BUSCO datasets](https://busco-data.ezlab.org/v5/data/lineages/) for complete list

### Telomere patterns
- Vertebrates typically use TTAGGG
- Some species have variant patterns - check the literature
- IUPAC codes are supported (e.g., TTAGGK for TTAGGG/TTAGGC)

## Citation

If you use this workflow, please cite:
- PretextMap and PretextView tools
- Compleasm for gene completeness assessment
- Teloscope for telomere detection
- Other tools as listed in the workflow
