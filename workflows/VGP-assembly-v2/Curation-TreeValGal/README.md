# TreeValGal workflow

Workflow to generate pre-curation files and Jbrowse2 instance.

## Inputs 

### Mandatory

- `Genome assembly to report on` Single halotypes or concatenated haplotypes (If concatenating the haplotypes, windowmasker could fail. In that case, try re-runing with the option `Run windowmasker model-free repeats?` set as `No`)
- `fastqsanger pacbio sequence reads for coverage bigwig track` Concatenated PacBio reads

### Optional

- `Window size for bed to bigwig` Set the window size to generate the histogram tracks (coverage, gaps...)
- `dfam taxon for repeatmasker` Default is vertebrates. A more accurate taxon means more accurate repeat recognition 
- `telomere repeat to suit species` Default : CCCTAA. Seems to work for the treeval test data or for vertebrates . 

#### Annotations

You have the option to provide fasta files for different features. they will be aligned against the assembly and shown in Jbrowse2. 

CDS:
- Set `Will you provide a CDS fasta for annotation?` as `yes` and provide a Fasta in `CDS fasta input`

Genes
- Set `Will you provide a genes fasta for annotation?` as `yes` and provide a Fasta in `genes fasta input`

RNA
- Set `Will you provide a rna fasta for annotation?` as `yes` and provide a Fasta in `rna fasta input`
  
Proteins
- Set `Will you provide a protein (AA) fasta for annotation?` as `yes` and provide a Fasta in `AA fasta input`


#### Sequence similarity Mapping

You have the option to provide fasta files for a reference or a closely related species (Can also be used to provide the other haplotype of your asembly). These files will be used to produce synteny dotplots and displayed in Jbrowse. 

Independent Reference Genome. The dotplot produced will be filtered with a higher sequence identity: 97%, 98%, and 99%. Suitable for same species genome. 
- Set `Will you supply an independent reference genome fasta for sequence similarity "self comparison" mapping? This generates paf tracks viewable as contig dotplots.` to `yes` and provide a fasta of the genome in `Independent haplotype or reference genome if available`

Closely related species. The dotplot produced will be filtered with a lower sequence identity: 85%, 93%, and 95%. Suitable for same species genome. 
- Set `Will you provide a collection of related species for sequence similarity mapping?` to `yes` and provide a **collection** of fasta of one or more related genomes in `Collection of related species`


## Outputs

- A Jbrowse2 instance (on for viewing, in `html` the other for export or download in `zip`)
- Files corresponding to the tracks in Jbrowse2


## Display tracks in Jbrowse2

- Add a track:  click on the menu icon (`1` in the Jbrowse2 screenshot below) and click on `Open Track Selector`. Select or deselect the desired tracks
- Add dotplote: clid `Add` on the top bar and select `Dotplot View`. Then chose the species to display and click `Launch` (several dotplots can be displayed that way). To display a different identity threshold between the to selected species. Click on the menu icon in the Dotplot Window (`2` in the Jbrowse2 screenshot below) and click on `Open Track Selector`. Select the desired Identity threshold.(Warning, selecting more than one track here will overlay the dotplots) 

![Screenshot of Jbrowse2 Instance](img/Jbrowse2.png)
