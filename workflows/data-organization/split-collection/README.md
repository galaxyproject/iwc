# Split collection

These workflows allow to split a collection into 2 using identifiers.

The common input to all workflows is a collection of type 'list'.

The way to split the collection differs with the workflow.

- In the workflow "Split collection by pattern in identifiers", you need to specify a "pattern" (perl regular expression). This is a "word" that is present only in one part of your samples. This will split your collection into 2: one with the identifiers which have the 'pattern' (renamed '`<pattern>`') and the other one with the identifiers which don't have (renamed 'no `<pattern>`'). This workflow uses the grep tool and therefore special characters like '.', '+', '?'...  has a different meaning, see [here](https://en.wikipedia.org/wiki/Regular_expression).
- In the workflow "Split collection using tabular", you need to give a tabular where the first column is the identifier and the second column is the group (no header). All identifiers where the second column match the first item will be grouped into a collection renamed with the first item of the second column (`<group>`). Others will be in another collection renamed 'no `<group>`'.
- In the workflow "Split collection using comma separated list", you need to give the group of each item of your collection separated by comma. For example, if you have 3 items in your collection, you can put "treat,treat,untreat" to put the first 2 together in a collection named 'treat' and the third one appart in a collection named 'no treat'.

Warnings:
- If you specify more than 2 groups in the second and third workflow, it will not create 3 collections.
