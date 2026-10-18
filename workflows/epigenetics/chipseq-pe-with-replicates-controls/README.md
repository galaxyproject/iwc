# Quality control, mapping and peaks identification for ChIP-Seq replicates with controls

This workflow is for analyzing batches of ChIP-Seq samples with controls and replicates from paired-end sequenced reads to called peaks.

It uses:
- **fastp** for sequenced reads pre-processing,
- **bowtie2** for mapping
- **MACS2** for peak calling
- **deeptools** for cross-sample correlation and averaging

The workflow provides quality control at the level of sequenced reads, mapping results and called peaks, and visualizes correlation between samples.

## Input datasets

- **Sequencing data**: this must be provided as a single list collection of paired fastq datasets of all samples.
- **Sample sheet**: this is expected to be a 4-column tabular dataset that describes samples, their association with each other and with conditions and replicates.

  The first column of the file must list all samples with their names matching the element names in the Sequencing data collection. Samples can be listed in any order.
  The second column is used to specify the specific experimental condition that each sample represents. There is no formal restriction on this column, but values should be kept short for readable reports.
  The third column is used to specify the replicate that each sample belongs to. There is no formal restriction to replicate identifiers, but they should be kept as short as possible. At least two replicates are required per condition, but different conditions can have different numbers of replicates.
  The fourth column must provide the name of the sample that serves as the control for the sample described on each line. Different samples can be associated with the same control sample.
  Control samples must also be listed on their own lines just like regular samples, but must use . or - as the value of the fourth column. The value of the third column (replicate ID) is ignored for control sample lines so may also be set to . or -.
  
  Here's an example sample sheet:
  
  SRR5680995    input       -       -
  SRR5680996    H3K4me3     rep1    SRR5680995
  SRR5680997    H3K27me3    rep1    SRR5680995
  SRR5681007    H3K27me3    rep2    SRR5681005
  SRR5681006    H3K4me3     rep2    SRR5681005
  SRR5680998    CTCF        rep1    SRR5680995
  SRR5681008    CTCF        rep2    SRR5681005
  SRR5681005    input       -       -

  This declares an experimental design with three conditions - H3K4me3, H3K27me3 and CTCF - with two replicates per condition and one input control per replicate. The control sample SRR5680995 is declared as the shared control for all samples from replicate rep1, SRR5681005 as the control for all samples from replicate rep2.

  When importing the sample sheet into Galaxy make sure you are using Tab characters as the column separators.

## Input parameters

- **Reference genome**: set this to the reference genome of your organism of interest; used at the read mapping step
- **Sequencing adapter - forward** (optional)
- **Sequencing adapter - reverse** (optional)
- **Effective genome size**: this is used by MACS2 and may be entered manually (indications are provided for heavily used genomes).
- **Average size of sequenced fragments**: used for deeptools-based QC

## Outputs:

- **MultiQC analysis reports**: contains key quality metrics from the fastp, bowtie2 and MACS2 steps of the workflow
- **Sample fingerprints**: plot comparing IP strengths for all samples
  (see https://deeptools.readthedocs.io/en/latest/content/tools/plotFingerprint.html#background)
- **Between-samples correlation plot**: plot comparing the similarity between all samples in terms of read coverage across genomic regions (see https://deeptools.readthedocs.io/en/latest/content/tools/plotCorrelation.html#background)
- **Per-replicate clustered heatmaps of peaks**: Clustered heatmap plots of IP read coverage (relative to control) around peaks called by MACS2; collection with one plot per replicate; the WF produces one more cluster per plot than there are samples in the replicate, but you can experiment with different cluster numbers by rerunning the tool with a different setting for *"Number of clusters to compute"* in the *"Clustering algorithm"* section near the bottom of the tool interface.
- **Clustered heatmap of peaks across all samples**: Clustered heatmap like above but as a single plot including all samples from all replicates; the WF produces one more cluster per plot than there are total samples across all replicates, but you can experiment with different cluster numbers by rerunning the tool with a different setting for *"Number of clusters to compute"* in the *"Clustering algorithm"* section near the bottom of the tool interface.
- **Peak regions called by MACS2**: collection of bed files describing the peak regions called by MACS2 and organized by replicate and IP condition
- **Positions of summits of MACS2-called peaks**: collection of bed files describing just the summits of the peaks called by MACS2, again organized by replicate and IP condition
- **Peaks per replicate**: collection of MACS2 treatment pileup output converted to bigWig format, organized by replicate and IP condition
- **Peaks averaged across replicates**: the Peaks per replicate output averaged across replicates with bigwigAverage from the deeptools suite; collection organized by IP condition

## Related training material

https://gxy.io/GTN:T00140 guides you through manual execution of all the key steps of this workflow with more detailed explanations.
