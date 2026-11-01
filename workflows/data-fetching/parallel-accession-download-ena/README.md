# Parallel Accession Download ENA - Galaxy Workflow

## Overview

This Galaxy workflow automates the parallel download of sequencing data (FASTQ files) from the European Nucleotide Archive (ENA) using a list of accession numbers. The workflow is designed to efficiently handle bulk downloads by splitting accessions into manageable batches and processing them in parallel.

## Workflow Author

**Anton Nekrutenko**
- ORCID: [0000-0002-5987-8032](https://orcid.org/0000-0002-5987-8032)

## License

MIT License

## What This Workflow Does

The workflow performs the following steps:

1. **Input Processing**: Takes a list of accession numbers (e.g., SRR numbers from ENA)
2. **Batch Splitting**: Divides the accession list into smaller chunks for parallel processing
3. **Parallel Download**: Downloads FASTQ files for each batch simultaneously using the `fastq-dl` tool
4. **Output Organization**: Organizes downloaded data into three categories:
   - Metadata files (information about each accession)
   - Single-end reads (SE)
   - Paired-end reads (PE)

## Workflow Inputs

### 1. List of Accessions (Required)
- **Format**: Text file (txt, tabular, or csv)
- **Content**: One accession number per line
- **Example**:
  ```
  SRR123456
  SRR123457
  SRR123458
  ```
- **Source**: Accessions can be obtained from NCBI SRA or ENA databases

### 2. Number of Accessions per Download Job (Optional)
- **Type**: Integer parameter
- **Default**: 1
- **Recommended**: Set higher for large lists to reduce the number of parallel jobs
- **Example**: For 1,000 accessions, set to 100 to create 10 parallel jobs (each downloading 100 accessions)
- **Minimum**: 1

## Workflow Steps

### Step 1: Split File
- **Tool**: `split_file_to_collection`
- **Purpose**: Divides the input accession list into chunks based on the specified batch size
- **Output**: Collection of smaller files, each containing a subset of accessions

### Step 2: Download FASTQ Files
- **Tool**: `fastq-dl`
- **Purpose**: Downloads sequencing data from ENA/NCBI for each batch of accessions
- **Features**:
  - Automatically detects whether data is single-end or paired-end
  - Downloads metadata for each accession

### Step 3-5: Apply Rules
- **Purpose**: Organizes downloaded files into properly structured collections
- **Step 3**: Creates metadata collection
- **Step 4**: Creates single-end reads collection (tagged as "SE")
- **Step 5**: Creates paired-end reads collection (tagged as "PE")

## Workflow Outputs

1. **Metadata Collection**: TSV/JSON files containing information about each downloaded accession
2. **Single-End Reads**: FASTQ files for single-end sequencing experiments (tagged "SE")
3. **Paired-End Reads**: Paired FASTQ files for paired-end sequencing experiments (tagged "PE")

## Usage Recommendations

### For Small Lists (< 50 accessions)
- Keep the default batch size of 1
- This will create one job per accession

### For Medium Lists (50-500 accessions)
- Set batch size to 10-50
- This balances parallelization with job management

### For Large Lists (> 500 accessions)
- Set batch size to 50-100 or higher
- Reduces the total number of jobs and system overhead
- Example: 1,000 accessions with batch size 100 = 10 parallel jobs

## Important Notes

1. **Network Requirements**: This workflow requires internet access to download data from ENA
2. **Storage Requirements**: Ensure sufficient storage space for downloaded FASTQ files (sequencing files can be very large)
3. **Time Considerations**: Download time depends on:
   - Number of accessions
   - Size of each sequencing dataset
   - Network bandwidth
   - Server load on ENA

4. **Error Handling**: Some accessions may fail to download if:
   - The accession is invalid
   - Data is restricted/private
   - Network connectivity issues
   - The data is not available on the queried repository

## Example Use Case

**Scenario**: Downloading 500 bacterial genome sequencing datasets

```
Input 1: List of 500 SRR accessions (one per line)
Input 2: Batch size = 50

Result: 10 parallel download jobs, each handling 50 accessions
```

## Testing

The workflow includes automated tests for both single-end and paired-end data downloads:

- **Single-End Test**: Downloads SRR000062
- **Paired-End Test**: Downloads SRR11953971

Test data is located in the `test-data/` directory.

## References

- Galaxy Project: https://galaxyproject.org/
- ENA: https://www.ebi.ac.uk/ena
- fastq-dl tool: https://github.com/rpetit3/fastq-dl
