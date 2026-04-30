# 🧬 DNA Sequence Classification using LSTM (Galaxy Workflow)

## 📌 Overview
This workflow implements a deep learning pipeline for DNA sequence classification using an LSTM-based neural network. It takes raw DNA sequences in FASTA format and their labels in tabular format, processes them into numerical representations, trains a model, and evaluates its performance. 

---

## ⚙️ Key Features
- End-to-end pipeline in Galaxy
- DNA sequence encoding using k-mer representation
- Deep learning model built with Keras
- LSTM-based architecture for sequence learning
- Automatic train/test split
- Model evaluation with metrics and confusion matrix
- Prediction of class labels and probabilities

---

## 📥 Inputs
The workflow requires two datasets:
- DNA sequences (FASTA format)
- Labels for sequences (tabular format)

---

## 🔄 Workflow Steps

### 1. Data Encoding
- DNA sequences are converted into numerical format using:
  - k-mer encoding (k=3)
- Output: encoded feature matrix

### 2. Data Preparation
- Encoded sequences are merged with labels
- Dataset is split into:
  - Training set (75%)
  - Test set (25%)

### 3. Feature & Label Separation
- Training and test datasets are split into:
  - X (features): encoded sequences
  - y (labels): class labels
- Labels are converted to categorical (one-hot encoding)

---

## 🧠 Model Architecture

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

## 🏋️ Model Training

- Optimizer: Adam  
- Loss function: categorical crossentropy  
- Metrics: categorical accuracy  

Training parameters:
- Epochs: 10  
- Batch size: 32
- Validation split: 10%  

---

## 📊 Evaluation

- Metrics reported:
  - Accuracy
  - F1-score (macro)
  - Recall (macro)

- Outputs:
  - Predictions on test data
  - Class probabilities
  - Confusion matrix visualization

---

## 📤 Outputs

- Trained model
- Prediction results (labels)
- Prediction probabilities
- Evaluation metrics
- Confusion matrix plot

---

## 🚀 Usage Notes

- Ensure DNA sequences are properly formatted (FASTA)
- Labels must align with input sequences
- GPU acceleration is enabled (if available)
- Suitable for multi-class classification problems

---

## 📄 License
MIT License

---

## 👤 Author
**Anup Kumar**  
ORCID: 0000-0002-2068-4695