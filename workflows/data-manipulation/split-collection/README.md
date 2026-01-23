# Split collection

These workflows allow to split a collection into 2 using identifiers.

The common input to all workflows is a collection of type 'list'.

The way to split the collection differs with the workflow.

- In the workflow "Split collection by pattern in identifiers", you need to specify a "pattern". This is a word that is present only in one part of your samples. This will split your collection into 2: one with the identifiers which have the 'pattern' and the other one with the identifiers which don't have.
- In the workflow "Split collection using tabular", you need to give a tabular where the first column is the identifier and the second column is the group (no header). All identifiers where the second column match the first item will be grouped into a collection. Others will be in another collection.
- In the workflow "Split collection using comma separated list", you need to give the group of each item of your collection separated by comma. For example, if you have 3 items in your collection, you can put "1,1,2" to put the first 2 together and the third one appart.

Warnings:
- If you specify more than 2 groups in the second and third workflow, it will not create 3 collections.
