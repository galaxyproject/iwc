# _Taxonomy Profiling_ and Visualisation with Krona

In this workflow, we identify the different organisms found in our samples by assigning taxonomy levels to the reads starting from the kingdom level down to the species level and visualise the result.

It’s important to check what might be the species of a possible pathogen to be found, it gets us closer to the investigation as well as discovering possible multiple pathogenetic infections if any existed.

For taxonomy profiling Kraken2 tool is used along with one of its standard databases available on Galaxy, you can freely choose between Kraken2 different databases based on your input datasets. For visualisation multiple tools can be used, Krona pie chart (as default in this workflow), Phinch interactive tool, Pavian, etc.

## Input Datasets
- Collection of Pre-Processed Sequenced reads of all samples, ready for further analysis with the other workflows, in a `fastq or fastq.gz` format, the output of **Nanopore _Preprocessing_** workflow.

## Output Datasets
- Taxonomy profiling Tabular file, visualisation figures and interactive pie charts.

This workflow is available for trial through our [GTN tutorial](https://training.galaxyproject.org/training-material/topics/microbiome/tutorials/pathogen-detection-from-nanopore-foodborne-data/tutorial.html)

