# US01 — Investigate a particular kernel

**Status:** discussion draft; proposed behavior and unresolved choices.

**Template:** [[templates/Usage Scenario|Usage scenario template]].

**Shared design basis:** [[usage-scenarios/README#Scenario-specific starting information|Scenario-specific starting information]] and [[usage-scenarios/README#Manual workflow exploration before automation|manual workflow exploration before automation]].

## 1. Situation and intended outcome

An AscendNPU-IR engineer has a task to improve a particular kernel, or suspects an inefficient region in its generated IR. A performance concern supplies a reason to investigate; a useful alternative may still be unknown.

The engineer wants a reproducible comparison showing a candidate compiler opportunity and its applicable conditions. The framework's contribution is a bounded investigation that can proceed between engineer interventions.

## 2. Actors and trigger

**Primary actor:** compiler or performance engineer.

**Trigger:** a kernel-specific task, performance issue or manual inspection. An integration maintainer supplies reusable project profiles where available; the same person may initially perform both roles.

## 3. Starting material and preparation

### Starting points to explore

Examples discussed for US01:

1. The engineer supplies only the kernel and delegates opportunity selection and investigation.
2. The engineer supplies a region of interest, with further investigation delegated.
3. The engineer identifies a bottleneck without knowing the rewrite.
4. The engineer supplies a transformation hypothesis without a complete candidate.
5. The engineer supplies an existing rewrite to assess or refine.

This is a working, potentially incomplete set of US01 subcases. Their concrete interactions remain deferred to manual workflow exploration. Supplying a region or diagnosis can still lead to unattended investigation.

| Material | Preparation and responsibility |
| --- | --- |
| Kernel implementation or captured IR | The engineer identifies the subject. Whether the framework captures IR through an existing build workflow or requires prepared IR is open. |
| Editing scope and context | Whole input or a complete-operation range, with enclosing code and relevant assumptions. |
| Compilation, checking and metric profiles | Integration setup establishes a supported route. Each investigation selects profiles and supplies case-specific overrides. |
| Test/measurement material | Existing harness, inputs and references required by the selected route; missing material is exposed before dependent work. |
| Budget | Engineer selects candidate/time/resource limits, including device use where applicable. |

Distinguish reusable integration setup from preparation repeated for each kernel. An isolated fragment is not assumed to be independently runnable.

## 4. Main flow

1. The engineer identifies the kernel, desired investigation scope, objective and budget.
2. The framework resolves the supplied material and profiles, reports missing requirements and preserves the original artifact and configuration.
3. It prepares context for the selected scope. The engineer can nominate a region; requesting region discovery uses an explicitly selected capability.
4. The agent proposes scoped IR edits and, when authorized and supported, pipeline alternatives. The framework retains each submitted version.
5. Compilation, selected behavior checks and metric comparison produce independent evidence. Results guide further attempts within the budget.
6. Under the currently proposed baseline policy, a case stops at its first qualifying candidate or another stopping condition. The engineer receives the retained finding or an account of the outcome.

## 5. Alternative paths and outcomes

| Event | Proposed handling |
| --- | --- |
| Required material or route is missing | Explain the missing requirement before dependent search/checking proceeds. |
| Candidate fails compilation or behavior checks | Retain diagnostics and return applicable feedback for repair. |
| Checks pass but the criterion is not met | Continue within the budget; preserve the attempt. |
| A check is unsupported or a device is unavailable | Preserve an unresolved result and identify what is needed to continue. |
| Budget ends without a finding | Return progress and outcomes, with no claim that the kernel is optimal. |
| Work is interrupted | Recover compatible completed work and remaining progress from persistent state. |

## 6. Result and next action

A qualifying finding contains the original and candidate IR/pipeline versions, assumptions, checking evidence, metric comparison and a replay entry point. Static evidence supports a claim about the selected indicator; runtime gains require execution measurements.

The engineer reviews whether the candidate warrants compiler work and can replay its recorded comparison. Deferred NPU evaluation or investigation of the same snapshot under another metric follows US06. Diagnosing the responsible pass or implementing a fix can follow.

## 7. Architecture and interface implications

- The submission interface must make scope, required supporting material and reusable profiles understandable.
- Input snapshots, candidate edits and execution recipes need stable identities.
- Progress and missing requirements must remain visible while the investigation runs unattended.
- Pipeline-edit permission and actual integration support must be explicit.

Concrete commands, source-to-IR capture and user-interface form remain design choices.

## 8. Intended value and evaluation

**Intended value:** reduce repeated hands-on experimentation needed to obtain a useful candidate for a chosen kernel.

Evaluate useful findings and engineer preparation, intervention and review effort. Record model/host/NPU consumption and unsuccessful attempts alongside the result.

## 9. Open decisions

- **Deferred:** identify the relevant starting information and guidance for this scenario and manually explore its workflow before choosing interaction, interface/API and automation designs.
- Is the primary entry point an existing kernel build workflow or engineer-prepared IR?
- What work must the engineer repeat for every kernel, and what can profiles absorb?
- Which checkpoint, checks and metric support the first usable route?
- How does the engineer inspect progress or supply additional constraints during an investigation?

## 10. Connections

[[usage-scenarios/README|Scenario index]] · [[usage-scenarios/US06 - Investigate on host and evaluate on NPU|US06: later NPU evaluation]]

Basis: [[questions/H02 - How is it done today|H02]], [[questions/H03 - What is new in our approach|H03 §§2.1–2.6]], [[framework/planning/experiment-contract|Experiment contracts]].
