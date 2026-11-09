# How is it done today?

[[Pitch Presentation]]

Working notes based on the project owner's observations. This is a partial account of the **AscendNPU-IR** team's workflow; the uncertainties below still need investigation.

## Current practices

- **Performance regression testing:** nightly testing aims to reduce the number of performance regressions that reach upstream. Reverting code changes is one response to detected regressions.
- **Performance issue tickets:** newly discovered performance issues in already merged code are assigned to developers for investigation.
- **Kernel-specific tasks:** some tasks ask engineers to make a particular kernel faster without prescribing an optimization. Investigation includes inspecting the generated code.
- **Optimization epics:** broader tasks target improvements to a class of optimizations. Comparisons with other accelerators are a likely source of these epics, although this has not been confirmed.

## Identifying slow cases

Comparing the same kernel across GPU/NPU platforms can reveal relatively slow cases and motivate optimization work. The working hypothesis is that comparisons against CUDA implementations motivate some kernel-specific tasks and optimization epics; their actual role in the team's workflow needs confirmation.

A performance gap provides a reason to investigate. It does not, by itself, establish a missed compiler optimization or show how much of the gap a compiler change could eliminate.

A possible implication for the proposal is recorded in [[research/Framework-generated comparison references|Framework-generated comparison references]]. This remains a hypothesis to investigate.

Nightly regression testing provides another signal: performance has deteriorated relative to an existing baseline. A stable baseline can still contain missed optimization opportunities.

## Investigating an optimization task

A perf-like profiling tool is available, but its name and capabilities need clarification.

The difficulties vary by task. Reported examples include insufficient runnable examples for profiling, complex IR that is hard to inspect, uncertainty about a suitable optimization, and validation tools that require substantial manual reasoning. Occasionally, identifying where in the compiler to implement a fix is also difficult.

These observations describe the working environment. They do not establish a commitment for this project to solve those difficulties.

## TODO

## Unanswered questions

- Related terminology research: [[questions/Q01 - Taxonomy of bug finding and performance search|Q01 — Taxonomy of bug finding and performance search]].
- **[[questions/Q02 - Selection and prioritization of optimization tasks|Q02: How are kernel-specific optimization tasks and optimization epics selected and prioritized?]]**
- **[[questions/Q03 - Existing proactive searches for missed optimizations|Q03: What proactive searches for missed optimizations already take place, and how are they organized?]]**
- **[[questions/Q04 - Tools and processes for investigating slow cases|Q04: What tools or processes already help engineers turn a slow case into a candidate compiler improvement?]]**
