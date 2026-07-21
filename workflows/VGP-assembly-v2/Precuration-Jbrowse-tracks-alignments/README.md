# JBrowse2 Precuration Tracks with Related Species Alignments

This workflow generates JBrowse2 instances with genome assembly tracks and alignments against related species, to assist the manual curation of genome assemblies. It complements the Hi-C contact map workflow by providing a complementary genome browser view of the same precuration tracks alongside synteny with related species.

The workflow takes the assembly haplotype(s) and the precuration tracks (telomeres, gaps, coverage, optional gene annotations), optionally aligns the assembly against a list of related species, and packages everything into a JBrowse2 instance that curators can open directly in their browser.

## Inputs

The workflow auto-detects its operating mode from the data you provide — there are no toggle parameters to set:

- Provide **Haplotype 2** to switch to dual-haplotype mode (includes hap1-vs-hap2 alignment)
- Provide **Genes** to add a gene annotation track
- Provide **Related Species** to add synteny alignments against external genomes

Each of the four combinations produces a different JBrowse2 instance (see Outputs).

### Required inputs

1. **Species Name** [text] - Species identifier used in the assembly info report
2. **Assembly Name** [text] - Assembly identifier (e.g., toLID)
3. **Haplotype 1** [fasta] - Primary haplotype assembly (recommended: with H1 suffix added to scaffold names)
4. **Telomere P** [BED] - P-arm telomere coordinates
5. **Telomere Q** [BED] - Q-arm telomere coordinates (can be empty)
6. **Gaps** [BED] - Assembly gap coordinates
7. **Coverage** [BigWig] - PacBio HiFi read coverage track

### Optional inputs

8. **Haplotype 2** [fasta] - Secondary haplotype assembly. Provide for diploid assemblies; leave empty for single-haplotype mode.
9. **Genes** [GFF3] - Gene annotation track. Provide to add a gene track to every JBrowse2 instance.
10. **Related Species** [collection of fasta.gz] - Simple list of gzipped FASTA files of related species genomes for synteny alignment. **Sequence names must be unique across the entire collection** - the workflow performs a duplicate-name check on the merged related-species fastas and will fail early if any sequence name appears in more than one file. A common pattern is to prefix each species' scaffolds with the species name (e.g. `Species_1_scaffold_1`). Leave empty to skip related-species alignment entirely.

## Outputs

The set of populated outputs depends on which optional inputs are provided. Outputs from inactive modes are present in the history but empty.

### Single-haplotype outputs (Haplotype 2 not provided)

1. **JBrowse2 Single Haplotype** [collection] - JBrowse2 instance for one haplotype with assembly tracks only (telomeres, gaps, coverage), no related-species alignments
2. **JBrowse2 Single Haplotype with Gene Track** [collection] - As above, with gene annotation tracks included (when Genes provided)
3. **JBrowse2 Single Haplotype with related species** [collection] - JBrowse2 instance for one haplotype with related-species alignments (when Related Species provided)
4. **JBrowse2 Single Haplotype with related species and Gene Tracks** [collection] - As above, with gene annotation tracks included

### Dual-haplotype outputs (Haplotype 2 provided)

5. **JBrowse2 Hap1 vs Hap2** [collection] - JBrowse2 instance with hap1-vs-hap2 alignment, no related-species alignments
6. **JBrowse2 Hap1 vs Hap2 with gene tracks** [collection] - As above, with gene annotation tracks included (when Genes provided)
7. **JBrowse2 Hap1 and hap2 with related species** [collection] - JBrowse2 instance with hap1, hap2, and related-species alignments (when Related Species provided)
8. **JBrowse2 Hap1 and hap2 with related species and gene tracks** [collection] - As above, with gene annotation tracks included

### Other outputs

9. **Assembly Info** - Summary of species and assembly name
10. **Fail if there are duplicated sequence names between the fasta files** [boolean] - Internal validation flag. The workflow fails fast if any sequence name appears in more than one of the related-species fastas.

## Usage Notes

### Pairing with the Hi-C contact map workflow

This workflow is designed to consume the precuration track outputs of the [Hi-C contact map for assembly manual curation](../hi-c-contact-map-for-assembly-manual-curation) workflow:

| Hi-C workflow output | Use here as input |
|---|---|
| `Decontaminated Hap1 with Suffix` | `Haplotype 1` |
| `Decontaminated Hap2 with Suffix` | `Haplotype 2` |
| `P telomeres bed` | `Telomere P` |
| `Q telomeres Bed` | `Telomere Q` |
| `Gaps Bed` | `Gaps` |
| `BigWig Coverage` | `Coverage` |
| `Compleasm Genes track` | `Genes` |

### Related species selection

Choose related species whose genomes are evolutionarily close to the assembly under curation, so synteny is informative for spotting misassemblies. Provide them as gzipped FASTA files in a simple list collection.

**Sequence names must be unique across the collection.** The workflow validates this and fails fast if duplicates are detected (e.g. two species both contain `>scaffold_1`). Prefix per-species scaffold names before uploading, for example:

```bash
zcat Species_1.fasta.gz | sed 's/^>/>Species_1_/' | gzip > Species_1_renamed.fasta.gz
```

### Scaffold name suffixes

If using two haplotypes, the recommended workflow is to apply per-haplotype suffixes (e.g. `H1`/`H2`) to scaffold names *before* running this workflow, so that scaffolds from each haplotype are unambiguously identified in the JBrowse view and in synteny tracks.

## Citation

If you use this workflow, please cite:
- JBrowse2 ([Diesh et al., 2023](https://doi.org/10.1186/s13059-023-02914-z))
- minimap2 (used for related-species alignment)
- Other tools as listed in the workflow
