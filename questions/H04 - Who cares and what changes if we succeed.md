# Who cares and what changes if we succeed?

[[Pitch Presentation]]

**Status: initial draft for discussion.** The benefits below are intended outcomes. Stakeholder priorities and the conditions for adoption still need confirmation.

## Who benefits

The initial focus is **AscendNPU-IR and the workloads it compiles for Ascend NPUs**. The intended customer benefit is less waiting for useful kernel improvements, supported by a more consistent investigation process that consumes less scarce expert time.

| Stakeholder | Why this matters | What would change if we succeed |
| --- | --- | --- |
| **NPU customers — downstream beneficiaries** | Compiler and kernel improvements affect how efficiently their workloads use the hardware. | Useful improvements could reach their workloads more consistently as establishing optimization opportunities requires less expert effort. The benefit reaches customers through integrated improvements. |
| **AscendNPU-IR compiler engineers — direct users** | Establishing an opportunity involves constructing alternatives, checking them and assembling a reproducible comparison. | Engineers receive saved original/alternative code, check results and metric comparisons through a runnable experiment. Repeated experimental work is offloaded, leaving them to assess relevance and decide on compiler changes. |
| **The AscendNPU-IR team — organizational beneficiary** | Investigation competes for the same expert attention needed to implement and integrate improvements. | The team gains a bounded, repeatable way to investigate supplied cases or code collections, retaining findings and progress across runs. The intended gain is lower expert effort per useful finding. |

## How findings become customer benefits

The proposed path is:

```text
Framework produces a runnable finding
    → engineers assess its relevance and evidence
    → worthwhile compiler or kernel changes are implemented and validated
    → integrated changes improve relevant customer workloads
```

The framework directly supports discovery and experimental comparison. Engineering review, implementation, integration and delivery remain necessary. Customer impact depends on those steps and on whether affected code matters to their workloads.

A better static metric is evidence under that metric. A customer performance claim requires evidence for the resulting workload benefit; the appropriate measures remain part of [[questions/Q06 - Metrics for assessing LLVM IR and MLIR improvements|Q06]].

## What would make adoption worthwhile

The framework should produce findings that engineers can reproduce, understand and use in an optimization decision with less investigation effort. Any saving must account for preparing inputs, reviewing unsuccessful proposals and maintaining the integration, alongside model and execution costs.

The practical test is whether useful findings justify those costs and free expert attention for other work. How to measure that comparison belongs in [[questions/H08 - How will we check success|H08]].

## Open points for stakeholder discussion

- **Q: Which engineers and representative workloads should the first experiment serve?** This would ground the proposed benefits in actual optimization work.
- **Q: What evidence would make a finding worth investigating or implementing?** Relates to [[questions/Q02 - Selection and prioritization of optimization tasks|Q02]] and [[questions/Q04 - Tools and processes for investigating slow cases|Q04]].

## TODO
