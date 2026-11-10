# What is new in our approach?

[[Pitch Presentation]]

**Status: working draft for review.** The sections separate the proposed capability, search flow, framework responsibilities, supporting evidence and open research agenda. The flow and responsibility split are proposals; unresolved design questions remain explicit.

## 1. Proposed contribution

We propose an **LLM-assisted framework for investigating potential missed optimizations in AscendNPU-IR**. It would generate alternatives for selected code, coordinate checks and improvement comparisons, and use their results as feedback for further search.

Compiler engineers could supply a kernel or IR fragment, specify a region to investigate, or ask the framework to identify promising regions in supplied code or a collection. Region discovery would support a configured default classifier set or a selected subset. Initial classifier coverage remains to be researched.

The intended demonstration is that useful, reproducible findings can be obtained with **less expert time and investigation effort**. A finding identifies **what could be improved** through the original code, an alternative, applicable conditions, correctness-check results and comparison evidence under the selected metric. Explaining why the compiler missed the opportunity can follow later. The resource benefit remains to be evaluated.

Possible later work:

- **Generating test cases:** a tentative, questionable extension for substantially later experiments.
- **Automatically writing or fixing optimization passes:** possible work for a separate agentic framework, requiring its own validation research. The initial contribution focuses on identifying opportunities.

## 2. Search mechanism

A proposed investigation follows the six steps below. Sections 2.1–2.3 describe the proposed input contract, context preparation and generation baseline. Section 2.4 defines the proposed compilation, validation and evaluation contracts, result combination and compatibility requirements; concrete Ascend routes remain to be established. Section 2.5 describes feedback, investigation history and recovery. Section 2.6 defines the runnable finding and replay requirements.

### 2.1 Provide the input

#### Input contract

An engineer submits an **investigation request** containing one or more code inputs, an investigation mode and a configuration. The same request structure supports a single kernel, an IR fragment and a collection of existing code.

Each code input identifies the original artifact and its representation, together with any enclosing code, dependencies and existing test or measurement material. The framework preserves a snapshot of the supplied artifacts. Selections, attempts and findings refer to that snapshot.

#### Investigation modes

The engineer selects one of three modes. A request can apply a common mode to all inputs, with explicit overrides for individual inputs.

| Mode | Required input | Framework task |
| --- | --- | --- |
| **Whole input** | A code artifact to investigate as a whole. | Generate alternatives within the supplied artifact. |
| **Specified range** | A code artifact and an explicitly selected range within it. | Generate alternatives within that range; retain the surrounding code as context. |
| **Discover regions** | One or more code artifacts and a classifier selection. | Run the selected classifiers, identify candidate regions and investigate them. |

A specified range identifies its artifact and start/end positions in the original snapshot. Its boundaries must select complete statements or IR operations; invalid or unsupported selections are reported before search. Code outside that range and separately attached context are read-only. A small fragment can therefore be investigated in full while its enclosing function or module remains available for reasoning and checking.

Discovery uses either the installation's configured default classifier set or an explicitly selected subset. The resolved selection is recorded. Whole-input and specified-range modes skip classifier-based discovery; the framework does not infer the mode from input size.

#### Configuration and supporting material

The request supplies the settings below directly or selects **named profiles** containing them. A profile is a reusable, versioned bundle of settings, such as a compilation pipeline or validation process. **Required** means present in the resolved configuration; the engineer does not need to repeat values already supplied by a profile.

##### Compilation and target

| Setting | What it specifies | Requirement |
| --- | --- | --- |
| Input representation | The code format or dialect and the IR checkpoint from which the supplied artifact originates. | Every input. |
| Compiler build | The compiler executable or integration entry point, with its build identifier or revision. | Every investigation. |
| Continuation pipeline | The pipeline to resume from the input checkpoint, its pass configuration, requested output checkpoints and any explicit stop-before/stop-after boundary. | Every investigation. |
| Build settings | Compiler flags, dependency paths and enclosing build context needed by that pipeline. | Required by the selected pipeline. |
| Target configuration | The architecture/device configuration and target-specific options used to compile both the original and alternatives. | Required by the selected pipeline or evaluator. |

##### Checking policy — validation process and acceptance rules

| Setting | What it specifies | Requirement |
| --- | --- | --- |
| Validation process | The process/runner to invoke, its ordered checks and check-specific parameters. Supported processes declare whether they perform compilation checks, execution-based checks or another correctness check. | Every investigation. |
| Reference and test material | The behavior reference—execution of the original or supplied expected results—and the harness, test inputs and assumptions required by the selected checks. | Required by the selected validation process. |
| Result comparison | Which outputs or observable results are compared, using exact equality or explicitly configured numerical tolerances. | Comparing execution results. |
| Execution environment | The execution runner, machine/device configuration and runtime settings used by the selected checks. | A check requires execution. |
| Acceptance conditions | Which checks must pass before a candidate has the requested validation evidence. A failed required check rejects the candidate; a timeout, unsupported check or inconclusive result leaves it unvalidated. | Every investigation. |

The checking policy selects and configures the validation process executed in **2.4 Check and compare**. Passing the selected checks records the evidence they provide; it does not imply a stronger correctness guarantee. A compilation-only policy and a policy requiring matching execution results therefore produce different evidence labels.

##### Improvement objective

| Setting | What it specifies | Requirement |
| --- | --- | --- |
| Evaluator | The metric or cost-model implementation, its parameters, the code stage it consumes and the quantity/unit it reports. | Every investigation. |
| Comparison baseline | The original artifact evaluated under the same compilation, target and evaluator settings as the alternative. Reusing recorded baseline results requires matching those settings and relevant inputs. | Every comparison. |
| Improvement criterion | Whether lower or higher values are better, and the minimum absolute or relative change required to retain an improvement claim. | Every investigation. |
| Measurement protocol | The execution workload, runner, warm-up count, repetition count and aggregation rule. A static evaluator instead uses its declared analysis inputs and parameters. | The objective uses runtime measurements. |

Validation and improvement are separate results: an alternative must satisfy the selected checking policy and the improvement criterion to be reported as a validated improvement under that policy. Static metrics do not by themselves establish a runtime speedup.

##### Generation setup

| Setting | What it specifies | Requirement |
| --- | --- | --- |
| Model backend | The model runner/provider and model identifier used to generate alternatives. | Every investigation. |
| Generation profile | The versioned prompt templates, feedback instructions and response format used by the generation stage. | Every investigation. |
| Model parameters | Backend-specific generation settings, including supported sampling parameters and response-length limits. Effective backend defaults are recorded where available. | Exposed by the selected backend. |

##### Search budget

| Setting | What it specifies | Requirement |
| --- | --- | --- |
| Candidate limit | Maximum number of generated alternatives per input, including candidates later rejected as invalid. | Every investigation. |
| Collection limit | An additional cap on the total candidates across the request. Per-input settings cannot override this shared cap. | Optional for collections. |
| Time limits | Request elapsed-time limit and timeouts for individual compilation, validation, evaluation and model operations. | Optional request limit; operation timeouts as required by the selected processes. |
| Resource limits | Additional caps on model calls/tokens or execution jobs, including accelerator runs where used. | Optional. |

When a budget is exhausted, the framework stops scheduling work that would exceed it and retains the evidence already collected.

##### Supporting material and configuration resolution

Code inputs reference supporting files explicitly: enclosing code and declarations, build dependencies, test harnesses, test inputs, expected outputs, baseline measurements and profiles. Each selected pipeline, validation process and evaluator declares which files and metadata it requires. A fragment is not assumed to be independently compilable or executable.

Installation defaults are overridden by request settings, which are overridden by per-input settings. Shared request limits remain upper bounds. The framework resolves profile versions and records the effective configuration before searching. Required settings without a configured default must be supplied explicitly. Missing conditional settings or material are reported when the selected process requires them.

#### Submission rules

- Validate artifact references, selected ranges, configuration compatibility and the presence of required supporting material before search.
- Report missing requirements or unsupported selections explicitly. Do not silently change the mode, target, objective or checking policy.
- Keep original inputs and the effective configuration linked to every attempt and resulting finding.

Step 2.1 establishes what the engineer supplies and authorizes. Step 2.2 prepares that material for reasoning, region discovery where requested, and checking.

#### MVP coverage

The input contract above defines the proposed interface. **MVP coverage is a separate choice:** which representations and checkpoints, classifiers, compilation routes, checks and metrics are implemented first. Each implementation declares its supported capabilities and required material. Research on those capabilities remains in [[questions/Q06 - Metrics for assessing LLVM IR and MLIR improvements|Q06]], [[questions/Q07 - Initial classifiers and code classification scheme|Q07]] and [[questions/Q08 - Compilation continuation and validation routes|Q08]].

### 2.2 Prepare the search context

Turn the accepted submission into one or more **search cases** containing the original code, its permitted editing scope, supplied context and requirements, and resolved configuration. These are the inputs to **2.3 Generate an alternative**.

#### 1. Establish the investigation region

| Mode | Preparation |
| --- | --- |
| Whole input | Use the supplied artifact as the editing scope. |
| Specified range | Resolve the supplied selection against the original snapshot and retain its enclosing context. |
| Discover regions | Run the selected discovery method; create cases for the returned regions and record the selection reason and any reported score. |

In discovery mode, prompted agent review can perform region selection: return locations in the original artifact and a reason for investigating each region, following the configured default or focused discovery instructions. This is one implementation of discovery; a classifier need not be a separate static-analysis component.

Selections remain tied to the original snapshot. Overlapping regions are recorded as separate cases, each retaining the original compilation context as its reference.

#### 2. Collect the supplied context and requirements

The preparation stage attaches the original region, its enclosing code and the relevant supporting material supplied with the request:

- Available declarations, type/shape metadata, constants, documentation and surrounding code.
- Target settings, the improvement objective and the selected checking policy.
- Engineer-supplied restrictions and assumptions, and explicit requirements of the selected compilation and validation routes.
- Complete artifacts and supporting files needed for later compilation and checking.

Record the source of attached information, such as supplied code, an engineer statement or an existing analysis result. **Static analysis is an optional source of additional information.** In the MVP, the supplied IR and metadata can form the complete initial context. The agent's subsequent interpretation of dependencies and effects belongs to 2.3.

#### 3. Assemble the prepared case

| Case entry | Material prepared for generation |
| --- | --- |
| Original code | Artifact snapshot and the locations of the investigation region. |
| Editing scope | Code eligible for replacement and the surrounding material that remains read-only. |
| Available context | Attached code, declarations, metadata and documentation, with their sources. |
| Supplied requirements | Restrictions and assumptions received from the engineer or selected compilation/checking configuration. |
| Resolved configuration | Target, objective, checking policy, generation profile and budget, with references to complete compilation and validation material. |
| Preparation record | Selection provenance, missing information and context limitations. |

This is the minimum handoff for the direct-review MVP. Case entries can reference the original IR and supplied material. Complete artifacts remain available for compilation and checking. If supplied material exceeds the model's context allowance, report that limitation rather than silently presenting an incomplete excerpt as complete context.

#### Further research and development

- [ ] **Information delivery — [[directions/D04 - Domain-specific agent instructions and context|D04]] / [[questions/Q09 - Agent prompt construction and information delivery|Q09]].** Compare context assembly in coding agents and specialist harnesses from any domain; use the results to propose useful information sources and delivery methods for IR review.
- [ ] Establish useful discovery instructions and code-category coverage for agent review; compare additional classifiers as they become available. See [[questions/Q07 - Initial classifiers and code classification scheme|Q07]].
- [ ] Investigate context selection and additional file access for larger inputs, including how the agent obtains missing declarations or surrounding code.
- [ ] Evaluate whether static analyses improve finding quality or reduce agent effort enough to justify their integration cost.

### 2.3 Generate an alternative

Use the prepared case to review the code and produce a rewrite expected to improve the selected metric while preserving the required behavior.

#### Generation task and permitted transformations

The agent may propose **arbitrary transformations within the permitted editing scope**, including changes to control flow. One candidate is a complete alternative for that scope and can contain several coordinated edits. Supplied restrictions and the required behavior continue to apply.

The search leaves the compiler-side explanation open. An existing optimization might have failed to apply, encountered a bug or been deliberately restricted. A candidate records a potential improvement; determining why the original compiler output differs belongs to subsequent investigation.

During review, the agent can examine:

| Information | What the agent examines |
| --- | --- |
| Inputs and externally used results | Referenced values, signatures, declarations and surrounding uses crossing the editing boundary. |
| Control flow and dependencies | Enclosing control flow and dependencies visible in the supplied code and context. |
| Observable effects | Relevant memory changes and other externally observable behavior that the replacement must preserve. |
| Potential improvements | Changes expected to improve the selected metric under the supplied restrictions. |

Agent-produced dependency and effect descriptions are recorded as interpretations. Additional assumptions remain proposed conditions to establish through subsequent checking or review. For example, a rewrite that relies on two buffers not overlapping must identify that requirement; proposing it does not establish that it holds for the original case.

#### MVP path: review and edit a working copy

The framework provides a working copy of the original file, the permitted editing scope, available context and resolved configuration. The prompt asks the agent to review the IR and edit that copy to produce a potentially better alternative. Surrounding material remains read-only where required by the case.

The baseline uses ordinary file reading and editing, the model's existing knowledge and supplied context. Whether that knowledge is sufficient for useful AscendNPU-IR rewrites is an experimental question. Additional domain-specific tools and constrained editors remain research topics.

Review and editing can happen in the same agent session. The logical steps do not require separate agents or model calls. Initial experiments can use IR and supplied context that fit within the selected model's context allowance. Generation operates within the configured candidate, time and resource limits, following the default search policy in section 2.5.

#### Candidate artifact and investigation record

| Item | What the framework retains |
| --- | --- |
| Candidate artifact | A snapshot of the file edited by the agent, associated with the original artifact and permitted editing scope. |
| Change record | A diff constructed and stored by the framework from the original and candidate versions. The agent operates through file edits. |
| Optional description | A brief account of the change, if produced; it is not required for candidate submission. |
| Agent working record | Agent-provided working notes, rationale, proposed assumptions and uncertainties, together with interaction history and tool calls/results made available by the selected harness. These are retained in the investigation record and need not be exposed in the initial user-facing report. |

The agent's expectation motivates a candidate. **2.4 Check and compare** produces the selected compilation, correctness-checking and improvement evidence. The handoff includes the original and candidate versions, the change record, resolved configuration and available notes or proposed conditions.

#### Further research and development

- [ ] **Prompt construction and information delivery — [[questions/Q09 - Agent prompt construction and information delivery|Q09]] / [[directions/D04 - Domain-specific agent instructions and context|D04]].** Compare public instruction text and context assembly to improve the initial prompt and supplied information.
- [ ] **Agent tools and editing constraints — [[questions/Q10 - Agent tools and editing constraints|Q10]] / [[directions/D05 - Agent tools and editing constraints|D05]].** Start by examining LPO's actual interaction and tool flow. Compare additional tools and restricted editing interfaces against the ordinary-file-editing baseline.

### 2.4 Check and compare

Execute the configured compilation, validation and improvement-assessment routes, retaining their outcomes and evidence for each candidate.

**Status: compilation, validation, evaluator and result-combination contracts drafted.** Concrete AscendNPU-IR routes, validation profiles and metrics remain unestablished.

#### Compilation-runner contract

One runner invocation compiles **one code version**. The framework invokes it for the original and candidate using the same resolved compilation configuration and corresponding build context.

##### Runner inputs

| Input | Contents |
| --- | --- |
| Code snapshot | The original or candidate file, with an immutable version identifier. |
| Compilation context | Enclosing module/build files, dependencies and supplied material needed to compile it. |
| Starting checkpoint | The input representation, dialect and position in the configured pipeline. |
| Compilation profile | Compiler build, continuation pipeline, pass configuration, flags and target settings. |
| Requested artifacts and limits | Output artifacts/checkpoints required by validation and assessment, plus any explicit stop-before/stop-after boundary. |
| Execution limits | Configured timeout and applicable resource limits. |

Compilation operates on the supplied artifact and enclosing context. A selected region need not be an independently compilable program. Supporting a mid-pipeline starting point depends on whether the concrete compiler integration can restore the state and invariants required at that checkpoint.

##### Runner outputs

| Output | Contents |
| --- | --- |
| Status | Success, compilation failure, timeout, or runner/environment failure. Missing context and unsupported requests receive explicit diagnostics. |
| Artifact manifest | Produced files, their kinds and compilation checkpoints, associated with the input version. |
| Diagnostics | Compiler output, exit status and termination information where available. |
| Execution record | Effective command or pipeline invocation, compiler identity, settings and relevant environment information. |
| Resource usage | Elapsed time and other usage information available from the runner. |

A timeout or unavailable compiler remains distinguishable from a compiler rejecting the candidate. Successful compilation records which requested outputs were produced; it does not establish preservation of behavior.

##### Original/candidate orchestration

1. Compile the original to establish a usable baseline.
2. Compile the candidate using the same compiler, continuation pipeline, target and corresponding build context.
3. Retain both sets of artifacts for the selected validation process and evaluator.
4. Retain failures and diagnostics for the feedback stage.

Persist completed operation results and artifacts using the recovery protocol in **2.5 Use feedback**, including progress within compilation, validation and assessment. A later framework failure should allow reuse of completed work under the same applicable configuration.

The original's compiled artifacts can be reused across candidates while their relevant inputs and configuration remain unchanged. If the original cannot be compiled, record a baseline failure; successful candidate compilation alone cannot establish improvement over it.

##### Shared execution recipe for evaluation and replay

The framework records a versioned execution recipe for the original/candidate compilation, selected validation process and metric comparison, with the resolved settings, inputs and environment requirements. **The initial evaluation uses the same recipe and execution entry point later exported with the finding in section 2.6.** The recipe coordinates the individual runners; their invocation contracts remain unchanged.

Store the recipe and the results of its initial execution with the candidate evidence. This makes the exported reproduction procedure an exercised part of evaluation. Replays use the saved original and candidate code and produce fresh results under the recorded conditions; they do not require the agent to rediscover the rewrite.

#### Validation-runner contract

Execute the selected checks and report the evidence obtained for the original/candidate comparison.

##### Runner inputs

| Input | Contents |
| --- | --- |
| Comparison artifacts | Original and candidate artifacts, their identifiers, compilation checkpoints and relevant context. |
| Validation profile | Selected process, required checks, comparison rules, tolerances and declared assumptions. |
| Case material | Inputs, harnesses, reference results and supporting information required by that process. |
| Execution configuration | Runner, environment, hardware requirements, timeouts and resource limits. |

A compilation-only policy can reference compilation evidence already produced.

##### Runner outputs

- **Per-check outcome:** passed, failed, inconclusive, unsupported, execution error or not performed.
- **Evidence:** observed results, failing inputs or counterexamples where available, and artifact references.
- **Coverage:** inputs, properties and conditions actually checked.
- **Unresolved conditions:** additional assumptions or missing information.
- **Execution record:** effective configuration, diagnostics and resource usage.

An observed candidate mismatch is a failed check. An unavailable device or broken reference harness is an execution/setup problem. These outcomes remain distinguishable. **Passed means passed the selected checks under the recorded conditions.**

#### Metric-evaluator contract

Produce a comparable assessment of the original and candidate under the selected metric and protocol.

##### Evaluator inputs

| Input | Contents |
| --- | --- |
| Comparison artifacts | Original and candidate artifacts at the configured observation checkpoints. |
| Evaluator profile | Metric implementation/version, parameters, unit and required target information. |
| Assessment material | Workload, inputs, execution environment and measurement protocol where required. |
| Comparison criterion | Direction of improvement, threshold and configured rules for interpreting repeated measurements. |
| Execution limits | Applicable time and resource limits. |

The evaluator may assess the versions separately or through a paired protocol, as specified by its profile.

##### Evaluator outputs

- **Assessment outcome:** completed, inconclusive, unsupported, execution error or not performed.
- **Version-labelled values:** original/candidate values, units, samples and aggregation where applicable.
- **Coverage and conditions:** observation checkpoints, supported operations, target assumptions and workload.
- **Evidence:** raw measurements or analysis outputs.
- **Execution record:** effective configuration, diagnostics and resource usage.

The framework applies the recorded comparison criterion to these results. A numeric result outside the evaluator's supported conditions cannot establish improvement.

#### Combining validation and assessment results

| Validation | Assessment | Framework treatment |
| --- | --- | --- |
| Required checks passed | Improvement criterion met | Eligible for a finding, subject to the runnable-bundle requirements in 2.6. |
| Required checks passed | Criterion not met | Retain the attempt and provide comparison feedback. |
| Required check failed | Any outcome | Retain the failure evidence for repair or another proposal. |
| Required evidence incomplete | Any outcome | Record an unresolved attempt and its cause. |

**Validation and assessment remain independent records.** Their execution order follows the configured route; a cheap metric can screen candidates before expensive validation. Finding eligibility still requires all evidence demanded by the selected policy.

Both runners use the persisted execution recipe. Results are linked to their investigation, candidate and operation identifiers and retained with their evidence for feedback, recovery and replay.

#### Compatibility of compilation, validation and assessment

The configuration must describe a **jointly supported route** from the starting checkpoint to all required artifacts. The framework checks the declared compatibility when resolving the request and records candidate-specific coverage failures encountered later.

| Compatibility requirement | What must be established |
| --- | --- |
| Resume and stop support | The compiler can accept the starting checkpoint and produce the requested outputs while respecting explicit stopping boundaries. |
| Validation inputs | The selected process accepts the produced representation, operations, semantics and required context. Execution-based validation of compiled code requires runnable artifacts and the necessary harness/environment. |
| Metric applicability | The evaluator is defined for the selected checkpoint and operations, and the meaning of its result is appropriate to that representation and intended claim. |
| Comparable versions | Original and candidate are assessed at corresponding checkpoints under comparable compilation, target, context and evaluator settings. |
| Available resources | Required compiler, checker, harness and execution resources are available for the configured route. |

**An observation checkpoint and a hard stopping boundary are distinct.** A metric can consume an intermediate IR snapshot while validation requires compilation to continue to a runnable artifact. That is compatible only if the configured route permits that continuation. If compilation must stop before a lowering stage required by the validator, the combination is incompatible.

The framework reports incompatible or unsupported combinations explicitly. It must not silently compile past a stopping boundary, select weaker validation or move assessment to a different checkpoint. A candidate that introduces operations outside checker or evaluator coverage receives an unsupported/inconclusive outcome rather than an inferred correctness or improvement result.

The route may require multiple output checkpoints. Whether these can be collected during one continuation or need separate invocations is part of the concrete integration research; no Ascend capability is assumed here.

#### Research and remaining design

- [ ] **Route compatibility — [[questions/Q08 - Compilation continuation and validation routes|Q08]].** Establish supported start/stop checkpoints, state restoration, artifact production, validation-mode requirements and their compatibility with selected evaluator stages. Produce a matrix of investigated routes and supporting evidence.
- [ ] **Metric applicability — [[questions/Q06 - Metrics for assessing LLVM IR and MLIR improvements|Q06]].** Establish which metrics are meaningful at which stages, their operation/target coverage, and what a stage-local improvement supports as a claim.
- [ ] Implement concrete runner adapters and result schemas for the selected profiles. Establish route-specific ordering through Q08 while preserving the independent validation/assessment records and eligibility rules above.

### 2.5 Use feedback

Turn check results into information that guides subsequent attempts. Retain the investigation state durably so that the chain can continue after an internal framework failure, reusing completed work. Whether feedback reduces wasted attempts and expensive checks remains an experimental question.

#### 1. Construct useful feedback

Feedback identifies the original and candidate versions, the operations performed and the evidence behind each outcome.

| Outcome | Feedback to provide |
| --- | --- |
| Compilation failed | Candidate identifier, compiler diagnostics and relevant artifact locations. |
| Behavior mismatch | Failing input, expected/observed results and comparison conditions, where available. |
| Selected checks passed; metric did not improve | Original/candidate values, metric definition, observation checkpoint and improvement threshold. |
| Selected checks passed; metric improved | The same comparison evidence, linked to the retained successful candidate. |
| Check unsupported or inconclusive | Coverage limitation, timeout, missing information or unresolved condition. |
| Infrastructure failure | Unavailable resource or execution failure, distinguished from a problem in the proposed code. |

The feedback record includes:

- **Identity:** investigation, case, candidate and operation identifiers, with references to the original and any parent candidate.
- **Outcomes:** separate compilation, validation and improvement-assessment results, including checks not performed and why.
- **Comparison context:** resolved settings, relevant checkpoint, metric units, values and comparison conditions.
- **Evidence:** references to retained code, diagnostics, failing cases, measurements and other produced artifacts.
- **Resource state:** recorded usage and remaining configured limits.

Summaries remain linked to the underlying evidence. A failed test, a compiler diagnostic and an unavailable NPU are distinct observations for the next action.

#### 2. Preserve investigation history

Retain the original reference, every submitted candidate, its parent/version relationship and corresponding evidence. Keep the best candidate satisfying the selected checking policy and objective identifiable independently of the agent's current working file. A failed later attempt must not overwrite it.

The persistent record holds the framework-visible interaction history, tool calls/results and agent-provided notes. The portion presented to the agent is configurable: the latest result, conversation history or a compact history with access to complete records. Selection and summarization belong to [[questions/Q09 - Agent prompt construction and information delivery|Q09]].

#### 3. Guide the next action

After receiving feedback, the agent can repair the current candidate, try another transformation, request additional context or an available check, or report that it cannot proceed.

The framework enforces the configured editing scope, checking requirements and resource limits. Search policy determines when to continue, change direction or stop. Infrastructure recovery is handled explicitly; an execution failure does not automatically become an instruction to change the IR.

#### MVP feedback loop

Continue the same agent conversation, supply structured results and artifact references, and let the agent edit its working copy again. Preserve each submitted version independently. Richer feedback, different history selection and more elaborate search policies can be compared against this baseline.

#### Default search policy

- Compare each candidate against the unchanged original under the same checking policy and objective.
- Feed failures or insufficient improvements back to the same agent for another attempt within the configured limits.
- Stop the case at the first candidate passing required checks and meeting the improvement threshold; retain it for export. Otherwise, stop when limits are reached or the agent cannot proceed.
- For a collection, continue with the next case while the shared budget permits. Infrastructure interruptions follow the recovery protocol below.

#### Persistence and recovery

**Persistence is a requirement across generation, compilation, checking, assessment and feedback delivery.** Durable state must outlive individual worker processes and temporary working directories. Results are checkpointed as operations complete, including partial progress within 2.4.

| Persisted state | Contents needed to resume |
| --- | --- |
| Investigation definition | Original snapshots and supplied context, resolved configuration/profile versions, editing scope and resource limits. |
| Candidate history | Submitted file versions, parent relationships, diffs, agent-provided notes and the reference to the best eligible candidate. |
| Operation ledger | Stable operation identifiers, inputs/configuration, pending/running/completed/failed/interrupted state, available external job/session identifiers and result/artifact references. |
| Agent and feedback state | Framework-visible messages, tool interactions, feedback records and delivery state, plus any resumable session information supplied by the selected harness. |
| Budget and progress | Completed work, scheduled/reserved work, known resource consumption, remaining limits and the next pending action. |

The recovery protocol is:

1. **Record intent before execution.** Persist the operation identifier, inputs and configuration before launching a compiler/checker job, requesting model work or delivering feedback.
2. **Publish results durably.** Save complete artifacts and evidence before marking an operation completed and advancing the checkpoint. Partial output remains distinguishable from a completed result.
3. **Restore and reconcile.** On restart, load the latest durable checkpoint, verify referenced artifacts/configuration and reconcile running operations with available job status or completion records. Reuse completed results whose inputs and conditions remain applicable.
4. **Recover the working session.** Restore the appropriate candidate working copy and resume the agent session where supported. Otherwise, reconstruct its context from the persisted case, conversation, feedback and artifact references.
5. **Continue pending work.** Resume the next unfinished operation with the recorded budget state and preserve already retained findings. Usage accumulated before the failure is not reset.

An external operation may have completed before the framework saved its result. Reconcile it using recorded identifiers or retrievable outputs where possible. If its outcome cannot be established, record it as interrupted/unknown and apply an explicit retry rule to that operation, accounting for possible resource use. Completed persisted stages remain reusable; recovery does not depend on reproducing an interrupted model response exactly.

Persist feedback before delivery and record available delivery/session receipts so recovery can establish which results the agent has already received. The persistent record remains sufficient to reconstruct a continuation if a live session is lost.

#### Further design and evaluation

- [ ] Compare feedback detail and history-selection policies through Q09, including the context supplied when reconstructing a session after failure.
- [ ] Compare alternative search and budget-allocation policies against the default, including continuing from a successful candidate. Specify infrastructure retry rules separately from candidate repair.
- [ ] Verify persistence and recovery through interruption/restart experiments: preserve candidates and evidence, reuse completed compilation/checks, restore agent context, retain budget usage and handle uncertain in-flight work explicitly.
- [ ] Evaluate feedback policies through useful findings and resource costs against the baseline. Measure persistence/recovery overhead and the completed work recovered after interruptions.

### 2.6 Produce a finding

The primary deliverable is a **runnable experiment**, with a readable report serving as its index. The most important acceptance criterion is that each finding is easily runnable and reproducible using its saved material and declared environment.

#### Acceptance and readiness

When a candidate meets the configured checking policy and improvement criterion, retain a finding linked to its exact original/candidate versions and evidence. It can be exported while the investigation continues.

**Every ready finding provides one entry point that reruns the recorded compilation, validation and metric comparison for the saved original and candidate.** The procedure uses the same execution recipe exercised during the initial evaluation in 2.4.

Before marking the finding ready, verify that its case material, resolved recipe, required artifact references and initial execution evidence are present and consistent. The recipe's original execution establishes that the procedure has been exercised in the recorded environment. The framework implementation must also verify that exported bundles remain runnable after relocation with the declared external bindings.

#### Finding contents

| Component | Contents |
| --- | --- |
| Identity | Stable finding, investigation, case and candidate identifiers, with links to the originating run and original evidence. |
| Code | Original and rewritten artifacts, permitted editing scope and the framework-generated diff. |
| Case material | Test inputs, expected results/reference behavior, harnesses and supporting context used by the selected process. Include supplied input-generation recipes, versions and seeds where those produced the recorded inputs. |
| Resolved execution recipe | Compiler build, target, continuation pipeline, observation checkpoints, stopping boundaries, validation settings, metric configuration and comparison criteria. |
| Environment requirements | Required framework/runner versions, dependencies, compiler/checker bindings and execution hardware/runtime settings. External resources have explicit identifiers/versions and access bindings. |
| Original evidence | Compilation diagnostics, validation outcomes, metric values, observation conditions, proposed assumptions and unresolved limitations. |
| Readable report | A concise account of the change and observed results, with links to code, evidence and the replay entry point. A brief agent-produced explanation remains optional; working notes remain accessible through the investigation record. |

Package the available case material using bundle-local paths. Identify required external resources explicitly so the finding can be used independently of the original worker's temporary directories and live agent session.

#### Replay interface and behavior

Proposed interface shape; this is a framework requirement, not an implemented command:

```sh
framework replay ./finding-ID
```

A replay:

1. Loads the manifest and recorded recipe, resolves environment bindings and checks required dependencies, artifacts and hardware before execution. Missing requirements produce actionable diagnostics.
2. Uses the saved original and candidate versions and supplied case material to repeat the configured compilation, validation and assessment through the shared execution entry point.
3. Creates a new replay identifier linked to the finding and originating investigation, storing diagnostics, effective configuration, observed environment, validation results, metric values and resource usage.
4. Records whether the selected checking and improvement criteria held on that replay, with enough information to compare outcomes and measurement variation across executions.

The original evidence is preserved alongside subsequent replay results. Divergent or unsuccessful replays remain visible. Reuse of compilation artifacts follows the recorded compatibility rules and is identified in the replay record. Validation and metric assessment requested by the replay are executed again, producing fresh results.

#### Export and recovery

A proposed bundle layout is:

```text
finding-ID/
  report.md
  manifest.json
  original/
  candidate/
  changes.diff
  evidence/
  reproduce/
  replays/
```

The manifest identifies the recipe, artifact versions and required environment bindings. The replay entry point consumes that manifest and the saved experiment material.

Use a stable finding identifier and publish a complete bundle as a unit. Track pending/complete export state in the durable investigation record from 2.5. An interrupted export can be resumed or regenerated from persisted records without rerunning completed discovery, compilation or checks solely to rebuild the package. Successful findings remain available even if later search attempts or the framework process fail.

#### Remaining implementation and evaluation work

- [ ] Specify the manifest/recipe schema and concrete replay command while retaining the shared evaluation/replay execution path.
- [ ] Verify replay in the declared environment from a relocated bundle, plus recovery from an interrupted export. Verify that missing dependencies are reported and that each replay preserves the original evidence.
- [ ] Coordinate validation coverage, metric interpretation and measurement-repeatability criteria with [[questions/Q08 - Compilation continuation and validation routes|Q08]], [[questions/Q06 - Metrics for assessing LLVM IR and MLIR improvements|Q06]] and [[questions/H08 - How will we check success|H08]]. Concrete Ascend routes and tools remain to be established.

Alternative generation, budget-allocation and stopping strategies remain research choices beyond the default in section 2.5. Detailed infrastructure retry rules also remain open. Sections 2.4–2.6 establish outcome distinctions, persistence/recovery behavior and the runnable finding contract.

## 3. Framework responsibilities

### Supported investigation modes

| Input | Intended investigation |
| --- | --- |
| A small kernel or IR fragment | Treat the supplied fragment as a whole. |
| Larger IR with an engineer-specified range | Investigate the specified range. |
| A kernel or larger IR with a request to find promising cases | Select promising regions, then investigate them. |
| A collection of existing code | Search using a configured default classifier set, then investigate selected regions. |
| A collection with selected classifiers | Restrict discovery to the chosen subset, then investigate selected regions. |

### Context and integration

The framework would coordinate code preparation, classifiers, LLM interaction, compiler execution, checks and comparisons. Its responsibilities include:

- Keeping the **permitted editing range** distinct from the **available context for reasoning and checking**. Surrounding code may supply context without being eligible for modification.
- Connecting original and modified code to supported compilation and checking routes, with the conditions needed for meaningful comparison.
- Recording the relevant inputs, settings, artifacts, outcomes and reproduction steps behind a finding.
- Exporting each ready finding as a runnable experiment that replays the saved original/candidate comparison through the same execution recipe used in its initial evaluation. See section 2.6.
- Persisting investigation progress, operation results, candidate/evidence history, agent context and budget state so that internal framework failures can be recovered without restarting completed stages. See section 2.5.

Compilation continuation and runtime validation need explicit investigation: which IR checkpoints can be accepted, how modified regions are reinserted, what executable context is needed, and which checks require an NPU. Correctness execution and performance timing are separate activities. No particular continuation or device-free validation route has been established for our experiment; see [[questions/Q08 - Compilation continuation and validation routes|Q08]].

## 4. Basis for confidence

Existing work motivates testing parts of this approach:

- [[papers/LPO]] (§3.3) provides an example of LLM-proposed local IR alternatives combined with independent checking, metric comparisons and diagnostic feedback.
- [[papers/PRAGMA]] (§III) provides an example of execution and profiling feedback guiding iterative kernel generation.

These provide methods to examine and potentially adapt. They do not establish applicability to AscendNPU-IR or demonstrate the expert-time benefit proposed here.

The expected saving comes from offloading variant construction, repeated checks and reproduction packaging, leaving engineers runnable comparisons to assess. This is useful only if finding quality and saved expert effort justify generation, execution and review costs. That hypothesis must be evaluated in [[questions/H08 - How will we check success|H08]].

The [[research/Framework-generated comparison references|framework-generated comparison reference]] is a hypothesis for our experiment: an alternative evaluated for the same target could provide evidence of an opportunity without requiring another accelerator's implementation as the reference.

## 5. Open research agenda

Developing the mechanism above generates the following lines of investigation. This overview connects each to its question, proposed study and expected evidence. Detailed questions and local checklists remain linked from the relevant steps.

**Status:** all investigations remain open. Core feasibility identifies what must be established for a usable route; it does not select a metric, checker or tool. Optional comparisons can improve the proposed baseline. No experiment plan or additional method is selected by this table.

| Research direction | Question and links | Proposed investigation | Expected evidence | Role and selection status |
| --- | --- | --- | --- | --- |
| **Improvement metrics** | Which indicators provide useful comparisons at acceptable cost? [[questions/Q06 - Metrics for assessing LLVM IR and MLIR improvements\|Q06]] | Review candidate metrics and probe their stage/target coverage, interpretation and resource requirements. | Sourced comparison of applicability, limitations and cost; evidence supporting each improvement claim. | **Core feasibility.** Open; metric unselected. |
| **Compilation and validation routes** | Which start/stop/check combinations can support the comparison? [[questions/Q08 - Compilation continuation and validation routes\|Q08]] | Inspect compiler entry points and test continuation/checking combinations jointly with Q06. | Checkpoint catalog, validation coverage and compatibility matrix supported by reproducible probes. | **Core feasibility.** Open; no concrete Ascend route established. |
| **Region discovery and classification** | Which code categories and selection methods produce useful search cases? [[questions/Q07 - Initial classifiers and code classification scheme\|Q07]] | Investigate category coverage; compare prompted discovery with candidate static or cost-model classifiers. | Proposed category scheme and evidence on coverage, useful findings and selection cost. | **Discovery-mode capability.** Research deferred; classifier coverage unselected. Whole-input and specified-range modes bypass discovery. |
| **Agent instructions and context** | What information should the agent receive, and how? [[directions/D04 - Domain-specific agent instructions and context\|D04]] / [[questions/Q09 - Agent prompt construction and information delivery\|Q09]] | Analyze public harnesses from different domains; compare instruction/context variants with direct review of supplied IR. | Annotated source comparison, proposed instruction/context profiles and comparative results. | **Optional refinement.** Proposed; initial source map exists, comparative analysis pending. |
| **Agent tools and editing constraints** | When do additional tools or editing restrictions help? [[directions/D05 - Agent tools and editing constraints\|D05]] / [[questions/Q10 - Agent tools and editing constraints\|Q10]] | Trace LPO's model/harness interaction; compare ordinary file edits with added tools or constraints. | Comparisons of finding usefulness, validity, transformation coverage and resource cost. | **Optional refinement.** Proposed; reference analysis and experiments pending. Ordinary file editing is the proposed baseline. |
| **Feedback and search policies** | Which feedback, history and budget policies improve search? Section 2.5; [[questions/Q09 - Agent prompt construction and information delivery\|Q09]] for information delivery. | Compare feedback detail, history selection, effort allocation and continuation strategies against the default under comparable budgets. | Retained attempt histories, useful findings, failed/inconclusive attempts and resource-cost comparisons. | **Optional comparisons.** Same-conversation feedback and first-qualifying-finding stopping are the proposed baseline; alternatives unselected. |
| **Finding evidence and framework value** | What makes a finding useful, and does the framework save expert effort? [[questions/Q06 - Metrics for assessing LLVM IR and MLIR improvements\|Q06]], [[questions/Q08 - Compilation continuation and validation routes\|Q08]] and [[questions/H08 - How will we check success\|H08]]. | Establish candidate evidence requirements through Q06/Q08; develop a study of finding usefulness, replay and investigation effort in H08. | Explicit evidence coverage, replay outcomes and a comparison of finding quality, expert effort and execution/model costs. | **Core evaluation.** Study design remains open; resource benefit unestablished. |

These dependencies are related: metric choice and validation must share a feasible route; prompts and tools affect one another; optional policies need a functioning baseline for comparison.

Implementation and verification work remains in sections 2.4–2.6: concrete adapters/schemas, recovery after interruptions and replay from relocated bundles. Persistence and runnable findings are baseline requirements. Test-case generation and automatic pass implementation retain the tentative/later scope described in section 1.

## TODO
