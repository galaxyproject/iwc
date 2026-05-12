# JBrowse2 Precuration Tracks with Related Species Alignments

This workflow generates JBrowse2 instances with genome assembly tracks and alignments against related species, to assist the manual curation of genome assemblies. It complements the Hi-C contact map workflow by providing a complementary genome browser view of the same precuration tracks alongside synteny with related species.

The workflow takes the assembly haplotype(s) and the precuration tracks (telomeres, gaps, coverage, optional gene annotations), aligns the assembly against a list of related species, and packages everything into a JBrowse2 instance that curators can open directly in their browser.

## Inputs

### Required Inputs

1. **Species Name** [text] - Species identifier used in the assembly info report
2. **Assembly Name** [text] - Assembly identifier (e.g., toLID)
3. **Haplotype 1** [fasta] - Primary haplotype assembly (recommended: with H1 suffix added to scaffold names)
4. **Will you use a second haplotype?** [boolean] - Set to true for diploid assemblies
5. **Haplotype 2** [fasta, optional] - Secondary haplotype assembly (required if using two haplotypes)
6. **Related Species** [collection of fasta.gz] - Simple list of gzipped FASTA files of related species genomes for synteny alignment. **Sequence names must be unique across the entire collection** - the workflow performs a duplicate-name check on the merged related-species fastas and will fail early if any sequence name appears in more than one file. A common pattern is to prefix each species' scaffolds with the species name (e.g. `Species_1_scaffold_1`).
7. **Telomere P** [BED] - P-arm telomere coordinates
8. **Telomere Q** [BED] - Q-arm telomere coordinates (can be empty)
9. **Gaps** [BED] - Assembly gap coordinates
10. **Coverage** [BigWig] - PacBio HiFi read coverage track

### Gene Annotation Options

11. **Do you want to provide gene annotation for your assembly?** [boolean] - Enable to include a gene annotation track in the JBrowse2 instance
12. **Genes** [GFF, optional] - Gene annotation track (required if gene annotations enabled)

## Outputs

1. **Assembly Info** - Summary of species and assembly name
2. **JBrowse2 Single Haplotype with related species** [collection] - JBrowse2 instance for a single haplotype with related species alignments (when only one haplotype is used)
3. **JBrowse2 Single Haplotype with related species and Gene Tracks** [collection] - As above, with gene annotation tracks included
4. **JBrowse2 Hap1 and hap2 with related species** [collection] - JBrowse2 instance for two haplotypes with related species alignments (when two haplotypes are used)
5. **JBrowse2 Hap1 and hap2 with related species and gene tracks** [collection] - As above, with gene annotation tracks included

### Additional outputs

These JBrowse2 instances are produced without the related-species alignment tracks and can be useful for curators who only need the assembly-internal view.

6. **JBrowse2 Single Haplotype** [collection] - JBrowse2 instance for a single haplotype with assembly tracks only (telomeres, gaps, coverage), no related-species alignments
7. **JBrowse2 Single Haplotype with Gene Track** [collection] - As above, with gene annotation tracks included
8. **JBrowse2 Hap1 vs Hap2** [collection] - JBrowse2 instance for two haplotypes with the hap1-vs-hap2 alignment, no related-species alignments
9. **JBrowse2 Hap1 vs Hap2 with gene tracks** [collection] - As above, with gene annotation tracks included

### Validation output

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
