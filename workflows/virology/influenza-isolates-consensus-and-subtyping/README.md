# Subtyping and consensus sequence generation for batches of Influenza A isolates

This workflow performs subtyping (with respect to the HA and NA genes) and consensus sequence generation for batches of Illumina PE sequenced Influenza A isolates. It overcomes Influenza genome variability by compiling the best possible reference for read mapping from a collection of reference sequences for each viral genome segment.

It uses:
- **VAPOR** for identifying, from a collection of reference sequences of each of the eight viral genome segments, the individual segment sequences that match the sequencing data for each sample most closely
- **fastp** for sequenced reads pre-processing,
- **bwa mem** for mapping the preprocessed reads to a reference compiled from the best-matching segment sequences identified by *VAPOR*
- **ivar consensus** for generating consensus sequences from the mapped reads data
- **MAFFT** for generating multiple sequence alignments from the consensus sequences of the samples in a batch
- **Snipit** and **IQ-Tree** for visualizing differences and analyzing relationships between sequences from a batch

The workflow provides a subtyping report, the consensus sequences arranged by gene segment or by sample, quality control at the level of sequenced reads and of mapping results, and batch-level visualization and phylogenetic insight.

## Input datasets

- **Sequenced paired-end data**: a list of pairs of sequencing datasets, one fw-/rv-reads pair per sequenced isolate
- **References per segment collection**: this must be provided as a list of 8 FASTA datasets, one for each Influenza genome segment. Each of these datasets should contain all reference sequences of the corresponding segment that you wish to use in the analysis.

  **NOTE 1**: For subtyping to work correctly *all* FASTA sequence title lines in the input need to follow the scheme (note the use of both `|` and `/`):

  `>[segment]|[influenza type]/[host]/[region]/[internal reference number]/[collection year]|subtype|[accession number]`

  where `[host]` can be omitted for samples obtained from human patients.

  Examples:

  - `>NS|A/California/07/2009|H1N1|NC_026432.1` (for the NS segment sequence of a H1N1 sample obtained from a human patient in California in 2009)
  - `>NA|A/chicken/Zimbabwe/AI4935/2017|H5N8|MF973227.1` (for the NA segment sequence of a H5N8 sample obtained from chicken in Zimbabwe in 2017)

  **NOTE 2**: Sequences containing the ambiguity symbol N will be ignored by the workflow entirely.

  **NOTE 3**: A well-formatted collection of reference sequences suitable for most analysis needs is linked from the "Data resources" section of the page: https://virology.usegalaxy.eu/published/page?id=a04ab8d6ecb698fa.

## Outputs:

- **Vapor - closest references**: a nested collection listing, for each sample and segment, the up to 500 best matching reference sequences according to VAPOR; inspect this collection if you are curious how many good matches to your data there were in the reference collection; useful for debugging, for example, if generated consensus sequences contain unresolved bases (Ns)
- **Subtyping results**: a table listing one sample and its detected subtype (with respect to the HA and NA segments) per row
- **Hybrid reference genomes used for mapping**: collection of compiled reference genomes (in FASTA format, one per sample) that served as input for bwa-mem; each reference genome consists of the genome segments from the reference collections that best matched the corresponding sample's sequencing data
- **fastp reports**: QC and read trimming and filtering results from fastp
- **Final read mapping results**: bwa-mem mapping results in BAM format post-processed with samtools view
- **QC reports for mapping results**: a collection of reports of QC metrics for the "Final read mapping results" generated with Qualimap
- **Per-sample consensus sequences**: a nested collection of consensus sequences organized first by sample, then by segment
- **Per-segment consensus sequences with samples combined**: a collection of the same consensus sequences organized by segment; each collection element is a multi-sequence FASTA dataset with the segment-specific sequences of all samples
- **Multiple sequence alignments per segment**: a collection of multiple sequence alignments generated with MAFFT from each of the "Per-segment consensus sequences with samples combined" above; generated only if you provided input sequencing data of at least two samples
- **Snipit plots per segment**: a collection of SNP plots across samples generated with Snipit; one plot per segment; generated  only if you provided input sequencing data of at least two samples; the first input sample will be used as the reference in the plot
- **IQ-Tree per-segment ML tree**, **IQ-Tree per-segment ML distance matrix** and **IQ-Tree per-segment report**: collections of IQ-Tree ML trees, distance matrices and reports; each collection has one element per segment; generated  only if you provided input sequencing data of at least three samples

## Related training material

https://gxy.io/GTN:T00308 guides you through a simplified, manual analysis that still includes the key steps of this workflow.

