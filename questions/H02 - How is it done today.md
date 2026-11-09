# How is it done today?

[[Pitch Presentation]]

## Draft pitch answer

### How performance work starts

Performance work in AscendNPU-IR includes nightly regression testing, investigation of reported performance issues, and targeted work on individual kernels or classes of optimizations. Nightly testing aims to keep regressions from reaching upstream. Comparisons with other accelerators are thought to motivate some optimization tasks; this remains unconfirmed.

### How opportunities are investigated

Investigations draw on generated code, profiling and validation tools. Depending on the task, engineers may need to prepare runnable examples, interpret complex IR, identify candidate transformations and reason about their correctness. The effort and available support vary by case.

### What remains to be established

Our description of the team's existing support for systematic discovery of missed optimizations remains incomplete. We also need to determine which parts of discovery and evaluation could usefully be offloaded to a framework. Any reduction in investigation effort remains to be tested.

## Supporting notes

Working notes based on the project owner's observations. This is a partial account of the **AscendNPU-IR** team's workflow; the uncertainties below still need investigation.

### Current practices

- **Performance regression testing:** nightly testing aims to reduce the number of performance regressions that reach upstream. Reverting code changes is one response to detected regressions.
- **Performance issue tickets:** newly discovered performance issues in already merged code are assigned to developers for investigation.
- **Kernel-specific tasks:** some tasks ask engineers to make a particular kernel faster without prescribing an optimization. Investigation includes inspecting the generated code.
- **Optimization epics:** broader tasks target improvements to a class of optimizations. Comparisons with other accelerators are a likely source of these epics, although this has not been confirmed.

**[[questions/Q02 - Selection and prioritization of optimization tasks|Q02: How are kernel-specific optimization tasks and optimization epics selected and prioritized?]]**

### Identifying slow cases

Comparing the same kernel across GPU/NPU platforms can reveal relatively slow cases and motivate optimization work. The working hypothesis is that comparisons against CUDA implementations motivate some kernel-specific tasks and optimization epics; their actual role in the team's workflow needs confirmation.

A performance gap provides a reason to investigate. It does not, by itself, establish a missed compiler optimization or show how much of the gap a compiler change could eliminate.

A possible implication for the proposal is recorded in [[research/Framework-generated comparison references|Framework-generated comparison references]]. This remains a hypothesis to investigate.

Nightly regression testing provides another signal: performance has deteriorated relative to an existing baseline. A stable baseline can still contain missed optimization opportunities.

**[[questions/Q03 - Existing proactive searches for missed optimizations|Q03: What proactive searches for missed optimizations already take place, and how are they organized?]]**

Related terminology research: [[questions/Q01 - Taxonomy of bug finding and performance search|Q01 — Taxonomy of bug finding and performance search]].

### Investigating an optimization task

A perf-like profiling tool is available, but its name and capabilities need clarification.

The difficulties vary by task. Reported examples include insufficient runnable examples for profiling, complex IR that is hard to inspect, uncertainty about a suitable optimization, and validation tools that require substantial manual reasoning. Occasionally, identifying where in the compiler to implement a fix is also difficult.

These observations describe the working environment. They do not establish a commitment for this project to solve those difficulties.

**[[questions/Q04 - Tools and processes for investigating slow cases|Q04: What tools or processes already help engineers turn a slow case into a candidate compiler improvement?]]**

## TODO
