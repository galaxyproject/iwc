# ELIXIR RCI-M Phenols Suspect Screening Workflow

## Overview

This Galaxy workflow performs **suspect screening list generation for phenolic compounds** using molecular structures and a trained retention time (RT) prediction model. It integrates cheminformatics tools and machine learning to calculate descriptors, predict RT values, and generate a final list of suspect ions suitable for downstream analysis.

The workflow is designed to work in conjunction with the **RCI-M RT prediction model training workflow**.

---

## Key Features

- Accepts molecular structures (SDF) as input  
- Predicts retention times using a trained ML model  
- Calculates molecular descriptors via RDKit  
- Generates a cleaned and annotated suspect screening list  
- Computes ionized forms and m/z values using Isolib  
- Outputs a ready-to-use suspect ion list for screening  

---

## Inputs

| Input | Format | Description |
|------|--------|------------|
| **Input structures** | `.sdf` | Molecular structures for suspect screening |
| **RT Prediction Model** | `.h5mlm` | Pre-trained ML model for RT prediction |

---

## Workflow Steps

### 1. Structure Preparation
- Convert input structures from **SDF → SMILES** using OpenBabel

### 2. Descriptor Calculation
- Compute molecular descriptors using RDKit, including:
  - LogP
  - Molecular weight
  - TPSA
  - Hydrogen bond donors/acceptors
  - Aromaticity metrics
  - Ring counts

### 3. Retention Time Prediction
- Apply the trained ML model to predict retention times (RT)

### 4. Data Processing
- Remove headers and merge:
  - SMILES structures
  - Predicted RT values
- Filter out invalid entries (e.g., negative RT values)

### 5. Output Formatting
- Convert results to CSV format
- Add headers:  
  ```
  smiles,name,rt
  ```

### 6. Molecular Annotation
- Add molecular formulas via **MSMetaEnhancer (RDKit)**

### 7. Data Cleaning
- Remove charge symbols (`+`, `-`) from formulas
- Filter invalid SMILES entries

### 8. Suspect Ion Generation
- Generate isotopic patterns and m/z values using **Isolib**
- Ionization settings:
  - Mode: **negative**
  - Adduct: **[M−H]⁻**
  - Includes isotopes and adduct calculations

---

## Outputs

| Output | Format | Description |
|--------|--------|------------|
| **Suspect Ion List** | `.msp` / tabular | Final list including SMILES, RT, formula, and predicted ions |

---

## Workflow Dependencies

This workflow uses the following Galaxy tools:

- OpenBabel (format conversion)
- RDKit descriptors
- Model Prediction (ML inference)
- MSMetaEnhancer
- Text processing tools
- Isolib (ion/isotope library generation)

---

## Usage Notes

- Ensure the RT prediction model (`.h5mlm`) is trained with compatible descriptors  
- Input structures must be valid and correctly formatted (SDF)  
- Negative RT predictions are automatically filtered out  
- The workflow is configured for **negative ionization mode ([M−H]⁻)**  

---

## Example Use Case

This workflow is suitable for:

- Environmental metabolomics  
- Non-target/suspect screening in LC-MS  
- Phenolic compound analysis  
- Generating inclusion lists for targeted MS workflows  

---

## License

MIT License

---

## Author

**Helge Hecht**  
ORCID: 0000-0001-6744-996X  

---

## Acknowledgements

Developed within the ELIXIR CZ infrastructure and leveraging Galaxy tool ecosystem.

The work was supported by the ESFRI Research Infrastructure ELIXIR programme 2024–2028, Commissioned Service Project Plan (COS) and its WP5 (Next level of reproducible, comparable and integrable Metabolomics) – funded by the European Union’s Horizon Europe Programme under grant agreement number 101131096.