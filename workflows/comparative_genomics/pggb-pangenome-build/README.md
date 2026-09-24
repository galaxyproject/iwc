# PGGB pangenome build

Galaxy workflow that constructs a pangenome variation graph from per-strain
assembly FASTAs using the [PGGB](https://github.com/pangenome/pggb) pipeline
(wfmash → seqwish → smoothxg → gfaffix → odgi) and emits an interactive
MultiQC report summarising the result.

## Inputs

| Step | Param | Type | Default | Notes |
|------|-------|------|--------:|-------|
| 0 | Strain FASTAs | `list` collection | — | One FASTA per haplotype; element identifier becomes the PanSN `SAMPLE` prefix. Plain `.fa` or gzipped `.fa.gz`. |
| 1 | `n_haplotypes` | integer | 8 | Total haplotypes; for haploid panels = collection size. |
| 2 | `segment_length` | integer | 5000 | wfmash seed length. 5000 fits ~25 Mb apicomplexan-scale genomes; raise to 10000 for >100 Mb genomes. |
| 3 | `map_pct_id` | float | 90.0 | wfmash identity threshold. 90 for intra-species panels; drop to 70–80 for inter-species. |
| 4 | `min_match_len` | integer | 23 | seqwish `-k`. Lower = finer graph; higher = more local collapsing. |
| 5 | `vcf_spec` | text | `""` | Reference accession prefix for `vg deconstruct`. Blank skips VCF emission. |

## Steps

```
input: list collection of strain FASTAs
        │
        ▼
   PanSN rename (mapped over collection)
        │                     ─► per-strain renamed FASTA (SAMPLE#HAP#contig)
        ▼
   FASTA collection concat    ─► single PanSN-named multifasta
        │
        ▼
   PGGB                       ─► canonical PGGB pipeline (wfmash + seqwish
        │                        + smoothxg + gfaffix + odgi). MultiQC
        │                        report enabled by default.
        ▼
   odgi stats                 ─► tabular graph metrics on the final .og
```

## Outputs

- **smoothed GFA** — final canonical GFA1 (gzipped)
- **odgi .og** — succinct binary graph (input for downstream odgi queries)
- **layout (.og.lay)** — 2D graph layout
- **layout PNG** — 2D layout rendered
- **viz PNG** — 1D path-coloured visualisation
- **pggb log** — full run log with all parameter hashes
- **MultiQC report** — interactive HTML collating odgi stats + viz across
  both the seqwish-induced intermediate and final smoothed graphs
- **deconstruct VCF** (optional) — only when `vcf_spec` is set
- **graph stats** — tab-delimited length / nodes / edges / paths / steps

## Recommended use

The workflow targets the apicomplexan-scale haploid panel (5–15 strains,
~25 Mb each). For other scales:

- *Closely related strains, intra-species*: defaults (`-p 90 -s 5000 -k 23`)
  are right. Validated on *P. vivax* (8 strains) and tested on PGGB's
  DRB1-3123 fixture (12 HLA haplotypes).
- *Inter-species panel* (e.g., *P. vivax* / *P. cynomolgi* / *P. knowlesi*
  mix at ~10–15 % divergence): drop `map_pct_id` to 80, keep
  `segment_length` at 5000.
- *Larger genomes (>100 Mb)*: raise `segment_length` to 10000 to keep
  wfmash memory in check.

## Resource notes

PGGB is the dominant compute step. For 8 × ~25 Mb haploid genomes at
default parameters: ~30 min wall on a 32-core box; ~3 GB peak RAM. The
`poa_length_target` parameter (currently fixed at the wrapper default
700,1100) dominates: setting it to `4001,4507` (the older pggb 0.6 default
that the v3 *P. vivax* reference build used) makes the graph ~50 % more
collapsed but ~3× slower.

## Author

- Anton Nekrutenko ([@nekrut](https://github.com/nekrut),
  [ORCID 0000-0002-5987-8032](https://orcid.org/0000-0002-5987-8032))

## License

MIT

## Citations

- PGGB / smoothxg: Garrison et al., *Nat. Biotechnol.* 2024 ([doi:10.1038/s41587-023-01793-w](https://doi.org/10.1038/s41587-023-01793-w))
- wfmash: Guarracino et al., *Bioinformatics* 2024 ([doi:10.1093/bioinformatics/btae155](https://doi.org/10.1093/bioinformatics/btae155))
- seqwish: Garrison & Guarracino, *Bioinformatics* 2023 ([doi:10.1093/bioinformatics/btac743](https://doi.org/10.1093/bioinformatics/btac743))
- odgi: Guarracino et al., *Bioinformatics* 2022 ([doi:10.1093/bioinformatics/btac308](https://doi.org/10.1093/bioinformatics/btac308))
- gfaffix: Steiner et al., *Bioinformatics* 2023 ([doi:10.1093/bioinformatics/btac788](https://doi.org/10.1093/bioinformatics/btac788))
- PanSN-spec: <https://github.com/pangenome/PanSN-spec>
