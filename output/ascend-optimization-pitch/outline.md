# Ascend Optimization Finder — presentation outline

**Status:** draft for outline approval. No visual style, image backend or sample slide has been approved.
**Language:** English. **Format:** 16:9. **Length:** 12 slides.
**Audience:** AscendNPU-IR compiler stakeholders, technical leads and potential internal collaborators.
**Purpose:** establish the performance problem, current practice and investigation gap before proposing a framework; then explain its goals, approach, constraints, MVP, risks and evaluation.
**Source baseline:** research-vault drafts and candidate-family catalog, plus the user's requested problem-first pitch sequence. No new evidence is established by this presentation draft.
**Evidence status:** framework design proposed; Ascend route, finding yield and effort savings unestablished.

This is a content and visual storyboard. Bullet text is proposed on-slide copy; visual descriptions are production instructions, not extra slide text. Source links and evidence boundaries guide later notes and QA.

## Progress

- [ ] **Active:** prepare and approve the outline; then confirm visual style and image backend.
- [ ] Generate and approve one representative sample slide.
- [ ] Prepare slide jobs and recorded state.
- [ ] Dispatch remaining slide-generation workers.
- [ ] Record and inspect generated slide results.
- [ ] Finish QA, presenter notes and PPTX assembly.

The codex-ppt outline gate is pending. This iteration creates only the outline.

## Narrative and Heilmeier mapping

The narrative follows the user's requested pitch sequence. The problem, existing approaches and investigation gap come first. The proposed framework is introduced on slide 4; architecture follows the goals.

| Slides | Narrative role | Heilmeier basis |
| --- | --- | --- |
| 1 | Performance and optimization problem | H01 motivation |
| 2 | Existing approaches in AscendNPU-IR | H02 |
| 3 | Proactive-search gap and repeated investigation effort | H02; H01 developer value |
| 4 | Proposed solution in two sentences | H01; H03 |
| 5 | Large goals and questions to resolve | H03; H08 |
| 6–8 | How: framework, search families and an MLIR rewrite | H03; candidate-family catalog; LPO/PRAGMA |
| 9 | Scope, semantic, evidence and resource constraints | H03; Q06; Q08 |
| 10 | MVP, stages and required support | H06; H07 |
| 11 | Risks | H05 |
| 12 | Success evaluation | H08 |

## Slide 1 — Optimized kernels can still contain avoidable work

**Role:** problem statement.
**Intent:** establish the performance and optimization problem before introducing any solution.

**Proposed on-slide copy:**

- Successful compilation and enabled optimizations do not guarantee efficient generated code.
- Avoidable operations, memory traffic or unsuitable execution patterns can remain.
- Finding a worthwhile improvement requires identifying the opportunity and establishing that an alternative helps.

**Visual:** a kernel-execution schematic with three potential sources of inefficiency: computation, data movement and execution organization. Show how these inefficiencies contribute to kernel execution cost, without performance numbers. No framework, LLM, candidate-generation loop or proposed solution appears on this slide.
**Evidence boundary:** this states the problem class. It does not attribute every kernel bottleneck to the compiler or claim a measured Ascend defect.
**Sources:** H01; candidate-family catalog; LPO and PRAGMA problem statements.
**Required source images:** none.

## Slide 2 — [REWORK] How optimization opportunities reach engineers today

**Role:** current-practice context.
**Intent:** describe known improvement mechanisms and identify the absence of proactive search within the presenter's current knowledge.

**Proposed on-slide copy:**

- Nightly performance regression testing helps keep regressions out of upstream.
- Performance tickets, kernel-specific tasks and optimization epics trigger investigations.
- Engineers inspect generated code and use available profiling/checking tools.
- To my knowledge, no proactive search for missed optimizations is currently performed in the project.

**Visual:** observed entry points converging on an engineer investigation, beside an unfilled “Proactive opportunity search” lane. Keep “To my knowledge” visibly attached to the absence claim. Cross-accelerator comparisons may appear as a dashed, unconfirmed task source.
**Evidence boundary:** the absence of proactive search is the presenter's current understanding, not a confirmed team-wide finding. Preserve that qualification in this early pitch. Task selection and existing tools still need clarification. Keep “[REWORK]” in this draft slide's title.
**Sources:** H02; Q02–Q04.
**Required source images:** none.

## Slide 3 — Proactive optimization discovery is the gap we target

**Role:** proactive-search gap and the engineering effort involved in filling it.
**Intent:** connect the qualified observation on slide 2 to the proposed project's purpose before introducing the framework.

**Proposed on-slide copy:**

- Search existing compiled code for opportunities before a performance issue or optimization task identifies a case.
- Establish a repeatable process for constructing alternatives, checking them and comparing results.
- Reduce the engineer effort needed to carry out these repeated investigations.
- Retain reproducible evidence for engineers to assess promising opportunities.

**Visual:** extend slide 2's unfilled lane into “Existing compiled code → proactive investigation → opportunities for engineer review.” Under the investigation, show repeated work: construct alternatives, check, compare and retain evidence. Keep this a description of the missing capability; framework components appear later.
**Evidence boundary:** this gap follows the qualified current understanding on slide 2. Engineers can already discover opportunities within existing tasks; the proposed addition is an organized proactive search capability. Finding yield and effort savings remain to be tested.
**Sources:** H01 developer value; H02 investigation notes and Q03–Q04; H03 §4.
**Required source images:** none.

## Slide 4 — Build a framework for reproducible optimization discovery

**Role:** proposed solution in two sentences.
**Intent:** name the target once the problem, current practice and gap have been established.

**Proposed on-slide copy:**

> Develop a framework that uses LLM-proposed MLIR rewrites, compilation, correctness checks and improvement comparisons to produce reproducible optimization findings for AscendNPU-IR.
>
> Offload repeated investigation work so compiler experts can focus on assessing useful opportunities.

**Visual:** one simple transformation: supplied MLIR → investigation framework → reproducible finding. Keep component architecture for slide 6.
**Evidence boundary:** intended capability and benefit, not an implemented system or demonstrated saving. This is the first slide to introduce the proposed framework and LLM role.
**Sources:** H01; H03 §1 and §4.
**Required source images:** none.

## Slide 5 — Five goals shape the experiment

**Role:** large work packages and questions.
**Intent:** state what the experiment must achieve and resolve before explaining the implementation.

**Proposed on-slide copy:**

- **Useful opportunities:** which transformation families yield findings worth an engineer's attention?
- **Dialect support:** deliver the AscendNPU-IR semantics and examples the agent needs to rewrite supported code.
- **Credible comparisons:** establish a compatible compilation route, checking policy and improvement metric.
- **Repeatable execution:** preserve attempts, budgets and evidence; support recovery and finding replay.
- **Demonstrated value:** assess finding usefulness and the expert/resource cost of obtaining it.

**Visual:** five goal cards, each linked to an observable output: scoped cases, dialect reference pack, exercised comparison route, runnable finding and evaluation record. Keep implementation components out of this goal overview.
**Evidence boundary:** these are goals and open questions. No particular metric, checker, backend or full classifier set is selected.
**Sources:** H03; H08; ASC-43; ASC-44.
**Required source images:** none.

## Slide 6 — A framework coordinates the investigation

**Role:** architecture.
**Intent:** make the system responsibilities concrete, with agent editing as one component.

**Proposed on-slide copy:**

- **Request:** supplied MLIR, editing scope, surrounding context and resolved profiles.
- **Agent workspace:** a working copy plus versioned dialect references.
- **Execution:** compiler continuation, correctness checks and the selected metric.
- **Durable evidence:** every attempt, feedback, budget state, recovery and finding replay.

**Visual:** one enclosing framework boundary. At its output, show a small finding-bundle mockup with original/candidate code, conditions, check results, metric evidence and replay entry point; use field names rather than invented results. Show original snapshots and context entering the agent workspace; candidate snapshots join the unchanged original at the execution layer. Separate validation and metric outputs feed structured feedback back to the agent. Place the operation/artifact store under every stage, not only at the end.
**Evidence boundary:** one proposed baseline agent session; backend, storage and concrete Ascend integration are unselected. No automatic compiler-pass implementation.
**Sources:** H03 §§2.1–2.6; ASC-43. LPO §3.3 and PRAGMA §III motivate independently checked rewrites and feedback; concrete Ascend support remains open.
**Required source images:** none.

## Slide 7 — Search for specific transformation families

**Role:** scope classification.
**Intent:** give the audience recognizable search targets without claiming confirmed Ascend defects.

**Proposed on-slide copy:**

- **Local simplification:** subsumed clamps; redundant predicates and selections.
- **Memory sequences:** legal combinations of adjacent narrow accesses.
- **Target use:** vectorization/instruction forms; reduction organization.
- **Representation:** unnecessary layout or conversion sequences.

**Visual:** six compact family cards, retaining catalog identifiers O01–O06. Give each a very small structural before/after sketch rather than a generic icon. Use a clear provenance marker: “LPO: LLVM cases,” “PRAGMA: kernel cases,” or “Our candidate.”
**Evidence boundary:** LPO motivates O01–O03; PRAGMA motivates O04–O05 at kernel level; O06 is our hypothesis. Applicability and benefit in Ascend remain open. Simple loop fusion is only an explanatory example; the project owner expects it to work already.
**Visible source labels:** LPO — arXiv:2508.16125v2; PRAGMA — arXiv:2511.06345v2. Full references are below.
**Sources:** [candidate-family catalog](../../research/Candidate%20optimization%20families.md); LPO §4.3 / Figure 4; PRAGMA §IV-D.
**Required source images:** none.

## Slide 8 — An MLIR rewrite can remove redundant work

**Role:** code case study.
**Intent:** show an actual rewrite with a short, understandable semantic explanation.

**Proposed on-slide copy:**

- The original replaces NaNs with zero, then tests ordered equality with one.
- Ordered equality with one is already false for NaN.
- A candidate removes the sanitizing comparison and selection.
- Illustrative MLIR adaptation of an LPO LLVM case; Ascend behavior untested.

**Code to reproduce exactly, in two panels:**

Shared context: `%x : f32`, `%zero = 0.0 : f32`, `%one = 1.0 : f32`.

Original:

```mlir
%ordinary = arith.cmpf ord, %x, %x : f32
%safe = arith.select %ordinary, %x, %zero : f32
%equal = arith.cmpf oeq, %safe, %one : f32
```

Candidate:

```mlir
%equal = arith.cmpf oeq, %x, %one : f32
```

**Visual:** code occupies most of the slide. Highlight the two removed operations. A small two-case annotation explains ordinary values versus NaN. Treat “three operations → one” as a count in this excerpt, never as a runtime speedup.
**Evidence boundary:** the complete illustrative functions are in the catalog. This MLIR translation has not been locally parsed or validated through Ascend. Later compilation might already remove the difference.
**Sources:** catalog; LPO §4.3, case 3 / Figure 4(c),(f).
**Required source images:** none.

## Slide 9 — Bound the search and the claims

**Role:** constraints.
**Intent:** state operating boundaries separately from goals, deliverables and risks.

**Proposed on-slide copy:**

- **Scope:** selected AscendNPU-IR checkpoints and operations, explicit editing boundaries and retained context.
- **Semantics:** preserve required behavior; record aliasing, numerical and target assumptions.
- **Evidence:** use a jointly supported compilation/checking/metric route; report its coverage.
- **Resources:** enforce model, compilation and execution limits, including NPU use where required.

**Visual:** a bounded experiment envelope around an original/candidate comparison. Show configurable scope, checking, objective and resource profiles as inputs. A two-branch evidence diagram distinguishes correctness checking from improvement assessment.
**Evidence boundary:** time is one possible metric, not a fixed requirement. A cheaper static indicator does not establish runtime speedup; avoiding timing does not establish device-free validation. Automatic compiler-pass writing and testcase generation remain later work.
**Sources:** H03 §§2.1, 2.3–2.5; Q06; Q08.
**Required source images:** none.

## Slide 10 — A focused MVP by month 4

**Role:** MVP scope, staged implementation and resources.
**Intent:** define the initial deliverable after the goals, mechanism and constraints are understood.

**Proposed on-slide copy:**

- Engineer-supplied MLIR at one supported checkpoint, with an explicit editing scope.
- An agent that receives versioned dialect references, edits a copy and uses checking/comparison feedback.
- One exercised compilation route, checking policy and improvement metric.
- Persistent investigation state, interruption recovery and runnable finding replay.

**Visual:** a bounded MVP box above a relative timeline: month 1 feasibility; months 2–3 baseline; month 4 MVP; month 5 evaluation; month 6 one selected refinement. A small resource band lists one developer, part-time compiler expertise, model/host resources and NPU access as required. No monetary amounts or calendar dates.
**Evidence boundary:** month 4 is a planning target conditional on access and route feasibility. Advanced classifiers, richer agent tools and broader coverage remain optional refinements. Baseline dialect knowledge delivery is required, not deferred.
**Sources:** H06; H07; ASC-43; engineering backlog.
**Required source images:** none.

## Slide 11 — Two uncertainties determine feasibility

**Role:** risks.
**Intent:** foreground the project's primary concerns and keep the remaining risks visible.

**Proposed on-slide copy:**

- **Finding yield:** real inputs may produce too few useful opportunities.
- **Integration effort:** compilation, checking and replay may exceed available capacity.
- **Expert effort:** preparation and review may offset saved work.
- **Evidence quality:** metric relevance and correctness coverage must be established.

**Visual:** two large uncertainty cards for yield and integration, plus a smaller strip for expert cost, metric interpretation and validation coverage. No numeric probabilities.
**Evidence boundary:** H05 ranks yield and integration as the primary concerns; their likelihood is unknown. Other risks are considered manageable, not resolved.
**Sources:** H05; Q06; Q08.
**Required source images:** none.

## Slide 12 — Judge success by useful, replayable findings

**Role:** evaluation methodology.
**Intent:** define observations that could support a decision rather than list generic progress signals.

**Proposed on-slide copy:**

- **MVP:** complete and resume an investigation; replay a finding reviewed as worth investigating.
- **Evaluation:** freeze representative cases, review criteria, budgets and repeats before the main study.
- **Report every case:** useful, duplicate, rejected, unsupported and inconclusive outcomes.
- **Measure cost:** preparation/review effort, model usage and host/device resources.

**Visual:** a protocol diagram with separate development and evaluation case sets. Every evaluation case enters an outcome ledger; retained findings link to review and replay. A compact evidence panel separates finding usefulness from expert-effort savings.
**Evidence boundary:** at least one useful reproducible real-case finding is a proposed MVP target, not an achieved result. Expert-time-saving claims need a comparable reference workflow. Case count, budgets, repeat count and that reference remain to be established.
**Sources:** H08; ASC-33; ASC-39; ASC-40.
**Required source images:** none.

## Source index

- [H01 — Goal and intended value](../../questions/H01%20-%20What%20are%20we%20trying%20to%20do.md)
- [H02 — Current practices and uncertainties](../../questions/H02%20-%20How%20is%20it%20done%20today.md)
- [H03 — Proposed framework](../../questions/H03%20-%20What%20is%20new%20in%20our%20approach.md)
- [H04 — Beneficiary cross-reference](../../questions/H04%20-%20Who%20cares%20and%20what%20changes%20if%20we%20succeed.md)
- [H05 — Risks](../../questions/H05%20-%20What%20are%20the%20risks.md)
- [H06 — Resource outline](../../questions/H06%20-%20How%20much%20will%20it%20cost.md)
- [H07 — Stages](../../questions/H07%20-%20How%20long%20will%20it%20take.md)
- [H08 — Evaluation](../../questions/H08%20-%20How%20will%20we%20check%20success.md)
- [Candidate families and full MLIR illustration](../../research/Candidate%20optimization%20families.md)
- [LPO reading record](../../papers/LPO.md)
- [PRAGMA reading record](../../papers/PRAGMA.md)
- [Engineering backlog](../../framework/planning/backlog.md)
- [Research backlog](../../framework/planning/research-backlog.md)

## Paper references for slides 6–8

- Xu et al., *LPO: Discovering Missed Peephole Optimizations with Large Language Models*, ASPLOS 2026. [arXiv:2508.16125v2](https://arxiv.org/abs/2508.16125v2). Reuse candidates: local IR rewrites, independent checking and diagnostic feedback. Alive2 belongs to the LLVM reference workflow; Ascend compatibility is unestablished.
- Lei et al., *PRAGMA: A Profiling-Reasoned Multi-Agent Framework for Automatic Kernel Optimization*, 2025 preprint. [arXiv:2511.06345v2](https://arxiv.org/abs/2511.06345v2). Reuse candidates: profiling-informed refinement and variant history. Profiling, multiple agents and reported CPU/GPU speedups are not adopted Ascend results.

These motivate the approach and examples. They do not establish Ascend finding yield or expert-effort savings. Use compact citations on the relevant slides; preserve the full references in the outline and later presenter notes.

## Image inputs and approval state

- Required source images: **none**.
- All proposed visualizations are explanatory compositions built from the source content. No measured chart is proposed.
- The code on slide 8 is an exact content constraint, not an image input.
- No images have been generated and no PPTX has been assembled.
- **Awaiting:** approval or revision of this 12-slide narrative. Visual style, image backend and one sample slide follow in that order under the codex-ppt workflow.
