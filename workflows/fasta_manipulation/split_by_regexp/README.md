Split a FASTA into a collection by using regular expressions and IDs given in a file.

Inputs: 

1. A regexp file containing IDs in column 1 and regular expressions in column 2
2. A FASTA file

Output:

A collection containing FASTA files. The collection elements will be named
by the IDs from the regexp file and contain all FASTA entries that match the
corresponding collection.
