# Split collection

These workflows allow to split a collection into 2 using identifiers.

The common input to all workflows is a collection of type 'list'.

The way to split the collection differs with the workflow.

- In the workflow "Split collection by pattern in element identifiers", you need to specify a "pattern" (perl regular expression). This will split your collection into 2: one with the identifiers which match the 'pattern' (renamed '`<pattern>`') and the other one with the identifiers which don't match (renamed 'not `<pattern>`'). The search is case-insensitive and the pattern can match anywhere in the identifier: 'S1' selects 'S1_rep1', but also 's1_rep2' and 'S10_rep1'. Use '^S1_' to select only the identifiers which start with 'S1_' (or 's1_'). This workflow uses the grep tool and therefore special characters like '.', '+', '?'... have a different meaning, see [here](https://en.wikipedia.org/wiki/Regular_expression).
- In the workflow "Split collection using tabular", you need to give a tabular where the first column is the identifier and the second column is the group (no header). All identifiers where the second column match the first item will be grouped into a collection renamed with the first item of the second column (`<group>`). Others will be in another collection renamed 'not `<group>`'.
- In the workflow "Split collection using comma separated list", you need to give the group of each item of your collection separated by comma. For example, if you have 3 items in your collection, you can put "treat,treat,untreat" to put the first 2 together in a collection named 'treat' and the third one apart in a collection named 'not treat'. Give exactly one group per item, in the order of the collection. Spaces around the commas are ignored.

Warnings:
- If you specify more than 2 groups in the second and third workflow, it will not create 3 collections.
