# MGnify's amplicon (v5.0) quality control subworkflow for single end data

## Input datasets

- **Accession** Download and extract single-end reads from NCBI SRA via corresponding accession IDs.

## Input values

- **Trimmomatic - SLIDING WINDOW - Average quality required** (Default = 15)
- **Trimmomatic - LEADING** Minimum quality required to keep a base, (Default = 3)
- **Trimmomatic - TRAILING** Minimum quality required to keep a base, (Default = 3)
- **Trimmomatic - SLIDING WINDOW - Number of bases to average across** (Default = 4)
- **Trimmomatic - MINLEN** Minimum length of reads to be kept, (Default = 100)
- **Trimmomatic - Quality score encoding** The phred+64 encoding works the same as the phred+33 encoding, except you add 64 to the phred score to determine the ascii code of the quality character, (Default = Phred33)
- **Length filtering - Minimum size** Minimum sequence length, (Default = 100)
- **Ambiguity filtering - Maximal N percentage threshold to conserve sequences** Maximal N percentage threshold to conserve sequences, (Default = 10)

## Processing

This subworkflow executes the following quality control steps:

- **Trimmomatic** Filtering and trimming reads using trimmomatic
- **Filter FASTQ** Filter reads shorter than 100 bp
- **PRINSEQ** Ambiguity filtering