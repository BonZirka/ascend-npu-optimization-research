# What are we trying to do?

[[Pitch Presentation]]

Develop a framework for finding missed optimizations in **AscendNPU-IR**. Produce reproducible reports containing the original code, a proposed replacement, the conditions under which it applies, correctness-check results, and a comparison using the selected improvement metric.

| Perspective | What we want to achieve |
| --- | --- |
| **Customer value** | Make software updates deliver useful, dependable improvements across the workloads customers run on their NPUs. |
| **Technical capability** | Find optimization opportunities the compiler currently misses and produce actionable evidence for improving generated kernels. |
| **Delivery process** | Shorten the investigation and validation work between noticing an opportunity and having an improvement ready for integration. |

**Research perspective — optional:** Determine which parts of the investigation can be automated economically and what evidence is sufficient to trust the results.
