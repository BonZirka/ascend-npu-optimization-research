# How much will it cost?

[[Pitch Presentation]]

**Status: draft resource outline.** Quantities, availability and monetary estimates remain to be established.

## Resources to estimate

Start with the resources required to build and evaluate the experiment.

| Resource | What needs estimating |
| --- | --- |
| **Development effort** | Framework implementation, AscendNPU-IR integration and experimental infrastructure. |
| **Compiler expert time** | Preparing representative cases, clarifying semantics and reviewing findings. |
| **LLM usage** | Model calls and context size across successful and unsuccessful attempts. |
| **Host compute** | Compilation, checks, static evaluation and artifact storage. |
| **NPU access** | Device time for validation or measurement where the selected route requires it. |

## Setup and operation

- **Initial setup:** work needed to obtain the first complete investigation route.
- **Experimental operation:** resources consumed while investigating the selected cases.

## Basis for an estimate

For each resource, identify what is already available, what needs allocation and what remains unknown. Existing access still has a capacity cost.

Estimate quantities before assigning monetary values: development and expert time, model usage, host compute and NPU hours. Integration effort is a major unresolved cost, matching the concern recorded in [[questions/H05 - What are the risks|H05]].

## TODO
