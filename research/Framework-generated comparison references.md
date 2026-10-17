# Framework-generated comparison references

**Status: hypothesis from discussion; not validated.**

Context: [[questions/H02 - How is it done today|H02 — How is it done today?]]

If kernel-specific tasks and optimization epics are often prompted by comparisons with other accelerators, the framework could offer another way to identify opportunities: generate an alternative for the same workload and compare it with the existing code on the same Ascend NPU target.

The reference would be generated automatically by the framework. A candidate that passes the agreed correctness checks and improves the selected metric could provide evidence of an optimization opportunity without requiring an implementation for another accelerator as the reference.

This may be an advantage of the approach. It depends on both the actual role of cross-platform comparisons in the current workflow and the framework's ability to generate useful alternatives. It is not yet an established benefit or a claim of novelty.
