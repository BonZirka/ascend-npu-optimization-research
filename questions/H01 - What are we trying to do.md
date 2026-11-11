# What are we trying to do?

[[Pitch Presentation]]

Develop a framework for finding missed optimizations in **AscendNPU-IR**. Produce reproducible reports containing the original code, a proposed replacement, the conditions under which it applies, correctness-check results, and a comparison using the selected improvement metric.

| Perspective                 | What we want to achieve                                                                                                                                        |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Customer value**          | Make the delivery of kernel improvements predictable and less dependent on individual optimization investigation                                               |
| **Developer value**         | Shorten the investigation and validation work between noticing an opportunity and having an improvement ready for integration.                                 |
| **Technical opportunities** | Enable systematic, repeatable experiments that test whether the compiler could produce better code and establish the conditions under which improvements apply |

> **Note:**
The intended customer benefit is less waiting for useful improvements because finding them consumes scarce expert time.
