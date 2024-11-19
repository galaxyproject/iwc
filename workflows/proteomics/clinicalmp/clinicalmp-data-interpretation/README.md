# Clinical Metaproteomics 1: Data Interpretation
The final workflow in the array of clinical metaproteomics tutorials is the data interpretation workflow. Interpreting MaxQuant data using MSstats involves applying a rigorous statistical framework to glean meaningful insights from quantitative proteomic datasets. The MaxQuant output is explored to understand data distribution and variability. Subsequent normalization helps account for systematic variations. MSstats allows the user to define the experimental design, including sample groups and conditions, to perform statistical analysis. The output provides valuable information about differential protein expression across conditions, estimates of fold changes, and associated p-values, aiding in the identification of biologically significant proteins. Furthermore, MSstats enables quality control and data visualization, ultimately enhancing our ability to draw meaningful conclusions from complex proteomic datasets.
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
