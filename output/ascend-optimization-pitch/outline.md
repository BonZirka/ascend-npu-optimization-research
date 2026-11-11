# Ascend Optimization Finder — presentation outline

**Status:** draft for outline approval. No visual style, image backend or sample slide has been approved.
**Language:** English. **Format:** 16:9. **Length:** 12 slides.
**Audience:** AscendNPU-IR compiler stakeholders, technical leads and potential internal collaborators.
**Purpose:** explain and justify a bounded experiment in finding useful, reproducible compiler optimization opportunities with less expert investigation effort.
**Source baseline:** research-vault drafts and candidate-family catalog at Git commit `43fbc4c`, plus the user's clarifications in this chat.
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

| Slides | Question | Intended takeaway |
| --- | --- | --- |
| 1–2 | H01 / H04 | The desired outcome and intended customer, developer and technical value. |
| 3 | H02 | The partial account of current practice and what still needs confirmation. |
| 4–8 | H03 | A concrete proposed framework, candidate search scope, MLIR example, finding contract and supporting methods. |
| 9 | H05 | The two primary uncertainties and the other risks to manage. |
| 10 | H06 / H07 | Resource categories and the relative development stages; MVP by month 4. |
| 11 | H08 | How useful findings, replay and costs will be assessed. |
| 12 | Decision / next step | Establish one feasible Ascend route and run the bounded experiment. |

## Slide 1 — Finding missed optimizations in AscendNPU-IR

**Role:** cover and proposition.
**Intent:** state the concrete target and experimental objective immediately.

**Proposed on-slide copy:**

- An LLM-assisted framework for investigating alternative MLIR rewrites.
- Produce useful findings that compiler engineers can reproduce and assess.
- Test whether offloading repeated investigation work reduces expert effort.

**Visual:** a simple original-MLIR → candidate-MLIR → runnable-finding motif. Show an explicit “Experimental project” label. No performance numbers.
**Evidence boundary:** this is the proposed outcome, not an existing product or demonstrated saving.
**Sources:** H01; H03 §1.
**Required source images:** none.

## Slide 2 — Make useful kernel improvements more consistent

**Role:** value explanation.
**Intent:** connect engineering work to NPU customers without promising a wider set of optimizations or a measured delivery benefit.

**Proposed on-slide copy:**

- **NPU customers:** aim for more consistent delivery of useful kernel improvements.
- **Compiler engineers:** reduce the work needed to construct alternatives, run comparisons and package evidence.
- **Technical opportunity:** make optimization investigations repeatable and reusable.
- **Hypothesis to test:** useful findings justify their preparation, checking and review costs.

**Visual:** a three-level chain: repeatable investigations → engineer-assessed compiler opportunities → intended benefits in deployed kernels. Distinguish immediate framework output from downstream compiler/product work.
**Evidence boundary:** customers see the effects of later integrations; engineers use the framework. The intended customer effect remains downstream and unmeasured.
**Sources:** H01; H04 cross-reference; H03 §4.
**Required source images:** none.

## Slide 3 — [REWORK] How optimization opportunities reach engineers today

**Role:** current-practice context.
**Intent:** preserve the partial account and its uncertainty rather than imply that the team lacks effective optimization work.

**Proposed on-slide copy:**

- Nightly performance regression testing helps keep regressions out of upstream.
- Performance tickets, kernel-specific tasks and optimization epics trigger investigations.
- Engineers inspect generated code and use available profiling/checking tools.
- How proactive search is organized, and how tasks are prioritized, still needs confirmation.

**Visual:** observed entry points converging on an engineer investigation. A small “Partial account — team confirmation needed” panel holds uncertainties. Cross-accelerator comparisons may appear as a dashed, unconfirmed task source.
**Evidence boundary:** do not describe all work as reactive or assert that no systematic search exists. Keep “[REWORK]” in this draft slide's title.
**Sources:** H02; Q02–Q04.
**Required source images:** none.

## Slide 4 — A framework coordinates the investigation

**Role:** architecture.
**Intent:** make the system responsibilities concrete, with agent editing as one component.

**Proposed on-slide copy:**

- **Request:** supplied MLIR, editing scope, surrounding context and resolved profiles.
- **Agent workspace:** a working copy plus versioned dialect references.
- **Execution:** compiler continuation, correctness checks and the selected metric.
- **Durable evidence:** every attempt, feedback, budget state, recovery and finding replay.

**Visual:** one enclosing framework boundary. Show original snapshots and context entering the agent workspace; candidate snapshots join the unchanged original at the execution layer. Separate validation and metric outputs feed structured feedback back to the agent. Place the operation/artifact store under every stage, not only at the end.
**Evidence boundary:** one proposed baseline agent session; backend, storage and concrete Ascend integration are unselected. No automatic compiler-pass implementation.
**Sources:** H03 §§2.1–2.6; ASC-43.
**Required source images:** none.

## Slide 5 — Search for specific transformation families

**Role:** scope classification.
**Intent:** give the audience recognizable search targets without claiming confirmed Ascend defects.

**Proposed on-slide copy:**

- **Local simplification:** subsumed clamps; redundant predicates and selections.
- **Memory sequences:** legal combinations of adjacent narrow accesses.
- **Target use:** vectorization/instruction forms; reduction organization.
- **Representation:** unnecessary layout or conversion sequences.

**Visual:** six compact family cards, retaining catalog identifiers O01–O06. Give each a very small structural before/after sketch rather than a generic icon. Use a clear provenance marker: “LPO: LLVM cases,” “PRAGMA: kernel cases,” or “Our candidate.”
**Evidence boundary:** LPO motivates O01–O03; PRAGMA motivates O04–O05 at kernel level; O06 is our hypothesis. Applicability and benefit in Ascend remain open. Simple loop fusion is only an explanatory example; the project owner expects it to work already.
**Sources:** [candidate-family catalog](../../research/Candidate%20optimization%20families.md); LPO §4.3 / Figure 4; PRAGMA §IV-D.
**Required source images:** none.

## Slide 6 — An MLIR rewrite can remove redundant work

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

## Slide 7 — Return a runnable comparison

**Role:** output demonstration and evidence contract.
**Intent:** make the finding tangible and explain what makes it worth reviewing.

**Proposed on-slide copy:**

- Saved original/candidate MLIR, change record and applicable conditions.
- Compiler route, selected checks and independent metric results.
- One entry point to rerun the comparison in its declared environment.
- A visible record of coverage, assumptions and unresolved outcomes.

**Visual:** a finding-report mockup linked to a compilation diagram. Both variants follow the same configured pipeline and target. Validation and metric assessment are separate branches, potentially consuming different checkpoints. The mockup uses “pending,” “not measured” or field names instead of fabricated results. Label any replay command as a proposed interface.
**Evidence boundary:** a static metric can be used without claiming runtime speedup. Avoiding timing does not itself remove hardware requirements for validation. Checks establish only their declared coverage.
**Sources:** H03 §§2.4–2.6; Q06; Q08.
**Required source images:** none.

## Slide 8 — Reuse methods from LPO and PRAGMA

**Role:** related work and basis for confidence.
**Intent:** explain why the experiment is worth trying and identify the target-specific work that remains.

**Proposed on-slide copy:**

- **LPO:** local IR alternatives, independent checking and diagnostic feedback.
- **PRAGMA:** profiling-informed refinement and variant-specific history.
- **Ascend work:** dialect knowledge, compatible compilation/checking routes and a meaningful metric.
- **Our evaluation:** useful findings and the total effort/resource cost of obtaining them.

**Visual:** two source cards feed a proposed Ascend framework card. Each source card separates “method to examine” from “target assumptions.” Introduce Alive2 only inside the LPO card, labeled “LLVM refinement checker”; no arrow implies that it supports Ascend dialects. Profiling and multiple agents remain optional adaptations.

**Visible references:**

- Xu et al., *LPO: Discovering Missed Peephole Optimizations with Large Language Models*, ASPLOS 2026. [arXiv:2508.16125v2](https://arxiv.org/abs/2508.16125v2).
- Lei et al., *PRAGMA: A Profiling-Reasoned Multi-Agent Framework for Automatic Kernel Optimization*, 2025 preprint. [arXiv:2511.06345v2](https://arxiv.org/abs/2511.06345v2).

**Evidence boundary:** neither paper establishes Ascend applicability or our proposed expert-effort saving. Do not transfer CPU/GPU speedups to this proposal.
**Sources:** local LPO and PRAGMA notes; H03 §4.
**Required source images:** none. Original explanatory diagrams will be generated; no paper figure is a strict input asset.

## Slide 9 — Two uncertainties determine feasibility

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

## Slide 10 — Deliver an MVP by month 4

**Role:** staged plan and resource outline.
**Intent:** give a bounded sequence and make the required support concrete without inventing a budget.

**Proposed on-slide copy:**

- **Month 1:** establish one feasible route and try direct agent rewrites.
- **Months 2–3:** implement the baseline, including dialect references and persistent state.
- **Month 4:** complete replay, recovery and MVP acceptance.
- **Months 5–6:** evaluate the baseline, then implement and compare one selected refinement.

**Visual:** a relative timeline with a prominent month-4 MVP marker. A small resource band lists one developer, part-time compiler expertise, model/host resources and NPU access where required. No calendar dates or monetary amounts.
**Evidence boundary:** this is a planning target conditional on access and integration feasibility. Dialect knowledge delivery is part of MVP; optional classifiers, richer context and extra tools are not prerequisites for the baseline.
**Sources:** H06; H07; ASC-43; engineering backlog.
**Required source images:** none.

## Slide 11 — Judge success by useful, replayable findings

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

## Slide 12 — Begin with one supported Ascend route

**Role:** closing proposal and next step.
**Intent:** end with an explicit, reviewable experiment rather than a broad platform promise.

**Proposed on-slide copy:**

- Supply representative AscendNPU-IR cases, semantic references and compiler access.
- Establish one checkpoint, checking policy and improvement metric.
- Run bounded rewrite investigations and retain reproducible evidence.
- Use finding quality, integration effort and measured cost to decide the next step.

**Visual:** a compact experiment charter: “Inputs and access” → “Bounded pilot” → “Evidence for continuation.” Include the intended customer effect as a small closing line: “More consistent delivery of useful kernel improvements.”
**Evidence boundary:** kernel integration and writing/fixing optimization passes remain subsequent work. No broad portability promise, fixed speedup, guaranteed finding yield or guaranteed expert-effort saving.
**Sources:** H01; H03; H06–H08.
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

## Image inputs and approval state

- Required source images: **none**.
- All proposed visualizations are explanatory compositions built from the source content. No measured chart is proposed.
- The code on slide 6 is an exact content constraint, not an image input.
- No images have been generated and no PPTX has been assembled.
- **Awaiting:** approval or revision of this 12-slide narrative. Visual style, image backend and one sample slide follow in that order under the codex-ppt workflow.
