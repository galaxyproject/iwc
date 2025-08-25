# Assembly of Mitochondrial DNA from PacBio HiFi reads

Generate mitochondrial assembly based on PacBio HiFi reads. Part of the VGP suite, it can be run at any time independently of the other workflows. This workflow uses MitoHiFi and a mitochondrial reference to assemble the mitochondrial genome from PacBio reads. You do not need to provide the reference yourself, only the Latin name of the species.


## Inputs

1. Name of the Species
2. Name of the Assembly
3. Hifi long reads [fastq]
4. Email adress required for NCBI database query 
5. Organism genetic code following NCBI table (for mitogenome annotation)

## Outputs

1. Contigs Statistics
2. Images : 
   1. Mitogenome Coverage
   2. Mitogenome Annotation
3. Genbank file of the assembled mitogenome
4. Fasta file of the assembled mitogenome