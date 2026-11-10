# D05 - Agent tools and editing constraints

**Status: proposed research direction; reference analysis and experiments pending.**

Investigate how the tools available to an IR-review agent and restrictions on its editing interface affect useful optimization findings, invalid candidates and resource cost.

## Baseline

The agent edits a working copy of the supplied file using ordinary reading/editing facilities, its existing knowledge and supplied context. Transformations within the permitted region are arbitrary, including changes to control flow, while required behavior must be preserved. The sufficiency of this baseline is an experimental question.

## Candidate comparisons

- Additional access to domain documentation, examples and analysis queries.
- Ordinary file editing versus an IR-aware editing interface.
- Arbitrary in-scope rewrites versus restrictions, such as preserving control flow.
- Operations available for the agent to invoke versus operations coordinated automatically by the framework.

Start with reference analysis of [[papers/LPO]] and its implementation artifact. Establish the actual model/harness division before drawing conclusions or selecting tools. No such analysis or adaptation is completed here.

The expected result is a proposed tool/interface configuration supported by reference evidence and comparative experiments, with effects on finding coverage, validation outcomes and cost recorded.

Detailed question: [[questions/Q10 - Agent tools and editing constraints|Q10]]. Related instruction/context study: [[directions/D04 - Domain-specific agent instructions and context|D04]] / [[questions/Q09 - Agent prompt construction and information delivery|Q09]]. Baseline: [[questions/H03 - What is new in our approach|H03, section 2.3]].
