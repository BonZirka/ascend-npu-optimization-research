# Automated testing for missed optimizations

**Status: candidate; not selected.**

Given compiled code, search for alternatives that pass the agreed correctness checks and improve a selected metric. A successful alternative would provide evidence of a potential missed optimization.

A framework could connect generation, compilation, checking and comparison into a repeatable investigation.

Open questions: which code boundary, correctness checks and improvement metric would make this practical and useful?

## Paper connection

[[papers/LPO]] (§§3.2–3.3, Figure 2) demonstrates the LLVM discovery/checking workflow behind this candidate. Applying that approach to AscendNPU-IR is a possible adaptation; target support has not been established.

[[directions/Candidate Directions]] · [[papers/LPO]]
