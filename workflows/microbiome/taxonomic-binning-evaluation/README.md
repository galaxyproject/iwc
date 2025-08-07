# FAIRyMAGs Taxonomic Binning Evaluation Workflow

This workflow bin paired short reads to generates Metagenome-Assembled Genomes (MAGs) and classified them afterwards.
**CAMI AMBER** will evaluate the binning and the classification of the MAGs.

## Inputs

- Paired short reads collection
- List of corresponded `Assembly(s)`
- List of `Gold Standard Biobox File(s)`

## Biobox File

The Biobox File can be generated with the utility Tool named **CAMI AMBER convert to biobox**. 
This tool can be found on Galaxy. Important to this is that this tool does not add the TAXID column this has to be done manually!

The `Gold Standard File` can also be written manually. Therefor there is the example for this File, tab separated, and which information has to be written:

```
@SampleID: <Anything>
@@SEQUENCEID	BINID	TAXID
SEQ1	TEST1	1
SEQ2	TEST1	2
SEQ3	TEST2	1
```

It is important to keep this file like this otherwise **CAMI AMBER** might not work!

## Workflow Logic

- Reads and Assembly(s) will be preprocessed for binning
- Binning with multiple Binners:
    - CONCOCT
    - MaxBin2
    - MetaBAT2
    - SemiBin
    - DAS Tool
    - Binette
- From every Binner the bins will be classified with **GTDB-Tk**
- GTDB classification will be mapped to the NCBI classification (**CAMI AMBER** only works with NCBI)
- The generated `Biobox File`will be modified such that the TAXID column will be added to the corresponded BINID
- **CAMI AMBER** will evaluated the result for all Binners in multiple output files together with a `HTML File` to visualize the result. Since the TAXID is added the result also have metrics and visualization for the **taxonomic classification**

