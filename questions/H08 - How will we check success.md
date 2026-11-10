# How will we check success?

[[Pitch Presentation]]

**Status: proposed evaluation plan.** The evaluation cases, usefulness criteria, resource limits, repeat count and reference workflow remain to be established.

**Useful, reproducible findings are the primary outcome.** Expert-effort savings and resource costs are additional outcomes. The milestones follow [[questions/H07 - How long will it take|H07]].

## 1. MVP acceptance — month 4

Demonstrate that the framework can:

- Complete an investigation under the configured checks, metric and budget.
- Produce a finding that an AscendNPU-IR engineer considers worth investigating.
- Replay the original/candidate comparison from its saved bundle.
- Resume interrupted work using persisted results.

A proposed initial target is **at least one useful, reproducible finding on a real case**.

## 2. Evaluate usefulness — month 5

Use a fixed collection of representative AscendNPU-IR cases, keeping evaluation cases separate from those used to tune the agent.

For each investigation, retain:

| Observation | Purpose |
| --- | --- |
| Engineer-reviewed useful findings | Establish practical value. |
| Rejected, duplicate and inconclusive results | Show the full search outcome. |
| Correctness evidence and metric changes | Establish what each finding supports. |
| Replay results | Check reproducibility. |
| Preparation and review effort, model usage and execution resources | Establish the cost of obtaining findings. |

Agree on what counts as a useful finding and the resource limits **before the main evaluation**. Report outcomes across all selected cases.

## 3. Evaluate the selected refinement — month 6

Compare the refinement against the unchanged MVP baseline on the same evaluation cases, controlling the model, checking policy, objective and relevant budgets. Repeat searches to assess variation.

A claim of **expert-time savings** additionally needs a comparable investigation workflow as a reference. The choice of that reference remains open.

This separates a working implementation, demonstrated usefulness and evidence of improvement over the baseline.

## TODO

## Related research questions

- [[questions/Q06 - Metrics for assessing LLVM IR and MLIR improvements|Q06 — Metrics for assessing LLVM IR and MLIR improvements]].
- [[questions/Q08 - Compilation continuation and validation routes|Q08 — Compilation continuation and validation routes]].
