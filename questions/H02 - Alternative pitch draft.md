# H02 — How is it done today?

**Status: alternative draft for review; not selected.**

Original version: [[questions/H02 - How is it done today]].

## How performance work starts

Performance work in AscendNPU-IR includes nightly regression testing, investigation of reported performance issues, and targeted work on individual kernels or classes of optimizations. Nightly testing aims to keep regressions from reaching upstream. Comparisons with other accelerators are thought to motivate some optimization tasks; this remains unconfirmed.

## How opportunities are investigated

Investigations draw on generated code, profiling and validation tools. Depending on the task, engineers may need to prepare runnable examples, interpret complex IR, identify candidate transformations and reason about their correctness. The effort and available support vary by case.

## What remains to be established

Our description of the team's existing support for systematic discovery of missed optimizations remains incomplete. We also need to determine which parts of discovery and evaluation could usefully be offloaded to a framework. Any reduction in investigation effort remains to be tested.
