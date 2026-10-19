# Standalone parameter exposure follow-up

This branch carries the changes used by the Foundry MAGs parent into the standalone workflow.

- Expose Binette minimum completeness and contamination weight.
- Expose the supported SemiBin single-mode environment parameter.
- Publish coverage depth matrices as a testable output.
- Derive CONCOCT read length from both mates using a read-count-weighted mean.
- Enable all five binners by default; each has an independent run toggle.
- Enclose the tools in a native frame with a Markdown explanation.
- Preserve the existing refiner selector.
- Parent refiner reconciliation remains outside this standalone workflow.

Status: development branch; runtime validation and submission metadata updates pending.
