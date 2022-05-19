# Vertebrate Genome Project in Galaxy

### The vertebrate Genome Project


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



#### Quality control and parameter estimation.


##### Inputs

- A collection of Hifi reads

> Note : Learn about collections with the [Using dataset collections](https://training.galaxyproject.org/training-material/topics/galaxy-interface/tutorials/collections/tutorial.html) tutorial.
##### Outputs

- A Meryl Database of kmer counts
-

#### Phased assembly with Pacbio long reads


##### Inputs

##### Outputs


#### Scaffolding with Bionano optical mapping


##### Inputs

##### Outputs


#### Scaffolding with HiC



##### Inputs

##### Outputs


#### Export Workflows
