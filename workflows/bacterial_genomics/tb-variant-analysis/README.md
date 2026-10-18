# M. tuberculosis variant analysis

This workflow computes variants and drug resistance reports from M. tuberculosis short read data. It is recommended to use the M. tuberculosis inferred ancestral sequence as a reference. A copy in Genbank format can be downloaded [here](https://zenodo.org/records/3960260/files/Mycobacterium_tuberculosis_ancestral_reference.gbk).

## Inputs

1. Per-sample reads as a list of pairs.

2. Reference genome sequence

3. Minimum depth of coverage to analyse a position on a genome (default: 10)

4. Minimum allele fraction to support a variant (default: 0.8)

5. Fraction of the genome with min depth required to complete analysis (default: 0.9)

6. Additional BWA-MEM options (a string value). These can be used to fine-tune the operation of BWA-MEM within snippy.

## Steps 

The workflow follows the following steps:

1.  Reads are quality-filtered using [fastp](https://github.com/OpenGene/fastp), contaminants are removed by filtering using [kraken2](https://github.com/DerrickWood/kraken2?tab=readme-ov-file) and the [Mycobacterium representative database](https://zenodo.org/records/8339822).

2. Filtered reads are mapped to the reference genome and variants are called using [snippy](https://github.com/tseemann/snippy). Only variants with a minimum allelle frequency (a workflow parameter, set to 0.8 i.e. 80% by default) are retained.

3. Depth of coverage of the alignment is computed using [mosdepth](https://github.com/brentp/mosdepth). This depth calculation is used to compute what proportion of the genome is covered by a minimum depth of reads. Both of these parameters can be set as workflow inputs, with minimum depth of coverage set to 10 by default and fraction of the genome that needs to be covered with min depth set to 0.9 (90%). After mapping, the input samples are filtered to only continue analysis with those samples that pass minimum mapping criteria.

4. Quality control metrics from the read filtering and mapping are combined to create a report using [MultiQC](https://github.com/MultiQC/MultiQC).

5. Variants are filtered using [tb_variant_filter](https://github.com/COMBAT-TB/tb_variant_filter) to exclude those in problematic regions of the M. tuberculosis region (e.g. PE/PPE genes).

6. Drug resistance and lineage prediction is performed using [TB-Profiler](https://github.com/jodyphelan/TBProfiler).

7. For each input sample, a genome is computed by (a) filtering variants to retain only single nucleotide variants and remove those in problematic regions of the genome (b) masking the reference genome to replace regions of low mapping coverage with Ns (c) inserting the computed variants into the masked reference genome. These genomes are suitable for later phylogenetic and cluster analysis. A SNP distance matrix between all input samples, with and without the reference genome included, is computed.

8. A report on all variants in each sample is prepared using [tbvcfreport](https://github.com/COMBAT-TB/tbvcfreport). This links back to further information in the COMBAT TB eXplorer database.

## Workflow outputs

The key workflow outputs are:

1. Quality Control Report produced by MultiQC along with a report on which samples had sufficient mapped reads to be analysed further.

2. TB Profiler drug resistance and lineage reports. In addition to the per-sample reports a combined report is also generated collating information from all samples.

3. Per-sample annotated and filtered variants in VCF format.

4. A user-friend (HTML format) per sample report on variants and drug resistance.

5. Per-sample genomes with single nucleotide variants included and low coverage regions masked. These are provided both as a collection and as a single multi-record FASTA file.

6. SNP distance matrices calculated between the per-sample genomes, with and without the reference sequence included in the analysis.
