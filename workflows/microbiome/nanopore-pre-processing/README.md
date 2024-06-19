# Nanopore Preprocessing

Before starting any analysis, it is always a good idea to assess the quality of your input data and to discard poor-quality base content by trimming and filtering reads.

Generally, we are not interested in the host sequences, but rather only those originating from the pathogen itself. It is important to get rid of all host sequences and to only retain sequences that might include a pathogen, both in order to speed up further steps and to avoid host sequences compromising the analysis.

## Input Datasets

- Collection of sequenced Nanopore reads of all samples to be analysed in a `fastqsanger` or `fastqsanger.gz` format.

## Output Datasets

- Collection of Pre-Processed Sequenced reads of all samples, ready for further analysis with the other workflows, in a `fastqsanger` or `fastqsanger.gz` format.

- Tables indicating total number of reads before and after host sequences trimming, and the host sequences percentages found in each sample.

If you're unsure how to use this workflows, or if you want to see it in action with test datasets, it is included in our detailed training material for foodborne pathogen detection and tracking. You can find step-by-step instructions and practical examples in the following [GTN tutorial](https://training.galaxyproject.org/training-material/topics/microbiome/tutorials/pathogen-detection-from-nanopore-foodborne-data/tutorial.html)
