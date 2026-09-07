# pyeuk-panel-inference

Reconstruct an amplicon **panel** from reads + a reference genome (coverage peaks), for when no panel is available. Output is a drop-in panel for the Standard workflow.

Every clustering result is reported as a **cluster sweep**: the range of group counts the data
support, whether that count is determined, and the reproducible *stable cores* — never one forced
number. Uses the `pyeuk` tool suite (Bioconda `pyeuk` 0.8.0).

Upstream: https://github.com/spond/pyeuk
