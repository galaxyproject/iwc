# **Grouped FASTQ merging Workflow**

This workflow organizes and merges paired-end FASTQ datasets into group-specific outputs using user-defined metadata.  
It is designed to support a variety of downstream analyses by preparing merged datasets at the group or sample level. 
These grouped datasets for example can be used for subsequent group co-assembly, enabling downstream analysis of group-level metagenomes.

---

## **Inputs**
- **Metadata File**: 
  A two-column tabular file mapping sample IDs to group IDs.
- **Paired-end Reads**:
  Paired-end reads FASTQ reads (input as a list of paired collections).

---

## **Outputs**
- **Grouped Paired Reads**:
  Concatenated paired-end FASTQ datasets organized by group.
  These are ready for downstream analysis such as co-assembly or per-group processing.

---

## **Example Use Cases**
- **Co-assembly**: Merge reads across individuals or conditions (e.g., healthy vs. diseased) for group-level assembly.  
- **Technical replicates**: Merge sequencing runs from the same sample into one dataset.  
- **Batch processing**: Organize reads into demographic categories (e.g., age groups, sexes) or experimental conditions.  

---

## **Workflow Steps**
1. **Input Data**:
   - Provide metadata and paired FASTQ collections.
2. **Group Assignment**:
   - Assign samples to groups based on metadata.
   - Organize paired reads into group-specific datasets.
3. **Concatenation**:
   - Concatenate reads within each group to produce group-specific FASTQ collections.

---

## **License**
MIT
