# Pangenome Variant Calling using VG Giraffe and Google DeepVariant

This workflow performs small variant calling using pangenome reference graphs. It combines vg giraffe for pangenomic read alignment and Google DeepVariant for variant calling. 

Input reads are chunked for parallel mapping. The chunk size can be specified. If both forward and reverse reads are provided, they are interleaved into a single FASTQ file in the workflow before chunking.

VG giraffe surjects its results directly to the reference within the pangenome graph. A different reference FASTA can be specified if the input pangenome graph does not contain all the bases of the reference. If the pangenome graph is missing reference paths overall, an according xg graph with the reference can be provided. If the reads should not be surjected to all the paths in the pangenome graph, a custom path list file can be given. The mapped reads will be output in BAM format. Then, the BAM file undergoes postprocessing by marking paired reads properly paired until a given maximum distance (default 3000 bp) (only if a second read pair is provided).

According to the [authors](https://github.com/vgteam/vg_wdl#read-realignment), realignment can improve variant calling. By default, mapped reads are locally realigned using DeepVariant's built-in realigner before calling variants. Reads longer than DeepVariant's max_read_length_to_realign threshold (default 500 bp) are never realigned. Additionally, DeepVariant's read normalization is also enabled to left align indels for each read. For a faster variant calling step, the BAM file is split into smaller, contig-specific BAM files. This allows parallel analysis.

If the path names in the input pangenome graph follow PanSN specification, or if a prefix should to be removed from the path names in general, a reference prefix can be provided. This removes the prefix of the paths within the BAM and vcf files. While vg giraffe requires paths with the prefix for mapping, if a custom path list file is provided, the prefix should remain in the path names for correct mapping. However, a different reference FASTA can already have the prefix stripped.

For benchmarking and validation, hap.py can be used by providing a truth vcf file to enable it.


## Inputs

### General
- Input Pangenome Graph (.gbz file)
- Pangenome Graph index files:
  - A Minimizer Index to speed up finding matches (seeds) between reads and the graph [Optional] (vg.min file)
  - A Distance Index to quickly cluster seeds [Optional] (vg.dist file)
  - A Zipcodes Index for distance hints to speed up chaining, especially for long reads [Optional] (vg.zipcodes file)
- Input XG Graph if the Input Pangenome Graph is missing reference paths for surjection [Optional] (.xg file)
- First Read (fastqsanger or fastqsanger.gz file)
- Second Read [Optional] (fastqsanger or fastqsanger.gz file)
- Number of reads contained in each mapping chunk. For paired reads, make sure this value is even [Default 20000000]
- Sample Name
- Path List File listing the specific reference path names (one per line) from the pangenome graph onto which alignments should be surjected [Optional] (txt file)
- Reference to use instead of extracting it from the input pangenome graph [Optional] (fasta file)
- Reference Prefix string (e.g., GRCh38#0#) to strip from the beginning of path names [Optional]

### VG Giraffe
- Name of mapper to use [Default 'default']
- Allow to prune low-complexity or short in-tail anchors while surjecting [Default 'true']
- A Maximum distance at which VG Giraffe marks paired reads properly paired [Default 3000]
- Whether or not to left-align reads in the BAM [Default 'true']
- Extra command line options for the mapper [Optional] 

### DeepVariant
- Model Type [Default 'WGS']
- Names of contigs in the reference that are haploid [Optional]
- BED file with pseudo-autosomal regions [Optional] (bed file)
- Minimum MAPQ of reads to use for calling [Optional] [Default 'DeepVariant default for the model type']
- Whether DeepVariant should use the legacy allele counter behavior [Default 'false']
- Whether DeepVariant should normalize reads itself [Default 'false']
- Whether to disable the small model of DeepVariant [Default 'false']
- Additional arguments for the make_examples step of DeepVariant [Optional] 

### Hap.py
- Path to Truth .vcf file to compare against. Set this value for hap.py evaluation to run [Optional] (vcf file)
- BED file to evaluate against Truth .vcf file on, where false positives will be counted [Optional] (bed file)
- BED file to restrict hap.py comparison against Truth .vcf to [Optional] (bed file)
- Contig or region to restrict hap.py evaluation to [Optional]

## Outputs
- BAM output file from VG Giraffe
- Unmapped Reads of the BAM file
- Calling BAM files before running DeepVariant 
- VCF from DeepVariant 
- gVCF from DeepVariant 
- If hap.py is enabled:
  - Metrics file
  - Summary file
  - Results file

# References
1) Original WDL Workflow: https://github.com/vgteam/vg_wdl
2) Liao, Asri, Ebler, et al. A Draft Human Pangenome Reference. preprint, bioRxiv 2022; doi: https://doi.org/10.1101/2022.07.09.499321

