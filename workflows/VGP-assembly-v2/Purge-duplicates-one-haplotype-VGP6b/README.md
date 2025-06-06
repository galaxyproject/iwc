# Purge Duplicate Contigs

Purge contigs marked as duplicates by purge_dups in a single haplotype (could be haplotypic duplication or overlap duplication). If you think the purged contigs might belong to the other haplotype, use the workflow VGP6 instead. 
This workflow is the 6th workflow of the VGP pipeline. It is meant to be run after one of the contigging steps (Workflow 3, 4, or 5).

## Inputs

1. Genomescope model parameters [txt] (Generated by the k-mer profiling workflow)
2. Hifi long reads - trimmed [fastq] (Generated by Cutadapt in the contigging workflow)
3. Assembly to purge (e.g. hap1) [fasta] (Generated by the contigging workflow)
4. K-mer database [meryldb]  (Generated by the k-mer profiling workflow)
5. Assembly to leave alone (used for merqury statistics) (e.g. hap2) [fasta] (Generated by the contigging workflow)
6. Estimated Genome Size [txt]
7. Database for busco lineage (recommended: latest)
8. Busco lineage (recommended: vertebrata)
9. Name of un-altered assembly
10. Name of purged assembly


## Outputs

1. Purged assembly (Fasta and gfa)
2. QC: BUSCO report for the purged assembly
3. QC: Compleasm report for the purged assembly
4. QC: Merqury report for both assemblies
5. QC: Assembly statistics for both assemblies
6. QC: Nx plot for both assemblies
7. QC: Size plot for both assemblies
