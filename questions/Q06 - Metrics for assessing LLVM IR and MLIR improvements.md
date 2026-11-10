# Q06 — Metrics for assessing LLVM IR and MLIR improvements

**Status: open; investigation pending.**

**Question:** Which existing metrics, cost models or measurement methods can assess candidate improvements at LLVM IR or MLIR level, and under what conditions could they provide useful evidence for AscendNPU-IR?

## Context

The framework needs a way to identify promising alternatives and guide further search. Runtime measurement is one possibility; the choice of indicator and its resource requirements remain open.

This investigation informs several proposal answers:

- [[questions/H02 - How is it done today|H02]]: relevant existing approaches, their assumptions and limitations.
- [[questions/H03 - What is new in our approach|H03]]: how the framework could compare candidates and use the results in further search.
- [[questions/H08 - How will we check success|H08]]: how to assess the usefulness of the chosen indicator and evaluate the framework. Candidate improvement and overall framework success require distinct evaluation criteria.

## What to investigate

- Identify existing methods and the quantities they assess, distinguishing measurements, estimates and structural indicators.
- Record the applicable IR stages, dialects, target assumptions and operation coverage, including what remains unestablished for AscendNPU-IR.
- Examine execution requirements, hardware access, collection cost and suitability for repeated automated comparisons.
- Establish what conclusions each method supports, including evidence for a relationship to the intended performance outcome.

An improved metric and preservation of program behavior are separate checks. A metric reduction alone does not establish a runtime gain or a confirmed missed optimization.

## Stage applicability and compilation-route compatibility

Coordinate these questions with [[questions/Q08 - Compilation continuation and validation routes|Q08]] and record the answers for each candidate metric:

- At which precise checkpoints, dialects and established IR invariants is the metric defined? Are different parameterizations or models needed before and after particular lowering steps?
- Does it cover all operations introduced by a candidate? How are unsupported operations and partial coverage reported, and can those cases support a comparison?
- Which target information, shapes, layouts, precision, memory or execution assumptions does the evaluator need at that stage? Is the necessary information still available, or has it not yet been introduced?
- Are original and candidate evaluated at corresponding checkpoints for the same amount of work, scope and conditions? Could moving work outside the assessed region or into unmodeled operations produce a misleading score?
- What does an improvement at that stage support as a claim? Can later passes eliminate or reverse it, or make both versions equivalent under a later assessment? Which additional observations would be needed for the intended finding?
- What artifact must compilation produce for the metric, and is that compatible with the selected validation mode and explicit stopping boundary? A static metric may consume intermediate IR while the selected validation still needs a later runnable artifact.

A metric's implementation coverage and its usefulness as an improvement indicator are separate properties. Establish both rather than treating availability of a numeric result as sufficient.

## Expected outcome

A sourced comparison of candidate methods, their requirements, costs, limitations and possible applicability. No metric, checking method or IR boundary is selected by recording this question.
