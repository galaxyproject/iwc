## Creates a custom JBrowse2 interactive browser from VGP scale assemblies and data.

#### Inputs required:

- Two haplotype assembly fasta
- PacBio reads as fastqsanger

#### Output tracks:

A combined reference fasta from both haplotypes, allows 25 tracks to be viewed together.
### For each haplotype

#### Dimer density as bigwig 

 - AT
 - GC
 - GA
 - TC

#### Map 1 coverage and fold changeH2, H1 SV, solo coverage and fold

 - map1
 - fold
 - SV.vcf

#### Dimer density outlier bed tracks 

 - AT
 - GC
 - GA
 - TC

A separate browser window provides 4 tracks on a combined reference with suffixed (H1 or H2) contig names

#### Dimer density fold change h2/h1

 - H2vsH1ATfold
 - H2vsH1GCfold
 - H2vsH1GAfold
 - H2vsH1TCfold
