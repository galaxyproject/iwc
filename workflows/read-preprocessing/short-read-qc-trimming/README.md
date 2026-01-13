# Short-read quality control and trimming

Before starting any analysis, it is always a good idea to assess the quality of the input data and to discard poor-quality base content by trimming and filtering reads.

This workflow takes paired-end Illumina (**short-reads**) fastq(.gz) files and executes the following steps:
1. Quality control and trimming using **fastp**
2. Aggregation of the quality control reports using **MultiQC**

## Input Datasets

- A list of paired datasets corresponding to paired-end raw reads in `fastqsanger` or `fastqsanger.gz` format.
- Qualified quality score: The quality value that a base is qualified to have.
- Minimal read length: Reads shorter than this value will be discarded.
- Cutting mean quality: The bases in the sliding window with mean quality below this value will be cut.
- [Optional] Adapter to remove on forward reads and reverse reads

## Output Datasets

- A list of paired datasets corresponding to paired-end **trimmed** reads in `fastqsanger` or `fastqsanger.gz`, ready for further analysis.
- List of `JSON` reports of fastp for each sample that could be used as inputs for extra MultiQC
- MultiQC report in HTML