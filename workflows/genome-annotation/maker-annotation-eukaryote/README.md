# Annotation of eukaryotic genomes with MAKER

This workflow describes the necessary steps to annotate eukaryotic genomes by using the MAKER tool. Its original version appears in the GTN under the title [Genome annotation with Maker](https://training.galaxyproject.org/training-material/topics/genome-annotation/tutorials/annotation-with-maker/tutorial.html).

### Workflow evaluation

Comparing annotation workflows and deciding which one is the best is an open question. 

As a possible approach to assess whether changes in the workflow contribute to its improvement, one possibility is to use the [ParseVal](https://usegalaxy.eu/root?tool_id=toolshed.g2.bx.psu.edu/repos/iuc/aegean_parseval/aegean_parseval/0.16.0) tool, in order to compare the obtained result with a standard annotation.

If you only want to know if an annotation looks reasonable based on the current test data, you can just count the genes in the output GFF, and/or compare the total length of genes.

### Licencing

This workflow includes [MAKER](https://www.yandell-lab.org/software/maker.html), a tool whose use is restricted for commercial use without a license. Those wishing to license MAKER for commercial use should contact Aaron Duffy at the University of Utah TVC to discuss your needs.
