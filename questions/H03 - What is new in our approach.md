# What is new in our approach?

[[Pitch Presentation]]

**Status: working draft.** The proposed contribution records our discussion; topics 2–5 remain to be discussed. Open design questions do not block developing the document structure.

## 1. Proposed contribution

We propose a framework for investigating potential missed optimizations in **AscendNPU-IR**. The intended demonstration is that useful, reproducible optimization findings can be obtained with less expert time and investigation effort. The resource benefit remains to be evaluated.

The initial finding establishes **what could be improved**: the original code, a proposed alternative, its applicable conditions, correctness-check results and comparison evidence under the selected improvement metric. Explaining why the compiler missed the opportunity can follow later.

### Starting points and investigation modes

The first version is intended to work with engineer-supplied kernels or IR fragments and collections of existing code.

| Input | Intended investigation |
| --- | --- |
| A small kernel or IR fragment | Treat the supplied fragment as a whole. |
| Larger IR with an engineer-specified range | Investigate the specified range. |
| A kernel or larger IR with a request to find promising cases | Select promising regions, then investigate them. |
| A collection of existing code | Search for promising regions using a configured default set of classifiers, then investigate them. |
| A collection with selected classifiers | Restrict region discovery to the chosen subset of classifiers, then investigate the selected regions. |

The permitted editing range and the available context for reasoning and checking are distinct. Surrounding code may provide context without being part of the region the framework is allowed to change. Its use in compilation and runtime validation will be discussed under framework responsibilities.

### Classifier coverage

Classifiers recognize code categories or patterns to select promising regions. Region selection is a separate research task: static algorithms, cost models and agentic analysis are possible approaches. The initial classifiers and the common classification scheme remain open design choices.

- [ ] Investigate initial classifier coverage and the shared classification scheme: [[questions/Q07 - Initial classifiers and code classification scheme|Q07]].

### Possible later work

- **Generating test cases:** a tentative, questionable extension to consider in substantially later experiments.
- **Automatically writing or fixing optimization passes:** possible future work for a separate agentic framework, requiring its own validation research. The initial framework focuses on identifying opportunities.

## 2. Search mechanism

## 3. Framework responsibilities

To discuss here: available context for reasoning and checking, compilation continuation, runtime validation, hardware requirements and configurability.

## 4. Basis for confidence

## 5. Important open choices

## TODO

## Related research questions

- [[questions/Q06 - Metrics for assessing LLVM IR and MLIR improvements|Q06 — Metrics for assessing LLVM IR and MLIR improvements]]
- [[questions/Q07 - Initial classifiers and code classification scheme|Q07 — Initial classifiers and code classification scheme]]
