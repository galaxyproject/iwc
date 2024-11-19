# Clinical Metaproteomics 5: Data Interpretation
Data interpretation can provide meaningful insights about quantitative proteomic data. Here, MaxQuant data will be interpreted using MSstats by applying a rigorous statistical framework to understand data distribution and variability. Systematic variations are accounted for using subsequent normalization. Users can define the experimental design used by MSstats, such as sample groups and conditions, to perform statistical analysis. The MSstats output provides valuable information about differential protein expression across various conditions, estimates of fold changes, and associated p-values, which aids in the identification of biologically significant proteins. Furthermore, MSstats enables quality control and data visualization, enhancing our ability to draw meaningful conclusions from large-scale proteomic datasets and expands our understanding of complex biological processes.

In this current workflow, we perform taxonomic and functional annotations using Unipept and statistical analysis using MSstatsTMT. A GTN has been developed for this workflow.
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
- Unipept application: peptinfo: Tryptic peptides and associated EC and GO terms and lowest common ancestor taxonomy
- Match input peptides by: Match to the full input peptide

For MSstatsTMT:
- Generate separate plots for microbial and human proteins

## Processing
- Perform taxonomic and functional annotations for quantified microbial peptides using Unipept.
- Select microbial and human protein groups to perform statistical analysis using MSstatsTMT.
