# Parallel Accession Download

Downloads fastq files for sequencing run accessions provided in a text file
using fasterq-dump. Creates one job per listed run accession, and is therefore
much faster and more robust to errors when many accessions need to be
downloaded.
