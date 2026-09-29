# 🧬 DNA sequence classification using LSTM neural network (Galaxy Workflow)

## Overview

This workflow implements a deep learning pipeline for DNA sequence classification tasks using an LSTM-based neural network. It takes DNA sequences/fragments in FASTA format and their corresponding task specific categories/labels/classes in tabular format, processes them into numerical representations, trains the deep learning model, and evaluates the trained model's performance.

### An example task achieved by the workflow

The workflow can be used to perform DNA sequence classification (60 bp gene sequence fragments) on splice-junction gene sequences. In an example task, the workflow takes raw DNA sequence data as input and classifies each sequence based on whether it contains an exon–intron boundary, an intron–exon boundary, or no splice junction using an LSTM-based deep learning model. These classes correspond to donor sites (EI), acceptor sites (IE), and neither (N). During splicing, non-coding introns are removed and coding exons are joined together before a gene is translated into a protein. Detecting these splice-junction boundaries from DNA sequences helps in understanding gene structure and function. More information about such a dataset can be found in this [blogpost](https://galaxyproject.org/news/2026-04-28-tabpfn-v2-5/#splice-junction-gene-sequences). The blogpost uses a publicly available dataset that contains DNA sequences and their respective splice junction categories or classes as EI, IE and N. The dataset snippet is shared below:

| Splice junction categories  | Donor                   | DNA sequence                                                 |
|-----------------------------|-------------------------|--------------------------------------------------------------|
| EI                          | ATRINS-DONOR-521        | CCAGCTGCATCACAGGAGGCCAGCGAGCAGGTCTGTTCCAAGGGCCTTCGAGCCAGTCTG |
| IE                          | HUMMHCP52-ACCEPTOR-1763 | CGCTCAGCCCGCTCCTTTCACCCTCTGCAGGAGAGCCTCGTGGCAGGCCAGTGGAGGGAC |
| N                           | HUMPOMC-NEG-421         | CGGAGACCCAACGCCATCCATAATTAAGTTCTTCCTGAGGGCGAGCGGCCAGGTGCGCCT |

The first column contains a set of categories/labels/classes and the third column contains a set of DNA sequences.


Other tasks can include predicting protein-binding sites - whether a DNA fragment can bind to a certain protein. The labels in this task would be non-binding (0) or binding (1) and features would be DNA sequences.

An example of a regression task can be found in [Gosai, S. et al](https://www.nature.com/articles/s41586-024-08070-z) which studies gene expression regulation by cis-regulatory elements.
The dataset from the publication is available at [Hugging Face](https://huggingface.co/datasets/HuggingFaceBio/malinois-mpra-regression) which has DNA fragments matched with their gene expression for different cell types for the supervised DNA-to-activity regression task.
However, the current workflow is designed for classification tasks and will require modifications for use in regression tasks.

---

## Key features

- End-to-end pipeline in Galaxy
- DNA sequence encoding using k-mer representation
- Deep learning model built with Keras
- LSTM-based architecture for sequence learning
- Automatic train/test split
- Model prediction with classification metrics and confusion matrix
- Prediction of class labels and probabilities

---

## Inputs

The workflow requires two datasets:
- DNA sequences (FASTA format). Can contain fixed length or variable length sequences. Shorter sequences are padded to the length of the longest sequence
- Categories/labels/classes for DNA sequences (tabular format): a single column with one label per line, no header, in the same order as the FASTA records (e.g. splice junctions (exon-intron, intron-exon and neither) corresponding to DNA sequences). For the example dataset above, this is the first column only

The model and training parameters (k-mer size, embedding output dimensions, LSTM layer units, dense layer units, number of training epochs and batch size) are exposed as workflow parameters and can be changed when launching the workflow.

---

## Workflow steps

### 1. Data encoding
- DNA sequences are converted into numerical format using:
  - k-mer encoding (default k=3, set by the "K-mer size" parameter)
- Output: encoded feature matrix

### 2. Data preparation
- K-mer encoded sequences are merged with labels
- Dataset is split into:
  - Training set (75%)
  - Test set (25%), used to compute confusion matrix and predicted labels and probabilities
- Training set is further split into:
  - Training set (80% of original training set), used to train the model
  - Validation set (20% of original training set), used to compute the evaluation metrics

### 3. Feature & label separation
- Training and test datasets are split into:
  - X (features): k-mer encoded sequences
  - y (labels): class labels
- Labels are converted to categorical (one-hot encoded) representation

### 4. Model training
- LSTM-based deep learning model is trained to map k-mer encoded DNA sequences to their task-specific labels.

### 5. Model prediction
- The trained model is used to make predictions on unseen test data (25% test set).

---

## Model architecture

The workflow builds a Sequential Keras model with:

- Embedding layer:
  - Input dimension: computed from input data (size of the k-mer vocabulary)
  - Output dimension: 128 (default)
  - Number of output dimensions can be tuned for optimal performance

- LSTM layers:
  - LSTM (256 units by default, returns sequences)
  - LSTM (256 units by default)
  - Number of LSTM units can be tuned for optimal performance

- Dense layers:
  - Dense (64 units by default, ELU activation)
  - Output Dense (one unit per class, computed from the labels, Softmax)
  - Number of dense units can be tuned for optimal performance

---

## Model training

- Optimizer: Adam
- Loss function: categorical crossentropy
- Metric: categorical accuracy

Training parameters:
- Epochs: 10 (default)
- Batch size: 32 (default)
- Held-out validation set for prediction: 20% of the training set, used by Keras to monitor training (see Data preparation)

---

## Model optimisation

Machine and deep learning models need parameter optimisation (also called hyperparameter optimisation) to find the best classification performance for any dataset.
The model architecture in the workflow may not provide optimal accuracy for all datasets. Therefore, it is always good to tune the parameters to explore their optimal values.

A list of parameters to look out for model optimisation:

- Epochs
- Batch size
- Learning rate
- Optimiser
- Number of LSTM layers and their number of respective units
- Number of dense layers and their number of respective units
- Training/test/validate data split size

---

## Evaluation (validation set)

The trained model is evaluated on the held-out validation set. The "Evaluation metrics (validation set)" output reports:

- Accuracy
- Categorical accuracy
- F1-score (macro)
- Recall (macro)
- Loss

A higher F1-score (closer to 1.0) indicates high performance. High classification performance is not an objective metric, varies across datasets and heavily depends on model architecture and data quality.

---

## Prediction (test set)

The trained model is used to make predictions on the test set. It outputs:

- Confusion matrix
- Predicted labels
- Predicted label probabilities

A higher F1-score (closer to 1.0) indicates high performance. High classification performance is not an objective metric, varies across datasets and heavily depends on model architecture and data quality.

---

## Outputs

- Encoding vocabulary (DNA sequence labels to index mapping)
- Predicted labels (test set)
- Predicted label probabilities (test set)
- Evaluation metrics (validation set)
- Confusion matrix (test set)

---

## Usage notes

- Ensure DNA sequences are in FASTA and labels as tabular formats
- Categories/labels/classes must align with input DNA sequences
- Enable GPU for faster performance - consider this option when dataset is large (tested on Nvidia GPUs). To enable it, open the workflow and go to "Deep learning training and evaluation" tool. At the bottom of the tool definition, there is an option "Job Resource Parameters". Choose "Specify job resource parameters" and then in the "Use GPU resources", set it to "Yes"
- Suitable for multi-class classification problems

---

## License

MIT License