# How long will it take?

[[Pitch Presentation]]

**Planning target:** MVP by the end of **month 4**, within a **six-month overall horizon**.

**Assumptions:** one developer, compiler expert support on a part time basis, and access to the required AscendNPU-IR compiler and execution environment.

## Stages

| Period | Focus | Expected result |
| --- | --- | --- |
| **Month 1** | Feasibility probes and direct agent experiments. | Early evidence about integration and useful findings. |
| **Months 2–3** | Baseline implementation. | Working generation, checking, comparison and feedback with persistent state. |
| **Month 4 — MVP** | Complete replay, recovery and pilot testing. | Usable framework producing reproducible findings. |
| **Month 5** | Evaluate representative cases using the methodology developed in H08. | Evidence about usefulness, expert effort and resource costs. |
| **Month 6** | Implement and compare one focused refinement. | Results against the baseline and recommendations for further work. |

## MVP and subsequent work

The MVP supports engineer-supplied code, one compilation route, one checking policy and one improvement metric, with reproducible findings.

The refinement's scope is selected from evaluation results and remaining capacity. Candidate areas include context preparation, agent tools, region discovery and feedback/search policies. These remain optional research choices in [[questions/H03 - What is new in our approach|H03]].

Evaluation methodology: [[questions/H08 - How will we check success|H08]]. Resource estimates: [[questions/H06 - How much will it cost|H06]].

## TODO
