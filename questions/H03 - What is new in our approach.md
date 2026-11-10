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

A proposed investigation follows the six steps below. Section 2.1 defines the proposed input contract. Sections 2.2–2.6 remain brainstorming stubs for separate design discussions.

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

The request selects the following configuration, directly or through named profiles:

| Configuration | What it specifies |
| --- | --- |
| **Compilation and target** | The input representation and IR checkpoint, compiler build, continuation pipeline and target settings. |
| **Checking policy** | The checks to perform, their comparison conditions and the evidence required to retain a candidate. |
| **Improvement objective** | The metric or cost model and comparison settings used to assess alternatives. Runtime timing is one selectable objective. |
| **Generation setup** | The model and generation profile used to propose alternatives. |
| **Search budget** | The attempt limit and any additional time or resource limits. |

Supporting material includes surrounding declarations, build dependencies, existing test harnesses, test inputs, expected outputs, baseline measurements and profiles. Each selected compilation or checking route declares which material it requires; the engineer supplies that material with the request. A fragment is not assumed to be independently compilable or executable.

Installation defaults are overridden by request settings, which are overridden by per-input settings. The framework resolves and records the effective configuration before searching. Required settings without a configured default must be supplied explicitly.

#### Submission rules

- Validate artifact references, selected ranges, configuration compatibility and the presence of required supporting material before search.
- Report missing requirements or unsupported selections explicitly. Do not silently change the mode, target, objective or checking policy.
- Keep original inputs and the effective configuration linked to every attempt and resulting finding.

Step 2.1 establishes what the engineer supplies and authorizes. Step 2.2 prepares that material for reasoning, region discovery where requested, and checking.

#### MVP coverage

The input contract above defines the proposed interface. **MVP coverage is a separate choice:** which representations and checkpoints, classifiers, compilation routes, checks and metrics are implemented first. Each implementation declares its supported capabilities and required material. Research on those capabilities remains in [[questions/Q06 - Metrics for assessing LLVM IR and MLIR improvements|Q06]], [[questions/Q07 - Initial classifiers and code classification scheme|Q07]] and [[questions/Q08 - Compilation continuation and validation routes|Q08]].

### 2.2 Prepare the search context

Identify the original code, permitted editing range, surrounding information and improvement objective.

#### Possible designs

_TODO: discuss alternatives and describe how this step could work._

#### Research and development questions

_TODO: identify questions to investigate and decisions to resolve._

### 2.3 Generate an alternative

Ask the LLM to propose a change within the permitted scope.

#### Possible designs

_TODO: discuss alternatives and describe how this step could work._

#### Research and development questions

_TODO: identify questions to investigate and decisions to resolve._

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

The generation strategy, search budget, stopping rules and treatment of unsuccessful or inconclusive attempts remain open.

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

- [ ] **Classifier coverage and classification scheme — [[questions/Q07 - Initial classifiers and code classification scheme|Q07]].** Establish useful initial categories and classifiers. Static algorithms, cost models and agentic analysis are possible approaches; none is selected.
- [ ] **Improvement indicators — [[questions/Q06 - Metrics for assessing LLVM IR and MLIR improvements|Q06]].** Establish what comparisons can support useful findings, with what assumptions and resource costs.
- [ ] **Compilation and validation routes — [[questions/Q08 - Compilation continuation and validation routes|Q08]].** Establish supported IR boundaries, required context and test harnesses, hardware dependencies, checking coverage and configurable choices.
- [ ] **Search policies.** Define how alternatives are generated, how feedback is used, how effort is allocated and when an investigation stops.
- [ ] **Initial finding criteria.** Define the evidence required for a reported opportunity and what remains for an engineer to assess. Evaluation of the framework's usefulness and resource benefit belongs in [[questions/H08 - How will we check success|H08]].

## TODO
