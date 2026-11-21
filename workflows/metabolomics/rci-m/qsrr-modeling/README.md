# ELIXIR RCI-M QSRR Model Training Workflow for MetaboLights
## Summary

QSRR modeling is a tool which can be used to predict the retention behaviour of chemical compounds in chromatographic experiments.
Training a model requires structures with known retention behaviour.

The first step is to calculate the descriptors of physico-chemical properties for the input structures.
Then, the dataset is divided into test and validation set.
The model is then trained on the training set using a subset of available descriptors, using the validation set to decide when to stop training the model.
Then it is evaluated on the completely held out test set.

This workflow takes a MAF file from MetaboLights holding the annotations with structures and retention time values for these compounds.
Those high-confidence annotations are then used to build a model for the dataset, which can be then used to filter or confirm lower confidence annotations.

## Acknowledgements

The work was supported by the ESFRI Research Infrastructure ELIXIR programme 2024–2028, Commissioned Service Project Plan (COS) and its WP5 (Next level of reproducible, comparable and integrable Metabolomics) – funded by the European Union’s Horizon Europe Programme under grant agreement number 101131096.