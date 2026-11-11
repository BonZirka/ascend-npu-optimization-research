# Candidate optimization families

**Status: provisional search scope, not confirmed AscendNPU-IR defects.** Reviewed source passages on 2026-11-11. This is our working classification, not a taxonomy asserted by either paper. Availability of a transformation in principle does not establish that Ascend misses it.

## Candidate families for the pitch

| ID | Family | Concrete opportunity to investigate | Evidence and Ascend status |
| --- | --- | --- | --- |
| O01 | Arithmetic and clamp simplification | Remove a clamp whose effect is subsumed by later operations; simplify equivalent arithmetic/bitwise expressions. | LPO §4.3, case 2 provides a LLVM example. Ascend applicability untested. |
| O02 | Redundant predicates and selections | Remove explicit NaN sanitization before an ordered comparison when it cannot change that comparison's result. | LPO §4.3, case 3. Ascend applicability untested; exact comparison semantics matter. |
| O03 | Memory-access combination | Replace adjacent narrow loads and value reconstruction with a legal wider load. | LPO §4.3, case 1. Requires bounds, alignment, endianness, memory-space and access-semantics checks. Ascend status unknown. |
| O04 | Vectorization and instruction-form selection | Restructure a conditional vector path or expose a suitable target instruction. | PRAGMA §IV-D.2 reports a convolution trace involving vectorization and FMA. Kernel tuning evidence; an Ascend compiler gap is unestablished. FP contraction requires permission. |
| O05 | Reduction organization | Change the organization or mapping of a reduction to use the target more effectively. | PRAGMA §IV-D.1 studies max reduction. Specific MLIR rewrites and Ascend mapping are still to be selected; numeric order and edge cases require checking. |
| O06 | Redundant layout and representation changes | Eliminate an inverse conversion pair or retain a representation across compatible operations. | Our DL-compiler candidate, not established by these paper passages. Physical layout, aliasing and downstream consumers determine legality and benefit. Ascend status unknown. |

Sources: [LPO §4.3 / Figure 4](https://arxiv.org/html/2508.16125v2#S4.SS3), [PRAGMA §IV-D](https://arxiv.org/html/2511.06345v2#S4.SS4).
Local paper records: [[papers/LPO]] and [[papers/PRAGMA]].

LPO supplies examples of missed LLVM rewrites. PRAGMA supplies kernel-improvement cases and profiling guidance; these are different evidence. The proposed transfer to MLIR/Ascend remains ours to investigate.

## Short pitch wording

> We will investigate candidate missed optimizations in local arithmetic and predicate simplification, memory-access combination, vectorization, reduction organization and layout conversion. The framework will test whether alternative MLIR produces a useful improvement through the same compilation route and target configuration.

The shortlist can narrow with engineer input and integration evidence. Listing a family does not promise complete coverage.

## An illustrative MLIR case

Adaptation of LPO Figure 4(c)/(f), not a reported Ascend finding. The original explicitly replaces NaNs with zero before checking equality with one; the candidate uses the ordered comparison directly.

```mlir
func.func @original(%x: f32) -> i1 {
  %zero = arith.constant 0.0 : f32
  %one = arith.constant 1.0 : f32
  %ordinary = arith.cmpf ord, %x, %x : f32
  %safe = arith.select %ordinary, %x, %zero : f32
  %equal = arith.cmpf oeq, %safe, %one : f32
  return %equal : i1
}

func.func @candidate(%x: f32) -> i1 {
  %one = arith.constant 1.0 : f32
  %equal = arith.cmpf oeq, %x, %one : f32
  return %equal : i1
}
```

This is a documentation-based draft; it has not been parsed or tested in the selected Ascend pipeline. Preserve the stated floating-point semantics, inspect later output and run the selected checks before treating it as a finding.

The earlier two-loop fusion example remains an explanation of the mechanism. **Project-owner observation:** simple fusion is expected to work in Ascend already. Do not use it as evidence of a current gap.

## Separate transformation classes from explanations

A finding's transformation family describes **what changes**. Possible explanations for a missed opportunity describe **why**: missing/generalized rewrite, unmet or overly restrictive preconditions, unavailable facts, pass ordering or lowering interactions, or a deliberate tradeoff. These are investigation labels, not diagnoses.

LPO §4.3 also records reports declined because a backend handled them, another optimization would suffer, or the case was too specific. A smaller earlier IR alone is insufficient evidence of an actionable compiler improvement.

## What each catalog entry needs

- Original/candidate MLIR, source provenance and compiler revision.
- Required conditions: types/shapes/layouts, aliasing/effects, numeric semantics and target assumptions.
- Relevant pipeline checkpoint, dialect/operation coverage and continuation path.
- Selected correctness evidence and improvement metric.
- Whether a difference survives later compilation.
- Ascend status: engineer-reported, tested, handled already, unconfirmed or unsupported.
- A picture that shows the actual structural change; use measured values only when available.

Scoping task: [ASC-44](https://linear.app/ascendoptimizationfinder/issue/ASC-44/classify-candidate-missed-optimizations-and-select-representative-mlir).
Related: [[questions/Q07 - Initial classifiers and code classification scheme]].
