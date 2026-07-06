# Ancient DNA analysis pipeline
This workflow performs an ancient DNA (aDNA) based analysis similar to the one in the [nf-core/eager](https://nf-co.re/eager/2.5.3/) workflow. nf-core/eager is a bioinformatics best-practice processing pipeline for genomic NGS sequencing data, with a focus on ancient DNA data. It is ideal for the (palaeo)genomic analysis of humans, animals, plants, microbes and even microbiomes.

The pipeline processes the sequencing-read input provided to the workflow together with a reference genome and optional supporting reference data. It aligns reads and performs extensive general NGS and aDNA-specific quality control on the results.


## Required & Optional Inputs
To run this workflow successfully, you need to provide the following input datasets and parameters:

* **`Choose Read Type` :** Select whether your input is Single-End or Paired-End.
* **`Input Single-end reads` :** Input single-end FASTQ reads (list collection) for the sample.
* **`Input Paired-end Forward reads (R1)` :** Input paired-end forward FASTQ reads (list collection) for the sample.
* **`Input Paired-end reverse reads (R2)` :** Input paired-end reverse FASTQ reads (list collection) for the sample.
* **`Reference genome` :** Reference genome sequence in FASTA format. This is essential for read mapping and variant calling.
* **`Choose Mapper` :** Switch to select the alignment tool. Choose between BWA and Bowtie2.
* **`Hap Map ChrX reference` :** HapMap dataset required for X-chromosome contamination estimation in ANGSD.
* **`Input Mitochondrial Chromosome Name` :** The exact header name of the mitochondrial chromosome in your reference FASTA file (e.g., MT, chrM, rCRS).
* **`Kraken2 database directory` :** The database directory required for Kraken2 taxonomic classification.
* **`Optional BED file for Sex.DetERRmine` :** An optional BED file containing specific genomic coordinates to restrict the Sex.DetERRmine analysis. Leave empty for standard whole-genome human analysis, or provide targeted regions to enable gender estimation for non-human organisms.
* **`ANGSD region parameter` :** The specific genomic region to restrict the ANGSD analysis (typically 'X' for human male nuclear contamination estimation).


## Workflow Steps
By default the pipeline currently performs the following:

## 1. Preprocessing and Quality Control
* **Quality Control:** Evaluates read quality before and after trimming (`FastQC`)
* **Adapter Trimming:** Removes adapter sequences (`AdapterRemoval`)

## 2. Read Mapping and Processing
* **Alignment:** Maps reads to the provided reference genome conditionally using either (`BWA`) or (`Bowtie2`) based on user selection
* **Filtering and Statistics:** Separates unmapped reads and calculates alignment statistics (`Samtools View and Flagstat`)
* **Duplicate Removal:** Detects and marks PCR duplicates (`Picard MarkDuplicates`)
* **Alignment Quality:** Generates detailed BAM quality metrics (`QualiMap BamQC`)
* **Library Complexity:** Estimates library complexity (`Preseq`)

## 3. Ancient DNA (aDNA) Analysis
* **Damage Profiling:** Visualizes aDNA-specific C-to-T damage patterns (`mapDamage`)
* **Endogenous Content:** Calculates the proportion of endogenous (target) DNA in the sample (`EndorSpy`)
* **(`Optional`) Contamination:** Estimates nuclear X-chromosome contamination conditionally if HapMap data is provided (`ANGSD X-Contamination`)

## 4. Biological Information
* **Sex Determination:** Determines biological sex based on relative chromosome coverage ratio. This step adapts conditionally whether an optional BED file is provided (`Sex.DetERRmine`)
* **Mt/Nuc Ratio:** Calculates the ratio of mitochondrial reads to nuclear reads utilizing the specified mitochondrial chromosome name (`MtNucRatioCalculator`)

## 5. Genotyping
* **Variant Analysis:** Performs variant calling to generate VCF files (`FreeBayes`)
* **Variant Statistics:** Calculates statistics for the generated variants (`Bcftools stats`)

## 6. Metagenomic Screening (For Unmapped Reads)
* **Read Extraction:** Extracts unmapped reads for microbial analysis (`Picard SamToFastq`)
* **Quality Filter:** Filters low-complexity sequences (`BBTools BBduk`)
* **Taxonomic Classification:** Performs microbiome/taxonomic screening on the filtered unmapped reads (`Kraken2`)

## 7. Reporting
* **Summary Report:** Aggregates logs and statistics from all these tools into a single interactive HTML report (`MultiQC`)


## Workflow Outputs
Upon successful execution, the workflow explicitly provides the following final files for analysis:

* **`MultiQC aggregated workflow summary report` :** An interactive HTML report aggregating QC and analysis logs from all tools.
* **`QualiMap BamQC general alignment quality metrics report` :** A detailed HTML report containing mapping quality metrics, GC content, and coverage statistics.
* **`mapDamage Visualisation` :** Visual plots displaying the characteristic C-to-T deamination patterns at the ends of ancient DNA reads.
* **`Kraken2 taxonomic classification and microbial screening report` :** A tabular report showing the taxonomic classification of unmapped reads.
* **`EndorSpy endogenous DNA authentication report` :** A JSON file containing the calculated endogenous DNA percentage.
* **`Sex.DetERRmine (Without BED) report of chromosomal gender estimation` :** A JSON file containing biological sex metrics for human-genome alignments.
* **`Sex.DetERRmine (With BED) report of chromosomal gender estimation` :** A JSON file containing biological sex metrics for targeted capture regions.
* **`Mitochondrial to nuclear DNA ratio calculation report` :** A JSON file containing the calculated ratio between mitochondrial and nuclear reads.
* **`ANGSD report of nuclear contamination estimation` :** A tabular text file detailing the estimates of nuclear X-chromosome contamination.
* **`Bcftools variant calling summary statistics report` :** A text file containing comprehensive summary statistics for the called variants (VCF).
* **`Fully post-processed mapping results` :** The final deduplicated and filtered alignment BAM file.
* **`Freebayes raw genomic variant calls` :** The raw VCF file generated from variant analysis.


## Testing Data
To ensure the workflow functions correctly, it was validated using the following datasets and databases:

* **`Primary Test Data` :** A downsampled single-end FASTQ dataset [NIST7035_TAAGGCGA_L001_R1_001_10MB.fastq.gz](https://zenodo.org/records/20271974/files/NIST7035_TAAGGCGA_L001_R1_001_10MB.fastq.gz) optimized for rapid workflow testing and validation.
* **`Primary Reference Genome` :** The [hs37d5_chr21-MT.fa.gz](https://github.com/nf-core/test-datasets/blob/eager/reference/Human/hs37d5_chr21-MT.fa.gz) file was utilized as the primary reference genome sequence.
* **`X-Chromosome Contamination Reference` :** The [HapMap ChrX](https://github.com/ANGSD/angsd/blob/master/RES/HapMapChrX.gz) dataset was provided as the initial reference for the estimation of X-chromosome contamination using the ANGSD tool.
* **`Taxonomic Classification Database` :** The Minikraken v2 database was utilized to perform taxonomic classification via Kraken2.