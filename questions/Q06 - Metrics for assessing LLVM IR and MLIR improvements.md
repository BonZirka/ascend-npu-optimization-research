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

## Expected outcome

A sourced comparison of candidate methods, their requirements, costs, limitations and possible applicability. No metric, checking method or IR boundary is selected by recording this question.
