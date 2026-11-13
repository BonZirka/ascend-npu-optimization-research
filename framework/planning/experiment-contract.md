# Experiment records, pipeline variants and environment continuation

**Status: proposed requirements and design outline, added from project-owner feedback on 2026-11-11. Not implemented.** Exact schemas, supported pass edits, adapters and reuse rules still require design and experiments. No new Ascend compiler entry point, checker or cost-model capability is established here.

This extends [[questions/H03 - What is new in our approach|the framework design]]. The framework should investigate **new optimization opportunities and better placement/ordering of existing passes together**. Its shared records must represent kernel permutations, pipeline alternatives, experiment evidence and LLM-produced reports, and allow unfinished work to continue in another compatible execution environment.

## Search space and baseline

Preserve a fixed baseline kernel/IR and its baseline pipeline. A candidate can change the kernel/IR, the permitted pass sequence/options, or both. Kernel configurations can also vary shape, type, layout, precision and supplied inputs. The candidate space is bounded by request scope, pass prerequisites, available checkpoints, validation coverage and resource limits. It is not an instruction to enumerate every combination.

Separate three experiments where feasible:

| Candidate | What it tests |
| --- | --- |
| Original IR, alternative pipeline | Whether placement, ordering, repetition or supported options expose an existing optimization. |
| Rewritten IR, baseline pipeline | Whether the supplied alternative reveals a useful transformation opportunity. |
| Rewritten IR, alternative pipeline | Whether the effects depend on each other. |

For example, facts about a value's range or precision after casts may become useful to a later simplification. Investigate when those facts and IR forms are available and where the consuming pass runs. Do not infer the cause merely from a better final result. An IR witness may motivate a new rule, analysis or pass without automatically implementing it.

Each side of a comparison has its own recorded recipe. For a pipeline-ordering study, the deliberate pass-sequence difference is part of the trial. Hold the compiler build, intended target, workload and selected checks/objective comparable, and inspect the complete continuation. Pass nesting, dependencies, invalidated analyses and checkpoint invariants must remain valid. Unsupported orders are explicit failures, not silent fallback pipelines.

The initial IR-only baseline remains the single-pipeline slice of this model. Automatic ordering search requires the concrete integration to expose a bounded allowed pass space; its availability remains open.

## Common record model

All attempted combinations need records, including invalid, non-improving, unsupported and inconclusive attempts. A successful finding references these records instead of replacing the experiment history with a standalone report.

| Record | Required associations |
| --- | --- |
| Experiment | Schema version, immutable baseline references, request/configuration, allowed candidate dimensions, limits and progress. |
| Kernel variant | Stable ID, artifact hash/path, parent variant or originating proposal, editing scope, assumptions and case applicability. |
| Pipeline variant | Stable ID, ordered/nested passes and options, compiler build/profile, entry/observation/stop checkpoints and required invariants. |
| Case/configuration | Stable ID, shapes, types, layouts, precision, inputs/reference material and assumptions. |
| Trial | Stable combination of kernel variant, pipeline variant, case and execution/checking/objective recipe, with a baseline reference. |
| Execution/operation | Trial reference, actual environment fingerprint, input/reuse key, dependencies, pending/running/completed/failed/interrupted state, external job IDs and budget/usage. |
| Result/evidence | Typed compilation/check outcomes, semantic coverage, diagnostics, metric samples/units/protocol, conditions and artifact references. |
| Agent record/report | Model-visible instructions/context references, exposed messages and tool interactions, proposal lineage and agent-produced reports linked to trial/variant/execution IDs. No access to private model reasoning is assumed. |
| Finding | References to qualifying trials, original evidence, reports and the exercised replay recipe. |

A proposed portable representation is versioned JSON manifests, JSONL event/operation records and referenced artifacts. Readable Markdown reports can be indexes over those records. Filenames below are illustrative, not a frozen schema:

```text
experiment/
  experiment.json
  kernels/
  pipelines/
  cases/
  trials.jsonl
  executions/
  events.jsonl
  evidence/
  agent/
  reports/
  findings/
```

Use stable IDs and hashes, bundle-relative artifact paths and explicit external resource references. A report must name the exact variant combination and evidence it describes. A trial must not silently change meaning when a mutable file, pass profile or report changes. If compiler, target, policy or other effective trial configuration changes, create a linked new trial/revision rather than relabeling existing evidence. An additional run in a compatible environment gets a fresh execution record.

Schema versioning, validation, artifact integrity and migration behavior are implementation work. The portable format should be independent of the local persistence backend. Multi-writer distributed scheduling is not implied by a portable record.

## Continue an unfinished experiment elsewhere

The concrete journey is [[usage-scenarios/US06 - Investigate on host and evaluate on NPU|US06: host investigation and later NPU evaluation]]. The host and NPU stages belong to one continued investigation of the saved snapshot; the metric can change between stages. Assessments under a changed objective follow the linked-trial rule above while preserving the earlier metric results.

Continuation restores pending investigation work. Finding replay repeats a saved comparison. Both use the same recorded recipes and artifact identities, but continuation also needs pending operations, search progress, agent context and spent/reserved budgets.

A host environment might perform IR review and cheap checks while a lab environment can complete NPU-dependent work. The following is a proposed interface, not an implemented command:

```sh
framework resume ./experiment --environment npu-lab.yaml
```

The environment profile binds declared capabilities to concrete tools, runtimes, datasets and hardware. Required identities and compatible versions remain recorded. Environment-specific paths and access credentials are bindings, not assumptions hidden in code or report text.

Continuation must:

1. Validate the schema, artifact hashes and required identities before scheduling work.
2. Resolve the current environment's capabilities and explicit external bindings. Leave unsupported work blocked with a reason rather than selecting a weaker checking policy.
3. Reconcile uncertain in-flight jobs using saved identifiers. Preserve spent/reserved budgets and existing findings.
4. Reuse completed work only when its code, pipeline, compiler, inputs, policy, evaluator and relevant environment conditions remain applicable. Record the reuse decision and source operation.
5. Resume the agent session where supported, or reconstruct its context from saved model-visible material, results and reports. Exact response replay is not required.
6. Continue compatible pending operations automatically and append new evidence with the actual environment fingerprint. Keep earlier measurements and reports intact.

Moving to different hardware or measurement conditions does not make old timing samples directly comparable. Run a fresh baseline/candidate pair under the new conditions. A changed compiler or target can require a new linked trial; it is not merely a changed path binding. Some compilation or structural results may remain reusable, but that must follow an explicit compatibility rule.

## Memory transformations and cross-pass definedness

Treat the adjacent-load example as a potential cross-pass semantics study, not an uncomplicated local peephole promise. A wider or moved access can change which bytes are accessed, alignment obligations, faults, side effects or definedness after lowering. The actual source dialect, memory space and target determine the relevant conditions. LLVM poison/undef terminology is a reference, not automatically Ascend semantics.

Record the assumptions for each transformation and the pipeline stages that consume or alter them. Validate the composed route under the selected semantics. Defer such cases when coverage is unavailable. A general UB planner is not committed as MVP scope.

## Implementation follow-ups

- [ ] Define versioned schemas and round-trip fixtures for variants, cases, trials, executions, evidence and agent reports. Cover failed and incomplete outcomes as well as findings.
- [ ] Add pipeline-variant identity and a bounded allowed-pass contract to the compiler/agent adapters. Preserve the baseline and report invalid sequences explicitly.
- [ ] Link every result and report to exact variant, trial, operation and environment identities. Add schema/integrity checks on import/export.
- [ ] Resolve environment capabilities and external bindings when resuming. Preserve budgets, pending work and model-visible context; record reuse/invalidation decisions.
- [ ] Exercise continuation from one declared environment to another with unfinished work. Verify compatible reuse and fresh measurements where conditions differ.
- [ ] Compare IR-only, pipeline-only and combined candidates where the concrete compiler route supports them. Keep assumptions and metric/semantic coverage explicit.

These are planning follow-ups. No Linear issue status is changed by this note. The current [implementation backlog](backlog.md) supplies storage, runner, recipe, resume and export tasks that this requirement refines.

## References

- [MLIR pass infrastructure](https://mlir.llvm.org/docs/PassManagement/): textual pipelines, operation nesting, analysis management and failure handling.
- [LLVM UB manual](https://llvm.org/docs/UndefinedBehavior.html): immediate/deferred UB and the effect of speculative execution.
- [LLVM load semantics](https://llvm.org/docs/LangRef.html#load-instruction): access and alignment obligations.
- [[papers/LPO]] and [[papers/PRAGMA]] motivate search/checking/feedback. The joint Ascend pipeline search and portable record requirements are this project's design, not paper results.
