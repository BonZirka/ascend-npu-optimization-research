# D04 - Domain-specific agent instructions and context

**Status: proposed research direction; reference analysis pending.**

Investigate how existing agent harnesses construct instructions and deliver the information needed for a specialist task. References can come from any domain: coding, database queries, literature review or other tasks. Compiler-focused systems are one source of examples.

## Two parts of the study

1. **Prompt construction:** examine the actual public instruction text and how the harness combines general behavior, domain knowledge, task instructions, examples, tool descriptions and feedback. Identify which parts are fixed, selected from reusable templates or assembled for each request.
2. **Information delivery:** examine what the agent receives initially, what it can retrieve through tools, and what is added after execution or checking. Apply these observations to deciding what an IR-review agent should be given.

## Expected result

A source-based comparison, with annotated prompt examples and assembly paths where public implementations make those available, followed by a proposed baseline for our agent and experiments to compare alternatives.

For IR review, the study should produce candidate information requirements and ways to obtain them: supplied code, documentation, agent inspection, targeted queries or static-analysis results. No particular analysis becomes necessary simply because it appears useful in another system.

The proposed MVP in [[questions/H03 - What is new in our approach|H03, sections 2.2–2.3]] can begin with direct prompted review of supplied IR. This study can guide subsequent improvements without becoming a prerequisite for that baseline.

Detailed question, initial source map and comparison method: [[questions/Q09 - Agent prompt construction and information delivery|Q09]]. Related: [[questions/Q07 - Initial classifiers and code classification scheme|Q07]].
