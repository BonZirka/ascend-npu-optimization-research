---
title: "PRAGMA: A Profiling-Reasoned Multi-Agent Framework for Automatic Kernel Optimization"
authors:
  - Kelun Lei
  - Hailong Yang
  - Huaitao Zhang
  - Xin You
  - Kaige Zhang
  - Zhongzhi Luan
  - Yi Liu
  - Depei Qian
year: 2025
version: "arXiv:2511.06345v2 — 24 November 2025"
source: https://arxiv.org/abs/2511.06345v2
reading_status: initial-notes
---

# PRAGMA: A Profiling-Reasoned Multi-Agent Framework for Automatic Kernel Optimization

## Files and links

- PDF: [[attachments/papers/PRAGMA-2511.06345v2.pdf]]
- Publication: [arXiv preprint, version 2](https://arxiv.org/abs/2511.06345v2).
- Code / supplementary material: no PRAGMA implementation link identified in the reviewed paper; availability remains unverified.

## Problem addressed

Whether detailed profiling feedback helps LLMs generate faster kernels than correctness/runtime feedback alone. (§§I–II.)

## Approach

- Coder proposes code; a deterministic Verifier compiles, executes and compares outputs.
- Profiler collects CPU `perf` or GPU Nsight Compute metrics.
- Conductor interprets diagnostics, metric definitions and profiles, retaining the best code/profile pair to guide revisions. (§III; Figures 1–2.)

Method reference: [[attachments/papers/PRAGMA-2511.06345v2.pdf#page=2|§III, PDF page 2]].

## Evidence and results

**Authors' reports:**

- KernelBench, DeepSeek-R1, up to 15 attempts; Xeon Gold 6230R and A100 40GB. (§IV-A.)
- Average speedups versus Torch: 2.81× CPU, 2.30× GPU. (§IV-B; Figure 3.)
- GPU success: 92% for both PRAGMA and N-PRAGMA; 59.8% versus 32.2% at least as fast as Torch. (§IV-C; Table I, PDF page 5.)

## Limitations

**Authors:** convolution gains are limited; complex tiling/layout choices complicate correctness and performance. (§IV-B.)

**Our concerns:** evaluation covers CPU/GPU kernels, not Ascend compiler findings. Output comparisons are tests. The reported speedups do not measure investigator time saved.

## Relevance to our research

Possible ideas to investigate: profiles with metric descriptions, variant-specific history and a comparison with profiling disabled. Adopting multiple agents or routine profiling is still an open choice.

We need to examine whether detailed profiles provide enough useful guidance to justify their collection cost for our problem.

Related: [[LPO]]; [[questions/H02 - How is it done today]]; [[questions/H08 - How will we check success]].

## Open questions

- How are average speedups aggregated, including failed generations?
- What are the total generation, verification and profiling costs?
- Which benefits require profiling, and which come from other workflow differences?
- What connects a faster generated kernel to an actionable compiler improvement?
- Which parts, if any, transfer to AscendNPU-IR?
