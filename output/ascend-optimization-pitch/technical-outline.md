# Ascend Optimization Finder — technical presentation

**Status:** revised draft for technical expert review; 19 editable slides, 16:9, English. The original 12-slide draft is preserved.

[Editable PowerPoint](ascend-optimization-technical.pptx) · [PDF exported from the PowerPoint](ascend-optimization-technical.pdf) · [Authoring source](authoring/technical-deck.mjs)

The problem-first sequence is retained. The approach section now exposes the framework contracts and research comparisons instead of compressing them into a generic feedback loop. The primary target is AscendNPU-IR on Ascend NPU hardware.

The architecture is proposed. Actual compiler entry points, supported continuation routes, checker coverage, useful metrics and finding yield remain to be established. Illustrative interface names and compilation checkpoints are explicitly labeled in the slides. The MLIR rewrite is a paper-derived illustration, not a demonstrated Ascend finding.

## Visual sources and reuse

Slide 6 redraws **LPO Figure 2** and **PRAGMA Figures 1–2** using native PowerPoint shapes and connectors. Their extraction/checking and role/feedback structures inform our own architecture, route-compatibility, feedback and replay diagrams. Paper-specific tools retain their original scope: Alive2 and llvm-mca in LPO's LLVM workflow, NCU/perf in PRAGMA's GPU/CPU workflow. Their availability for Ascend is not assumed.

The MLIR example adapts LPO Figure 4(c,f). The candidate-family table separates paper-motivated transformations from our additional layout-conversion hypothesis. All slide text, code, tables and diagrams are editable objects; paper screenshots are not used as slides.

## Research agenda carried into the deck

| Question or study | Presentation treatment |
| --- | --- |
| [Q06 — improvement metrics](../../questions/Q06%20-%20Metrics%20for%20assessing%20LLVM%20IR%20and%20MLIR%20improvements.md) | Structural indicators, target models and runtime; coverage, downstream survival, interpretation and cost. |
| [Q08 — compilation and checking routes](../../questions/Q08%20-%20Compilation%20continuation%20and%20validation%20routes.md) | Accepted checkpoints, restored state, configured passes, observation stages, hard stops and runnable-artifact requirements. |
| [Q09 — agent information delivery](../../questions/Q09%20-%20Agent%20prompt%20construction%20and%20information%20delivery.md) | Required dialect references, harness-prompt study, direct context, retrieval and added analysis comparisons. |
| [Q10 — tools and editing constraints](../../questions/Q10%20-%20Agent%20tools%20and%20editing%20constraints.md) | Ordinary file-editing baseline; possible IR-aware editor, edit restrictions and checking tools. |
| [Q07 — discovery and classifiers](../../questions/Q07%20-%20Initial%20classifiers%20and%20code%20classification%20scheme.md) | Supplied code/range baseline; prompted, static and cost-model selectors as later comparisons. |
| [Research backlog](../../framework/planning/research-backlog.md) | Feedback/history/policy studies and controlled evaluation with all-case and resource reporting. |

These studies are not all prerequisites to the MVP. The baseline exercises one route, checking policy and evaluator with engineer-supplied input, versioned dialect context, durable investigation state and reproducible finding export/replay.

## Slide guide

### 01 — Optimized kernels can still contain avoidable work

**On-slide structure:** Three concrete opportunity families: expressions, memory/layout and execution mapping.

The performance problem concerns opportunities that remain after the configured optimizations. A stable regression baseline can already contain such opportunities. The examples are candidate problem classes. A concrete Ascend case must establish semantic conditions and observe whether later compilation preserves a useful difference.

**Source basis:** H01; H02; research/Candidate optimization families.md

### 02 — [REWORK] How optimization opportunities reach engineers today

**On-slide structure:** Current-mechanism table and the explicitly qualified absence of proactive search.

Current practices come from the project owner’s observations. Nightly performance testing helps keep significant regressions out of upstream. Broader optimization tasks and kernel-specific work may be informed by cross-platform comparisons, whose role in prioritization remains uncertain.

**Source basis:** H02; Q02–Q04

### 03 — Proactive discovery currently depends on engineer investigation

**On-slide structure:** Repeated investigation steps, with the concrete IR, execution and comparison context each requires.

The intended gap is a repeatable search over existing compiled code, including cases that have not triggered a regression or a specific optimization task. These activities currently require choosing transformations, assembling checks and retaining evidence. The project hypothesis concerns how much of that repeated work can be offloaded.

**Source basis:** H01; H02; H03 §4

### 04 — Build a framework for reproducible optimization discovery

**On-slide structure:** Supplied code and resolved configuration enter a bounded investigation and leave as a runnable experiment.

The framework uses an LLM to propose MLIR alternatives and coordinates compilation, selected checks and metric comparison. The same target supplies the original and candidate references. A finding identifies what might be improved. Root-cause analysis and optimization-pass implementation can follow engineer review.

**Source basis:** H01; H03 §1

### 05 — Research directions and planned comparisons

**On-slide structure:** Research matrix: required baseline, comparison, and retained evidence for Q06–Q10 and feedback policy.

This matrix is an open research agenda derived from H03, not completed experiments. Q06 and Q08 establish a feasible comparison route. Q09/Q10 and selector/feedback studies improve a baseline. The implementation does not depend on completing every optional comparison.

**Source basis:** H03 §5; Q06–Q10; research backlog

### 06 — Two paper workflows inform the experiment

**On-slide structure:** Editable reconstructions of LPO Figure 2 and PRAGMA Figures 1–2, including labeled feedback paths and paper-specific tools.

The top workflow is reconstructed from LPO Figure 2 and §3.2–3.3. Its extractor wraps dependent sequences, reoptimizes and deduplicates. opt -O3 preprocesses candidates; interestingness screens before Alive2 refinement checking. The lower workflow is reconstructed from PRAGMA Figures 1–2 and §III. A deterministic verifier compares outputs; a profiler gathers counters; the conductor reasons over code, logs, metric documentation and best history. The Ascend baseline can use one session; these papers motivate responsibilities and feedback signals.

**Source basis:** LPO Figure 2 and §3.2–3.3: https://arxiv.org/abs/2508.16125v2; PRAGMA Figures 1–2 and §III: https://arxiv.org/abs/2511.06345v2

### 07 — Proposed Ascend investigation architecture

**On-slide structure:** Prepared-case, agent-session and adapter boundaries; immutable baseline bypass, validation/evaluation branches, typed feedback and durable state.

H03 defines stage contracts and a default search policy. Read-only input snapshots remain distinct from candidate working copies. A single agent session edits the copy. The adapters compile and assess original/candidate artifacts through a saved recipe. Typed feedback returns independent outcomes and evidence pointers to the same conversation. The durable store records intent and completion plus budget usage at every stage.

**Source basis:** H03 §§2.1–2.6; ASC-43

### 08 — Candidate transformations and applicability conditions

**On-slide structure:** Six transformation families paired with semantic conditions and checkpoint information.

LPO provides LLVM clamp, memory and floating-point examples. PRAGMA supplies kernel vectorization and reduction-tuning examples. The layout-conversion family is a project candidate. These establish search families to investigate in MLIR. Exact Ascend support and benefit must be checked at the selected checkpoint and after continuation.

**Source basis:** Candidate optimization families; LPO §4.3 https://arxiv.org/abs/2508.16125v2; PRAGMA §IV-D https://arxiv.org/abs/2511.06345v2

### 09 — MLIR case — redundant NaN handling

**On-slide structure:** Original and rewritten MLIR, highlighted removed operations, and NaN/ordinary-value case reasoning.

This is an illustrative MLIR adaptation of LPO Figure 4(c)/(f). It assumes that the shown equality is the observed result, and that no other use requires retaining the sanitizing value. For NaN, the original selects zero and compares it with one; the candidate ordered equality is also false. For ordinary values both compare x with one. The arith rewrite and subsequent Ascend output have not been exercised locally.

**Source basis:** LPO §4.3 / Fig. 4(c,f): https://arxiv.org/abs/2508.16125v2; Candidate optimization families

### 10 — Request resolution and dialect knowledge delivery

**On-slide structure:** Illustrative request fields and precedence beside the dialect-reference preparation and delivery flow.

The input and configuration fields are based on H03 §2.1. The YAML-like view is an interface illustration, with profile names awaiting selection. The concrete dialect support task is part of MVP. Provide versioned authoritative operation/type/attribute semantics and representative examples as context or readable files. Capture information actually supplied or retrieved and report unknown semantics. Q09 evaluates richer instruction and retrieval methods; Q10 evaluates tools and editing restrictions.

**Source basis:** H03 §§2.1–2.3; Q09; Q10; ASC-43

### 11 — Compilation checkpoints determine route compatibility

**On-slide structure:** Input and observation checkpoints branch into a static evaluator and further lowering for runtime validation; optional stop incompatibility is explicit.

This is an illustrative route diagram, not a claim that Ascend accepts the depicted checkpoints. Q08 must establish input state restoration, prerequisite passes and exact output boundaries. A metric observation may occur earlier than the artifact consumed by execution validation. An explicit stop before the required lowering makes that runtime policy incompatible. Record the exact compiler version, pipeline, metadata, target and required resources for each demonstrated route.

**Source basis:** H03 §2.4; Q08; Q06

### 12 — Validation outcomes remain independent of improvement

**On-slide structure:** Checking-route requirements and an eligibility table that separates correctness outcomes from improvement outcomes.

Each selected check declares inputs, tolerances, assumptions and coverage. Parse/verify/compile checks validate structural properties. Execution compares selected observables on supplied cases. A semantic checker requires demonstrated representation and operation support. Alive2 supplies LLVM refinement checks in LPO; that does not establish an Ascend checker. A mismatch, unsupported operation and unavailable device are separate outcomes and must lead to different feedback.

**Source basis:** H03 §2.4; Q08; LPO §3.3 https://arxiv.org/abs/2508.16125v2

### 13 — Metric selection controls execution cost and interpretation

**On-slide structure:** Structural, model-based and runtime metrics compared by inputs, resource requirements and supported interpretation.

Q06 compares structural indicators, model-based estimates and runtime measurements. No metric is selected yet. The evaluator records its version, units, observation stage, operation coverage, target assumptions and raw outputs. LPO uses instruction count and llvm-mca as interestingness filters; these screen local cases. PRAGMA gathers target execution and profiling information. Validation cost remains separate. Lower scores before a later pass may be erased, reversed or caused by moving work outside the measured scope.

**Source basis:** Q06; H03 §2.4; LPO §3.3 https://arxiv.org/abs/2508.16125v2; PRAGMA §III https://arxiv.org/abs/2511.06345v2

### 14 — Feedback, stopping rules and crash recovery

**On-slide structure:** Typed feedback outcomes and durable operation transitions, including restart reconciliation and budget preservation.

The default is same-session feedback, each candidate compared to the unchanged original, stopping at the first qualifying result or a resource limit. Infrastructure retry is separate from candidate repair. Before each operation, persist intent and reserve budget. Retain complete evidence before marking completion. On restart, reuse completed applicable work and reconcile uncertain external jobs by identifiers or retrievable outputs. Preserve already spent budget and best eligible results. Exact model-response replay is unnecessary.

**Source basis:** H03 §2.5; Q09

### 15 — The finding is a replayable experiment

**On-slide structure:** Proposed bundle layout, shared execution recipe and relocated replay; original observations remain distinct from new replay evidence.

Initial comparison and replay use the same versioned execution recipe. The saved bundle includes code, case material, manifest and environment bindings. A relocated bundle should run independently of the generating worker and live agent session. Replay produces new evidence and preserves original observations. Interrupted export can be regenerated from durable records. The command shown is a proposed interface.

**Source basis:** H03 §§2.4 and 2.6; H08

### 16 — Constraints resolve into an explicit experiment profile

**On-slide structure:** Resolved experiment constraints paired with explicit failure or boundary handling.

Request resolution must establish a jointly supported route before search. The profile records scope, numeric assumptions, evidence requirements and budgets. Agent-proposed assumptions remain unresolved until established by checking or review. The stored environment and compiler identities determine whether original results may be reused.

**Source basis:** H03 §§2.1 and 2.4; Q06; Q08

### 17 — MVP scope and implementation stages

**On-slide structure:** Focused MVP scope and six-month stages, including dialect knowledge, interruption recovery and finding replay.

The MVP target remains month 4 in a six-month horizon, assuming one developer, part-time compiler support and required environment access. The baseline includes dialect knowledge delivery, durable state and replay. Month 5 evaluates it. Month 6 selects one refinement supported by those observations.

**Source basis:** H06; H07; ASC-43; implementation backlog

### 18 — Primary risks concern finding yield and integration effort

**On-slide structure:** Finding yield and integration effort as primary risks; expert effort, metric relevance and correctness coverage remain visible.

H05 orders the risks by severity and puts useful finding yield first, integration costs second. Their probability remains unknown. Expert-effort savings and evidence quality are additional concerns considered manageable by the project owner, with provisional assessments.

**Source basis:** H05; H08

### 19 — Evaluation protocol and controlled refinement studies

**On-slide structure:** Held-out baseline/refinement comparison, all-outcome ledger, useful finding review, replay and cost accounting.

The proposed MVP target is at least one real replayable finding worth engineer investigation. Main evaluation uses representative held-out cases, separate from development. Agree usefulness criteria, limits and repeat counts in advance. Report every attempted case including duplicates, rejected, unsupported and inconclusive outcomes. Controlled refinement studies change one component while keeping cases, model, checks, objective and relevant budgets comparable. A comparable engineer workflow is needed to claim expert-effort saving.

**Source basis:** H08; research backlog R07–R17

## Source index

- [H01 — intended goal and value](../../questions/H01%20-%20What%20are%20we%20trying%20to%20do.md)
- [H02 — current practices and uncertainties](../../questions/H02%20-%20How%20is%20it%20done%20today.md)
- [H03 — framework design and open studies](../../questions/H03%20-%20What%20is%20new%20in%20our%20approach.md)
- [H05 — risks](../../questions/H05%20-%20What%20are%20the%20risks.md)
- [H06 — resource outline](../../questions/H06%20-%20How%20much%20will%20it%20cost.md)
- [H07 — implementation stages](../../questions/H07%20-%20How%20long%20will%20it%20take.md)
- [H08 — evaluation](../../questions/H08%20-%20How%20will%20we%20check%20success.md)
- [Candidate optimization families and complete MLIR illustration](../../research/Candidate%20optimization%20families.md)
- [Engineering backlog](../../framework/planning/backlog.md)
- [LPO reading record](../../papers/LPO.md), [stored PDF](../../attachments/papers/LPO-2508.16125v2.pdf), [paper](https://arxiv.org/abs/2508.16125v2): *LPO: Discovering Missed Peephole Optimizations with Large Language Models*. Workflow: Figure 2 / §§3.2–3.3; examples: Figure 4 / §4.3.
- [PRAGMA reading record](../../papers/PRAGMA.md), [stored PDF](../../attachments/papers/PRAGMA-2511.06345v2.pdf), [paper](https://arxiv.org/abs/2511.06345v2): *PRAGMA: A Profiling-Reasoned Multi-Agent Framework for Automatic Kernel Optimization*. Workflow: Figures 1–2 / §III; kernel examples: §IV-D.

Speaker notes retain the source basis and evidence limits per slide. The PDF is exported from the finalized editable PPTX. See [authoring instructions](authoring/README.md) for rebuilding with the bundled Codex presentation runtime.
