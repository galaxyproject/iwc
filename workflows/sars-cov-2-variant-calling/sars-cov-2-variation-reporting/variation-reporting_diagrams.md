# Workflow diagrams

## COVID-19: variation analysis reporting

```mermaid
graph LR
0["Variation data to report"]@{ shape: docs }
1["AF Filter"]@{ shape: lean-l }
2["DP Filter"]@{ shape: lean-l }
3["DP_ALT Filter"]@{ shape: lean-l }
4["gene products translations"]@{ shape: doc }
5["Number of Clusters"]@{ shape: lean-l }
6["SnpSift Filter"]@{ shape: process }
0 --> 6
7["Compose text parameter value"]@{ shape: process }
1 --> 7
2 --> 7
3 --> 7
8["Compose text parameter value"]@{ shape: process }
1 --> 8
2 --> 8
3 --> 8
9["SnpSift Filter"]@{ shape: process }
7 --> 9
8 --> 9
6 --> 9
10["SnpSift Extract Fields"]@{ shape: process }
9 --> 10
11["Replace column"]@{ shape: process }
10 --> 11
4 --> 11
12["Compute"]@{ shape: process }
11 --> 12
13["Datamash"]@{ shape: process }
12 --> 13
14["Replace"]@{ shape: process }
13 --> 14
15["Collapse Collection"]@{ shape: process }
14 --> 15
16["Compute"]@{ shape: process }
15 --> 16
17["Replace"]@{ shape: process }
16 --> 17
18["Datamash"]@{ shape: process }
17 --> 18
19["Filter"]@{ shape: process }
17 --> 19
20["Datamash"]@{ shape: process }
17 --> 20
21["Join"]@{ shape: process }
19 --> 21
18 --> 21
22["Datamash"]@{ shape: process }
19 --> 22
23["Datamash"]@{ shape: process }
19 --> 23
24["Datamash"]@{ shape: process }
21 --> 24
25["Join"]@{ shape: process }
17 --> 25
22 --> 25
26["Join"]@{ shape: process }
16 --> 26
23 --> 26
27["Cut"]@{ shape: process }
24 --> 27
28["Join"]@{ shape: process }
25 --> 28
20 --> 28
29["Cut"]@{ shape: process }
26 --> 29
30["Replace"]@{ shape: process }
27 --> 30
31["Cut"]@{ shape: process }
28 --> 31
32["Split file"]@{ shape: process }
29 --> 32
33["Sort"]@{ shape: process }
30 --> 33
34["Sort"]@{ shape: process }
31 --> 34
35["Variant Frequency Plot"]@{ shape: process }
5 --> 35
32 --> 35
```
