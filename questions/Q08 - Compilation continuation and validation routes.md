# Q08 — Compilation continuation and validation routes

**Status: open; investigation pending.**

**Question:** Which compilation-continuation and validation routes can support the initial AscendNPU-IR experiment, and what context, test harnesses and execution resources do they require?

## Context

[[questions/H03 - What is new in our approach|H03]] distinguishes the permitted editing range from the available context for reasoning and checking. We need to establish how a proposed change can be compiled and assessed in that context.

Correctness checking, improvement assessment and runtime timing have different purposes. Selecting an indicator that avoids timing does not itself establish a device-free correctness-checking route.

## What to investigate

- Which IR checkpoints can be accepted, what surrounding information must be preserved, and how modified regions can be reinserted before compilation continues.
- Which continuation pipelines and settings can be supported and which choices could be configurable.
- What makes a supplied fragment or region executable for checking: inputs, enclosing code, expected results and available test harnesses.
- Which checking routes require NPU access, what alternatives could be investigated, and which behavior or compilation stages each route would cover.
- What evidence policy is practical for the initial experiment, including the conditions and limitations of successful compilation and checked outputs.

## Expected outcome

An evidence-based account of feasible initial routes, their requirements, costs and coverage, with unsupported cases and remaining uncertainties explicit. No execution backend, checkpoint or correctness guarantee is selected here.

Related: [[questions/Q06 - Metrics for assessing LLVM IR and MLIR improvements|Q06 — Improvement indicators]] and [[questions/H08 - How will we check success|H08 — Evaluation]].
