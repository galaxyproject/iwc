# Clinical Metaproteomics 1: Data Interpretation

[https://training.galaxyproject.org/training-material/topics/proteomics/tutorials/clinical-mp-5-data-interpretation/tutorial.html](https://training.galaxyproject.org/training-material/topics/proteomics/tutorials/clinical-mp-5-data-interpretation/tutorial.html).

## Input datasets

### Input tabular files
- `Annotation.tabular`
- `Comparison_Matrix.tabular`
- `MaxQuant_Evidence.tabular`
- `MaxQuant_Protein_Groups.tabular`
- `Quantified-Peptides.tabular`

## Input Values

For Unipept:
- Unipept application: `peptinfo: Tryptic peptides and associated EC and GO terms and lowest common ancestor taxonomy`
- Match input peptides by: `Match to the full input peptide`
- Choose outputs: `Tabular with one line per peptide` `JSON Taxomony Tree` `Peptide GO terms in normalized tabular` `Peptide InterPro entries in normalized tabular` `Peptide EC terms in normalized tabular` `JSON EC Coverage Tree`

For MSstatsTMT:


## Processing
Perform taxonomic and functional annotations using Unipept and statistical analysis using MSstatsTMT.
