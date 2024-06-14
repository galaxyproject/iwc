# Bacterial genome annotation workflow (v1.0)

This workflow uses assembled bacterial genome fasta files (but can be any fasta file) and executes the following steps:
1. Genomic annotation
    - **Bakta** to predict CDS and small proteins (sORF)
2. Integron identification
    - **IntegronFinder2** to identify CALIN elements, In0 elements, and complete integrons
3. Plasmid gene identification
    - **Plasmidfinder** to identify and typing plasmid sequences
4. Inserted sequence (IS) detection
    - **ISEScan** to detect IS elements
5. Aggregating outputs into a single JSON file
    - **ToolDistillator** to extract and aggregate information from different tool outputs to JSON parsable files

## Inputs

1. Assembled bacterial genome in fasta format.

## Outputs

1. Genomic annotation:
    - genome annotation in tabular, gff and several other formats
    - annotation plot
    - nucleotide and protein sequences identified
    - summary of genomic identified elements
2. Integron identification:
    - integron identification in tabular format and a summary
3. Plasmid gene identification:
    - plasmid gene identified and associated blast hits
4. Inserted Element (IS) detection:
    - IS element list in tabular format
    - is hits in fasta format
    - ORF hits in protein and nucleotide fasta format
    - IS annotation gff format
5. Aggregating outputs:
    - JSON file with information about the outputs of **Bakta**, **IntegronFinder2**, **Plasmidfinder**, **ISEScan**