# Vertebrate Genome Project in Galaxy

### The Vertebrate Genome Project (VGP)

This repository hosts the Galaxy workflows for the Vertebrate Genome Project's assembly pipeline. Each workflow's *.ga* file can be found in the folder with the corresponding name. For more information about the pipeline in general and the software/technologies used by the VGP for assembly, please see this [full-length GTN training tutorial](https://training.galaxyproject.org/training-material//topics/assembly/tutorials/vgp_genome_assembly/tutorial.html). For a shorter, workflow-focused tutorial, please see this [shortened GTN training tutorial](https://training.galaxyproject.org/training-material/topics/assembly/tutorials/vgp_workflow_training/tutorial.html). 

## Usage

Workflows currently available on the [Galaxy genome assembly](https://assembly.usegalaxy.eu/) instance.

### Import workflows to Galaxy

> Note : You need to be a registered user in a Galaxy instance to use workflows.


To import the VGP workflows into Galaxy, download the `.ga` files on your computer from this github repository.

1.  Go to the `Workflow` tab in Galaxy
![](img/galaxy_head.png)

2.  Select `Import` ![](img/import.png)
3.  Click on `Browse` and select the `.ga` file on your computer ![](img/import_screen.png)
4.  Click on `Import Workflow`

### Import data from the VGP repository

> Note : learn about data upload in Galaxy with the [Galaxy training network (GTN)](https://training.galaxyproject.org/training-material/topics/galaxy-interface/)

1.  On the left tool panel, click on `Upload Data`   ![](img/upload.png)
2.  Select `Choose remote files`   ![](img/choose_remote.png)
3.  Explore the *Genome Ark* repository for the data you want ![](img/genomeark_repo.png)
4.  Select the datasets to upload and click `Ok`
5.  Start the upload ![](img/start_upload.png)

### Run workflows

The VGP pipeline is composed of :
-   Five main workflows
    1. Quality control and parameter estimation. It provides a kmer coverage database and an estimation of parameters that will be useful in the genome assembly process.
    2. Phased assembly with Hifiasm
    3. Purging of duplications and overlap from the phased assembly
    4. Scafolding using Bionano optical mapping (optional)
    5. Scafolding using HiC data
-   Two secondary workflows to correct the assembly purging by using custom cutoffs
   - Custom Purging of duplications and overlap from the primary assembly
   - Custom Purging of duplications and overlap from the alternate assembly
-   Four export workflows to AWS VGP repository
   - Phased assembly export
   - Purged assembly export
   - Bionano scaffolding export
   - HiC Scafolding export

> Note: For more details about the workflows steps by steps, which parameters to use, and how to understand the results, read our
[VGP assembly pipeline tutorial](https://training.galaxyproject.org/training-material//topics/assembly/tutorials/vgp_genome_assembly/tutorial.html)


To run a workflow:
1.  Go to the `Workflow` tab in Galaxy
2.  Click on the arrow next to the desired workflow ![](img/run_workflow.png)
3. Fill the tool form with the desired parameters and Inputs ![](img/workflow_form.png)
4. Click on `Run Workflow`



#### VGP-Meryldb-creation (quality control and parameter estimation)


##### :dna: :arrow_right: :computer: Inputs

- HiFi reads (as a collection)

> Note : Learn about collections with the [Using dataset collections](https://training.galaxyproject.org/training-material/topics/galaxy-interface/tutorials/collections/tutorial.html) tutorial.

##### :computer: :arrow_right: :dna: Outputs

- Meryl database of kmer counts
- GenomeScope plots (linear, log, transformed linear, transformed log), summary, model parameters

#### VGP-Hifiasm (assembly using long reads)

##### :dna: :arrow_right: :computer: Inputs

- HiFi reads (as a collection)
- Meryl database (from **Meryl Database Creation** workflow)

##### :computer: :arrow_right: :dna: Outputs

- Primary assembly (as .gfa and as .fasta) [c1]
- Alternate assembly (as .gfa and as .fasta) [c2]
- HiFi reads with reads containing adapter sequence removed (as a collection) [trimmed]

Quality control (QC):
- BUSCO for primary assembly [c1]
- QUAST for primary and alternate assembly [c1, c2]
- Merqury files (as collections) for primary and alternate assembly [c]
    - plots (spectra-cn, spectra-asm, assembly01 spectra-cn, assembly02 spectra-cn)
    - stats (completeness)
    - QV stats

#### VGP-Purge-assembly (purge dups)

##### :dna: :arrow_right: :computer: Inputs

- Primary assembly [c1]
- Alternate assembly [c2]
- Genomescope model parameters (from **Meryl Database Creation** workflow) [genomescope_params]
- Estimated genome size (from **Hifiasm** workflow) [estimated_genome_size]
- *trimmed* HiFi reads (from **Hifiasm** workflow) (as a collection) [trimmed]

##### :computer: :arrow_right: :dna: Outputs

- Purged primary assembly [p1]
    - the sequences which were purged from the primary [seq_purged_p1]
- Purged alternate assembly [p2]
    - the sequences which were purged from the alternate [seq_purged_p2]
- Purge_dups intermediates (for primary and alternate)
    - coverage [depths]
    - PBCSTAT base coverage  [calcuts_basecov]
    - PBCSTAT base coverage (as .wig) [calcuts_basecov_wig]
    - histogram plot [calcuts_hist]
    - calcuts log [calcuts_log]
    - calcuts cutoff [calcuts_cutoffs]
    - purge_dups regions (as .bed) [purgeoverlap_bed]

QC:
- BUSCO for purged primary assembly [p1]
- QUAST for purged primary and purged alternate assembly [p1, p2]
- Merqury files (as collections) for purged primary and alternate assembly [p]
    - plots
    - completeness stats
    - QV stats

#### Scaffolding with Bionano optical maps

##### :dna: :arrow_right: :computer: Inputs

- Purged primary assembly [p1]
- Bionano optical map (.cmap file)
- Estimated genome size (from **Hifiasm** workflow) [estimated_genome_size]
- **(OPTIONAL)** Conflict resolution file
    - can be used if one has previously run bionano scaffolding to obtain a conflicts file

##### :computer: :arrow_right: :dna: Outputs

- Complete s1 assembly: bionano hybrid scaffolds + contigs that didn't get scaffolded [complete_s1]
- Bionano hybrid scaffolds [scaffolded_s1]
- Contigs that didn't get scaffolded [non_scaffolded_s1]
- Hybrid scaffold report [s1_report]
- Conflicts [s1_conflicts]
- AGP file [s1_agp]



#### Scaffolding with HiC



##### Inputs

##### Outputs


#### Export Workflows
