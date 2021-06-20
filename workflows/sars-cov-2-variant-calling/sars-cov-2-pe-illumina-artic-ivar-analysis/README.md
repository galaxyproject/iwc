# COVID-19 sequence analysis on Illumina ARTIC PE data

This workflow implements an [iVar](https://github.com/andersen-lab/ivar) based analysis similar to
the one in [ncov2019-artic-nf](https://github.com/connor-lab/ncov2019-artic-nf), [covid-19-signal](https://github.com/jaleezyy/covid-19-signal/) and the Thiagen [Titan workflow](https://github.com/theiagen/public_health_viral_genomics). These workflows (written in  Nextflow, Snakemake and WDL) are widely in use in [COG UK](https://www.cogconsortium.uk/), [CanCOGeN](https://www.genomecanada.ca/en/cancogen) and some US state public health laboratories.

This workflow is also the subject of a Galaxy Training Network tutorial (currently a [Work in Progress](https://github.com/galaxyproject/training-material/pull/2633)).
It differs from [this workflow](https://github.com/galaxyproject/iwc/tree/main/workflows/sars-cov-2-variant-calling/sars-cov-2-pe-illumina-artic-variant-calling) in
that it does not use `lofreq` and is aimed at rapid analysis of majority variants and lineage/clade assignment with `pangolin` and `nextclade`.

TODO:

1. Add support for QC using negative and positive controls
2. Integrate with phylogeny tools including IQTree and UShER (and possibly more).
