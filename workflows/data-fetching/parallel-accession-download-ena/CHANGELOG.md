# Changelog

All notable changes to this workflow will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- Initial version of parallel accession download workflow for ENA
- Support for batch downloading of FASTQ files from ENA/NCBI using accession lists
- Parallel processing capability with configurable batch sizes
- Automatic detection and separation of single-end and paired-end reads
- Metadata collection for all downloaded accessions
- Two test cases covering single-end (SRR000062) and paired-end (SRR11953971) downloads
- Comprehensive workflow documentation

### Features
- Split accession lists into customizable batch sizes for optimal parallelization
- Uses `fastq-dl` (v3.0.1) for downloading sequencing data
- Organized outputs with proper tagging (SE/PE)
- Support for txt, tabular, and csv input formats
