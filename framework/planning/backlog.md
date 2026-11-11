# Implementation backlog

**Scope:** technical setup, implementation and engineering verification. Research studies and pitch work remain in the research vault.

[Open the Linear board](https://linear.app/ascendoptimizationfinder/project/ascend-optimization-finder-22c80a5e428f/issues) — 21 issues, grouped into three implementation milestones.

Each issue contains completion criteria, prerequisite references and source sections. Dependencies are recorded in issue descriptions; native blocking relationships have not been configured.

All tasks begin in Backlog, without assignees or calendar deadlines. Month labels follow the agreed relative plan; no start date is assumed.

The metric, checking policy, compilation route and agent backend still require explicit selection. An implementation issue referencing a selected component does not establish that the selection has already been made.

## 01 Integration setup — Month 1

Prepare development inputs, exercise compiler continuation, configure one supported comparison route and verify the selected agent harness.

### F01 — Prepare AscendNPU-IR development fixtures and execution assets

**Linear:** [ASC-5](https://linear.app/ascendoptimizationfinder/issue/ASC-5/prepare-ascendnpu-ir-development-fixtures-and-execution-assets) · **Type:** integration. **Dependencies:** None.

Package existing engineer-supplied kernels or IR fragments for integration development and smoke tests.

Completion criteria:

- Record original code, enclosing context, inputs, reference results and harness commands.
- Record compiler/target versions, required access and missing execution assets.
- Provide one documented fixture layout with reproducible setup instructions.

Sources: questions/H03 - What is new in our approach.md §2.1–2.2.

### F02 — Verify AscendNPU-IR compilation entry and stopping points

**Linear:** [ASC-6](https://linear.app/ascendoptimizationfinder/issue/ASC-6/verify-ascendnpu-ir-compilation-entry-and-stopping-points) · **Type:** integration. **Dependencies:** [ASC-5](https://linear.app/ascendoptimizationfinder/issue/ASC-5/prepare-ascendnpu-ir-development-fixtures-and-execution-assets) (F01).

Exercise the intended saved-IR input and continuation commands on a development fixture; document the integration contract.

Completion criteria:

- Demonstrate the intended compiler entry point and required input state.
- Record output checkpoints and hard stop boundaries with commands and diagnostics.
- Record required metadata, compiler version, target and execution resources; report unsupported configurations.

Sources: questions/Q08 - Compilation continuation and validation routes.md.

### F03 — Configure the MVP compilation, validation and metric route

**Linear:** [ASC-7](https://linear.app/ascendoptimizationfinder/issue/ASC-7/configure-the-mvp-compilation-validation-and-metric-route) · **Type:** integration. **Dependencies:** [ASC-6](https://linear.app/ascendoptimizationfinder/issue/ASC-6/verify-ascendnpu-ir-compilation-entry-and-stopping-points) (F02).

Encode the selected MVP compiler, checking process and metric as an executable configuration. Tool and metric selection remain external prerequisites until resolved; this task does not perform a comparative research study.

Completion criteria:

- Record the selected start/output checkpoints, checks, evaluator and their versions.
- Provide commands, required inputs, environment bindings and hardware requirements for the route.
- Verify joint compatibility and preserve separate correctness and improvement results; report unresolved selections as blockers.

Sources: questions/H03 - What is new in our approach.md §2.4; questions/Q06 - Metrics for assessing LLVM IR and MLIR improvements.md; questions/Q08 - Compilation continuation and validation routes.md.

### F04 — Demonstrate a reproducible original/candidate comparison

**Linear:** [ASC-8](https://linear.app/ascendoptimizationfinder/issue/ASC-8/demonstrate-a-reproducible-originalcandidate-comparison) · **Type:** verification. **Dependencies:** [ASC-7](https://linear.app/ascendoptimizationfinder/issue/ASC-7/configure-the-mvp-compilation-validation-and-metric-route) (F03).

Exercise the selected compiler, checking policy and metric on a supplied original and alternative before building full orchestration. Preserve commands and artifacts for the later shared execution recipe.

Completion criteria:

- Compile both versions under the same resolved settings.
- Record independent check outcomes, metric values and applicability limits.
- Retain a reproducible comparison and diagnose failures explicitly.

Sources: questions/H03 - What is new in our approach.md §2.4.

### F05 — Verify the agent harness can read and edit an AscendNPU-IR working copy

**Linear:** [ASC-9](https://linear.app/ascendoptimizationfinder/issue/ASC-9/verify-the-agent-harness-can-read-and-edit-an-ascendnpu-ir-working) · **Type:** integration. **Dependencies:** [ASC-8](https://linear.app/ascendoptimizationfinder/issue/ASC-8/demonstrate-a-reproducible-originalcandidate-comparison) (F04).

Exercise the selected agent backend with ordinary file reading/editing against one development fixture before implementing durable orchestration.

Completion criteria:

- Document backend setup and record prompt/profile and model configuration.
- Capture the edited file, framework-visible messages and tool results through the harness.
- Submit the captured version to the F04 comparison route and document interface errors or unsupported capabilities.

Sources: questions/H03 - What is new in our approach.md §2.2–2.3.

## 02 Baseline implementation — Months 2–3

Implement the narrow end-to-end baseline in Python 3.15+, including durable state, runner contracts, agent file editing, configured comparison and feedback.

### F06 — Configure Python 3.15 development tooling and package setup

**Linear:** [ASC-10](https://linear.app/ascendoptimizationfinder/issue/ASC-10/configure-python-315-development-tooling-and-package-setup) · **Type:** implementation. **Dependencies:** None.

Complete the development environment inside framework/ using the current Python 3.15 series. The initial directory and metadata are only scaffolding.

Completion criteria:

- Provide reproducible environment/package setup using the pinned interpreter.
- Choose and document dependency management, formatting, type checks and meaningful test commands.
- Keep virtual environments, caches, secrets and generated run artifacts out of Git.

Sources: questions/H03 - What is new in our approach.md §2.

### F07 — Implement request, profile and outcome data contracts

**Linear:** [ASC-11](https://linear.app/ascendoptimizationfinder/issue/ASC-11/implement-request-profile-and-outcome-data-contracts) · **Type:** implementation. **Dependencies:** [ASC-7](https://linear.app/ascendoptimizationfinder/issue/ASC-7/configure-the-mvp-compilation-validation-and-metric-route) (F03), [ASC-10](https://linear.app/ascendoptimizationfinder/issue/ASC-10/configure-python-315-development-tooling-and-package-setup) (F06).

Translate the agreed H03 contracts into versioned Python data models and serialization. Implement the selected MVP subset explicitly.

Completion criteria:

- Resolve defaults → request → per-input settings while preserving shared limits.
- Represent compilation, checking, metric, target, agent and budget configuration.
- Reject missing/unsupported configurations and preserve independent outcome/coverage records.

Sources: questions/H03 - What is new in our approach.md §2.1, §2.4.

### F08 — Implement immutable input snapshots and editing-scope enforcement

**Linear:** [ASC-12](https://linear.app/ascendoptimizationfinder/issue/ASC-12/implement-immutable-input-snapshots-and-editing-scope-enforcement) · **Type:** implementation. **Dependencies:** [ASC-11](https://linear.app/ascendoptimizationfinder/issue/ASC-11/implement-request-profile-and-outcome-data-contracts) (F07).

Prepare an investigation case and an agent working copy tied to immutable original artifacts. Supporting context remains distinct from editable code.

Completion criteria:

- Persist original artifacts, supplied context and selection provenance.
- Support the selected whole-input or specified-range MVP mode with explicit boundaries.
- Detect edits outside the allowed scope and produce candidate snapshots plus framework-generated diffs.

Sources: questions/H03 - What is new in our approach.md §2.1–2.3.

### F09 — Implement durable investigation, artifact and operation storage

**Linear:** [ASC-13](https://linear.app/ascendoptimizationfinder/issue/ASC-13/implement-durable-investigation-artifact-and-operation-storage) · **Type:** implementation. **Dependencies:** [ASC-11](https://linear.app/ascendoptimizationfinder/issue/ASC-11/implement-request-profile-and-outcome-data-contracts) (F07).

Persist the complete investigation chain rather than relying on temporary directories or a live agent session. Choose concrete storage during implementation.

Completion criteria:

- Assign stable investigation/case/candidate/operation identifiers and retain artifact references.
- Record operation intent, state, effective configuration, evidence and budget consumption/reservations.
- Publish artifacts durably before completion checkpoints; retain transcripts and visible tool records.

Sources: questions/H03 - What is new in our approach.md §2.5.

### F10 — Implement the selected compilation runner

**Linear:** [ASC-14](https://linear.app/ascendoptimizationfinder/issue/ASC-14/implement-the-selected-compilation-runner) · **Type:** implementation. **Dependencies:** [ASC-8](https://linear.app/ascendoptimizationfinder/issue/ASC-8/demonstrate-a-reproducible-originalcandidate-comparison) (F04), [ASC-11](https://linear.app/ascendoptimizationfinder/issue/ASC-11/implement-request-profile-and-outcome-data-contracts) (F07), [ASC-13](https://linear.app/ascendoptimizationfinder/issue/ASC-13/implement-durable-investigation-artifact-and-operation-storage) (F09).

Compile one original or candidate version per invocation using the route established during feasibility.

Completion criteria:

- Accept snapshot, enclosing context, checkpoint, pipeline, target and limits.
- Return artifact manifests, actual invocation, diagnostics and available resource use.
- Distinguish baseline failure, candidate compiler rejection, timeout, unsupported request and infrastructure failure.

Sources: questions/H03 - What is new in our approach.md §2.4.

### F11 — Implement the selected validation adapter

**Linear:** [ASC-15](https://linear.app/ascendoptimizationfinder/issue/ASC-15/implement-the-selected-validation-adapter) · **Type:** implementation. **Dependencies:** [ASC-7](https://linear.app/ascendoptimizationfinder/issue/ASC-7/configure-the-mvp-compilation-validation-and-metric-route) (F03), [ASC-14](https://linear.app/ascendoptimizationfinder/issue/ASC-14/implement-the-selected-compilation-runner) (F10).

Execute the selected MVP checking policy and record the behavior or invariants covered.

Completion criteria:

- Handle references, test material, tolerances, assumptions and environment requirements.
- Represent passed/failed/inconclusive/unsupported/error/not-performed outcomes independently.
- Preserve observed differences, coverage and diagnostics; compilation-only evidence receives its own label.

Sources: questions/H03 - What is new in our approach.md §2.4; questions/Q08 - Compilation continuation and validation routes.md.

### F12 — Implement the selected metric evaluator and comparison criterion

**Linear:** [ASC-16](https://linear.app/ascendoptimizationfinder/issue/ASC-16/implement-the-selected-metric-evaluator-and-comparison-criterion) · **Type:** implementation. **Dependencies:** [ASC-7](https://linear.app/ascendoptimizationfinder/issue/ASC-7/configure-the-mvp-compilation-validation-and-metric-route) (F03), [ASC-14](https://linear.app/ascendoptimizationfinder/issue/ASC-14/implement-the-selected-compilation-runner) (F10).

Assess corresponding original/candidate artifacts through the metric configured in F03. Preserve its stage, coverage and interpretation.

Completion criteria:

- Record evaluator version, units, raw values, conditions and any measurement protocol.
- Apply configured improvement direction and threshold.
- Report unsupported coverage or inconclusive assessment explicitly; static scores retain their limited interpretation.

Sources: questions/H03 - What is new in our approach.md §2.4; questions/Q06 - Metrics for assessing LLVM IR and MLIR improvements.md.

### F13 — Implement the shared comparison recipe for evaluation and replay

**Linear:** [ASC-17](https://linear.app/ascendoptimizationfinder/issue/ASC-17/implement-the-shared-comparison-recipe-for-evaluation-and-replay) · **Type:** implementation. **Dependencies:** [ASC-13](https://linear.app/ascendoptimizationfinder/issue/ASC-13/implement-durable-investigation-artifact-and-operation-storage) (F09), [ASC-15](https://linear.app/ascendoptimizationfinder/issue/ASC-15/implement-the-selected-validation-adapter) (F11), [ASC-16](https://linear.app/ascendoptimizationfinder/issue/ASC-16/implement-the-selected-metric-evaluator-and-comparison-criterion) (F12).

Coordinate the compiler, validator and evaluator through one versioned execution recipe used both initially and when replaying a finding.

Completion criteria:

- Check route compatibility and enforce observation/stopping settings without silent substitutions.
- Retain independent validation and metric outcomes with the selected finding-eligibility rules.
- Reuse applicable original results under explicit compatibility rules and checkpoint each completed operation.

Sources: questions/H03 - What is new in our approach.md §2.4, §2.6.

### F14 — Implement the agent session and working-copy adapter

**Linear:** [ASC-18](https://linear.app/ascendoptimizationfinder/issue/ASC-18/implement-the-agent-session-and-working-copy-adapter) · **Type:** implementation. **Dependencies:** [ASC-9](https://linear.app/ascendoptimizationfinder/issue/ASC-9/verify-the-agent-harness-can-read-and-edit-an-ascendnpu-ir-working) (F05), [ASC-12](https://linear.app/ascendoptimizationfinder/issue/ASC-12/implement-immutable-input-snapshots-and-editing-scope-enforcement) (F08), [ASC-13](https://linear.app/ascendoptimizationfinder/issue/ASC-13/implement-durable-investigation-artifact-and-operation-storage) (F09).

Integrate the backend exercised in F05. Provide prepared code/context and ordinary file editing through the selected harness.

Completion criteria:

- Version prompts and record effective model/backend settings.
- Persist framework-visible conversation, tool results, candidate versions and optional agent notes.
- Enforce edit scope, preserve complete artifacts for checking and report context limitations.

Sources: questions/H03 - What is new in our approach.md §2.2–2.3.

### F15 — Implement feedback, budget enforcement and default stopping

**Linear:** [ASC-19](https://linear.app/ascendoptimizationfinder/issue/ASC-19/implement-feedback-budget-enforcement-and-default-stopping) · **Type:** implementation. **Dependencies:** [ASC-17](https://linear.app/ascendoptimizationfinder/issue/ASC-17/implement-the-shared-comparison-recipe-for-evaluation-and-replay) (F13), [ASC-18](https://linear.app/ascendoptimizationfinder/issue/ASC-18/implement-the-agent-session-and-working-copy-adapter) (F14).

Connect agent proposals to comparison evidence and continue the same conversation for repairs or new attempts within the configured budget.

Completion criteria:

- Return structured feedback distinguishing code problems, coverage limits and infrastructure failures.
- Compare each candidate to the unchanged original; stop at the first qualifying finding, exhausted limits or inability to proceed.
- Preserve each attempt, best eligible result and used/reserved budget; do not reset limits on restart.

Sources: questions/H03 - What is new in our approach.md §2.5.

### F16 — Expose the baseline investigation through a CLI

**Linear:** [ASC-20](https://linear.app/ascendoptimizationfinder/issue/ASC-20/expose-the-baseline-investigation-through-a-cli) · **Type:** implementation. **Dependencies:** [ASC-19](https://linear.app/ascendoptimizationfinder/issue/ASC-19/implement-feedback-budget-enforcement-and-default-stopping) (F15).

Provide the selected engineer-supplied-input workflow from framework/. Concrete command syntax can be finalized during implementation.

Completion criteria:

- Accept request/profile paths and explicit supporting material.
- Report missing requirements, progress, result locations and operation failures.
- Document an executable example using the chosen route and configuration.

Sources: questions/H03 - What is new in our approach.md §2.1–2.5.

## 03 MVP — Month 4

Complete runnable finding bundles, replay, recovery and end-to-end MVP acceptance.

### F17 — Export runnable finding bundles and a replay command

**Linear:** [ASC-21](https://linear.app/ascendoptimizationfinder/issue/ASC-21/export-runnable-finding-bundles-and-a-replay-command) · **Type:** implementation. **Dependencies:** [ASC-17](https://linear.app/ascendoptimizationfinder/issue/ASC-17/implement-the-shared-comparison-recipe-for-evaluation-and-replay) (F13), [ASC-19](https://linear.app/ascendoptimizationfinder/issue/ASC-19/implement-feedback-budget-enforcement-and-default-stopping) (F15).

Package successful comparisons as independent runnable experiments using the shared recipe rather than requiring agent rediscovery.

Completion criteria:

- Export original/candidate code, diff, recipe, checks, metric evidence, environment bindings and a concise report.
- Use bundle-local references and publish complete exports with stable finding IDs.
- Replay through the same execution path and store fresh results without overwriting original evidence.

Sources: questions/H03 - What is new in our approach.md §2.6.

### F18 — Implement investigation resume and interrupted-operation reconciliation

**Linear:** [ASC-22](https://linear.app/ascendoptimizationfinder/issue/ASC-22/implement-investigation-resume-and-interrupted-operation) · **Type:** implementation. **Dependencies:** [ASC-13](https://linear.app/ascendoptimizationfinder/issue/ASC-13/implement-durable-investigation-artifact-and-operation-storage) (F09), [ASC-19](https://linear.app/ascendoptimizationfinder/issue/ASC-19/implement-feedback-budget-enforcement-and-default-stopping) (F15).

Recover durable progress, working copies and agent context after internal failures. Handle uncertain external work explicitly.

Completion criteria:

- Reuse completed applicable operations and reconcile recorded job IDs or artifacts.
- Restore a session where supported or reconstruct context from persisted records.
- Preserve findings and budgets; distinguish candidate repair from infrastructure retry and account for uncertain work.

Sources: questions/H03 - What is new in our approach.md §2.5.

### F19 — Verify finding replay after relocation

**Linear:** [ASC-23](https://linear.app/ascendoptimizationfinder/issue/ASC-23/verify-finding-replay-after-relocation) · **Type:** verification. **Dependencies:** [ASC-21](https://linear.app/ascendoptimizationfinder/issue/ASC-21/export-runnable-finding-bundles-and-a-replay-command) (F17).

Exercise exported findings independently of the generating worker, temporary directory and live agent session.

Completion criteria:

- Replay from a relocated bundle using declared external bindings.
- Report missing dependencies/hardware and retain divergent or failed replay outcomes.
- Verify interrupted export recovery and fresh requested validation/metric results.

Sources: questions/H03 - What is new in our approach.md §2.6; questions/H08 - How will we check success.md.

### F20 — Verify end-to-end failure handling, recovery and evidence boundaries

**Linear:** [ASC-24](https://linear.app/ascendoptimizationfinder/issue/ASC-24/verify-end-to-end-failure-handling-recovery-and-evidence-boundaries) · **Type:** verification. **Dependencies:** [ASC-20](https://linear.app/ascendoptimizationfinder/issue/ASC-20/expose-the-baseline-investigation-through-a-cli) (F16), [ASC-22](https://linear.app/ascendoptimizationfinder/issue/ASC-22/implement-investigation-resume-and-interrupted-operation) (F18), [ASC-23](https://linear.app/ascendoptimizationfinder/issue/ASC-23/verify-finding-replay-after-relocation) (F19).

Add integration checks for the meaningful failure cases in the selected route and orchestration, using recorded or deterministic fixtures where appropriate.

Completion criteria:

- Cover baseline/candidate compilation failure, unsupported/inconclusive checks, mismatches and non-improvement.
- Interrupt at durable boundaries and verify reuse, restored context and preserved budget.
- Verify out-of-scope edits and incompatible routes cannot become ready findings.

Sources: questions/H03 - What is new in our approach.md §2.4–2.6.

### F21 — Verify the complete MVP workflow on an AscendNPU-IR case

**Linear:** [ASC-25](https://linear.app/ascendoptimizationfinder/issue/ASC-25/verify-the-complete-mvp-workflow-on-an-ascendnpu-ir-case) · **Type:** verification. **Dependencies:** [ASC-9](https://linear.app/ascendoptimizationfinder/issue/ASC-9/verify-the-agent-harness-can-read-and-edit-an-ascendnpu-ir-working) (F05), [ASC-24](https://linear.app/ascendoptimizationfinder/issue/ASC-24/verify-end-to-end-failure-handling-recovery-and-evidence-boundaries) (F20).

Run the supported engineer-supplied-input workflow using real development material and verify its technical acceptance requirements.

Completion criteria:

- Run input preparation, agent editing, compilation, checks, metric comparison and feedback under configured limits.
- Export and replay an eligible comparison; use a known qualifying fixture if the search produces none, clearly recording its provenance.
- Interrupt and resume an investigation, then document executable setup/run/replay/resume instructions and remaining integration limitations.

Sources: questions/H07 - How long will it take.md; questions/H08 - How will we check success.md.
