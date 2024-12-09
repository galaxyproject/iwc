# Workflow diagrams

## QIIME2-III-V-Phylogeny-Rarefaction-Taxonomic-Analysis

```mermaid
graph LR
0["Representative sequences"]@{ shape: doc }
1["Feature table"]@{ shape: doc }
2["Metadata"]@{ shape: doc }
3["Minimum depth"]@{ shape: lean-l }
4["Maximum depth"]@{ shape: lean-l }
5["SEPP fragment insertion reference"]@{ shape: doc }
6["Taxonomic classifier"]@{ shape: doc }
7["Phylogenetic tree for diversity analysis"]@{ shape: subprocess }
0 --> 7
5 --> 7
8["Taxonomic analysis"]@{ shape: subprocess }
1 --> 8
0 --> 8
2 --> 8
6 --> 8
9["Rarefaction"]@{ shape: subprocess }
1 --> 9
4 --> 9
2 --> 9
3 --> 9
7 --> 9
```

## QIIME2 IV: Rarefaction

```mermaid
graph LR
0["Metadata"]@{ shape: doc }
1["DADA2 feature table"]@{ shape: doc }
2["Rooted tree"]@{ shape: doc }
3["Minimum depth"]@{ shape: lean-l }
4["Maximum depth"]@{ shape: lean-l }
5["Alpha rarefaction"]@{ shape: process }
0 --> 5
3 --> 5
2 --> 5
4 --> 5
1 --> 5
```

## QIIME2 V: Taxonomic analysis

```mermaid
graph LR
0["Metadata"]@{ shape: doc }
1["DADA2 representative sequences"]@{ shape: doc }
2["Taxonomic classifier"]@{ shape: doc }
3["DADA2 feature table"]@{ shape: doc }
4["Taxonomy classification"]@{ shape: process }
2 --> 4
1 --> 4
5["Taxonomy barplot"]@{ shape: process }
0 --> 5
4 --> 5
3 --> 5
6["Tabulate taxonomy classification"]@{ shape: process }
4 --> 6
```

## QIIME2 III: Phylogenetic tree for diversity analysis

```mermaid
graph LR
0["DADA2 representative sequences"]@{ shape: doc }
1["SEPP fragment insertion source file"]@{ shape: doc }
2["Phylogenetic tree generation"]@{ shape: process }
1 --> 2
0 --> 2
```
