# MAGs Binning Evaluation Workflow

This workflow bins paired short reads to generate Metagenome-Assembled Genomes (MAGs) and classifies them afterwards.
**CAMI AMBER** will evaluate the binning of the MAGs.

## Inputs

- Paired short reads collection
- List of corresponding `Assembly(s)`
- List of `Gold Standard Biobox File(s)`

## Biobox File

The Biobox File can be generated with the utility Tool named **CAMI AMBER convert to biobox**. 
This tool can be found on Galaxy. Important to this is that this tool does not add the TAXID column this has to be done manually!

The `Gold Standard File` can also be written manually. Therefore, here is an example of this tab-separated file and the information that must be included:

```
@SampleID: <Anything>
@@SEQUENCEID	BINID	TAXID
SEQ1	TEST1	1
SEQ2	TEST1	2
SEQ3	TEST2	1
```

It is important to keep this file like this otherwise **CAMI AMBER** might not work. The TAXID column is optional.


## Workflow Logic

- Reads and Assembly(s) will be preprocessed for binning
- Binning with multiple Binners:
    - CONCOCT
    - MaxBin2
    - MetaBAT2
    - SemiBin
    - DAS Tool
    - Binette
- **CAMI AMBER** will evaluate the result for all Binners in multiple output files together with a `HTML File` to visualize the result