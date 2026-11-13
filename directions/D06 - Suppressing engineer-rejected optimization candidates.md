# D06 - Suppressing engineer-rejected optimization candidates

**Status: proposed research direction; mechanism and experiments unselected.**

A candidate rewrite can improve the selected metric and still be rejected by a compiler engineer as a false positive: the edit cannot be accepted under the relevant compiler, semantic or project constraints. Investigate how to record that review decision and use it to prevent the LLM from repeatedly proposing the same unacceptable edit or equivalent variations.

The intended capability is persistent feedback from engineer review that constrains subsequent search. Here, “masking” means suppressing rejected proposals within their applicable scope; no particular generation or filtering mechanism has been selected. An engineer's rejection does not by itself constitute a formal unsatisfiability proof.

## Questions to investigate

- **What is rejected?** An exact candidate, a rewrite pattern, an additional assumption or a broader class of edits? How do we recognize equivalent attempts with different syntax?
- **Where does the decision apply?** Record the rejection reason and relevant code, compiler/dialect version, target, assumptions and checking/metric policy. Determine when it can be reused across cases and when it must be reconsidered.
- **How does it constrain the agent?** Compare supplying rejection examples and reasons in context, persistent retrieval of applicable decisions, and candidate filtering or editing restrictions. Prompt feedback alone may fail to prevent repetition; filtering may stop a candidate only after generation. Distinguish these outcomes.
- **How can decisions be revised?** Allow review, correction and removal of restrictions. Avoid suppressing a useful transformation when its previously missing preconditions become available.

## Possible evaluation

Replay searches after engineer review and compare ordinary attempt history with explicit rejection memory or restrictions. Measure repeated rejected proposals, compilation/checking work avoided, review effort and useful findings retained. Include cases where a similar transformation becomes acceptable under different conditions to assess overly broad suppression.

## Origin and connections

Proposed by the project owner on 2026-11-13. This is an additional research direction, with no implementation or measured benefit established. It extends [[questions/H03 - What is new in our approach|H03 §2.5: feedback and search policies]] and connects to [[directions/D04 - Domain-specific agent instructions and context|D04: agent context]] and [[directions/D05 - Agent tools and editing constraints|D05: editing restrictions]]. No claim is made that the cited papers already implement this feature.

[[directions/Candidate Directions]]
