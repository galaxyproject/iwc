# Pre-Processing collection

Before starting any analysis, it is always a good idea to assess the quality of your input data and to discard poor quality base content by trimming and filtering reads.

Generally, we are not interested in the host sequences, rather only those originating from the pathogen itself. It is an important to get rid of all host sequences and to only retain sequences that might include a pathogen, both in order to speed up further steps and to avoid host sequences compromising the analysis.

## Input datasets

- Collection of sequenced Nanopore reads of all samples to be analized in a `fastq or fastq.gz` formate

## Output datasets

- Collection of Pre-Processed Sequenced reads of all samples, ready for further analysis with the other workflows, in a `fastq or fastq.gz` formate