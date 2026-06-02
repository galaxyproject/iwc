# 🧬 DNA sequence classification using LSTM neural network (Galaxy Workflow)

## Overview
This workflow implements a deep learning pipeline for DNA sequence classification task using an LSTM-based neural network. It takes DNA sequences/fragments in FASTA format and their corresponding task specific categories/labels/classes in tabular format, processes them into numerical representations, trains the deep learning model, and evaluates the trained model performance.

### An example task achieved by the workflow

The workflow can be used to perform DNA sequence classification (60bp long short reads) on splice-junction gene sequences. In an example task, the workflow takes raw DNA sequence data as input and classifies each sequence according to whether it contains an exon–intron boundary, an intron–exon boundary, or no splice junction using an LSTM-based deep learning model. These classes correspond to donor sites (EI), acceptor sites (IE), and neither (N). During splicing, non-coding introns are removed and coding exons are joined together before a gene is translated into a protein. Detecting these splice-junction boundaries from DNA sequences helps in understanding gene structure and function. More information about such a dataset can be found in this [blogpost](https://galaxyproject.org/news/2026-04-28-tabpfn-v2-5/#splice-junction-gene-sequences). The blogpost uses a publicly available dataset that contains DNA sequences and their respective splice junction categories or classes as EI, IE and N. The dataset snippet is shared below:

| Splice junction categories  | Donor                   | DNA sequence                                                 |
|-----------------------------|-------------------------|--------------------------------------------------------------|
| EI                          | ATRINS-DONOR-521        | CCAGCTGCATCACAGGAGGCCAGCGAGCAGGTCTGTTCCAAGGGCCTTCGAGCCAGTCTG |
| IE                          | HUMMHCP52-ACCEPTOR-1763 | CGCTCAGCCCGCTCCTTTCACCCTCTGCAGGAGAGCCTCGTGGCAGGCCAGTGGAGGGAC |
| N                           | HUMPOMC-NEG-421         | CGGAGACCCAACGCCATCCATAATTAAGTTCTTCCTGAGGGCGAGCGGCCAGGTGCGCCT |

The first colunm is given as a set of catgories/labels/classes and the third column is used as a set of DNA sequences.


Other tasks can include predicting protein binding sites - whether a DNA fragment can bind to a certain protein. The labels in this task would be non-binding (0) or binding (1) and features would be DNA sequences.

An example of regression task can be found in [Gosai, S et al](https://www.nature.com/articles/s41586-024-08070-z) which studies gene expression regulation by Cis-regulatory elements. The dataset from the publication is available at [Hugging Face](https://huggingface.co/datasets/HuggingFaceBio/malinois-mpra-regression) which has DNA fragments matched with their gene expression for different cell types for the supervised DNA-to-activity regression taks.

---

## Key features
- End-to-end pipeline in Galaxy
- DNA sequence encoding using k-mer representation
- Deep learning model built with Keras
- LSTM-based architecture for sequence learning
- Automatic train/test split
- Model evaluation with classification metrics and confusion matrix
- Prediction of class labels and probabilities

---

## Inputs
The workflow requires two datasets:
- DNA sequences (FASTA format). Can contain fixed length or variable length sequences
- Categories/labels/classes for DNA sequences (tabular format) (e.g. splice junctions (exon-intron, intron-exon and neither) corresponding to DNA sequences)

---

## Workflow steps

### 1. Data encoding
- DNA sequences are converted into numerical format using:
  - k-mer encoding (k=3)
- Output: encoded feature matrix

### 2. Data preparation
- Encoded sequences are merged with labels
- Dataset is split into:
  - Training set (75%)
  - Test set (25%)

### 3. Feature & label separation
- Training and test datasets are split into:
  - X (features): k-mer encoded sequences
  - y (labels): class labels
- Labels are converted to categorical (one-hot encoding) representation

### 4. Model training
- LSTM-based deep learning model is trained to map encoded DNA sequences to their task-specific labels.

### 5. Model evaluation
- The trained model is evaluated on unseen test data on several classification metrics.

---

## Model architecture

The workflow builds a Sequential Keras model with:

- Embedding layer:
  - Input dim: 130
  - Output dim: 128

- LSTM layers:
  - LSTM (256 units, return sequences)
  - LSTM (256 units)

- Dense layers:
  - Dense (64 units, ELU activation)
  - Output Dense (3 units, Softmax)

---

## Model training

- Optimizer: Adam  
- Loss function: categorical crossentropy  
- Metrics: categorical accuracy  

Training parameters:
- Epochs: 10  
- Batch size: 32
- Validation split: 10%  

---

## Model optimisation

Machine and deep learning models need parameter optimisation (also call hyperparameter optimisation) to find the best classification or regression performance for any dataset. The model architecture in the workflow may not provide optimal accuracy for all datasets. Therefore, it is always a good to tune the parameters to explore the optimal set of parameters. 

A list of parameters to look out for model optimisation:

- Epochs
- Batch size
- Learning rate
- Optimiser
- Number of LSTM layers and their number of respective units
- Number of dense layers and their number of respective units
- Training/test/validate data split

---

## Evaluation

- Metrics reported:
  - Accuracy
  - F1-score (macro)
  - Recall (macro)

- Outputs:
  - Predictions on test data
  - Class probabilities
  - Confusion matrix visualization

A higher F1-score (closer to 1.0) indicate high performance. High classification or regression performance is not an objective metric, vary from dataset to dataset and heavily depends on model architecture and data quality. 

---

## Outputs

- Trained model
- Prediction results (labels)
- Prediction probabilities
- Evaluation metrics
- Confusion matrix plot

---

## Usage notes

- Ensure DNA sequences are in FASTA and labels as tabular formats.
- Categories/labels/classes must align with input DNA sequences
- Enable GPU for faster performance - consider this option when dataset is large (tested on Nvidia GPUs). To enable it, open the workflow and go to "Deep learning training and evaluation" tool. At the bottom of the tool definition, there is an option "Job Resource Parameters". Choose "Specify job resource parameters" and the in the "Use GPU resources", set it to "Yes".
- Suitable for multi-class classification problems

---

## License
MIT License