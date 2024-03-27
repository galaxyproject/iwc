# MGnify's amplicon (v5.0) quality control subworkflow for paired end data

## Input datasets

- **Accession** Download and extract paired-end reads from NCBI SRA via corresponding accession IDs.

## Input values

- **fastp - Enable base correction** Enable base correction in overlapped regions, (Default = No)
- **fastp - Qualified quality phred** The quality value that a base is qualified, (Default = 20)
- **fastp - Unqualified percent limit** How many percents of bases are allowed to be unqualified, (Default = 20)
- **fastp - Length required** Reads shorter than this value will be discarded, (Default = 70)
- **Trimmomatic - SLIDINGWINDOW - Number of bases to average across** (Default = 4)
- **Trimmomatic - SLIDINGWINDOW - Average quality required** (Default = 15)
- **Trimmomatic - LEADING** Minimum quality required to keep a base, (Default = 3)
- **Trimmomatic - TRAILING** Minimum quality required to keep a base, (Default = 3)
- **Trimmomatic - MINLEN** Minimum length of reads to be kept, (Default = 100)
- **Trimmomatic - Quality score encoding** The phred+64 encoding works the same as the phred+33 encoding, except you add 64 to the phred score to determine the ascii code of the quality character, (Default = Phred33)
- **Length filtering - Minimum size** Minimum sequence length, (Default = 100)
- **Ambiguity filtering - Maximal N percentage threshold to conserve sequences** Maximal N percentage threshold to conserve sequences, (Default = 10)

## Processing

This subworkflow executes the following quality control steps:

- **fastp** Quality and length filtering
- **SeqPrep** Merges overlapping reads into a single longer reads using SeqPrep
- **Trimmomatic** Filtering and trimming reads using trimmomatic
- **Filter FASTQ** Filter reads shorter than 100 bp
- **PRINSEQ** Ambiguity filtering
