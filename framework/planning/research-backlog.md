# Research backlog

[Linear project](https://linear.app/ascendoptimizationfinder/project/ascend-optimization-finder-22c80a5e428f/issues)

All 17 issues carry **Research**, plus **Paper review**, **Experiment** or **Evaluation study**. Filter the project by Research to see this work separately from implementation.

**Status:** issues published in Backlog, unassigned and unscheduled. Recording an optional direction does not select it or establish a result. Pitch work is outside this backlog.

Research prerequisites use native Linear blocking relationships. Related implementation issues provide context; they are not additional implementation blockers.

## Paper review

### R01 — Review LPO's discovery, validation and feedback pipeline

**Linear:** [ASC-26](https://linear.app/ascendoptimizationfinder/issue/ASC-26/review-lpos-discovery-validation-and-feedback-pipeline)

**Selection status:** Foundational review.

Which parts of LPO can inform AscendNPU-IR optimization discovery, and which rely on LLVM-specific support?

Completion criteria:

- Trace code extraction, replacement generation, optimization, metric screening and Alive2 checking using the pinned paper and available artifact; record source locations and actual model/framework responsibilities.
- Separate rediscovery, accepted reports, fixes and measured runtime effects; examine validity coverage, report acceptance and human work still required.
- Produce a reuse/applicability table with unknowns and proposed checks. Initial vault notes are a starting point, not a completed artifact review.

**Research prerequisites:** None.

**Related implementation:** ASC-7, ASC-18.

Sources: papers/LPO.md; questions/Q10 - Agent tools and editing constraints.md.

### R02 — Review PRAGMA's profiling feedback and evaluation evidence

**Linear:** [ASC-27](https://linear.app/ascendoptimizationfinder/issue/ASC-27/review-pragmas-profiling-feedback-and-evaluation-evidence)

**Selection status:** Foundational review.

What does profiling contribute in PRAGMA, and what would transferring that guidance to AscendNPU-IR require?

Completion criteria:

- Trace generation, verification, profiling, feedback and retained variant history in the pinned paper; check public artifact availability without assuming an implementation exists.
- Examine baselines, ablations, aggregation, failed generations and reported resource costs; distinguish kernel acceleration from compiler-opportunity discovery.
- Document reusable mechanisms, hardware/tool assumptions, unsupported transfer claims and an experiment for testing whether profiling justifies its cost.

**Research prerequisites:** None.

**Related implementation:** ASC-16, ASC-19.

Sources: papers/PRAGMA.md.

### R03 — Survey methods and terminology for discovering missed optimizations

**Linear:** [ASC-28](https://linear.app/ascendoptimizationfinder/issue/ASC-28/survey-methods-and-terminology-for-discovering-missed-optimizations)

**Selection status:** Deferred reference study.

Which published methods and classifications can inform our search and checking design?

Completion criteria:

- Collect a bounded, sourced comparison of compiler optimization discovery and performance-search methods; define inclusion criteria and pin inspected references.
- Compare candidate selection, references/oracles, correctness checks, improvement indicators and resource requirements; distinguish regression detection from searching for new opportunities.
- Propose reusable terminology and relevant adaptations, recording gaps and limitations. Do not assume proactive/reactive is an established taxonomy.

**Research prerequisites:** None.

**Related implementation:** None.

Sources: questions/Q01 - Taxonomy of bug finding and performance search.md; questions/Q05 - Proactive optimization discovery in literature and other compiler projects.md.

### R04 — Review how agent harnesses construct prompts and deliver domain context

**Linear:** [ASC-29](https://linear.app/ascendoptimizationfinder/issue/ASC-29/review-how-agent-harnesses-construct-prompts-and-deliver-domain)

**Selection status:** Optional refinement; reference analysis.

How do public coding and specialist harnesses assemble instructions, tools, task data and feedback?

Completion criteria:

- Inspect a bounded sample from Q09, including general coding and non-compiler domain harnesses; pin public source versions and distinguish examples from reconstructed runtime requests.
- Record actual instruction layers, assembly paths, initial and retrieved information, context reduction and treatment of uncertainty.
- Produce an information requirement → delivery method → experiment map for IR review, with source-backed observations separated from proposed adaptations.

**Research prerequisites:** None.

**Related implementation:** ASC-18.

Sources: questions/Q09 - Agent prompt construction and information delivery.md; directions/D04 - Domain-specific agent instructions and context.md.

## Experiment

### R07 — Test useful-finding feasibility with direct agent rewriting

**Linear:** [ASC-32](https://linear.app/ascendoptimizationfinder/issue/ASC-32/test-useful-finding-feasibility-with-direct-agent-rewriting)

**Selection status:** Initial feasibility experiment.

Can ordinary agent file editing of supplied AscendNPU-IR produce a useful, reproducible comparison under declared checks?

Completion criteria:

- Select development cases and one demonstrated comparison route; record model, supplied context, prompts, limits and attempted versions.
- Preserve successful, invalid, non-improving and inconclusive attempts, check coverage, comparison evidence, replay and resource use.
- Obtain engineer review of any proposed findings and record a feasibility conclusion with limitations. Integration success or a seeded fixture is not evidence of an agent-discovered useful finding.

**Research prerequisites:** [ASC-30](https://linear.app/ascendoptimizationfinder/issue/ASC-30/assess-candidate-improvement-metrics-for-llvm-ir-mlir-and-ascendnpu-ir) (R05), [ASC-31](https://linear.app/ascendoptimizationfinder/issue/ASC-31/assess-compilation-and-validation-route-coverage-for-ascendnpu-ir) (R06).

**Related implementation:** ASC-8, ASC-9, ASC-25.

Sources: questions/H03 - What is new in our approach.md §2.2–2.6; questions/H08 - How will we check success.md; directions/D01 - Automated testing for missed optimizations.md.

### R08 — Compare instruction and context variants against direct IR review

**Linear:** [ASC-34](https://linear.app/ascendoptimizationfinder/issue/ASC-34/compare-instruction-and-context-variants-against-direct-ir-review)

**Selection status:** Optional refinement; not selected.

Which added information or instruction changes improve finding quality enough to justify their cost?

Completion criteria:

- Select one bounded instruction/context change motivated by R04; specify supplied facts, provenance and delivery method.
- Compare with direct-IR review using comparable model, cases, checking policy, metric and budgets; predefine repeats and handling of context limitations.
- Report useful findings, invalid/inconclusive outcomes, expert effort and model/tool/compilation/device costs; keep baseline artifacts and all attempt histories.

**Research prerequisites:** [ASC-29](https://linear.app/ascendoptimizationfinder/issue/ASC-29/review-how-agent-harnesses-construct-prompts-and-deliver-domain) (R04), [ASC-32](https://linear.app/ascendoptimizationfinder/issue/ASC-32/test-useful-finding-feasibility-with-direct-agent-rewriting) (R07), [ASC-33](https://linear.app/ascendoptimizationfinder/issue/ASC-33/define-the-evaluation-corpus-usefulness-criteria-and-study-protocol) (R13).

**Related implementation:** ASC-18.

Sources: questions/Q09 - Agent prompt construction and information delivery.md; directions/D04 - Domain-specific agent instructions and context.md.

### R09 — Compare agent tools and editing constraints with ordinary file editing

**Linear:** [ASC-35](https://linear.app/ascendoptimizationfinder/issue/ASC-35/compare-agent-tools-and-editing-constraints-with-ordinary-file-editing)

**Selection status:** Optional refinement; not selected.

When do additional tools or enforced editing restrictions improve usefulness, validity or resource cost?

Completion criteria:

- Use R01 to establish LPO's actual model/tool interface; choose one bounded tool or constraint and specify its inputs, outputs, allowed effects and failures.
- Compare ordinary editing with the selected addition under comparable conditions, distinguishing enforced restrictions from prompt instructions.
- Record useful findings, invalid proposals, lost transformation coverage, unresolved cases and total resource/review costs; do not assume structured editing is beneficial.

**Research prerequisites:** [ASC-26](https://linear.app/ascendoptimizationfinder/issue/ASC-26/review-lpos-discovery-validation-and-feedback-pipeline) (R01), [ASC-32](https://linear.app/ascendoptimizationfinder/issue/ASC-32/test-useful-finding-feasibility-with-direct-agent-rewriting) (R07), [ASC-33](https://linear.app/ascendoptimizationfinder/issue/ASC-33/define-the-evaluation-corpus-usefulness-criteria-and-study-protocol) (R13).

**Related implementation:** ASC-12, ASC-18.

Sources: questions/Q10 - Agent tools and editing constraints.md; directions/D05 - Agent tools and editing constraints.md.

### R10 — Compare region discovery methods and code-category coverage

**Linear:** [ASC-36](https://linear.app/ascendoptimizationfinder/issue/ASC-36/compare-region-discovery-methods-and-code-category-coverage)

**Selection status:** Deferred discovery capability; not selected.

Which region selectors and code categories provide useful cases for investigation?

Completion criteria:

- Propose candidate categories and a shared description of classifier outputs, including original-artifact locations, selection reasons and optional scores.
- Compare prompted discovery with a bounded static or cost-model selector where feasible, including default versus focused category selection.
- Measure selection coverage, downstream useful findings, missed/irrelevant regions and total search cost; preserve engineer-specified regions as a bypass.

**Research prerequisites:** [ASC-32](https://linear.app/ascendoptimizationfinder/issue/ASC-32/test-useful-finding-feasibility-with-direct-agent-rewriting) (R07), [ASC-33](https://linear.app/ascendoptimizationfinder/issue/ASC-33/define-the-evaluation-corpus-usefulness-criteria-and-study-protocol) (R13).

**Related implementation:** ASC-12.

Sources: questions/Q07 - Initial classifiers and code classification scheme.md; questions/H03 - What is new in our approach.md §2.2, §5.

### R11 — Compare feedback, history and search-budget policies

**Linear:** [ASC-37](https://linear.app/ascendoptimizationfinder/issue/ASC-37/compare-feedback-history-and-search-budget-policies)

**Selection status:** Optional refinement; not selected.

Which feedback and stopping policies reduce wasted search while preserving useful findings?

Completion criteria:

- Keep the same-conversation, unchanged-original and first-qualifying-finding policy as the baseline; select one feedback/history/allocation/stopping change.
- Use comparable cases, model, checks, metric and total budgets; predefine repeats and separate candidate repair from infrastructure retry.
- Preserve complete attempt and resource histories; compare useful findings, unsuccessful/inconclusive attempts, expensive checks and costs, including reconstruction after session loss where studied.

**Research prerequisites:** [ASC-32](https://linear.app/ascendoptimizationfinder/issue/ASC-32/test-useful-finding-feasibility-with-direct-agent-rewriting) (R07), [ASC-33](https://linear.app/ascendoptimizationfinder/issue/ASC-33/define-the-evaluation-corpus-usefulness-criteria-and-study-protocol) (R13).

**Related implementation:** ASC-19, ASC-22.

Sources: questions/H03 - What is new in our approach.md §2.5; questions/Q09 - Agent prompt construction and information delivery.md.

### R12 — Test whether profiling feedback justifies its collection cost

**Linear:** [ASC-38](https://linear.app/ascendoptimizationfinder/issue/ASC-38/test-whether-profiling-feedback-justifies-its-collection-cost)

**Selection status:** Optional refinement; not selected.

Does detailed profiling guidance yield enough useful compiler findings to justify additional target runs?

Completion criteria:

- Use R02 to choose one profiling signal available for our target; document its meaning, collection route and hardware requirements.
- Compare basic check/metric feedback with added profiling under a declared comparable budget and repeat protocol; account for every profiling and validation run.
- Report useful reproducible findings, invalid/inconclusive outcomes, expert effort and total resource cost. Reduced run count alone does not establish lower overall cost.

**Research prerequisites:** [ASC-27](https://linear.app/ascendoptimizationfinder/issue/ASC-27/review-pragmas-profiling-feedback-and-evaluation-evidence) (R02), [ASC-32](https://linear.app/ascendoptimizationfinder/issue/ASC-32/test-useful-finding-feasibility-with-direct-agent-rewriting) (R07), [ASC-33](https://linear.app/ascendoptimizationfinder/issue/ASC-33/define-the-evaluation-corpus-usefulness-criteria-and-study-protocol) (R13).

**Related implementation:** ASC-16, ASC-19.

Sources: papers/PRAGMA.md; questions/H03 - What is new in our approach.md §5; questions/H08 - How will we check success.md.

### R16 — Study transformation applicability across shapes, types and compiler settings

**Linear:** [ASC-41](https://linear.app/ascendoptimizationfinder/issue/ASC-41/study-transformation-applicability-across-shapes-types-and-compiler)

**Selection status:** Candidate future direction; not selected.

Under which conditions does one promising transformation remain valid and beneficial?

Completion criteria:

- Choose a retained transformation and a bounded set of relevant shape/type/layout/compiler-setting variations; record assumptions and affordable coverage.
- Repeat the selected checks and metric comparison for each case, preserving failures, unsupported combinations and reproducible artifacts.
- Produce an empirical applicability map with untested regions and limitations; tested examples do not establish universal validity.

**Research prerequisites:** [ASC-32](https://linear.app/ascendoptimizationfinder/issue/ASC-32/test-useful-finding-feasibility-with-direct-agent-rewriting) (R07).

**Related implementation:** ASC-21.

Sources: directions/D02 - Systematic investigation of applicability.md; papers/LPO.md.

### R17 — Study replay of optimization opportunities across compiler revisions

**Linear:** [ASC-42](https://linear.app/ascendoptimizationfinder/issue/ASC-42/study-replay-of-optimization-opportunities-across-compiler-revisions)

**Selection status:** Candidate future direction; not selected.

Can saved findings reveal when opportunities disappear, reappear or change across compiler versions?

Completion criteria:

- Choose a small finding corpus and accessible revisions; define comparable routes, target settings and treatment of representation changes.
- Replay saved comparisons and distinguish real outcome changes from unsupported routes, invalidated assumptions and measurement variation.
- Record provenance, replay results and remaining comparability gaps; estimate maintenance cost before proposing a maintained regression corpus.

**Research prerequisites:** [ASC-32](https://linear.app/ascendoptimizationfinder/issue/ASC-32/test-useful-finding-feasibility-with-direct-agent-rewriting) (R07).

**Related implementation:** ASC-21, ASC-23.

Sources: directions/D03 - Tracking opportunities across compiler revisions.md; papers/LPO.md; papers/PRAGMA.md.

## Evaluation study

### R05 — Assess candidate improvement metrics for LLVM IR, MLIR and AscendNPU-IR

**Linear:** [ASC-30](https://linear.app/ascendoptimizationfinder/issue/ASC-30/assess-candidate-improvement-metrics-for-llvm-ir-mlir-and-ascendnpu-ir)

**Selection status:** Core feasibility; metric unselected.

Which indicators provide meaningful original/candidate comparisons at acceptable resource cost?

Completion criteria:

- Compare candidate measurements, estimates and structural indicators by checkpoint, operation coverage, target assumptions, units and hardware requirements.
- Probe applicable methods on recorded original/alternative cases; examine unsupported operations, moving work outside the measured region and changes after later passes.
- Document supported claims and collection costs, distinguishing computability from usefulness and static improvement from runtime speedup; coordinate a compatible route with R06.

**Research prerequisites:** [ASC-26](https://linear.app/ascendoptimizationfinder/issue/ASC-26/review-lpos-discovery-validation-and-feedback-pipeline) (R01).

**Related implementation:** ASC-7, ASC-16.

Sources: questions/Q06 - Metrics for assessing LLVM IR and MLIR improvements.md; questions/H03 - What is new in our approach.md §2.4.

### R06 — Assess compilation and validation route coverage for AscendNPU-IR

**Linear:** [ASC-31](https://linear.app/ascendoptimizationfinder/issue/ASC-31/assess-compilation-and-validation-route-coverage-for-ascendnpu-ir)

**Selection status:** Core feasibility; no route assumed.

Which compilation checkpoints, correctness checks and metric stages can form a supported route?

Completion criteria:

- Use existing compiler probes to catalog accepted start states, resumption requirements, output checkpoints, observation points and hard stop boundaries; reference ASC-6 evidence rather than duplicating its integration work.
- Assess parsing/compilation checks, execution comparisons and semantic or alternative execution routes where available; record assumptions, FP/memory coverage, harness needs and host/NPU requirements.
- Produce a compatibility matrix with demonstrated, incompatible, unsupported and unknown outcomes. Identify evidence gaps, including proposed rewrite assumptions; do not infer an Ascend checker from Alive2's LLVM support.

**Research prerequisites:** [ASC-26](https://linear.app/ascendoptimizationfinder/issue/ASC-26/review-lpos-discovery-validation-and-feedback-pipeline) (R01).

**Related implementation:** ASC-6, ASC-7, ASC-15.

Sources: questions/Q08 - Compilation continuation and validation routes.md; questions/H03 - What is new in our approach.md §2.4.

### R13 — Define the evaluation corpus, usefulness criteria and study protocol

**Linear:** [ASC-33](https://linear.app/ascendoptimizationfinder/issue/ASC-33/define-the-evaluation-corpus-usefulness-criteria-and-study-protocol)

**Selection status:** Core evaluation design; unresolved choices.

How will we assess useful findings and cost without reporting only successful cases?

Completion criteria:

- Agree on representative evaluation cases distinct from development/tuning cases and record selection/exclusion criteria.
- Define engineer-review criteria, duplicate handling, validation/metric evidence requirements, replay outcomes and reporting of rejected, unsupported and inconclusive cases.
- Freeze relevant budgets, model/compiler/profile versions, repetitions and effort/resource recording before main evaluation; state which claims require an additional reference workflow.

**Research prerequisites:** None.

**Related implementation:** ASC-25.

Sources: questions/H08 - How will we check success.md.

### R14 — Evaluate MVP finding usefulness, reproducibility and resource cost

**Linear:** [ASC-39](https://linear.app/ascendoptimizationfinder/issue/ASC-39/evaluate-mvp-finding-usefulness-reproducibility-and-resource-cost)

**Selection status:** Core evaluation; after MVP and protocol.

What useful findings does the MVP produce on the fixed evaluation collection, and at what cost?

Completion criteria:

- Run the fixed R13 protocol and preserve every selected case, attempt and outcome with effective versions and budgets.
- Obtain engineer review and replay reported findings; keep validation coverage, metric changes and observed workload effects separate.
- Report useful, duplicate, rejected and inconclusive results together with preparation/review effort, model use and host/device costs; document limitations and no-finding outcomes.

**Research prerequisites:** [ASC-33](https://linear.app/ascendoptimizationfinder/issue/ASC-33/define-the-evaluation-corpus-usefulness-criteria-and-study-protocol) (R13).

**Related implementation:** ASC-25.

Sources: questions/H08 - How will we check success.md; questions/H06 - How much will it cost.md.

### R15 — Assess expert-effort savings against a comparable investigation workflow

**Linear:** [ASC-40](https://linear.app/ascendoptimizationfinder/issue/ASC-40/assess-expert-effort-savings-against-a-comparable-investigation)

**Selection status:** Additional outcome; reference workflow unselected.

Does the framework reduce expert effort per useful finding after preparation and review are counted?

Completion criteria:

- Define a realistic engineer workflow, comparable cases and usable effort-recording procedure before collecting comparison data; account for prior case knowledge.
- Record setup, context preparation, investigation, checking and review effort alongside useful output and model/compute costs.
- Report the comparison and uncertainty; distinguish effort savings from elapsed time and run count. If no defensible reference exists, report observed effort without claiming savings.

**Research prerequisites:** [ASC-33](https://linear.app/ascendoptimizationfinder/issue/ASC-33/define-the-evaluation-corpus-usefulness-criteria-and-study-protocol) (R13).

**Related implementation:** ASC-25.

Sources: questions/H08 - How will we check success.md; questions/H01 - What are we trying to do.md.
