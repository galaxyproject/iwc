# Ancient DNA analysis pipeline
This workflow performs an ancient DNA (aDNA) based analysis similar to the one in the [nf-core/eager](https://nf-co.re/eager/2.5.3/) workflow. nf-core/eager is a bioinformatics best-practise processing pipeline for genomic NGS sequencing data, with a focus on ancient DNA data. It is ideal for the (palaeo)genomic analysis of humans, animals, plants, microbes and even microbiomes.

The pipeline pre-processes raw data from FASTQ inputs, or preprocessed BAM inputs. It can align reads and performs extensive general NGS and aDNA specific quality-control on the results.


## Required Inputs
To run this workflow successfully, you need to provide the following input datasets:

* **`InputReads` :** The raw sequencing data for your sample in `FASTQ` format. The workflow supports both single-end and paired-end reads.
* **`ReferenceGenome` :** The reference genome sequence for your target organism in `FASTA` format. This is essential for read mapping (BWA) and variant calling.
* **`HapMapChrXReference` :** A reference HapMap dataset file. This is required by the ANGSD tool to estimate nuclear X-chromosome contamination in human ancient DNA samples.


## Workflow Steps
By default the pipeline currently performs the following:

## 1. Preprocessing and Quality Control
* **Format Conversion:** Converts input files from BAM/SAM format to FASTQ format (`Picard SamToFastq`)
* **Quality Control:** Evaluates read quality before and after trimming (`FastQC`)
* **Adapter Trimming:** Removes adapter sequences and merges paired-end reads (`AdapterRemoval`)

## 2. Read Mapping and Processing
* **Alignment:** Maps reads to the provided reference genome (`BWA`)
* **Filtering and Statistics:** Separates unmapped reads and calculates alignment statistics (`Samtools View and Flagstat`)
* **Duplicate Removal:** Detects and marks PCR duplicates (`Picard MarkDuplicates`)
* **Alignment Quality:** Generates detailed BAM quality metrics (`QualiMap BamQC`)
* **Library Complexity:** Estimates library complexity (`Preseq`)

## 3. Ancient DNA (aDNA) Analysis
* **Damage Profiling:** Visualizes aDNA-specific C-to-T damage patterns (`mapDamage`)
* **Endogenous Content:** Calculates the proportion of endogenous (target) DNA in the sample (`EndorSpy`)
* **Contamination:** Estimates nuclear X-chromosome contamination using HapMap data (`ANGSD X-Contamination`)

## 4. Biological Information
* **Sex Determination:** Determines biological sex based on relative chromosome coverage ratio (`Sex.DetERRmine`)
* **Mt/Nuc Ratio:** Calculates the ratio of mitochondrial reads to nuclear reads (`MtNucRatioCalculator`)

## 5. Genotyping
* **Variant Analysis:** Performs variant calling to generate VCF files (`FreeBayes`)
* **Variant Statistics:** Calculates statistics for the generated variants (`Bcftools stats`)

## 6. Metagenomic Screening (For Unmapped Reads)
* **Read Extraction:** Extracts unmapped reads for microbial analysis (`Picard SamToFastq`)
* **Quality Filter:** Filters low-complexity sequences (`BBTools BBduk`)
* **Taxonomic Classification:** Performs microbiome/taxonomic screening without alignment (`Kraken2`)

## 7. Reporting
* **Summary Report:** Aggregates logs and statistics from all these tools into a single interactive HTML report (`MultiQC`)


## Workflow Outputs
Upon successful execution, the workflow explicitly highlights and provides the following final files for analysis:

* **`MultiQC Report` :** An interactive HTML report aggregating QC and analysis logs from all tools.
* **`QualiMap BamQC Report` :** A detailed HTML report containing mapping quality metrics, GC content, and coverage statistics.
* **`mapDamage Visualisation` :** Visual plots displaying the characteristic C-to-T deamination patterns at the ends of ancient DNA reads.
* **`Kraken2 Report `:** A tabular report showing the taxonomic classification of unmapped reads.
* **`EndorSpy Report `:** A JSON file containing the calculated endogenous DNA percentage.
* **`Sex.DetERRmine Report` :** A JSON file containing relative chromosomal coverage and the calculated biological sex metrics.
* **`Mt/Nuc Ratio Report` :** A JSON file containing the calculated ratio between mitochondrial and nuclear reads.
* **`ANGSD Contamination Report` :** A tabular text file detailing the estimates of nuclear X-chromosome contamination.
* **`Bcftools Stats Report` :** A text file containing comprehensive summary statistics for the called variants (VCF).


## Testing Data
To ensure the workflow functions correctly, it was validated using the following datasets and databases:

* **`Primary Test Data` :** The [JK2067](https://github.com/nf-core/test-datasets/blob/eager/testdata/Human/bam/JK2067.bam) BAM file (HiSeq 1240k captured UDG-half single-end libraries containing approximately 10,000 reads post-clipping) obtained from Lamnidis et al., 2018, Nat. Comms.
* **`Primary Reference Genome` :** The [hs37d5_chr21-MT.fa.gz](https://github.com/nf-core/test-datasets/blob/eager/reference/Human/hs37d5_chr21-MT.fa.gz) file was utilized as the primary reference genome sequence.
* **`X-Chromosome Contamination Reference` :** The [HapMap ChrX](https://github.com/ANGSD/angsd/blob/master/RES/HapMapChrX.gz) dataset was provided as the initial reference for the estimation of X-chromosome contamination using the ANGSD tool.
* **`Taxonomic Classification Database` :** The Minikraken v2 database was utilized to perform taxonomic classification via Kraken2.