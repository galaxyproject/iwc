# Workflow diagrams

## Hi-C_fastqToCool_hicup_cooler

```mermaid
graph LR
0["PE fastq input"]@{ shape: docs }
1["genome name"]@{ shape: lean-l }
2["Restriction enzyme"]@{ shape: lean-l }
3["No fill-in"]@{ shape: lean-l }
4["minimum MAPQ"]@{ shape: lean-l }
5["Bin size in bp"]@{ shape: lean-l }
6["Interactions to consider to calculate weights in normalization step"]@{ shape: lean-l }
7["region for matrix plotting"]@{ shape: lean-l }
8["Hi-C_fastqToPairs_hicup"]@{ shape: subprocess }
3 --> 8
0 --> 8
2 --> 8
1 --> 8
4 --> 8
9["Sort pairs and index"]@{ shape: process }
8 --> 9
1 --> 9
10["Hi-C_juicermediumtabixToCool_cooler"]@{ shape: subprocess }
5 --> 10
6 --> 10
9 --> 10
1 --> 10
11["final plot"]@{ shape: process }
7 --> 11
10 --> 11
```

## Hi-C_juicermediumtabixToCool_cooler

```mermaid
graph LR
0["Bin size in bp"]@{ shape: lean-l }
1["genome name"]@{ shape: lean-l }
2["Juicer Medium Tabix with validPairs"]@{ shape: docs }
3["Interactions to consider to calculate weights in normalization step"]@{ shape: lean-l }
4["make bed with bins"]@{ shape: process }
0 --> 4
1 --> 4
5["Load pairs in matrix"]@{ shape: process }
1 --> 5
2 --> 5
4 --> 5
6["ICE normalization"]@{ shape: process }
3 --> 6
5 --> 6
```

## Hi-C_fastqToPairs_hicup

```mermaid
graph LR
0["PE fastq input"]@{ shape: docs }
1["genome name"]@{ shape: lean-l }
2["Restriction enzyme"]@{ shape: lean-l }
3["No fill-in"]@{ shape: lean-l }
4["minimum MAPQ"]@{ shape: lean-l }
5["HiCUP"]@{ shape: process }
3 --> 5
1 --> 5
0 --> 5
2 --> 5
1 --> 5
6["build filtering rule for MAPQ"]@{ shape: process }
4 --> 6
4 --> 6
7["valid pairs in juicebox format"]@{ shape: process }
5 --> 7
5 --> 7
8["valid pairs in juicebox format MAPQ filtered"]@{ shape: process }
6 --> 8
7 --> 8
```
