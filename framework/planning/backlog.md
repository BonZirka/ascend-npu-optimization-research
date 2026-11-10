# Implementation backlog

Snapshot of the implementation plan in `backlog.json`. All tasks are planned; no implementation or experiment is marked complete.

Linear publication awaits the new workspace and authenticated access. Milestones are relative to a project start that has not been assigned.

## 01 Feasibility — Month 1

Establish a supported original/candidate comparison route and test direct agent rewriting on supplied AscendNPU-IR cases. Concrete checkpoints, metric, validation policy and hardware requirements remain to be selected from evidence.

### F01 — Collect representative AscendNPU-IR cases and required execution assets

**Type:** discovery. **Dependencies:** None.

Identify existing engineer-supplied kernels or IR fragments usable for feasibility experiments. Preserve provenance and restrictions; test-case generation is outside this task.

Completion criteria:

- Document available code, enclosing context, inputs, reference results and harnesses.
- Record missing assets, target configuration and hardware access.
- Identify development cases; keep later evaluation cases distinct.

Sources: questions/H03 - What is new in our approach.md §2.1–2.2; questions/H08 - How will we check success.md.

### F02 — Investigate AscendNPU-IR compilation checkpoints and continuation

**Type:** discovery. **Dependencies:** F01.

Establish which saved artifacts can actually re-enter compilation and what state and context are required. Inspect the compiler and perform reproducible probes.

Completion criteria:

- Record supported and unsupported entry/stop points with evidence.
- Distinguish metric observation points from hard stopping boundaries.
- Document required metadata, compiler version, target, harness and execution resources.

Sources: questions/Q08 - Compilation continuation and validation routes.md.

### F03 — Select one compatible metric and checking route for the MVP

**Type:** discovery. **Dependencies:** F02.

Investigate candidate metrics and correctness checks jointly with compilation feasibility. This task produces a documented selection; it does not assume LLVM tools apply to AscendNPU-IR.

Completion criteria:

- Compare applicability, coverage, cost and supported claims of candidate metrics/checks.
- Select one demonstrated start/outputs/check/metric configuration with its assumptions.
- Record unsupported combinations and the hardware requirements; keep correctness and improvement evidence separate.

Sources: questions/Q06 - Metrics for assessing LLVM IR and MLIR improvements.md; questions/Q08 - Compilation continuation and validation routes.md.

### F04 — Demonstrate a reproducible original/candidate comparison

**Type:** verification. **Dependencies:** F03.

Exercise the selected compiler, checking policy and metric on a supplied original and alternative before building full orchestration. Preserve commands and artifacts for the later shared execution recipe.

Completion criteria:

- Compile both versions under the same resolved settings.
- Record independent check outcomes, metric values and applicability limits.
- Retain a reproducible comparison and diagnose failures explicitly.

Sources: questions/H03 - What is new in our approach.md §2.4.

### F05 — Probe direct agent rewriting on real AscendNPU-IR examples

**Type:** experiment. **Dependencies:** F04.

Try the minimal baseline: supplied IR/context, ordinary file reading/editing and independent comparison. Use results to assess useful-finding feasibility and bound MVP scope.

Completion criteria:

- Record the agent backend/profile and all submitted versions, including unsuccessful attempts.
- Evaluate proposals through the F04 route and obtain engineer feedback on usefulness.
- Document outcomes and a scope recommendation; no useful finding is assumed in advance.

Sources: questions/H03 - What is new in our approach.md §2.2–2.3; questions/Q09 - Agent prompt construction and information delivery.md; questions/Q10 - Agent tools and editing constraints.md.

## 02 Baseline implementation — Months 2–3

Implement the narrow end-to-end baseline in Python 3.15+, including durable state, runner contracts, agent file editing, configured comparison and feedback.

### F06 — Configure Python 3.15 development tooling and package setup

**Type:** implementation. **Dependencies:** None.

Complete the development environment inside framework/ using the current Python 3.15 series. The initial directory and metadata are only scaffolding.

Completion criteria:

- Provide reproducible environment/package setup using the pinned interpreter.
- Choose and document dependency management, formatting, type checks and meaningful test commands.
- Keep virtual environments, caches, secrets and generated run artifacts out of Git.

Sources: questions/H03 - What is new in our approach.md §2.

### F07 — Implement request, profile and outcome data contracts

**Type:** implementation. **Dependencies:** F03, F06.

Translate the agreed H03 contracts into versioned Python data models and serialization. Implement the selected MVP subset explicitly.

Completion criteria:

- Resolve defaults → request → per-input settings while preserving shared limits.
- Represent compilation, checking, metric, target, agent and budget configuration.
- Reject missing/unsupported configurations and preserve independent outcome/coverage records.

Sources: questions/H03 - What is new in our approach.md §2.1, §2.4.

### F08 — Implement immutable input snapshots and editing-scope enforcement

**Type:** implementation. **Dependencies:** F07.

Prepare an investigation case and an agent working copy tied to immutable original artifacts. Supporting context remains distinct from editable code.

Completion criteria:

- Persist original artifacts, supplied context and selection provenance.
- Support the selected whole-input or specified-range MVP mode with explicit boundaries.
- Detect edits outside the allowed scope and produce candidate snapshots plus framework-generated diffs.

Sources: questions/H03 - What is new in our approach.md §2.1–2.3.

### F09 — Implement durable investigation, artifact and operation storage

**Type:** implementation. **Dependencies:** F07.

Persist the complete investigation chain rather than relying on temporary directories or a live agent session. Choose concrete storage during implementation.

Completion criteria:

- Assign stable investigation/case/candidate/operation identifiers and retain artifact references.
- Record operation intent, state, effective configuration, evidence and budget consumption/reservations.
- Publish artifacts durably before completion checkpoints; retain transcripts and visible tool records.

Sources: questions/H03 - What is new in our approach.md §2.5.

### F10 — Implement the selected compilation runner

**Type:** implementation. **Dependencies:** F04, F07, F09.

Compile one original or candidate version per invocation using the route established during feasibility.

Completion criteria:

- Accept snapshot, enclosing context, checkpoint, pipeline, target and limits.
- Return artifact manifests, actual invocation, diagnostics and available resource use.
- Distinguish baseline failure, candidate compiler rejection, timeout, unsupported request and infrastructure failure.

Sources: questions/H03 - What is new in our approach.md §2.4.

### F11 — Implement the selected validation adapter

**Type:** implementation. **Dependencies:** F03, F10.

Execute the MVP checking policy and record exactly the behavior or invariants covered. Additional semantic checkers remain optional research unless selected through F03.

Completion criteria:

- Handle references, test material, tolerances, assumptions and environment requirements.
- Represent passed/failed/inconclusive/unsupported/error/not-performed outcomes independently.
- Preserve observed differences, coverage and diagnostics; compilation-only evidence receives its own label.

Sources: questions/H03 - What is new in our approach.md §2.4; questions/Q08 - Compilation continuation and validation routes.md.

### F12 — Implement the selected metric evaluator and comparison criterion

**Type:** implementation. **Dependencies:** F03, F10.

Assess corresponding original/candidate artifacts through the metric chosen in F03. Preserve its stage, coverage and interpretation.

Completion criteria:

- Record evaluator version, units, raw values, conditions and any measurement protocol.
- Apply configured improvement direction and threshold.
- Report unsupported coverage or inconclusive assessment explicitly; static scores retain their limited interpretation.

Sources: questions/H03 - What is new in our approach.md §2.4; questions/Q06 - Metrics for assessing LLVM IR and MLIR improvements.md.

### F13 — Implement the shared comparison recipe for evaluation and replay

**Type:** implementation. **Dependencies:** F09, F11, F12.

Coordinate the compiler, validator and evaluator through one versioned execution recipe used both initially and when replaying a finding.

Completion criteria:

- Check route compatibility and enforce observation/stopping settings without silent substitutions.
- Retain independent validation and metric outcomes with the selected finding-eligibility rules.
- Reuse applicable original results under explicit compatibility rules and checkpoint each completed operation.

Sources: questions/H03 - What is new in our approach.md §2.4, §2.6.

### F14 — Implement the agent session and working-copy adapter

**Type:** implementation. **Dependencies:** F05, F08, F09.

Integrate the backend selected through the feasibility experiment. Provide code/context and ordinary file editing without requiring a multi-agent architecture.

Completion criteria:

- Version prompts and record effective model/backend settings.
- Persist framework-visible conversation, tool results, candidate versions and optional agent notes.
- Enforce edit scope, preserve complete artifacts for checking and report context limitations.

Sources: questions/H03 - What is new in our approach.md §2.2–2.3.

### F15 — Implement feedback, budget enforcement and default stopping

**Type:** implementation. **Dependencies:** F13, F14.

Connect agent proposals to comparison evidence and continue the same conversation for repairs or new attempts within the configured budget.

Completion criteria:

- Return structured feedback distinguishing code problems, coverage limits and infrastructure failures.
- Compare each candidate to the unchanged original; stop at the first qualifying finding, exhausted limits or inability to proceed.
- Preserve each attempt, best eligible result and used/reserved budget; do not reset limits on restart.

Sources: questions/H03 - What is new in our approach.md §2.5.

### F16 — Expose the baseline investigation through a CLI

**Type:** implementation. **Dependencies:** F15.

Provide the selected engineer-supplied-input workflow from framework/. Concrete command syntax can be finalized during implementation.

Completion criteria:

- Accept request/profile paths and explicit supporting material.
- Report missing requirements, progress, result locations and operation failures.
- Document an executable example using the chosen route and configuration.

Sources: questions/H03 - What is new in our approach.md §2.1–2.5.

## 03 MVP — Month 4

Complete runnable finding bundles, replay, recovery and engineer pilot acceptance. Proposed initial target: at least one useful reproducible finding on a real case under declared checks.

### F17 — Export runnable finding bundles and a replay command

**Type:** implementation. **Dependencies:** F13, F15.

Package successful comparisons as independent runnable experiments using the shared recipe rather than requiring agent rediscovery.

Completion criteria:

- Export original/candidate code, diff, recipe, checks, metric evidence, environment bindings and a concise report.
- Use bundle-local references and publish complete exports with stable finding IDs.
- Replay through the same execution path and store fresh results without overwriting original evidence.

Sources: questions/H03 - What is new in our approach.md §2.6.

### F18 — Implement investigation resume and interrupted-operation reconciliation

**Type:** implementation. **Dependencies:** F09, F15.

Recover durable progress, working copies and agent context after internal failures. Handle uncertain external work explicitly.

Completion criteria:

- Reuse completed applicable operations and reconcile recorded job IDs or artifacts.
- Restore a session where supported or reconstruct context from persisted records.
- Preserve findings and budgets; distinguish candidate repair from infrastructure retry and account for uncertain work.

Sources: questions/H03 - What is new in our approach.md §2.5.

### F19 — Verify finding replay after relocation

**Type:** verification. **Dependencies:** F17.

Exercise exported findings independently of the generating worker, temporary directory and live agent session.

Completion criteria:

- Replay from a relocated bundle using declared external bindings.
- Report missing dependencies/hardware and retain divergent or failed replay outcomes.
- Verify interrupted export recovery and fresh requested validation/metric results.

Sources: questions/H03 - What is new in our approach.md §2.6; questions/H08 - How will we check success.md.

### F20 — Verify end-to-end failure handling, recovery and evidence boundaries

**Type:** verification. **Dependencies:** F16, F18, F19.

Add integration checks for the meaningful failure cases in the selected route and orchestration, using recorded or deterministic fixtures where appropriate.

Completion criteria:

- Cover baseline/candidate compilation failure, unsupported/inconclusive checks, mismatches and non-improvement.
- Interrupt at durable boundaries and verify reuse, restored context and preserved budget.
- Verify out-of-scope edits and incompatible routes cannot become ready findings.

Sources: questions/H03 - What is new in our approach.md §2.4–2.6.

### F21 — Run the MVP engineer pilot and review a reproducible finding

**Type:** pilot. **Dependencies:** F05, F20.

Exercise the supported workflow on real AscendNPU-IR cases with an engineer. Useful findings are the primary outcome.

Completion criteria:

- Demonstrate a complete budgeted investigation, replay and resume.
- Seek at least one finding an engineer considers worth investigating; record rejected/inconclusive outcomes as well.
- Document the acceptance decision and remaining limitations without equating selected checks with a general proof.

Sources: questions/H07 - How long will it take.md; questions/H08 - How will we check success.md.

## 04 Evaluation — Month 5

Fix evaluation cases, review criteria and budgets before the main evaluation; report useful, rejected, duplicate and inconclusive outcomes with expert effort and resource costs.

### F22 — Finalize the evaluation corpus, review criteria and resource budgets

**Type:** evaluation. **Dependencies:** F21.

Resolve the open H08 choices before the main evaluation. Coordinate with relevant engineers and preserve separation from development/tuning cases.

Completion criteria:

- Freeze evaluation cases, usefulness-review criteria, relevant limits and repeat protocol.
- Define handling of duplicate, rejected, unsupported and inconclusive results.
- Choose a comparable reference workflow if making expert-time-saving claims; otherwise retain that claim as unestablished.

Sources: questions/H08 - How will we check success.md.

### F23 — Run and preserve the MVP baseline evaluation

**Type:** evaluation. **Dependencies:** F22.

Evaluate the fixed case collection under the F22 protocol, preserving all outcomes rather than only findings.

Completion criteria:

- Record engineer-reviewed findings, correctness evidence, metric comparisons and replay outcomes.
- Retain preparation/review effort, model use and host/device resource use.
- Archive model/profile/compiler/evaluator versions and repeated-run results.

Sources: questions/H08 - How will we check success.md.

### F24 — Report baseline finding usefulness, limitations and resource costs

**Type:** evaluation. **Dependencies:** F23.

Summarize the complete evaluation to support the decision about continued development.

Completion criteria:

- Report useful output and rejected/duplicate/inconclusive outcomes across all selected cases.
- Separate supported metric gains, engineer-assessed usefulness and demonstrated workload benefits.
- Report expert effort and resource costs; any savings claim identifies its reference and evidence.

Sources: questions/H08 - How will we check success.md; questions/H06 - How much will it cost.md.

## 05 Selected refinement — Month 6

Select one refinement from evaluation results and available capacity, then implement and compare it with the MVP baseline. No classifier, tool, prompt or search-policy extension is preselected.

### F25 — Select one evidence-led refinement and bound its scope

**Type:** decision. **Dependencies:** F24.

Use evaluation results and remaining capacity to choose one follow-on investigation. Candidate directions are not automatically selected by this backlog.

Completion criteria:

- Record the observed limitation, proposed change and expected benefit.
- Select one bounded area such as context, agent tools, discovery or feedback/search policy.
- State required evidence and a comparison protocol against the unchanged MVP.

Sources: questions/H03 - What is new in our approach.md §5; questions/H07 - How long will it take.md.

### F26 — Implement the selected refinement

**Type:** implementation. **Dependencies:** F25.

Implement only the refinement chosen in F25 while preserving the baseline for comparison.

Completion criteria:

- Keep the changed feature identifiable and retain baseline configuration/artifacts.
- Integrate with existing evidence, persistence and replay contracts.
- Document any changed coverage, assumptions and added resource requirements.

Sources: questions/H07 - How long will it take.md.

### F27 — Compare the refinement with the MVP and recommend next steps

**Type:** evaluation. **Dependencies:** F23, F26.

Run the agreed controlled comparison and report both gains and limitations.

Completion criteria:

- Use the same evaluation cases with comparable model, checking, objective and resource settings except the studied change.
- Repeat searches according to the agreed protocol and preserve all outcomes.
- Report usefulness, coverage, cost and effort differences, then recommend whether and how to continue.

Sources: questions/H08 - How will we check success.md.
