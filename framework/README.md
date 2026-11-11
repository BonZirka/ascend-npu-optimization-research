# Ascend Optimization Finder

Implementation directory for the AscendNPU-IR optimization-discovery framework, inside the existing research Git repository.

**Status:** implementation planning and initial project metadata. Runtime components and package tooling remain to be implemented through the backlog.

## Python

Use Python **3.15 or newer**. `.python-version` pins **3.15.2**, the latest stable release verified on 2026-11-11 against the [official release page](https://www.python.org/downloads/release/python-3152/).

## Implementation plan

- [Implementation tasks](planning/backlog.md)
- [Machine-readable backlog](planning/backlog.json)
- [Research issues](planning/research-backlog.md) — 17 reviews, experiments and evaluation studies, labeled separately in Linear.

[Linear implementation board](https://linear.app/ascendoptimizationfinder/project/ascend-optimization-finder-22c80a5e428f/issues) in **AscendOptimizationFinder** contains 21 technical issues across integration setup, baseline implementation and MVP verification, plus 17 issues labeled Research. Each issue has completion criteria, prerequisite references and source sections. The local backlog records their identifiers and links. Research issues also carry a category label: Paper review, Experiment or Evaluation study. Optional research directions remain unscheduled candidates. Pitch work is outside this board.

The planning target is an MVP by the end of month 4 within a six-month overall horizon. The MVP uses engineer-supplied code, one demonstrated compilation route, one checking policy and one metric. Metric, checker, checkpoint and agent-backend choices remain open prerequisites; the corresponding integrations require those selections before completion.

## Research references

- [H03: mechanism and open research agenda](<../questions/H03 - What is new in our approach.md>)
- [H07: development stages](<../questions/H07 - How long will it take.md>)
- [H08: evaluation plan](<../questions/H08 - How will we check success.md>)

Persistence, interrupted-work recovery and runnable finding replay are MVP requirements. Optional refinements remain subject to evaluation and capacity. Automatic optimization-pass implementation and generated test cases retain their separate future scope.
