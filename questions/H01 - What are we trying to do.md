# What are we trying to do?

[[Pitch Presentation]]

Develop a framework for finding missed optimizations in **AscendNPU-IR**. Produce reproducible reports containing the original code, a proposed replacement, the conditions under which it applies, correctness-check results, and a comparison using the selected improvement metric.

| Perspective | What we want to achieve |
| --- | --- |
| **Customer value** | Provide customers with a more consistent flow of updates that improve kernel performance and efficiency. |
| **Technical opportunities** | Identify recurring patterns behind inefficient generated kernels and determine which compiler changes could address them across multiple workloads. |
| **Developer value** | Shorten the investigation and validation work between noticing an opportunity and having an improvement ready for integration. |

**Research perspective — optional:** Determine which parts of the investigation can be automated economically and what evidence is sufficient to trust the results.

## TODO

- [ ] Consider changing the titles in the `Perspective` column.
