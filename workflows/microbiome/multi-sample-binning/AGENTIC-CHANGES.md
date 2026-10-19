# Standalone parameter exposure follow-up

This branch carries the changes used by the Foundry MAGs parent into the standalone workflow.

- Expose Binette minimum completeness and contamination weight.
- Do not invent an environment parameter for SemiBin co mode: the wrapper does not expose one.
- Publish coverage depth matrices as a testable output.
- Preserve the existing refiner selector and original standalone topology.
- Parent refiner reconciliation remains outside this standalone workflow.

Status: development branch; runtime validation and submission metadata updates pending.
