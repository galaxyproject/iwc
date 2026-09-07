# Pangenome Variant Calling using VG Giraffe and Google DeepVariant

This workflow performs small variant calling using mapped reads against pangenome reference graphs. It combines *VG Giraffe* for pangenomic read alignment and Google *DeepVariant* for variant calling.

Input reads are chunked for parallel mapping. The chunk size can be specified. If both forward and reverse reads are provided, they are interleaved into a single FASTQ file in the workflow before chunking.

After pangenomic read alignment, *VG Giraffe* surjects the graph-based alignments to linear reference coordinates by using the reference paths within the pangenome graph. If the pangenome graph is missing reference paths, all contigs found within the pangenome graph are used as paths. For surjection, the sequences for these paths need to be embedded in the pangenome graph. If sequences are missing, a corresponding XG Graph containing the sequences for the paths can be provided. To target a specific subset of paths in the pangenome graph, a custom path list file can be given. In the workflow, paths from the pangenome graph that match `_decoy`, `_random`, `chrUn_`, `chrEBV`, `chrM` and `chain_` are excluded before surjection. This is not done if a custom path list file is provided.

After surjection, the mapped reads are provided in SAM format. The SAM file undergoes post-processing by marking paired reads as properly paired up to a given maximum distance (default 3000 bp; only if a second read is provided). After post-processing, the SAM file is converted into a coordinate-sorted BAM file, which is then split into smaller, path-specific BAM files for parallel analysis with *DeepVariant*.

According to [Liao et al., 2023](https://doi.org/10.1038/s41586-023-05896-x), realignment can improve variant calling ([Read more](https://github.com/vgteam/vg_wdl#read-realignment)). By default, mapped reads are locally realigned using *DeepVariant's* built-in realigner before calling variants. Reads that are longer than *DeepVariant's* `Maximum Read Length to Realign` threshold (default 500 bp) are not realigned. Additionally, *DeepVariant's* read normalization is enabled to left-align indels for each read. The linear reference sequences used for variant calling are extracted from the pangenome graph (or corresponding XG Graph if given). The extracted sequences are defined by the paths used during surjection. A custom reference FASTA can be specified if any of the input graphs do not contain all the bases.

If only a subset of paths starting with a prefix want to be targeted (e.g., GRCh38#0#), a reference prefix can be provided. This also removes the prefix from the paths within the output BAM and VCF files. Since *VG Giraffe* requires paths with the prefix for mapping, any provided custom path list file must retain the prefix in its path names. However, a custom reference FASTA should already have the prefix stripped from its sequence names.

For benchmarking and validation, hap.py can be enabled by providing a Truth VCF file.

## Inputs

### General
- Input Pangenome Graph (.gbz file)
- Pangenome Graph index files:
  - Minimizer Index to speed up finding matches (seeds) between reads and the graph [Optional] (vg.min file)
  - Distance Index to quickly cluster seeds [Optional] (vg.dist file)
  - Zipcodes Index for distance hints to speed up chaining, especially for long reads [Optional] (vg.zipcodes file)
- Input XG Graph if the Input Pangenome Graph is missing paths for surjection and sequence extraction [Optional] (xg file)
- First Read (fastqsanger or fastqsanger.gz file)
- Second Read [Optional] (fastqsanger or fastqsanger.gz file)
- Number of reads contained in each mapping chunk. For paired reads, make sure this value is even [Default 20000000]
- Sample Name
- Path List File listing the specific path names (one per line) from the pangenome graph to specifically target for surjection [Optional] (txt file)
- Reference to use instead of extracting it from the input pangenome graph (or XG Graph) [Optional] (fasta file)
- Reference Prefix string (e.g., GRCh38#0#) to only target the paths starting with this prefix for surjection and to strip from the beginning of path names in output files. If set, any given custom Path List File must retain this prefix in its path names for mapping. Any given custom Reference File should already have the prefix stripped from its sequence names [Optional]

### VG Giraffe
- Name of mapper parameter preset to use [Default 'default']
- Whether to prune low-complexity or short in-tail anchors while surjecting and force tail realignment [Default 'true']
- Maximum distance at which VG Giraffe marks paired reads as properly paired [Default 3000]
- Extra command line options for the mapper [Optional]

### DeepVariant
- Model Type [Default 'WGS']
- Names of contigs in the reference that are haploid (without the Reference Prefix if given) [Optional]
- BED file with pseudo-autosomal regions [Optional] (bed file)
- Minimum Mapping Quality of reads to use for calling [Optional] [Default 'DeepVariant default for the model type']
- Whether DeepVariant should use the legacy allele counter behavior. Reverts [this commit](https://github.com/google/deepvariant/commit/fbde0674639a28cb9e8004c7a01bbe25240c7d46) [Default 'false']
- Whether DeepVariant should normalize reads [Default 'true']
- Whether DeepVariant should realign reads [Default 'true']
- Maximum length of a read to realign [Default 500]
- Whether to disable the small model of DeepVariant [Default 'false']
- Additional arguments for the make_examples step of DeepVariant [Optional]

### Hap.py
- Truth VCF File to compare against. Set this value for hap.py evaluation to run [Optional] (vcf file)
- BED file to evaluate against the Truth VCF file, where false positives will be counted [Optional] (bed file)
- BED file to restrict hap.py comparison against the Truth VCF file to [Optional] (bed file)
- Contig or region to restrict hap.py evaluation to [Optional]

## Outputs
- BAM file from VG Giraffe
- Unmapped Reads of the BAM file
- VCF from DeepVariant
- gVCF from DeepVariant
- If hap.py is enabled:
  - Metrics file
  - Summary file
  - Results file

## References
1) Original WDL Workflow: https://github.com/vgteam/vg_wdl#giraffe-deepvariant-workflow
2) Liao, WW., Asri, M., Ebler, J. et al. A draft human pangenome reference. Nature 617, 312–324 (2023). https://doi.org/10.1038/s41586-023-05896-x