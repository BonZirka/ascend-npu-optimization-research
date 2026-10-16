---
title: "LPO: Discovering Missed Peephole Optimizations with Large Language Models"
authors:
  - Zhenyang Xu
  - Hongxu Xu
  - Yongqiang Tian
  - Xintong Zhou
  - Chengnian Sun
year: 2026
version: "arXiv:2508.16125v2 — 16 March 2026"
source: https://arxiv.org/abs/2508.16125v2
reading_status: initial-notes
---

# LPO: Discovering Missed Peephole Optimizations with Large Language Models

## Files and links

- PDF: [[attachments/papers/LPO-2508.16125v2.pdf]]
- Publication: [ASPLOS 2026](https://doi.org/10.1145/3779212.3790184); [versioned arXiv record](https://arxiv.org/abs/2508.16125v2).
- Code / supplementary material: [LPO replication artifact](https://github.com/uw-pluverse/lpo-artifact). Not executed for these notes.

## Problem addressed

Discovering missed local LLVM optimizations while rejecting incorrect LLM replacements. (§1.)

## Approach

- Extract dependent instruction sequences within basic blocks; reoptimize and deduplicate. (§3.2.)
- Request LLM replacements and process them with `opt -O3`.
- Screen instruction count and `llvm-mca` cycle estimates, then check refinement with Alive2. Return diagnostics/counterexamples to the model. (§3.3; Figure 2.)

Method reference: [[attachments/papers/LPO-2508.16125v2.pdf#page=7|§3.3, PDF page 7]].

## Evidence and results

**Authors' reports:**

- Up to 22/25 previously reported cases rediscovered. (§4.2; abstract.)
- 62 reports: 28 confirmed and 13 fixed. (§4.3; Table 3.)
- Selected patches showed no significant SPEC CPU2017 Integer speedup; differences stayed within 2%. (§5.1; Figure 5, PDF page 12.)

These outcomes concern different evaluations: rediscovery, maintainer response and runtime impact.

## Limitations

**Authors:** leakage, benchmark representativeness and model variability threaten evaluation. (§4.5.) Generalizing and implementing compiler changes remain manual. (§5.2.)

**Our concern:** static interestingness and local refinement alone cannot establish whole-workload acceleration or applicability to Ascend.

## Relevance to our research

Possible ideas to investigate: bounded replacements, static screening and counterexample feedback. Their suitability for our target remains open.

This suggests asking whether a useful report needs target timing, and what could independently check an Ascend rewrite. We have not selected a metric or verification route.

Related: [[PRAGMA]]; [[questions/H03 - What is new in our approach]]; [[questions/H08 - How will we check success]].

## Open questions

- What evidence led maintainers to accept or reject individual reports?
- Which useful reports can be prepared without executing the candidate on the target?
- What Ascend semantics and cost information would an analogous workflow require?
- How much human investigation remains after automated search?
