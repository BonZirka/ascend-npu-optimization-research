# Ascend Optimization Finder — technical presentation

**Status:** revised draft for technical expert review. 20 editable slides, 16:9, English. The original 12-slide draft is preserved.

[Editable PowerPoint](ascend-optimization-technical.pptx) · [PDF exported from the PowerPoint](ascend-optimization-technical.pdf) · [Authoring source](authoring/technical-deck.mjs)

The problem-first sequence remains. The opening now states that existing compiler optimizations are incomplete. The current-practice slide recognizes proactive work within optimization epics, usually after a performance gap has been noticed. The proposed addition is routine discovery before a problem triggers that work. This qualification follows the project owner's clarification on 2026-11-11.

The architecture is proposed. Compiler entry points, continuation routes, checker coverage, useful metrics and finding yield remain to be established. Named tools and harnesses are concrete research starting points, not selected or demonstrated Ascend integrations. The MLIR rewrite remains a paper-derived illustration. Presentation text names research subjects directly and omits internal question identifiers.

## Visual sources

Slide 6 uses the papers' exact full titles as editable text and redraws **LPO Figure 2** and **PRAGMA Figures 1–2** with native shapes and connectors. Their extraction/checking and role/feedback structures inform our architecture, route, feedback and replay diagrams. Alive2 and llvm-mca retain their LLVM/CPU reference scope. PRAGMA's NCU/perf references retain their GPU/CPU scope.

The MLIR example adapts LPO Figure 4(c,f). The candidate-family table separates paper-motivated transformations from the additional layout-conversion hypothesis. All text, code, tables and diagrams remain editable.

## Research agenda

| Study | Initial examples and comparison |
| --- | --- |
| [Improvement metrics](../../questions/Q06%20-%20Metrics%20for%20assessing%20LLVM%20IR%20and%20MLIR%20improvements.md) | MLIR operation counts, logical access/byte estimates, LLVM TTI, llvm-mca and Ascend msProf. Investigate coverage, downstream survival, relevance and collection cost. |
| [Compilation and validation routes](../../questions/Q08%20-%20Compilation%20continuation%20and%20validation%20routes.md) | MLIR verification, Alive2, MLIR-TV, xdsl-smt and execution comparison. Investigate jointly supported checkpoints, artifact requirements and semantic coverage. |
| [Agent instructions and context](../../questions/Q09%20-%20Agent%20prompt%20construction%20and%20information%20delivery.md) | Public Codex, Claude Code and OpenCode materials, LangChain SQL-agent workflow and PaperQA prompts. Study assembly, retrieval, diagnostics and evidence handling. |
| [Agent tools and editing constraints](../../questions/Q10%20-%20Agent%20tools%20and%20editing%20constraints.md) | File editing and compiler diagnostics as baseline. Compare an operation-aware editor, restricted edits or additional checking tools. |
| [Discovery and classifiers](../../questions/Q07%20-%20Initial%20classifiers%20and%20code%20classification%20scheme.md) | Supplied range as baseline. Investigate prompted selection, use-def/effect scans and available cost/profile estimates. |
| [Feedback and evaluation](../../framework/planning/research-backlog.md) | LPO diagnostics/counterexamples and PRAGMA profiling/history as references. Compare feedback content and search policy under controlled budgets. |

The MVP does not require completing every comparison. It exercises one route, checking policy and evaluator with supplied input, versioned dialect context, durable state and reproducible finding export/replay.

## Slide guide

### 01 — Existing compilers miss useful optimizations

**On-slide structure:** Three reasons compilers miss transformations: incomplete rewrite coverage, conservative decisions and pipeline interactions. A missed case is defined against a specific pipeline and target.

Even mature production compilers miss beneficial transformations. LPO motivates this through incomplete coverage of instruction patterns and continuing optimizer development. Conservative legality/cost decisions and pipeline interactions are additional general mechanisms to investigate, not established Ascend defects. A missed case may require a new optimization, a generalized pattern or a change to when an existing transformation fires.

**Source basis:** LPO introduction: https://arxiv.org/abs/2508.16125v2; MLIR canonicalization design: https://mlir.llvm.org/docs/Canonicalization/

### 02 — [REWORK] How optimization opportunities reach engineers today

**On-slide structure:** A current-practice table recognizes optimization epics as proactive exploration usually prompted by an observed gap. The remaining gap concerns routine discovery before a problem is noticed.

Current practices come from the project owner’s observations. Nightly testing helps prevent significant regressions reaching upstream. Optimization epics can proactively explore an optimization class, usually after a performance problem has already been noticed. The intended gap is routine discovery before a problem is noticed, not an assertion that the team never works proactively. The role of cross-platform comparisons in task selection remains uncertain.

**Source basis:** Current practices and uncertainties

### 03 — Routine discovery needs a repeatable investigation process

**On-slide structure:** Repeated investigation steps and the concrete IR, execution and comparison context required at each step.

The intended gap is a routine search over existing compiled code before a problem triggers a regression investigation, kernel task or optimization epic. These activities currently require choosing transformations, assembling checks and retaining evidence. The project hypothesis concerns how much of that repeated work can be offloaded.

**Source basis:** Goal and intended value; Current practices; Framework design §4

### 04 — Build a framework for reproducible optimization discovery

**On-slide structure:** Supplied code and resolved configuration enter a bounded investigation and leave as a runnable experiment.

The framework uses an LLM to propose MLIR alternatives and coordinates compilation, selected checks and metric comparison. The same target supplies the original and candidate references. A finding identifies what might be improved. Root-cause analysis and optimization-pass implementation can follow engineer review.

**Source basis:** Goal and intended value; Framework design §1

### 05 — Research directions and concrete starting points

**On-slide structure:** A research matrix names concrete harnesses, checkers, metrics and selection mechanisms, with comparisons and retained evidence.

These are starting points for open studies, not adopted integrations or completed experiments. Compiler/checker compatibility and a meaningful evaluator are required baseline work. Richer harnesses, tools, selectors and feedback policies are comparisons after a baseline. Keep cases, model, selected checking policy and resource budgets comparable. The named references have different input and semantic coverage.

**Source basis:** Framework research agenda and research backlog; Public harness, validation and metric references in the following technical slides

### 06 — Two paper workflows inform the experiment

**On-slide structure:** The exact full paper titles accompany editable reconstructions of LPO Figure 2 and PRAGMA Figures 1–2, with labeled feedback and paper-specific tools.

The top workflow is reconstructed from LPO Figure 2 and §3.2–3.3. Its extractor wraps dependent sequences, reoptimizes and deduplicates. opt -O3 preprocesses candidates; interestingness screens before Alive2 refinement checking. The lower workflow is reconstructed from PRAGMA Figures 1–2 and §III. A deterministic verifier compares outputs; a profiler gathers counters; the conductor reasons over code, logs, metric documentation and best history. The Ascend baseline can use one session; these papers motivate responsibilities and feedback signals.

**Source basis:** LPO Figure 2 and §3.2–3.3: https://arxiv.org/abs/2508.16125v2; PRAGMA Figures 1–2 and §III: https://arxiv.org/abs/2511.06345v2

### 07 — Proposed Ascend investigation architecture

**On-slide structure:** Prepared-case, agent-session and adapter boundaries, including immutable baseline, independent checking/evaluation and durable feedback.

Framework design defines stage contracts and a default search policy. Read-only input snapshots remain distinct from candidate working copies. A single agent session edits the copy. The adapters compile and assess original/candidate artifacts through a saved recipe. Typed feedback returns independent outcomes and evidence pointers to the same conversation. The durable store records intent and completion plus budget usage at every stage.

**Source basis:** Framework design §§2.1–2.6; MVP dialect knowledge task

### 08 — Candidate transformations and applicability conditions

**On-slide structure:** Six transformation families paired with semantic applicability conditions.

LPO provides LLVM clamp, memory and floating-point examples. PRAGMA supplies kernel vectorization and reduction-tuning examples. The layout-conversion family is a project candidate. These establish search families to investigate in MLIR. Exact Ascend support and benefit must be checked at the selected checkpoint and after continuation.

**Source basis:** Candidate optimization families; LPO §4.3 https://arxiv.org/abs/2508.16125v2; PRAGMA §IV-D https://arxiv.org/abs/2511.06345v2

### 09 — MLIR case — redundant NaN handling

**On-slide structure:** Original and rewritten MLIR, highlighted removed operations and NaN/ordinary-value reasoning.

This is an illustrative MLIR adaptation of LPO Figure 4(c)/(f). It assumes that the shown equality is the observed result, and that no other use requires retaining the sanitizing value. For NaN, the original selects zero and compares it with one; the candidate ordered equality is also false. For ordinary values both compare x with one. The arith rewrite and subsequent Ascend output have not been exercised locally.

**Source basis:** LPO §4.3 / Fig. 4(c,f): https://arxiv.org/abs/2508.16125v2; Candidate optimization families

### 10 — Request resolution and dialect knowledge delivery

**On-slide structure:** Illustrative request fields and precedence beside dialect-reference preparation and delivery.

The input and configuration fields are based on Framework design §2.1. The YAML-like view is an interface illustration, with profile names awaiting selection. The concrete dialect support task is part of MVP. Provide versioned authoritative operation/type/attribute semantics and representative examples as context or readable files. Capture information actually supplied or retrieved and report unknown semantics. Agent context study evaluates richer instruction and retrieval methods; Agent tools study evaluates tools and editing restrictions.

**Source basis:** Framework design §§2.1–2.3; Agent context study; Agent tools study; MVP dialect knowledge task

### 11 — Agent context research: public harness starting points

**On-slide structure:** Five public harness references and the specific prompt/context mechanisms to study, followed by a controlled comparison plan.

Inspect published prompts and message-assembly mechanisms, rather than assuming access to complete proprietary system prompts. The Codex guide is a model-specific published example, Claude Code documents custom subagent instructions, and OpenCode documents configurable agents. SQL agents and PaperQA provide specialist examples for retrieval and evidence handling. These are study references, not a decision to adopt a product or multi-agent topology. Pin source versions before comparative experiments.

**Source basis:** Codex: https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide; Claude Code: https://code.claude.com/docs/en/sub-agents; OpenCode: https://opencode.ai/docs/agents/; LangChain SQL agent: https://docs.langchain.com/oss/python/langchain/sql-agent; PaperQA prompts: https://github.com/Future-House/paper-qa/blob/main/src/paperqa/prompts.py

### 12 — Compilation checkpoints determine route compatibility

**On-slide structure:** Input and metric checkpoints branch to a static evaluator and further compilation for runtime validation. An optional hard stop can make the route incompatible.

This is an illustrative route diagram, not a claim that Ascend accepts the depicted checkpoints. Compilation and validation study must establish input state restoration, prerequisite passes and exact output boundaries. A metric observation may occur earlier than the artifact consumed by execution validation. An explicit stop before the required lowering makes that runtime policy incompatible. Record the exact compiler version, pipeline, metadata, target and required resources for each demonstrated route.

**Source basis:** Framework design §2.4; Compilation and validation study; Metrics study

### 13 — Validation research: LLVM and MLIR starting points

**On-slide structure:** MLIR verification, Alive2, MLIR-TV, xdsl-smt and execution comparison, with their different inputs, evidence and open coverage questions.

The tools below offer different kinds of evidence and are not interchangeable. MLIR verification checks IR invariants. Alive2 checks LLVM refinement. MLIR-TV and xdsl-smt supply semantic checking for supported MLIR/xDSL subsets. Their exact operation, control-flow, memory and floating-point coverage must be probed before use. Translating custom Ascend operations into a supported representation creates an additional semantic obligation. Execution compares only the selected observable results on recorded cases.

**Source basis:** MLIR tool: https://mlir.llvm.org/docs/Tutorials/MlirOpt/; Alive2: https://github.com/AliveToolkit/alive2; MLIR-TV: https://github.com/aqjune/mlir-tv; xdsl-smt: https://github.com/opencompl/xdsl-smt; Framework compilation and validation contract

### 14 — Metric research: concrete indicators and tools

**On-slide structure:** Operation counts, logical memory estimates, LLVM target cost estimates and Ascend profiling, with resource needs and interpretation limits.

Structural counts and logical-memory estimates are cheap screening candidates. MLIR print-op-stats provides operation counts, not a performance guarantee. LLVM TargetTransformInfo exposes target-dependent IR costs; llvm-mca estimates supported CPU assembly using scheduling models. Neither establishes an Ascend NPU model. Ascend documentation describes msProf / msprof op for operator profiling. Its local availability, permissions, artifacts and relevant counters must still be checked. Compare indicator rankings against later code or execution when feasible.

**Source basis:** MLIR op statistics: https://mlir.llvm.org/docs/Passes/#-print-op-stats; LLVM TargetTransformInfo: https://llvm.org/doxygen/classllvm_1_1TargetTransformInfo.html; llvm-mca: https://www.llvm.org/docs/CommandGuide/llvm-mca.html; Ascend msProf: https://www.hiascend.com/doc_center/source/en/CANNCommunityEdition/850/devaids/optool/atlasopdev_16_0082.html; LPO interestingness: https://arxiv.org/abs/2508.16125v2

### 15 — Feedback, stopping rules and crash recovery

**On-slide structure:** Typed feedback outcomes and durable operations with restart reconciliation and retained budgets.

The default is same-session feedback, each candidate compared to the unchanged original, stopping at the first qualifying result or a resource limit. Infrastructure retry is separate from candidate repair. Before each operation, persist intent and reserve budget. Retain complete evidence before marking completion. On restart, reuse completed applicable work and reconcile uncertain external jobs by identifiers or retrievable outputs. Preserve already spent budget and best eligible results. Exact model-response replay is unnecessary.

**Source basis:** Framework design §2.5; Agent context study

### 16 — The finding is a replayable experiment

**On-slide structure:** Proposed bundle layout, shared execution recipe and relocated replay, preserving original observations.

Initial comparison and replay use the same versioned execution recipe. The saved bundle includes code, case material, manifest and environment bindings. A relocated bundle should run independently of the generating worker and live agent session. Replay produces new evidence and preserves original observations. Interrupted export can be regenerated from durable records. The command shown is a proposed interface.

**Source basis:** Framework design §§2.4 and 2.6; Evaluation protocol

### 17 — Constraints resolve into an explicit experiment profile

**On-slide structure:** Resolved experiment constraints and explicit failures or boundary handling.

Request resolution must establish a jointly supported route before search. The profile records scope, numeric assumptions, evidence requirements and budgets. Agent-proposed assumptions remain unresolved until established by checking or review. The stored environment and compiler identities determine whether original results may be reused.

**Source basis:** Framework design §§2.1 and 2.4; Metrics study; Compilation and validation study

### 18 — MVP scope and implementation stages

**On-slide structure:** Focused MVP and six-month stages, including dialect knowledge, recovery and replay.

The MVP target remains month 4 in a six-month horizon, assuming one developer, part-time compiler support and required environment access. The baseline includes dialect knowledge delivery, durable state and replay. Month 5 evaluates it. Month 6 selects one refinement supported by those observations.

**Source basis:** Resource outline; Implementation stages; MVP dialect knowledge task; implementation backlog

### 19 — Primary risks concern finding yield and integration effort

**On-slide structure:** Finding yield and integration effort as primary risks, alongside expert effort and evidence quality.

Risk assessment orders the risks by severity and puts useful finding yield first, integration costs second. Their probability remains unknown. Expert-effort savings and evidence quality are additional concerns considered manageable by the project owner, with provisional assessments.

**Source basis:** Risk assessment; Evaluation protocol

### 20 — Evaluation protocol and controlled refinement studies

**On-slide structure:** Held-out baseline/refinement comparison and all-outcome/cost reporting.

The proposed MVP target is at least one real replayable finding worth engineer investigation. Main evaluation uses representative held-out cases, separate from development. Agree usefulness criteria, limits and repeat counts in advance. Report every attempted case including duplicates, rejected, unsupported and inconclusive outcomes. Controlled refinement studies change one component while keeping cases, model, checks, objective and relevant budgets comparable. A comparable engineer workflow is needed to claim expert-effort saving.

**Source basis:** Evaluation protocol; research backlog planned comparison studies

## Primary references for the starting points

**Checked 2026-11-11.** These checks identify public materials and narrow capabilities. They do not establish suitability for AscendNPU-IR. Pin documentation versions or repository commits before detailed comparisons.

| Reference | Public starting point and boundary |
| --- | --- |
| [MLIR canonicalization](https://mlir.llvm.org/docs/Canonicalization/) | Documents greedy, best-effort pattern application and configured rewrite/iteration limits. This supports the motivation that enabled compiler optimization does not imply complete rewrite coverage. |
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
