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

A proposed investigation follows the six steps below. The subsections collect design possibilities and research questions; unresolved choices remain open, and the later subsections are still brainstorming stubs.

### 2.1 Provide the input

An engineer provides a kernel or IR fragment, or a collection of existing code, together with any specified investigation range or classifier preferences.

#### Possible designs

A possible submission consists of **code artifacts plus an investigation configuration**, with supporting material where available. The forms and settings below are candidates for discussion; required fields, supported formats and defaults remain to be established.

**Possible inputs**

| Input | What the engineer could provide |
| --- | --- |
| One code artifact | A kernel, function, IR fragment or larger compilation unit in a supported representation. Which representations and IR checkpoints are accepted remains open. |
| A collection of existing code | Multiple code artifacts to investigate. Packaging could use a file list, directory or manifest; no submission format is selected. |
| Supporting context | Surrounding code, declarations, build information and compiler settings that are available for reasoning, compilation or checking. |
| Existing test or measurement material | Test harnesses, inputs, expected outputs, baseline results or profiles, where available and relevant to the selected checking route. |

Supplying a fragment does not establish that it can be compiled or executed independently. The required enclosing context and checking material depend on the routes investigated in [[questions/Q08 - Compilation continuation and validation routes|Q08]].

**Possible configuration**

| Configuration area | Choices to investigate |
| --- | --- |
| Investigation scope | Investigate the whole supplied artifact, an explicitly specified range, or request discovery of promising regions. How ranges are identified remains open. |
| Classifier selection | Use the configured default classifier set or a selected subset, with any supported classifier parameters. Coverage and classification scheme remain in [[questions/Q07 - Initial classifiers and code classification scheme|Q07]]. |
| Compilation and target | Identify the input IR checkpoint, compiler/build configuration, continuation pipeline and target settings, where supported. Exact controls depend on Q08. |
| Checking setup | Reference the intended checking route and available test material, including any explicit comparison conditions. The initial evidence policy remains open. |
| Improvement objective | Reference the metric or cost-model configuration to use for comparisons. Candidate indicators and their applicability remain in [[questions/Q06 - Metrics for assessing LLVM IR and MLIR improvements|Q06]]. |
| Generation setup | Reference a model or generation configuration. Which controls are useful to expose will be discussed in 2.3. |
| Search limits | Possible limits on attempts, elapsed time or resource use. Supported limits and their enforcement remain design questions for the search policies. |

Step 2.1 records what is supplied and requested. Step 2.2 determines how to prepare the available material into a search context. The placement and execution of automatic region discovery still need to be designed.

#### Research and development questions

- [ ] Which code representations, artifact sizes and IR checkpoints should the initial version accept? How is the input checkpoint identified? See Q08.
- [ ] How does an engineer identify a range, and distinguish editable code from context that may only be inspected?
- [ ] Which metadata and supporting materials are required for each investigation mode and checking route? What happens when they are missing?
- [ ] How are whole-artifact investigation, specified-range investigation and automatic discovery requested explicitly? Which defaults are appropriate?
- [ ] What is the useful configuration boundary between an installation, a collection and an individual input? Are shared defaults and per-input overrides needed?
- [ ] How are original inputs and supplied settings recorded so that later attempts and findings can be reproduced?

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
