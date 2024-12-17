# Genome annotation workflow with Maker

This workflow allows for genome annotation using Maker and evaluates the quality of the annotation with BUSCO and genome annotation statistics. The annotation can then be improved, standardized, and visualized with additional tools.

**Maker** is a genome model prediction software that uses ab initio predictors (SANP and Augustus) to improve its predictions. Maker is capable of annotating both prokaryotes and eukaryotes. It works by aligning as much evidence as possible along the genome sequence, then reconciling all these signals to determine likely genetic structures.

## Workflow Steps

- Annotation with Maker: Maker uses the genome sequence, protein evidence, ab-initio predictions, and ESTs to produce the annotation.
- Quality Evaluation:
    - Run Fasta Statistics to assess genome assembly quality.
    - Use BUSCO to evaluate annotation completeness.
- Annotation Statistics: Analyze the annotation using Genome Annotation Statistics, producing graphical and textual summaries.
- Sequence Extraction: Extract predicted protein sequences using GFFRead for downstream analysis.
- Improve Gene Names: Standardize gene names using Map annotation ids for better readability.
- Visualization: Load the genome sequence and annotation into JBrowse for interactive browsing.

## Input data
The following input files are required for the workflow:
- Genome sequence (FASTA format): The genome to be annotated. Used by Maker, Fasta Statistics, and BUSCO.
- Protein sequences (FASTA format): Evidence to assist annotation in Maker.
- EST evidences (FASTA format): Alignments used as evidence by Maker.
- Ab-initio gene predictions: Supplementary data for Maker to refine annotations.


## Output Data
The workflow generates the following outputs:
- Annotation file (GFF3): Contains the final consensus gene models produced by Maker.
- Genome statistics: A tabular file summarizing contig sizes and base content, produced by Fasta Statistics.
- BUSCO results: Assess the completeness of the annotation and include:
    - A summary of results.
    - A table of all searched BUSCO genes with their status.
    - A table of missing BUSCO genes.
- Annotation statistics: Summary and graphical analyses of the annotation, produced by Genome Annotation Statistics.
- Protein sequences (FASTA): Predicted from the annotation using GFFRead.
- Renamed GFF annotation file: Contains standardized gene names, produced by Map annotation ids.
- Genome browser visualization (HTML): An interactive genome view produced by JBrowse.