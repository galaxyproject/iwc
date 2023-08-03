# Gene based pathogenic identification

With taxonomy profiling, we identified some bacterial species. But we want to be sure they are pathogenic, by looking for genes known to be linked to pathogenicity or to the pathogenecity character of the organim:

- Virulence Factor (VF): gene products, usually proteins, involved in pathogenicity. By identifiying them we can call a pathogen and its severity level

- Antimicrobial Resistance genes (AMR).

    These type of genes have three fundamental mechanisms of antimicrobial resistance that are enzymatic degradation of antibacterial drugs, alteration of bacterial proteins that are antimicrobial targets, and changes in membrane permeability to antibiotics, which will lead to not altering the target site and spread throughput the pathogenic bacteria decreasing the overall fitness of the host.

To look for these genes and determine the strain of the bacteria we are testing for pathogenicity we use Multilocus Sequence Typing approach and dedicated pubMLST datases database:

1. Genome assembly to get contigs, i.e. longer sequences, using metaflye (Kolmogorov et al. 2020) then assembly polishing using medaka consensus pipeline and visualizing the assembly graph using Bandage Image (Wick et al. 2015)
2. Generate an MLST report with MLST tool that scans genomes against PubMLST schemes
3. Generate reports with AMR genes and VF using ABRicate

As outputs, we will get our FASTA and Tabular files to track genes and visualize our pathogenic identification.
