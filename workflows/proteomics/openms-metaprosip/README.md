# MetaProSIP: automated inference of elemental fluxes in microbial communities

## Inputs dataset

- mzML
- Fasta (aminoacid sequences)

## Inputs values

## Processing

- DecoyDatabase: Add decoy sequences to the Fasta database (for FDR calculation)
- FeatureFinderCentroided: identify eluting peptides that correspond to isotopologues with natural isotopic distributions 
- MSGFPlusAdapter: identify peptides through peptide fragment fingerprinting (database search)
- FeatureFinderMultiplex: detect elution profiles of unlabeled peptides
- PeptideIndexer: annotate protein association to identified peptides
- FalseDiscoveryRate: Calculate FDR
- IDMapper: map identified spectra to elution profiles
- MetaProSIP: calculate the protein-SIP features, to perform functional grouping, and for protein inference
