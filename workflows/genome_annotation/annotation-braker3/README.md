# Genome annotation workflow with Braker3

This workflow allows annotation of a eukaryotic genome using Braker3 and evaluates the quality of the annotation using BUSCO and genome annotation statistics. The annotation can then be improved, normalized, and visualized using additional tools.

**Braker3** is an automated bioinformatics tool that uses RNA-seq and protein data to annotate genomes. It integrates GeneMark-ETP and AUGUSTUS software to predict genes with a high degree of precision. By combining the results of these two tools, Braker3 generates a final file containing gene annotations with strong extrinsic support (i.e. based on external experimental data).

## Workflow Steps

- Annotation with Braker3: Braker3 uses the genome sequence, protein sequences, and alignments from RNA-seq.
- Quality Evaluation:
    - Run Fasta Statistics to assess genome assembly quality.
    - Use BUSCO to evaluate annotation completeness.
- Sequence Extraction: Extract predicted protein sequences using GFFRead for downstream analysis.
- Visualization: Load the genome sequence and annotation into JBrowse for interactive browsing.

## Input data
The following input files are required for the workflow:
- Soft Masked genome sequence (FASTA format): The genome to be annotated. Used by Braker3, Fasta Statistics, and BUSCO.
- Protein sequences (FASTA format): Evidence to assist annotation in Braker3.
- Alignments from RNA-seq (BAM format): Alignments used as evidence by Braker3.

## Output Data
The workflow generates the following outputs:
- Annotation file (GFF3): Contains the final consensus gene models produced by Braker3.
- Genome statistics: A tabular file summarizing contig sizes and base content, produced by Fasta Statistics.
- BUSCO results: Assess the completeness of the annotation and include:
    - A summary of results.
    - A table of all searched BUSCO genes with their status.
    - A table of missing BUSCO genes.
- Protein sequences (FASTA): Predicted from the annotation using GFFRead.
- Genome browser visualization (HTML): An interactive genome view produced by JBrowse.