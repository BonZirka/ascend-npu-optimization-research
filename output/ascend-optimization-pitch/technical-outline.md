# Ascend Optimization Finder — technical presentation

**Status:** revised draft for technical expert review. 23 editable slides, 16:9, English. The original 12-slide draft is preserved.

[Editable PowerPoint](ascend-optimization-technical.pptx) · [PDF exported from the PowerPoint](ascend-optimization-technical.pdf) · [Authoring source](authoring/technical-deck.mjs)

The motivation concerns the behavior of the current matching implementation, pass placement and missing transformations. There is no claim that pattern-based engines inherently cannot cover useful sequences. The search now explicitly includes new transformation opportunities and alternative ordering/placement of existing passes, separately and together.

A fixed baseline kernel/pipeline is compared with deliberately identified kernel/pipeline variants. The arithmetic family emphasizes range and precision tracking after casts. Memory rewrites are flagged as a possible cross-pass definedness study whose scope depends on semantic coverage, rather than a simple guaranteed local win.

The shared experiment format links kernel permutations, pipeline variants, cases, executions, evidence and LLM-produced reports. An unfinished investigation must be able to continue in another compatible environment while retaining state, provenance and budgets. These are proposed requirements. Exact schemas, permitted pass edits, concrete adapters and reuse rules remain to be designed and tested.

## Visual sources

The exact full titles accompany editable reconstructions of **LPO Figure 2** and **PRAGMA Figures 1–2**. Their workflows motivate search/checking/feedback responsibilities. Joint Ascend pipeline search and portable records are our project design, not results established by those papers.

The MLIR case adapts LPO Figure 4(c,f). All slide text, code, tables and diagrams remain editable. No Ascend missed-optimization example, checker coverage, pipeline change or resource saving is claimed as demonstrated.

## Research agenda and implementation contracts

| Subject | Concrete starting point / required comparison |
| --- | --- |
| Pass and rewrite search | Scoped MLIR textual pipeline edits and IR alternatives. Compare ordering-only, rewrite-only and combined candidates against a recorded control. |
| [Improvement metrics](../../questions/Q06%20-%20Metrics%20for%20assessing%20LLVM%20IR%20and%20MLIR%20improvements.md) | MLIR operation statistics, logical access/byte estimates, LLVM TTI, llvm-mca and Ascend msProf. Establish relevance, coverage and collection cost. |
| [Compilation and validation](../../questions/Q08%20-%20Compilation%20continuation%20and%20validation%20routes.md) | MLIR verification, Alive2, MLIR-TV, xdsl-smt and execution comparison. Establish compatible route and cross-pass semantic coverage. |
| [Agent context](../../questions/Q09%20-%20Agent%20prompt%20construction%20and%20information%20delivery.md) | Public Codex, Claude Code and OpenCode materials, SQL-agent workflow and PaperQA prompts. Compare direct references, retrieval and added analyses. |
| [Agent tools](../../questions/Q10%20-%20Agent%20tools%20and%20editing%20constraints.md) | File edits / diagnostics, operation-aware edits and pipeline controls. Compare validity, reachable changes and cost. |
| [Discovery](../../questions/Q07%20-%20Initial%20classifiers%20and%20code%20classification%20scheme.md) | Supplied range, prompted selection, use-def/effect scans and available cost/profile estimates. |
| [Feedback studies](../../framework/planning/research-backlog.md) | LPO diagnostics/counterexamples and PRAGMA profiles/history as concrete references. |
| [Common records and continuation](../../framework/planning/experiment-contract.md) | Versioned kernel/pipeline/case/trial/execution/evidence/report records. Resolve new environment bindings, preserve compatible completed work and resume pending operations. |

The MVP is a bounded integration, not exhaustive pipeline enumeration or a general UB planner. A fixed-pipeline IR baseline remains a valid initial slice. Broader ordering search requires exposed, supported pass controls.

## Slide guide

### 01 — Compilers miss useful optimizations

**On-slide structure:** A native editable dependency pipeline replaces the premise paragraph. A legal rewrite can fail to match, leaving the form needed by a later transformation absent. The three columns use the requested concise labels: Pattern Blindness, Pass Misordering and Missing Logic. An arrow shows the exploiter preceding the enabler. The footer is removed. The lower area contains a documented LLVM clamp excerpt with the observed four-operation sequence and an equivalent three-operation form.

The dependency pipeline is schematic. Pattern matching and legality are distinct, and a later pass may run without applying the dependent rewrite. The LLVM excerpt is a real reported example from Figure 1(b,c), with SSA names renamed and calls reflowed. It is not an Ascend finding, and the schematic is not asserted as that case's diagnosed cause. The instruction counts describe the excerpt, not measured runtime speedups. The paper's method is introduced later in the talk.

**Source basis:** LPO §2.2 / Figure 1(b,c), https://arxiv.org/abs/2508.16125v2. Detailed attribution and conditions remain in speaker notes.

### 02 — [REWORK] How optimization opportunities reach engineers today

**On-slide structure:** A current-practice table recognizes optimization epics as proactive exploration usually prompted by an observed gap. The remaining gap concerns routine discovery before a problem is noticed.

Current practices come from the project owner’s observations. Nightly testing helps prevent significant regressions reaching upstream. Optimization epics can proactively explore an optimization class, usually after a performance problem has already been noticed. The intended gap is routine discovery before a problem is noticed, not an assertion that the team never works proactively. The role of cross-platform comparisons in task selection remains uncertain.

**Source basis:** Current practices and uncertainties

### 03 — Routine discovery needs a repeatable investigation process

**On-slide structure:** Repeated investigation steps and the concrete IR, execution and comparison context required at each step.

The intended gap is a routine search over existing compiled code before a problem triggers a regression investigation, kernel task or optimization epic. These activities currently require choosing transformations, assembling checks and retaining evidence. The project hypothesis concerns how much of that repeated work can be offloaded.

**Source basis:** Goal and intended value; Current practices; Framework design §4

### 04 — Build a framework for reproducible optimization discovery

**On-slide structure:** Kernel variants and permitted pipeline alternatives enter a bounded investigation and produce reproducible comparison experiments.

The proposed framework searches MLIR alternatives and permitted pass-pipeline alternatives. A trial may change the IR, the pipeline or both. The baseline is fixed and versioned. Selected checks and a meaningful metric determine whether the complete candidate route is useful. An IR witness can motivate a new pass without automatically implementing that pass. Root-cause investigation and pass implementation remain later engineer work.

**Source basis:** Goal and intended value; Framework design; Project-owner clarification, 2026-11-11

### 05 — Research directions and concrete starting points

**On-slide structure:** The agenda adds rewrite-only, pipeline-only and joint studies alongside the existing metrics, validation, harness, tool, selection and feedback studies.

The studies remain open. New pass-ordering work compares fixed-pipeline IR rewrites, existing-pass pipeline variants and their combinations. A shared experiment format and continuation across environments are implementation requirements, with exact schemas and compatible execution bindings to design. Advanced selectors, richer context, tools and feedback policies remain comparisons after the baseline.

**Source basis:** Framework research agenda; experiment records and continuation design; Project-owner clarification, 2026-11-11

### 06 — Two paper workflows inform the experiment

**On-slide structure:** The exact full paper titles accompany editable reconstructions of LPO Figure 2 and PRAGMA Figures 1–2, with labeled feedback and paper-specific tools.

The top workflow is reconstructed from LPO Figure 2 and §3.2–3.3. Its extractor wraps dependent sequences, reoptimizes and deduplicates. opt -O3 preprocesses candidates; interestingness screens before Alive2 refinement checking. The lower workflow is reconstructed from PRAGMA Figures 1–2 and §III. A deterministic verifier compares outputs; a profiler gathers counters; the conductor reasons over code, logs, metric documentation and best history. The Ascend baseline can use one session; these papers motivate responsibilities and feedback signals.

**Source basis:** LPO Figure 2 and §3.2–3.3: https://arxiv.org/abs/2508.16125v2; PRAGMA Figures 1–2 and §III: https://arxiv.org/abs/2511.06345v2

### 07 — Proposed Ascend investigation architecture

**On-slide structure:** A fixed baseline kernel/pipeline bypasses generation. The agent proposes scoped kernel/pipeline alternatives; adapters check and assess them, retaining trials, reports and pending work.

Framework design defines stage contracts and a default search policy. Read-only input snapshots remain distinct from candidate working copies. A single agent session proposes candidate IR and permitted pipeline changes. Adapters compile the fixed baseline route and each candidate route through saved recipes. Candidate kernels and pipeline variants have separate identities. Typed feedback returns independent outcomes and evidence pointers to the same conversation. The durable store records intent and completion plus budget usage at every stage.

**Source basis:** Framework design §§2.1–2.6; MVP dialect knowledge task

### 08 — Search combines kernel variants and pass pipelines

**On-slide structure:** An editable two-input diagram joins kernel and pipeline variants into trials. The comparison table separates fixed baseline, ordering-only, rewrite-only and combined effects.

Treat the baseline kernel and pipeline as the fixed control. Candidate dimensions include kernel/IR rewrites, permitted existing-pass sequences/options and case configurations. This diagram is illustrative and does not claim the named relative order improves Ascend. Pass dependencies, nesting, analysis invalidation and available pipeline entry points must be checked. The product of dimensions defines the search space, not a requirement to enumerate it exhaustively.

**Source basis:** Project-owner clarification, 2026-11-11; MLIR pass pipelines and analysis management: https://mlir.llvm.org/docs/PassManagement/

### 09 — Candidate transformations and applicability conditions

**On-slide structure:** Value ranges and precision through casts, predicates, cross-pass memory/UB concerns, vectorization, reduction, layout and explicit pass-ordering opportunities.

The arithmetic family focuses on tracking ranges and precision through casts, rather than only removing a clamp. Memory-access rewrites may require cross-pass reasoning about bounds, alignment, definedness and lowering assumptions. Keep these as a later/high-complexity study until the selected checking route covers them; this is not a commitment to a general UB planner. Pass placement and ordering are an explicit family alongside direct IR rewrites. The paper examples motivate cases but do not establish Ascend defects.

**Source basis:** Candidate optimization families; project-owner clarification, 2026-11-11; LPO §4.3: https://arxiv.org/abs/2508.16125v2; PRAGMA §IV-D: https://arxiv.org/abs/2511.06345v2; LLVM definedness and loads: https://llvm.org/docs/UndefinedBehavior.html https://llvm.org/docs/LangRef.html#load-instruction

### 10 — MLIR case — redundant NaN handling

**On-slide structure:** Original and rewritten MLIR, highlighted removed operations and NaN/ordinary-value reasoning.

This is an illustrative MLIR adaptation of LPO Figure 4(c)/(f). It assumes that the shown equality is the observed result, and that no other use requires retaining the sanitizing value. For NaN, the original selects zero and compares it with one; the candidate ordered equality is also false. For ordinary values both compare x with one. The arith rewrite and subsequent Ascend output have not been exercised locally.

**Source basis:** LPO §4.3 / Fig. 4(c,f): https://arxiv.org/abs/2508.16125v2; Candidate optimization families

### 11 — Request resolution and dialect knowledge delivery

**On-slide structure:** Request fields include permitted pipeline variants alongside the input, policy, metric and limits. Dialect references remain a required information-delivery task.

The input and configuration fields are based on Framework design §2.1. The YAML-like view is an interface illustration, with profile names awaiting selection. The baseline pipeline and permitted candidate pipeline space are explicit. The concrete dialect support task is part of MVP. Provide versioned authoritative operation/type/attribute semantics and representative examples as context or readable files. Capture information actually supplied or retrieved and report unknown semantics. Agent context study evaluates richer instruction and retrieval methods; Agent tools study evaluates tools and editing restrictions.

**Source basis:** Framework design §§2.1–2.3; Agent context study; Agent tools study; MVP dialect knowledge task

### 12 — Agent context research: public harness starting points

**On-slide structure:** Five public harness references and the specific prompt/context mechanisms to study, followed by a controlled comparison plan.

Inspect published prompts and message-assembly mechanisms, rather than assuming access to complete proprietary system prompts. The Codex guide is a model-specific published example, Claude Code documents custom subagent instructions, and OpenCode documents configurable agents. SQL agents and PaperQA provide specialist examples for retrieval and evidence handling. These are study references, not a decision to adopt a product or multi-agent topology. Pin source versions before comparative experiments.

**Source basis:** Codex: https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide; Claude Code: https://code.claude.com/docs/en/sub-agents; OpenCode: https://opencode.ai/docs/agents/; LangChain SQL agent: https://docs.langchain.com/oss/python/langchain/sql-agent; PaperQA prompts: https://github.com/Future-House/paper-qa/blob/main/src/paperqa/prompts.py

### 13 — Compilation checkpoints determine route compatibility

**On-slide structure:** Each baseline/candidate route records its pipeline, input/check/metric checkpoints and hard stops. A deliberately different pass order is an experiment variable.

This is an illustrative route diagram, not a claim that Ascend accepts the depicted checkpoints. Compilation and validation study must establish input state restoration, prerequisite passes and exact output boundaries. A metric observation may occur earlier than the artifact consumed by execution validation. An explicit stop before the required lowering makes that runtime policy incompatible. Record the exact compiler version, pass sequence/options, metadata, target and required resources for each demonstrated route. A pipeline candidate may differ intentionally from the baseline, while preserving agreed comparison conditions.

**Source basis:** Framework design §2.4; Compilation and validation study; Metrics study

### 14 — Validation research: LLVM and MLIR starting points

**On-slide structure:** MLIR verification, Alive2, MLIR-TV, xdsl-smt and execution comparison, with their different inputs, evidence and open coverage questions.

The tools below offer different kinds of evidence and are not interchangeable. MLIR verification checks IR invariants. Alive2 checks LLVM refinement. MLIR-TV and xdsl-smt supply semantic checking for supported MLIR/xDSL subsets. Their exact operation, control-flow, memory and floating-point coverage must be probed before use. Translating custom Ascend operations into a supported representation creates an additional semantic obligation. Execution compares only the selected observable results on recorded cases.

**Source basis:** MLIR tool: https://mlir.llvm.org/docs/Tutorials/MlirOpt/; Alive2: https://github.com/AliveToolkit/alive2; MLIR-TV: https://github.com/aqjune/mlir-tv; xdsl-smt: https://github.com/opencompl/xdsl-smt; Framework compilation and validation contract

### 15 — Metric research: concrete indicators and tools

**On-slide structure:** Operation counts, logical memory estimates, LLVM target cost estimates and Ascend profiling, with resource needs and interpretation limits.

Structural counts and logical-memory estimates are cheap screening candidates. MLIR print-op-stats provides operation counts, not a performance guarantee. LLVM TargetTransformInfo exposes target-dependent IR costs; llvm-mca estimates supported CPU assembly using scheduling models. Neither establishes an Ascend NPU model. Ascend documentation describes msProf / msprof op for operator profiling. Its local availability, permissions, artifacts and relevant counters must still be checked. Compare indicator rankings against later code or execution when feasible.

**Source basis:** MLIR op statistics: https://mlir.llvm.org/docs/Passes/#-print-op-stats; LLVM TargetTransformInfo: https://llvm.org/doxygen/classllvm_1_1TargetTransformInfo.html; llvm-mca: https://www.llvm.org/docs/CommandGuide/llvm-mca.html; Ascend msProf: https://www.hiascend.com/doc_center/source/en/CANNCommunityEdition/850/devaids/optool/atlasopdev_16_0082.html; LPO interestingness: https://arxiv.org/abs/2508.16125v2

### 16 — A common experiment format joins variants and evidence

**On-slide structure:** Kernel, pipeline and case IDs join into a trial. Versioned records link per-environment executions, evidence and LLM-produced reports through stable identities.

The proposed storage contract covers whole investigations, not only successful findings. Kernel variants, pipeline variants and workload/configuration cases have stable IDs. A trial joins these with the compiler, checking policy and evaluator recipe. Each execution links its actual environment identity; changed trial semantics create a new linked trial rather than mutating old evidence. Typed check results, raw metric samples, usage, messages, tool outputs and agent-produced reports link to the exact trial. Proposed JSON/JSONL filenames illustrate the format; schema details and version migration remain design work. Private model reasoning is not an assumed artifact.

**Source basis:** Proposed experiment records and continuation design; Framework design persistence / replay contracts

### 17 — Feedback, stopping rules and crash recovery

**On-slide structure:** Typed feedback outcomes and durable operations with restart reconciliation and retained budgets.

The default is same-session feedback, each candidate kernel/pipeline combination compared to the fixed baseline, stopping at the first qualifying result or a resource limit. Infrastructure retry is separate from candidate repair. Before each operation, persist intent and reserve budget. Retain complete evidence before marking completion. On restart, reuse completed applicable work and reconcile uncertain external jobs by identifiers or retrievable outputs. Preserve already spent budget and best eligible results. Exact model-response replay is unnecessary.

**Source basis:** Framework design §2.5; Agent context study

### 18 — The finding is a replayable experiment

**On-slide structure:** The finding bundle points back to its trial and saved baseline/candidate recipes, preserving variant, pipeline and report provenance.

Initial comparison and replay use the same versioned execution recipe. A finding links to the experiment, trial, kernel variants, pipeline variants, results and agent reports that produced it. The saved bundle includes code, case material, manifest and environment bindings. A finding replay repeats a saved comparison independently of the generating worker. Resuming an ongoing experiment in another environment additionally restores pending work and the agent context. Replay produces new evidence and preserves original observations. Interrupted export can be regenerated from durable records. The command shown is a proposed interface.

**Source basis:** Framework design §§2.4 and 2.6; Evaluation protocol

### 19 — Continue the same experiment in another environment

**On-slide structure:** A portable experiment record moves from host preparation to an NPU environment. Binding resolution, progress/agent recovery, reuse decisions and new paired measurements are explicit.

Experiment continuation is distinct from replaying a completed finding. A host environment may prepare variants or perform cheap checks, while an NPU lab resolves compatible tool/runtime/data bindings and continues pending work. The portable record includes artifacts, operation state, budget usage and model-visible context/reports. Restore a harness session if supported; otherwise reconstruct it. Reuse only compatible completed operations and append new environment-specific results. Changed hardware or measurement conditions require a new paired baseline/candidate measurement. This is a proposed capability, not an implemented scheduler.

**Source basis:** Proposed experiment records and continuation design; Framework design recovery contract

### 20 — Constraints resolve into an explicit experiment profile

**On-slide structure:** IR edit scope and allowed pass changes are separate controls. The baseline remains fixed; invalid prerequisites and unsupported continuation remain visible.

Request resolution must establish a jointly supported route before search. The profile records scope, numeric assumptions, evidence requirements and budgets. Agent-proposed assumptions remain unresolved until established by checking or review. Compiler, pipeline, artifact, policy, input and environment identities determine reuse. Different hardware or measurement settings invalidate direct reuse of timing evidence.

**Source basis:** Framework design §§2.1 and 2.4; Metrics study; Compilation and validation study

### 21 — MVP scope and implementation stages

**On-slide structure:** The staged plan includes common variant/trial/report records and continuation of pending work across environments. Pass search is bounded by demonstrated integration.

The MVP target remains month 4 in a six-month horizon, assuming one developer, part-time compiler support and required environment access. The baseline includes dialect knowledge, common experiment records, durable state, relocation of pending work and finding replay. Pass-order exploration uses a bounded supported set after pipeline feasibility checks; no general pass synthesizer or UB planner is promised. Month 5 evaluates it. Month 6 selects one refinement supported by those observations.

**Source basis:** Resource outline; Implementation stages; MVP dialect knowledge task; implementation backlog

### 22 — Primary risks concern finding yield and integration effort

**On-slide structure:** Finding yield and integration effort as primary risks, alongside expert effort and evidence quality.

Risk assessment orders the risks by severity and puts useful finding yield first, integration costs second. Their probability remains unknown. Expert-effort savings and evidence quality are additional concerns considered manageable by the project owner, with provisional assessments.

**Source basis:** Risk assessment; Evaluation protocol

### 23 — Evaluation protocol and controlled refinement studies

**On-slide structure:** The protocol tests useful findings, replay and cross-environment continuation while preserving provenance and rerunning incompatible measurements.

The proposed MVP target is at least one real replayable finding worth engineer investigation. Main evaluation uses representative held-out cases, separate from development. Agree usefulness criteria, limits and repeat counts in advance. Report every kernel/pipeline/case trial, including duplicates, rejected, unsupported and inconclusive outcomes. Test that a checkpointed ongoing experiment can resume in a second declared environment, preserving completed compatible work, reports, budgets and unresolved operations. Controlled refinement studies change one component while keeping cases, model, checks, objective and relevant budgets comparable. A comparable engineer workflow is needed to claim expert-effort saving.

**Source basis:** Evaluation protocol; research backlog planned comparison studies

## Primary references for the starting points

**Checked 2026-11-11.** These checks identify public materials and narrow capabilities. They do not establish suitability for AscendNPU-IR. Pin documentation versions or repository commits before detailed comparisons.

| Reference | Public starting point and boundary |
| --- | --- |
| [MLIR canonicalization](https://mlir.llvm.org/docs/Canonicalization/) | Documents greedy, best-effort pattern application and configured rewrite/iteration limits. Its configured greedy behavior is an implementation reference, not an impossibility claim about matching engines. |
| [Codex Prompting Guide](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide) | Published model-specific prompt and harness guidance. It does not expose the complete current desktop prompt. |
| [Claude Code custom subagents](https://code.claude.com/docs/en/sub-agents) | Custom role instructions and configurable tool access. This is a public customization surface, not the entire main-agent prompt. |
| [OpenCode agents](https://opencode.ai/docs/agents/) | Configurable agent prompts and permissions. Inspect actual message assembly during the study. |
| [LangChain SQL agent](https://docs.langchain.com/oss/python/langchain/sql-agent) | Domain retrieval and correction workflow using database schemas and engine errors. |
| [PaperQA prompts](https://github.com/Future-House/paper-qa/blob/main/src/paperqa/prompts.py) | Public evidence extraction and synthesis templates. The prompt module alone does not describe the entire runtime. |
| [Alive2](https://github.com/AliveToolkit/alive2) | LLVM refinement checking. Check supported features and boundedness assumptions. A custom-dialect-to-LLVM route needs its own justification. |
| [MLIR-TV](https://github.com/aqjune/mlir-tv) | SMT-based translation validation focused on MLIR for machine learning. Probe the exact operations and semantics required by selected cases. |
| [xdsl-smt](https://github.com/opencompl/xdsl-smt) | Partial lowerings and translation-validation tooling for supported arith/comb/func programs. Ascend semantics are not supplied automatically. |
| [MLIR tool](https://mlir.llvm.org/docs/Tutorials/MlirOpt/) and [operation statistics](https://mlir.llvm.org/docs/Passes/#-print-op-stats) | IR/pass tooling and operation counts. Structural validity and fewer operations do not establish preserved behavior or faster execution. |
| [LLVM TargetTransformInfo](https://llvm.org/doxygen/classllvm_1_1TargetTransformInfo.html) | Target-dependent IR cost interfaces. Relevant backend coverage must be established. |
| [llvm-mca](https://www.llvm.org/docs/CommandGuide/llvm-mca.html) | Static CPU machine-code estimates using supported scheduling models. This is not an established Ascend NPU evaluator. |
| [Ascend msProf / msprof op](https://www.hiascend.com/doc_center/source/en/CANNCommunityEdition/850/devaids/optool/atlasopdev_16_0082.html) | Official operator-profiling starting point. Local tool availability, required artifacts, permissions and relevant measurements remain untested. |

Additional references for the pipeline/definedness discussion:

- [MLIR pass infrastructure](https://mlir.llvm.org/docs/PassManagement/): pass nesting, textual pipelines, analysis management and failure handling.
- [LLVM UB manual](https://llvm.org/docs/UndefinedBehavior.html) and [load semantics](https://llvm.org/docs/LangRef.html#load-instruction): reference conditions for speculation, definedness and access/alignment. These are not assumed to be Ascend-dialect semantics.
- [Proposed experiment contract](../../framework/planning/experiment-contract.md): common format, pipeline combinations, environment continuation and implementation follow-ups.

## Source index

- [Goal and intended value](../../questions/H01%20-%20What%20are%20we%20trying%20to%20do.md)
- [Current practices and uncertainties](../../questions/H02%20-%20How%20is%20it%20done%20today.md)
- [Proposed framework and research agenda](../../questions/H03%20-%20What%20is%20new%20in%20our%20approach.md)
- [Risks](../../questions/H05%20-%20What%20are%20the%20risks.md)
- [Resource outline](../../questions/H06%20-%20How%20much%20will%20it%20cost.md)
- [Implementation stages](../../questions/H07%20-%20How%20long%20will%20it%20take.md)
- [Evaluation](../../questions/H08%20-%20How%20will%20we%20check%20success.md)
- [Candidate optimization families and complete MLIR illustration](../../research/Candidate%20optimization%20families.md)
- [Engineering backlog](../../framework/planning/backlog.md)
- [LPO reading record](../../papers/LPO.md), [stored PDF](../../attachments/papers/LPO-2508.16125v2.pdf), [paper](https://arxiv.org/abs/2508.16125v2): *LPO: Discovering Missed Peephole Optimizations with Large Language Models*. Motivation: introduction. Workflow: Figure 2 / §§3.2–3.3. Examples: Figure 4 / §4.3.
- [PRAGMA reading record](../../papers/PRAGMA.md), [stored PDF](../../attachments/papers/PRAGMA-2511.06345v2.pdf), [paper](https://arxiv.org/abs/2511.06345v2): *PRAGMA: A Profiling-Reasoned Multi-Agent Framework for Automatic Kernel Optimization*. Workflow: Figures 1–2 / §III. Kernel examples: §IV-D.

Speaker notes retain references and evidence limits per slide. The PDF is exported from the finalized editable PPTX. See [authoring instructions](authoring/README.md) for rebuilding.
