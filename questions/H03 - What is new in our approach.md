# What is new in our approach?

[[Pitch Presentation]]

**Status: working draft for review.** The sections separate the proposed capability, search flow, framework responsibilities, supporting evidence and open choices. The flow and responsibility split are proposals; unresolved design questions remain explicit.

## 1. Proposed contribution

We propose an **LLM-assisted framework for investigating potential missed optimizations in AscendNPU-IR**. It would generate alternatives for selected code, coordinate checks and improvement comparisons, and use their results as feedback for further search.

Compiler engineers could supply a kernel or IR fragment, specify a region to investigate, or ask the framework to identify promising regions in supplied code or a collection. Region discovery would support a configured default classifier set or a selected subset. Initial classifier coverage remains to be researched.

The intended demonstration is that useful, reproducible findings can be obtained with **less expert time and investigation effort**. A finding identifies **what could be improved** through the original code, an alternative, applicable conditions, correctness-check results and comparison evidence under the selected metric. Explaining why the compiler missed the opportunity can follow later. The resource benefit remains to be evaluated.

Possible later work:

- **Generating test cases:** a tentative, questionable extension for substantially later experiments.
- **Automatically writing or fixing optimization passes:** possible work for a separate agentic framework, requiring its own validation research. The initial contribution focuses on identifying opportunities.

## 2. Search mechanism

A proposed investigation follows the six steps below. Sections 2.1 and 2.2 describe the proposed input contract and context preparation. Section 2.3 outlines agent review and generation; its detailed generation design needs discussion. Sections 2.4–2.6 remain brainstorming stubs.

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
| Continuation pipeline | The pipeline to resume from the input checkpoint, its pass configuration and the output stage to produce for checking or assessment. | Every investigation. |
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

Use the prepared case to review the code and propose a replacement within the permitted editing scope.

**Status: partial draft for discussion.** The MVP outline and agent responsibilities are described below; the detailed generation design remains open.

#### Proposed MVP path: direct agent review and generation

The MVP can supply the original IR and available context directly to an agent, together with the editing scope, target settings, improvement objective and checking policy. The prompt asks the agent to inspect the IR, identify relevant dependencies and constraints, and propose a potentially better alternative under the selected objective.

Inspection and alternative generation can happen in the same agent session. The step boundaries describe responsibilities and recorded artifacts; they do not require separate agents or model calls. Initial experiments can use IR and supplied context that fit within the selected model's context allowance.

#### Review the code and replacement requirements

During review, the agent can identify:

| Information | What the agent examines |
| --- | --- |
| Inputs and externally used results | Referenced values, signatures, declarations and surrounding uses crossing the editing boundary. |
| Control flow and dependencies | Enclosing control flow and dependencies visible in the supplied code and context. |
| Observable effects | Relevant memory changes and other externally observable behavior that the replacement must preserve. |
| Potential improvements | Changes that may improve the selected metric while respecting the supplied restrictions. |

Dependency and effect descriptions produced by the agent are recorded as interpretations, with their source and uncertainty. Agent-proposed assumptions are retained for subsequent checking or review; they do not silently become conditions accepted by the engineer. Unestablished properties remain explicit uncertainties.

The candidate code and its location, together with relevant observations, proposed conditions and unresolved questions, are passed to **2.4 Check and compare**. That step produces the selected compilation, correctness-checking and improvement evidence.

#### Generation design still to discuss

_TODO: discuss how alternatives are requested and represented, which tools the agent can use during generation, and how generation effort is controlled within the configured budget._

Prompt construction and the information available to the agent remain subjects of [[questions/Q09 - Agent prompt construction and information delivery|Q09]], including reference analysis of public agent instructions and specialist harnesses. The relocated responsibilities above do not settle the prompt template or generation strategy.

### 2.4 Check and compare

Invoke the supported compilation, correctness-checking and improvement-assessment routes; record what evidence was obtained.

#### Possible designs

_TODO: discuss alternatives and describe how this step could work._

#### Research and development questions

_TODO: identify questions to investigate and decisions to resolve._

### 2.5 Use feedback

Make diagnostics, check results and comparison evidence available to guide subsequent attempts.

#### Possible designs

_TODO: discuss alternatives and describe how this step could work._

#### Research and development questions

_TODO: identify questions to investigate and decisions to resolve._

### 2.6 Produce a finding

Retain reproducible candidate cases with their conditions and evidence for engineer review.

#### Possible designs

_TODO: discuss alternatives and describe how this step could work._

#### Research and development questions

_TODO: identify questions to investigate and decisions to resolve._

The generation strategy, allocation of the configured budget across regions, early stopping rules and treatment of unsuccessful or inconclusive attempts remain to be designed in the later steps.

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

Compilation continuation and runtime validation need explicit investigation: which IR checkpoints can be accepted, how modified regions are reinserted, what executable context is needed, and which checks require an NPU. Correctness execution and performance timing are separate activities. No particular continuation or device-free validation route has been established for our experiment; see [[questions/Q08 - Compilation continuation and validation routes|Q08]].

## 4. Basis for confidence

Existing work motivates testing parts of this approach:

- [[papers/LPO]] (§3.3) provides an example of LLM-proposed local IR alternatives combined with independent checking, metric comparisons and diagnostic feedback.
- [[papers/PRAGMA]] (§III) provides an example of execution and profiling feedback guiding iterative kernel generation.

These provide methods to examine and potentially adapt. They do not establish applicability to AscendNPU-IR or demonstrate the expert-time benefit proposed here.

The [[research/Framework-generated comparison references|framework-generated comparison reference]] is a hypothesis for our experiment: an alternative evaluated for the same target could provide evidence of an opportunity without requiring another accelerator's implementation as the reference.

## 5. Important open choices

- [ ] **Classifier coverage and classification scheme — [[questions/Q07 - Initial classifiers and code classification scheme|Q07]].** Establish useful initial categories and classifiers. Sections 2.2–2.3 describe preparation and direct agent review as a minimal MVP path; category coverage and the value of additional static analyses or cost models remain open.
- [ ] **Improvement indicators — [[questions/Q06 - Metrics for assessing LLVM IR and MLIR improvements|Q06]].** Establish what comparisons can support useful findings, with what assumptions and resource costs.
- [ ] **Compilation and validation routes — [[questions/Q08 - Compilation continuation and validation routes|Q08]].** Establish supported IR boundaries, required context and test harnesses, hardware dependencies, checking coverage and configurable choices.
- [ ] **Search policies.** Define how alternatives are generated, how feedback is used, how effort is allocated and when an investigation stops.
- [ ] **Initial finding criteria.** Define the evidence required for a reported opportunity and what remains for an engineer to assess. Evaluation of the framework's usefulness and resource benefit belongs in [[questions/H08 - How will we check success|H08]].

## TODO
