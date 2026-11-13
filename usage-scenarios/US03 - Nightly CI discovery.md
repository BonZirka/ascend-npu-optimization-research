# US03 — Nightly CI discovery

**Status:** discussion draft; proposed behavior and unresolved choices.

**Template:** [[templates/Usage Scenario|Usage scenario template]].

**Shared design basis:** [[usage-scenarios/README#Scenario-specific starting information|Scenario-specific starting information]] and [[usage-scenarios/README#Manual workflow exploration before automation|manual workflow exploration before automation]].

## 1. Situation and intended outcome

The team wants routine discovery of optimization opportunities in existing code, without waiting for an engineer to notice a performance problem or create an investigation task.

A scheduled CI job launches bounded searches against declared kernel/IR material and compiler configurations. Engineers configure the activity and review its results. This is a first-class proactive usage scenario; integration details and delivery stage remain to be decided.

## 2. Actors and trigger

**Primary actors:** the team member configuring the CI job and compiler engineers reviewing its findings.

**Trigger:** a nightly or otherwise scheduled CI invocation. The scheduler starts the framework using stored configuration; no engineer supplies new instructions for each individual run.

The existing performance-regression workflow described in H02 is context. This proposed job specifically seeks improvements over the current recorded baseline.

## 3. Starting material and preparation

| Material | Preparation and responsibility |
| --- | --- |
| Corpus source | Team configures where existing kernels/IR and supporting material come from and how each run identifies its snapshot. |
| Compiler and target | CI resolves the intended compiler build and target configuration and records their identities. |
| Profiles and search scope | Maintainer configures supported routes, checks, metrics, permitted edits and optional search focus. |
| Resource bindings and limits | CI supplies model/compiler access and permitted execution resources; NPU-dependent work requires a declared binding. |
| Persistent state and result location | Deployment must retain search progress and evidence beyond a disposable CI worker. Concrete storage and review destinations are open. |

Initial integration and profile maintenance require explicit effort. Per-night operation should use that setup without repeated manual case preparation.

For this broad-discovery scenario, the scheduled job seeks any qualifying improvement within the configured scope and budget. Engineers supply no per-kernel ranges or hypotheses for each run. Selecting promising regions and proposals belongs to the delegated search. The forms of configuration or guidance useful for CI will be explored separately from US01.

## 4. Main flow

1. CI starts the configured job and records the compiler, corpus, configuration and available resource identities.
2. The framework selects work under a declared policy: possible choices include new/changed inputs, affected prior cases or a rotating corpus allocation. Selection policy remains open.
3. It establishes the applicable baseline and searches selected cases within the shared budget, coordinating compilation, behavior checks and metric evaluation.
4. It persists completed and pending operations, evidence and usage throughout the run.
5. At completion or a limit, it publishes a machine-readable execution outcome and reviewable findings/progress artifacts through the selected integration.
6. Engineers review candidate opportunities through US05. Later runs determine whether prior work is reusable, needs renewed checks or should be revisited.

## 5. Alternative paths and outcomes

| Event | Proposed handling or decision needed |
| --- | --- |
| No improvement is found | Treat this as a normal search outcome; report what was investigated. |
| Compiler/checker/framework execution fails | Preserve diagnostics and expose execution failure separately from finding yield. CI status mapping remains to define. |
| NPU resources are unavailable | Keep required device-dependent work pending or blocked. Which other stages can proceed depends on the supported route. |
| Job times out or its worker disappears | Retain progress outside the worker and reconcile interrupted operations before continuation. |
| Compiler, target or corpus changes | Apply explicit compatibility rules; preserve prior evidence and create new comparisons where needed. |
| A previously reported opportunity recurs | Identify the relationship to existing findings; deduplication and notification policy are open. |

## 6. Result and next action

A run produces replayable candidate findings, its execution/search status, coverage of attempted cases, resource usage and unfinished-work references. Engineers need a practical route from this output to review and follow-up work.

The proposed first role is discovery and evidence delivery. Whether and how this job affects an existing CI pipeline's gating is an open integration decision.

## 7. Architecture and interface implications

- A non-interactive entry point must accept stored configuration and expose machine-readable outcomes.
- Durable records and restart/continuation behavior must survive ephemeral CI workers.
- Corpus selection, revisiting, deduplication and review delivery affect whether nightly operation remains useful.
- Tool/hardware capabilities and shared budgets must be resolved without silently weakening required checks.
- Recurring execution requires stable configuration identities and explicit compatibility rules across revisions.

## 8. Intended value and evaluation

**Intended value:** make optimization discovery a recurring activity, concentrating expert attention on review of promising cases.

Evaluate distinct engineer-accepted opportunities over multiple runs, repeated findings, review effort, corpus coverage, execution reliability and resource use. Automated repetition alone does not demonstrate saved expert time.

## 9. Open decisions

- **Deferred:** identify the relevant starting information and guidance for this scenario and manually explore its workflow before choosing interaction, interface/API and automation designs.
- What CI platform and artifact source should the first integration use?
- What is searched each night, and when is previously investigated code revisited?
- What can proceed on host resources, and what requires an NPU-capable environment?
- Where do findings appear, who reviews them, and how are duplicates or stale reports handled?
- How should normal completion, incomplete search and infrastructure failure map to CI status?
- What scope is assigned to this scenario relative to the currently planned engineer-supplied-input MVP?

## 10. Connections

[[usage-scenarios/README|Scenario index]] · [[usage-scenarios/US02 - Search a collection on demand|US02: on-demand campaign]] · [[usage-scenarios/US05 - Review and reproduce a finding|US05: review]]

Basis: project-owner clarification, 2026-11-13; [[questions/H02 - How is it done today|H02]], [[questions/H03 - What is new in our approach|H03 persistence and search policies]], [[framework/planning/experiment-contract|Environment continuation]], [[directions/D03 - Tracking opportunities across compiler revisions|D03]].
