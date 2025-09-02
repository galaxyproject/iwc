## Decontamination Workflow

Decontamination (foreign contaminants and mitochondrial sequences) of genome assembly after scaffolding step. Part of the VGP Suite. 

### Inputs

- Genome assembly [fasta]
- The NCBI taxonomic identifier of your species (e.g. `9606` for humans) 
- Your species binomial name (e.g. Homo Sapiens)
- The assembly name (e.g. Hg19)
- The haplotype being decontaminated
- Maximum length of sequence to consider for mitochondrial scaffolds:. Select `0` to use all the scaffolds. Change this setting if you have particularly long scaffolds that cause BLAST to fail. 

### Ouput

- A taxonomy report containing the list of sequences and their identified taxonomy. [tabular]
- Contaminant sequences [fasta]
- List of mitochondrial scaffolds [txt]
- An adaptor report with the adaptor sequences found in the assembly and the actions to perform to remove them [tabular]
- A masking adaptor report, with the same informations than the adaptor report except the adaptor sequences found in the middle of the sequences are flagged for masking instead of trimming. [tabular]
- Decontaminated assembly [fasta]
