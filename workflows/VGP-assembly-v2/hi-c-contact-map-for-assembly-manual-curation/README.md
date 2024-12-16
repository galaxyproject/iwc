# Hi-C Contact map generation for manual curation of genome assemblies : 2 haplotypes

This workflow generates Hi-C contact maps for diploid genome assemblies in the Pretext format. It includes tracks for PacBio read coverage, Gaps, and telomeres. The Pretext files can be open in PretextView for the manual curation of genome assemblies. 


## Inputs

1. **Haplotype 1** [fasta]
2. **Haplotype 2** [fasta]
3. **Do you want to add suffixes to the scaffold names?** Select yes if the scaffold names in your assembly do not contain haplotype information.
4. **Haplotype 1 suffix** This suffix will be added to haplotype 1 scaffold names if you selected to add suffixes to the scaffold names.
5. **Haplotype 2 suffix** This suffix will be added to haplotype 2 scaffold names if you selected to add suffixes to the scaffold names.
6. **Hi-C reads - forward**  [fastq] Collection containing the Hi-C forward reads
7. **Hi-C reads - reverse**  [fastq] Collection containing the Hi-C reverse reads
8. **Do you want to trim the Hi-C data?** If *yes*, remove 5bp at the end of Hi-C reads. Use with Arima Hi-C data if the Hi-C map looks "noisy".
9.  **Telomere repeat to suit species** Expected value of the repeated sequences in the telomeres. Default value [CCCTAA] is suited to vertebrates.
10. **PacBio reads** [fastq] Collection of PacBio reads.


## Outputs

1. Concatenated Assembly [fasta]
2. Trimmed Hi-C data (If trimming option is selected) [fastq]
3. Mapped Hi-C reads [bam]
4. Telomeres track [bedgraph]
5. Gap track [bedgraph] 
6. Coverage track [bigwig]
7. Pretext Map without tracks [pretext]
8. Pretext Map with tracks [pretext]
9. Pretext Snapshot image of the Hi-C contact map [png]