# BigWig Replicates Averaging Workflow

This workflow is very useful when you processed multiple samples in collections and you want to generate an average coverage per condition.

## Inputs dataset

- The workflow needs a single input which is a list of bigwigs (normalized). The identifiers of your bigwigs must be like:
  - whatever_sample1_identificationOfReplicate1
  - whatever_sample1_identificationOfReplicate2
  - ...
  - whatever_sample2_identificationOfReplicate1
  - whatever_sample2_identificationOfReplicate2
  - ...

## Inputs values

- bin_size: this is used when average of coverage is performed. Large values will allow to have smaller output files but with less resolution while small values will increase computation time and size of output files to produce more resolutive bigwigs. I suggest 5bp for RNA-seq and 50bp for other applications.

## Processing

- The workflow will split identifiers between everything which is before the last underscore which will be the *sample* and everything which is after the last underscore which will be the *replicate identifier*. And restructure the collection as list:list:
  - whatever_sample1:
    - identificationOfReplicate1
    - identificationOfReplicate2
    - ...
  - whatever_sample2:
    - identificationOfReplicate1
    - identificationOfReplicate2
    - ---
  - ...
- Then it will average bigwigs into each inner list

## Outputs

- The output is a collection of bigwig datasets like:
  - whatever_sample1
  - whatever_sample2
  - ...
