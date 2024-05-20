# Nanopore _Preprocessing_

Before starting any analysis, it is always a good idea to assess the quality of your input data and to discard poor quality base content by trimming and filtering reads.

Generally, we are not interested in the host sequences, rather only those originating from the pathogen itself. It is important to get rid of all host sequences and to only retain sequences that might include a pathogen, both in order to speed up further steps and to avoid host sequences compromising the analysis.

## Input Datasets

- Collection of sequenced Nanopore reads of all samples to be analized in a `fastq or fastq.gz` formate.

## Output Datasets

- Collection of Pre-Processed Sequenced reads of all samples, ready for further analysis with the other workflows, in a `fastq or fastq.gz` formate.

- Tables indicating total number of reads before and after host sequences trimming, and the host sequences percentages found in each sample.

This workflow is available for trial through our [GTN tutorial](https://training.galaxyproject.org/training-material/topics/microbiome/tutorials/pathogen-detection-from-nanopore-foodborne-data/tutorial.html)
