# AMR gene detection workflow in an assembled bacterial genome (v1.0)

This workflow uses assembled bacterial genome fasta files (but can be any fasta file) and executes the following steps:
1. Genomic detection
    - Antimicrobial resistance gene identification:
        - **staramr** to blast against ResFinder and PlasmidFinder database
        - **AMRFinderPlus** to find antimicrobial resistance genes and point mutations 
    - Virulence gene identification:
        - **ABRicate** with VFDB_A database
2. Aggregating outputs into a single JSON file
    - **ToolDistillator** to extract and aggregate information from different tool outputs to JSON parsable files

## Inputs

1. Assembled bacterial genome in fasta format.

## Outputs

1. Genomic detection
    - Antimicrobial resistance gene identification:
        - AMR gene list
        - MLST typing
        - Plasmid gene identification
        - Blast hits
        - AMR gene fasta (assembled nucleotide sequences)
        - Point mutation list
    - Virulence gene identification:
        - Gene identification in tabular format
2. Aggregating outputs:
    - JSON file with information about the outputs of **staramr**, **AMRFinderPlus**, **ABRicate**