# **Group Assignment for Co-Assembly**

This workflow preprocesses metagenomic data by organizing and concatenating paired-end reads into group-specific datasets based on metadata. These grouped datasets are prepared for subsequent co-assembly, enabling downstream analysis of group-level metagenomes.

---

## **Inputs**
- **Metadata File**: A tabular file defining the grouping of samples.
- **Trimmed Paired Reads**:
  - Preprocessed paired-end reads in FASTQ format.
  - Input as a list of paired collections.

---

## **Outputs**
- **Grouped Paired Reads**:
  - Concatenated paired-end datasets organized by group.
  - Ready for co-assembly per group.

---

## **Workflow Steps**
1. **Input Data**:
   - Upload metadata and trimmed paired reads to the Galaxy server.
2. **Group Assignment**:
   - Assign samples to groups based on metadata.
   - Organize paired reads into group-specific datasets.
3. **Concatenation**:
   - Concatenate paired reads within each group.
   - Generate group-specific paired-end files for co-assembly
