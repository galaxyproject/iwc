# Fetch Related Genomes

This workflow identifies and downloads genomes from species closely related to a reference assembly. It is intended as a preparation step for downstream curation workflows that need a panel of related-species genomes for synteny alignment (for example, the [JBrowse2 precuration tracks workflow](../Precuration-Jbrowse-tracks-alignments)).

Given a reference assembly, the workflow:

1. Searches RefSeq with [RefSeq Masher](https://github.com/phac-nml/refseq_masher) to find the most similar genomes.
2. Queries [NCBI Datasets](https://www.ncbi.nlm.nih.gov/datasets/) for assembly and BioSample metadata for each candidate.
3. Filters candidates by user-defined criteria (assembly level, assembly type, BioSample sex, sequencing technology, taxonomic class, chromosome count).
4. Downloads the genome fastas of the *n* closest matching related species.

## Inputs

### Required Inputs

1. **Assembly** [fasta] - Reference assembly used to search for related genomes (typically your in-progress VGP assembly).
2. **Search assemblies among the n closest related species \*** [integer] - How many of the closest RefSeq matches to consider before filtering.
3. **Download n related species** [integer] - Final number of related-species fastas to download. Note: a large number of species can cause downstream mashmap alignment to run out of memory.
4. **Download sequences?** [boolean] - When `true`, downloads the genome fastas of the selected related species (the `Related Species Genomes` output collection). When `false`, only the filtered reports are produced - useful for exploring filter combinations before committing to a download.

### Filter Parameters

5. **Minimum Level Assembly** [text] - Minimum NCBI assembly level to accept. One of `Complete Genome`, `Chromosome`, `Scaffold`, `Contig`. Default: `Complete Genome`.
6. **Assembly Type** [text] - Required assembly type (e.g. `haploid`, `diploid`). Leave empty to keep everything.
7. **Assembly BioSample Sex** [text] - Required BioSample sex value (e.g. `female`, `male`). Leave empty to keep everything.
8. **Assembly Sequencing Technology** [text] - Substring that must appear in the NCBI Datasets sequencing-technology field (e.g. `PacBio`). Leave empty to keep everything.
9. **Assembly Taxonomic Class** [text] - Comma-separated taxonomic classes to keep (e.g. `Mammalia,Aves`). Leave empty to keep everything.
10. **Minimum Number Of Chromosomes** [integer] - Minimum number of chromosomes. Set to `0` to disable.
11. **Maximum Number Of Chromosomes** [integer] - Maximum number of chromosomes. Set to `0` to disable.
12. **Keep empty values when filtering on number of chromosomes** [boolean] - If `true`, assemblies with missing chromosome counts are kept when chromosome filters are applied.

## Outputs

1. **All Refseq Matches** [tabular] - Full RefSeq Masher match table for the reference assembly.
2. **Filtered Refseq Matches** [tabular] - RefSeq matches kept after applying the closest-*n* selection.
3. **All Related Species Genome Report** [tabular] - NCBI Datasets genome report for all candidate matches.
4. **Filtered Related Species Genome Report** [tabular] - Genome report after applying the assembly-quality filters.
5. **Filtered Genome Data** [tabular] - Filter-passing rows of the genome data report joined back with the RefSeq Masher columns (one row per kept species).
6. **Result Species** [tabular] - Final list of selected species (the top `Download n related species` rows that survived all filters).
7. **Related Species Sequence Reports** [tabular] - NCBI Datasets sequence-level reports for the kept genomes.
8. **Related Species Genomes** [collection of fasta] - Downloaded genome fastas of the closest related species, ready to feed into a synteny workflow. Only produced when `Download sequences?` is `true`.

### Validation output

9. **This step fails if no related species is found that matches the filters** [text] - Internal sentinel. The workflow fails fast at this step if every candidate is filtered out, so you get a clear error instead of empty downstream outputs.

## Pairing with downstream workflows

The **Related Species Genomes** output collection is designed to be used directly as the `Related Species` collection input of the [JBrowse2 precuration tracks workflow](../Precuration-Jbrowse-tracks-alignments). If sequence names collide across species, prefix scaffold names per species before downstream use:

```bash
zcat Species_1.fasta.gz | sed 's/^>/>Species_1_/' | gzip > Species_1_renamed.fasta.gz
```

## Citation

If you use this workflow, please cite the underlying tools:

- RefSeq Masher
- NCBI Datasets
- Other tools as listed in the workflow
