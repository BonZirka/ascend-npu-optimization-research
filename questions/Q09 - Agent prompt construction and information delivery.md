# Q09 — Agent prompt construction and information delivery

**Status: open; initial reference sources identified. The comparative analysis and Ascend experiments have not been performed.**

**Question:** How should we construct the instructions for an IR-review agent, and which information should it receive directly or obtain through tools, drawing on public examples of domain-specific agent harnesses?

## Context

Sections 2.2–2.3 of [[questions/H03 - What is new in our approach|H03]] describe context preparation and direct agent review of supplied IR as a minimal MVP path. We need a reference-based understanding of how to make that interaction useful. [[directions/D04 - Domain-specific agent instructions and context|D04]] records this as a research direction with two parts: prompt construction and information delivery.

The comparison includes general coding agents such as Claude Code, OpenCode and Codex, plus specialist agents from any domain. We are interested in how a harness equips an agent for its task. We have not selected a harness, prompt template, context-selection method or additional static analysis.

## What to investigate

### 1. How the instructions are constructed

- Locate the actual public prompt templates and the code or documented mechanism that assembles them.
- Trace how base instructions, domain-specific instructions, the current task, examples, tool definitions and output requirements reach the model.
- Identify which text is fixed, configured by a user, selected for a task or generated dynamically.
- Inspect how diagnostics and previous attempts change later messages.
- Distinguish manually authored templates, runtime context assembly and automatic optimization of prompt wording. These are different mechanisms to compare.

### 2. What information the agent possesses

- Record the initial material: code or other task artifacts, domain documentation, metadata, examples, assumptions and relevant environment settings.
- Record information available through tools, including what triggers its retrieval and how tool results are represented.
- Examine how the harness selects, summarizes or omits material when context is limited.
- Identify the source of facts, their uncertainty, and how errors or missing information are exposed to the agent.
- Map potentially useful information for IR review to ways of supplying it: existing IR, supplied annotations, documentation, agent inspection, targeted tool queries or static analyses.

## Initial reference map

**Sources checked: 2026-11-10.** These are starting points, with narrow observations from public documentation or source. Full runtime message assembly has not been reconstructed. Mutable documentation and repository links must be pinned to a version or commit when detailed comparisons are recorded.

| Reference | Public material identified | Focus for the study |
| --- | --- | --- |
| **Codex** | The official [Codex Prompting Guide](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide) publishes a model-specific starter prompt and discusses repository instructions, tools and compaction. | Trace the relationship between base instructions, repository instructions, tool interfaces and task context. The published example is not evidence of the complete current desktop prompt. |
| **Claude Code** | Official [custom subagent documentation](https://code.claude.com/docs/en/sub-agents) describes custom system prompts and tool access, with examples including a data scientist and database query validator. | Examine how a reusable specialist role is specified and which context it receives. Custom-agent examples do not establish the complete internal main-agent prompt. |
| **OpenCode** | Official [agent documentation](https://opencode.ai/docs/agents/) shows Markdown agent definitions whose body becomes the system prompt, alongside model and permission settings. | Trace how the selected agent definition and task information are assembled into messages. |
| **SQL agents** | The official LangChain [SQL-agent tutorial](https://docs.langchain.com/oss/python/langchain/sql-agent) provides a domain workflow, instructions and tools for discovering schemas, generating queries and responding to database errors. | Examine which domain facts are retrieved on demand and how instructions guide tool use and correction. |
| **Literature review / PaperQA** | The public [PaperQA prompt module](https://github.com/Future-House/paper-qa/blob/main/src/paperqa/prompts.py) includes question-conditioned excerpt summarization, relevance scoring and answer templates using evidence and citation identifiers. | Trace how retrieved evidence is transformed into model context and how evidence references survive later stages. |
| **Automatic prompt optimization — adjacent method** | Official [DSPy MIPROv2 documentation](https://dspy.ai/current/api/optimizers/MIPROv2/) describes proposing instructions and demonstrations and evaluating combinations against a metric. | Examine whether automatic prompt search is useful after a baseline and evaluation cases exist. This is not the same mechanism as a harness assembling a request. |

[[papers/LPO]] and [[papers/PRAGMA]] remain additional references for our optimization problem, particularly for how code, checks and feedback are presented. They do not limit the domains covered by this study.

## How to record each reference

Use a consistent comparison record:

| Item | Evidence to collect |
| --- | --- |
| Source and scope | Official documentation or repository, version/commit, inspected files and whether the text is an example, a default or a reconstructed request. |
| Instruction text | Public templates or short annotated excerpts, with source locations; record placeholders and their meanings. |
| Assembly path | Code/configuration responsible for selecting and combining instruction layers, tool definitions and task material. |
| Concrete request | An example showing the task, supplied data and tool results actually exposed to the model, where the public implementation permits reconstruction. |
| Information access | What is supplied initially, obtained on demand, summarized or preserved between attempts. |
| Evidence of usefulness | Published evaluation, implementation behavior or an untested design rationale, labeled accordingly. |
| Relevance to our agent | A candidate adaptation, its required information/tools and a way to test whether it helps. |

## Connection to static analyses

The review should produce an **information requirement → delivery method → experiment** mapping. Candidate information includes referenced definitions and uses, types and shapes, memory effects, aliasing assumptions, loop properties and target-specific semantics. These are investigation candidates, not an adopted analysis list.

For each candidate, ask whether the needed information is already explicit in the supplied IR, can be obtained through a small query, or benefits from a dedicated analysis. Specify the representation delivered to the agent and the work required to produce it.

Reference analysis can motivate these choices. To establish their value for our framework, compare the direct-IR baseline with an added information source while keeping the model, tasks, checking policy and resource budget comparable. Record validated findings, invalid proposals, unresolved cases, expert effort, model/tool cost and any additional compilation or device use. Evaluation details must be coordinated with [[questions/H08 - How will we check success|H08]].

## Expected outcome

An annotated reference comparison and a proposed initial instruction/context design, followed by a prioritized list of experiments. Separate observations from existing systems, adaptations proposed for AscendNPU-IR and results established by our own experiments. The question remains open until those outcomes are reviewed.
