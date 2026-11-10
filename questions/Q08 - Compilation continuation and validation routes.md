# Q08 — Compilation continuation and validation routes

**Status: open; investigation pending. No concrete AscendNPU-IR checkpoint or validation route has been established.**

**Question:** Which combinations of compilation start/stop checkpoints, validation modes and metric observation stages can support the AscendNPU-IR experiment, and what compiler state, context, artifacts and execution resources do they require?

## Context and scope

[[questions/H03 - What is new in our approach|H03, section 2.4]] defines a proposed compilation-runner contract. We need to establish which concrete compiler and validation integrations can implement it. In particular, starting from an intermediate IR dump or stopping before a lowering stage must be investigated rather than assumed.

Q08 owns the feasibility and compatibility of the compilation/validation route. [[questions/Q06 - Metrics for assessing LLVM IR and MLIR improvements|Q06]] owns metric definitions, stage applicability and interpretation. Together they must establish which configurations can supply both the requested validation evidence and a meaningful comparison.

Correctness checking, improvement assessment and runtime timing have different purposes. Avoiding timing does not itself establish an NPU-free correctness-checking route.

## Distinguish the relevant checkpoints

| Term | Meaning for this investigation |
| --- | --- |
| Starting checkpoint | The state at which the original or candidate artifact enters compilation. Representation/dialect alone may not describe the full state required there. |
| Metric observation checkpoint | The point at which an evaluator consumes an artifact. There may be several requested observations. |
| Validation checkpoint/artifact | The representation and associated context consumed by the selected validation process. This may be later than a metric observation. |
| Explicit stopping boundary | A configured limit such as stopping before a particular lowering step. Required outputs must be obtainable without crossing this boundary. |

A metric observation is not automatically the final compilation stop. If a request requires stopping at intermediate IR while the chosen validation mode needs a runnable binary, the configuration is incompatible unless another supported validation route is selected explicitly. This is configuration logic, not a claim that any particular alternative route exists.

## 1. Entering and stopping the compiler

| Area | Questions to answer |
| --- | --- |
| Checkpoint inventory | Which intermediate states can be emitted, parsed and accepted as compilation inputs? Which dumps are only for inspection? What commands or integration entry points expose each capability? |
| State restoration | What metadata, symbol information, target configuration or in-memory compiler state is needed to resume? Does the saved artifact retain it? Which analyses must be recomputed after a rewrite? |
| Checkpoint identity | How do we identify the precise pipeline position and established invariants when several checkpoints use the same dialect or representation? How are compiler version and pipeline configuration recorded? |
| Continuation | Which pass sequences can resume from each supported checkpoint? Which initialization, canonicalization or prerequisite passes are required? Can the selected path differ by target or input features? |
| Stopping boundaries | Can compilation stop before or after a selected pass/lowering boundary? What usable artifact is produced there? How is the stop enforced and verified? |
| Multiple outputs | Can one continuation retain an intermediate artifact for a metric and a later artifact for validation? If separate continuations are required, how is their shared configuration kept consistent? |

## 2. Validation modes and requirements

The modes below are categories to investigate. Their availability and coverage for AscendNPU-IR remain unknown.

| Validation category | Questions to answer |
| --- | --- |
| Parsing, IR verification and compilation checks | Which stages and invariants can be checked? What does success establish, and which behavior claims remain unsupported? Does stopping early skip checks that would otherwise run later? |
| Equivalence/refinement or another semantic checker | Which representations, operations, types, control flow, memory/FP semantics and synchronization effects can it handle? What surrounding context and assumptions does it require? Can it consume our checkpoint directly, or does conversion introduce additional obligations? |
| Execution of compiled code | What runnable binary/device artifact, host code, loader, harness and runtime configuration are required? Which lowering/linking stages must complete? Which hardware must be available? |
| Other execution routes, if any | Is an interpreter, simulator or other usable execution route available for an intermediate representation? What operations and semantics does it cover, and what evidence would comparison through it support? |

For every investigated mode, also answer:

- Which original and candidate inputs/results are compared, and at what granularity: region, function, kernel or enclosing program?
- Where do test inputs, expected results and comparison rules come from? Which shapes, types, layouts, aliasing conditions, side effects or numerical tolerances are covered?
- How are additional assumptions proposed by the agent established or left unresolved? Does the validation evidence cover the original case or only a narrower condition?
- How are unsupported features, timeouts, missing resources, compilation failures and observed behavior mismatches distinguished?
- What does validation at an intermediate checkpoint establish about artifacts produced by the remaining pipeline, and which later stages are outside its coverage?

## 3. Joint compatibility with metric stages

| Compatibility issue | Questions to answer |
| --- | --- |
| Hard stop versus required output | Does the validation mode require compilation beyond the requested stopping boundary? Is the chosen metric artifact obtainable before that boundary? How is an incompatible combination reported? |
| Different observation stages | Can the metric inspect earlier IR while validation consumes a later executable? Which artifacts and invocation paths must be retained to connect both results to the same candidate? |
| Stage and feature coverage | Does each consumer accept the exact dialect, invariants, operation set and target context of its artifact? How is support checked again when a candidate introduces different features? |
| Comparable routes | Do original and candidate use corresponding checkpoints, pass settings and targets? What differences invalidate a paired comparison? |
| Meaning of the metric | Is the metric meaningful at the selected stage, beyond merely being computable? Which assumptions and intended claims must be checked through Q06? |
| Effect of continuation | Can subsequent optimization or lowering erase or reverse the apparent benefit? At which observation point is the comparison relevant to the intended finding? |

## 4. Context, boundaries and resources

| Area | Questions to answer |
| --- | --- |
| Enclosing context | What makes a supplied region usable at each checkpoint: definitions, symbols, dependencies, build context and runtime inputs? How is an edited region incorporated into the artifact that the compiler or checker consumes? |
| Target assumptions | Which architecture, data-layout, precision, shape/layout specializations and other settings must be supplied? Which were established before the starting checkpoint and must remain valid after editing? |
| Resource requirements | What compiler/checker resources and execution hardware does each route require? Which work is host-side, which needs NPU access, and which proposed alternatives remain unestablished? |
| Baseline reuse | Which original artifacts can be reused between candidates? What changes to code, dependencies, compiler build, pipeline, target, requested outputs or assumptions invalidate reuse? |
| Operational evidence | Which commands, settings, artifacts, diagnostics and environment details are needed to reproduce a route? How can successful support be distinguished from an untested capability declaration? |
| Cost and scheduling | What does each continuation/check cost? Which stages can be shared or screened cheaply before expensive checks, while still collecting the evidence required by the selected policy? |

## Expected research records

Produce:

1. **A checkpoint catalog:** input acceptance, resumption requirements, available output/stop points and evidence from compiler documentation, source inspection or reproducible probes.
2. **Validation-mode records:** accepted artifacts, semantic/feature coverage, required context, assumptions, resources and the evidence each mode produces.
3. **A joint compatibility matrix:** one row per investigated configuration, with the fields below.

| Matrix field | What to record |
| --- | --- |
| Input and continuation | Starting checkpoint, compiler build, pipeline and target settings. |
| Outputs and limits | Requested artifacts/checkpoints and explicit stopping boundaries. |
| Validation | Mode, consumed artifact/checkpoint, assumptions and required harness/resources. |
| Assessment | Metric, consumed artifact/checkpoint, operation/target coverage and interpretation; link its Q06 record. |
| Compatibility status | Demonstrated on recorded cases, incompatible with a stated reason, or not yet investigated. Record limitations of demonstrated coverage. |
| Evidence and cost | Reproduction commands, original/candidate artifacts, observed outcomes and resource requirements/costs. |

No matrix row is considered supported merely because its individual components exist. The combination must be investigated. Unknown combinations stay explicit; incompatible requests must not silently select a weaker check, pass a stopping boundary or move the metric to another stage.

The outcome should identify feasible initial configurations and their limits. The detailed validation/evaluator contracts and framework evaluation remain subjects for further discussion in H03 and [[questions/H08 - How will we check success|H08]].
