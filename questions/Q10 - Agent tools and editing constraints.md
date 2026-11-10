# Q10 — Agent tools and editing constraints

**Status: open; reference analysis and experiments pending.**

**Question:** Which tools and editing constraints improve the usefulness and resource cost of an IR-review agent, compared with ordinary file editing using the model's existing knowledge and supplied context?

## Context

[[questions/H03 - What is new in our approach|H03, section 2.3]] proposes a baseline in which the agent edits a working copy of the supplied file. Within the permitted region, transformations are arbitrary, subject to preserving required behavior and improving the selected metric. Whether the model's existing knowledge and supplied material are sufficient remains unestablished.

[[directions/D05 - Agent tools and editing constraints|D05]] records this as a separate research direction. [[questions/Q09 - Agent prompt construction and information delivery|Q09]] studies instructions and information delivery; this question studies the capabilities exposed to the agent and restrictions enforced through the editing interface. Tool descriptions and information returned by tools connect the two studies.

## First reference: LPO

Begin with [[papers/LPO]] and its linked implementation artifact. Trace the actual interaction before proposing adaptations:

- What code, instructions and diagnostic information reach the model?
- Which operations can the model invoke, and which are automatically executed by the framework?
- How is a replacement represented and applied, and what limits its editing scope or transformation choices?
- How are compiler, correctness-checking and metric results turned into feedback?
- Which capabilities rely on precomputed analysis, and which rely on model interpretation?

Do not assume that a tool used by the framework is directly available for the model to call. No LPO tool-interface analysis has been completed for this question.

## What to investigate

| Area | Comparisons to investigate |
| --- | --- |
| Domain knowledge access | Supplied context and model knowledge versus access to IR documentation, examples or targeted queries. |
| Analysis tools | Which additional facts are useful, how they are obtained and how the agent can request them. Coordinate information requirements with Q09. |
| Editing interface | Ordinary text/file editing versus an IR-aware editor exposing structured operations. |
| Transformation restrictions | Arbitrary in-scope rewrites versus constraints such as preserving control flow or limiting operation changes. |
| Tool invocation | Agent-requested compiler/checking/evaluation operations versus framework-controlled invocation. Their evidence responsibilities remain in H03 section 2.4. |

For each proposed tool, record its inputs, outputs, allowed effects, errors and execution/resource requirements. Distinguish restrictions on the tool interface from instructions that merely ask the agent to follow a restriction.

## Evaluation approach to design

Use the direct-review, ordinary-file-editing baseline. Where feasible, vary an added tool or restriction while keeping the model, tasks, input scope, objective, checking policy and budget comparable. Record useful findings under the selected checks, invalid candidates, inconclusive cases, expert effort, model/tool use and any extra compilation or device work.

The benefit of a restricted editor or additional analysis must be established by experiments. A restriction may change which opportunities the agent can express, so record that coverage alongside validity and cost. Detailed evaluation belongs with [[questions/H08 - How will we check success|H08]].

## Expected outcome

An evidence-based account of useful initial tools and editing interfaces, their costs and limitations, plus a proposed configuration for subsequent experiments. Additional tools and restrictions remain unselected.
