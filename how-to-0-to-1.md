# How to go from 0 to 1: shaping a research proposal

This is a living guide for colleagues developing research proposals through the Heilmeier questions. It records a working method learned from discussing and revising an actual proposal, including approaches that caused confusion and how we corrected them.

**Current coverage:** the general working process and detailed guidance for **H01 — What are we trying to do?** H01 has been accepted by the project owner. Guidance for H02–H08 will be developed as we work through those questions. Their presence in the outline does not mean they have been answered.

The purpose of the process is to turn an idea into an objective that other people can understand, challenge and eventually evaluate. A polished sentence is useful when it expresses an agreed idea. Polishing an unresolved idea can make disagreement harder to see.

## 1. Work through questions without deciding the whole project at once

Use one central presentation note and a separate note for each H question. In this vault, [[Pitch Presentation]] is the hub. Each question can be discussed and revised independently while contributing to the same eventual pitch.

Supporting material has different roles:

| Material | Role |
| --- | --- |
| H question notes | Answers being developed for the proposal. |
| Paper notes and local PDFs | Source evidence, reported results, interpretations and unanswered reading questions. |
| Candidate direction notes | Possibilities worth remembering; a link does not select them. |
| Question-level TODO sections | Local wording or content issues to revisit. |
| Vault maintenance TODO | Improvements to the research workspace itself. |

Keep a distinction between something we discussed, something we proposed, something the literature demonstrates, something we tested, and something the project owner accepted. These distinctions matter more than any particular folder naming scheme.

A useful working cycle is:

1. Choose one H question.
2. Discuss what the answer needs to communicate.
3. Draft a small amount of wording that can be challenged directly.
4. Read it as a listener with no access to the preceding conversation.
5. Identify the specific misunderstanding or objection it creates.
6. Revise the idea or wording, keeping unresolved choices visible.
7. Save the version when the owner asks to record it.
8. Let the owner review the actual document and decide when the question is answered well enough to move on.

Discussion and document editing are separate actions. In this workflow, requests to discuss, brainstorm or compare wording remain discussion. An explicit instruction to write authorizes recording the agreed material. A collaborator or AI assistant should not silently turn a suggestion into a project decision.

## 2. What H01 needs to establish

H01 asks **what we want to achieve**, in language a listener can understand. Its answer should give the listener a concrete picture of the intended work and why that work matters.

The questions that helped us construct it were:

- What are we proposing to produce?
- Where will it initially be used?
- What will a person actually receive or be able to do?
- Who benefits directly, and who benefits through later integration?
- What should improve compared with the existing situation?
- Which statements describe objectives, and which would amount to guarantees?

These are drafting prompts, not additional questions that must each become a subsection. A short answer can cover several at once.

H01 can name the target and expected output without fixing the full implementation. In our example, naming AscendNPU-IR and describing a reproducible report made the proposal concrete. Choosing a particular LLM architecture, validation tool or performance metric was unnecessary to make that objective understandable.

A useful test is: **does this detail help the listener understand the intended result, or does it prematurely choose how we will obtain it?** Include the former. Keep the latter open until it is needed and discussed.

## 3. Start with a concrete objective and output

We initially used phrases such as “actionable evidence.” They sounded useful, but did not tell the listener what would be delivered.

The drafting technique was to replace the abstract phrase with the contents of the output. For this project, that meant:

- the original code;
- a proposed replacement;
- the conditions under which it applies;
- correctness-check results;
- a comparison using the selected improvement metric.

That became an introductory paragraph before the perspectives table:

> Develop a framework for finding missed optimizations in **AscendNPU-IR**. Produce reproducible reports containing the original code, a proposed replacement, the conditions under which it applies, correctness-check results, and a comparison using the selected improvement metric.

This is the project's example, not a mandatory formula for other proposals. Another project might produce a prototype, experimental dataset, analysis technique or language feature. Describe that output with comparable specificity.

Notice the choices this paragraph leaves open. “Selected improvement metric” does not choose execution time. “Correctness-check results” does not claim a universal equivalence proof or select a checker. Concrete output descriptions can coexist with unresolved technical choices.

## 4. Use perspectives to explain different consequences

We found a table useful for distinguishing several reasons the work could matter. The perspectives emerged through discussion; they are not a required checklist for every proposal.

| Perspective used in our discussion | What it is intended to communicate |
| --- | --- |
| Customer value | The intended effect on people who buy or depend on the product. |
| Developer value | The intended change in the work of the people who use the framework directly. |
| Technical opportunities | Experiments or capabilities the framework might make practical, even when experts could perform individual instances manually. |

Identify the actual roles before writing these rows. For this project, NPU buyers are downstream customers. Compiler engineers are the framework's direct users. NPU buyers are expected to experience the effects of integrated improvements; they are not expected to operate the framework.

A customer perspective therefore needs to explain what reaches those customers. A developer perspective can explain changes in investigation effort. Confusing those roles led us to repeatedly describe the same activity under different labels.

We also considered a business-value row. It largely restated the other benefits, so we did not retain it. Additional rows should earn their place by communicating a distinct consequence. A longer table is not automatically a stronger argument.

## 5. Challenge every row as a listener

The most productive revisions came from specific listener questions. Use the following challenges to inspect a draft. They are prompts for discussion, not a claim that we have already established the answers.

### “We already do this. What changes?”

An early technical row said we would identify inefficiency patterns and determine compiler changes. A customer row described useful, dependable improvements. Both could describe work the team already performs.

The delivery row was clearer because it immediately stated a comparative change: **shorten** investigation and validation work.

Look for the change relative to the existing situation. Depending on the project, that might be less effort, shorter delay, greater consistency, more repeatability or a new practical experiment. Choose a comparison that matches the intended contribution.

Adding “more” does not establish that the improvement will happen. It makes the objective explicit and exposes what later needs evidence. Do not invent a deficiency in the current team to justify the comparison.

### “What does that mean in simple terms?”

Ask the author to explain the sentence without its polished wording. For example, the discussion of predictable improvement delivery became:

> Keep looking for ways to improve kernels even when engineers are busy with other work, and give them checked examples to investigate.

This explanation made the proposed offloading understandable. It also exposed a remaining question: would offloading the search actually help improvements reach customers sooner?

If the simple explanation differs from the formal sentence, revise the formal sentence. If several people explain the sentence differently, the underlying objective may still need discussion.

### “What would I actually receive?”

Replace vague outputs with inspectable things. “Actionable evidence” became a report with code, conditions, check results and a metric comparison.

Apply the same technique to phrases such as “better quality,” “insight” or “improved capability.” Ask what a person would see, read, run or decide differently. The answer can reveal a missing definition rather than produce an immediate wording fix.

### “Why are these two rows different?”

We repeatedly encountered overlap between customer and developer benefits. Both mentioned kernel improvements, validation or delivery.

Assign each row a different subject and level of consequence. In this project:

- the customer row concerns the consistency of improvements reaching NPU buyers;
- the developer row concerns investigation and validation work;
- the technical row concerns systematic, repeatable experiments.

Some causal connection is expected: changing the developer workflow is meant to affect the customer outcome. The listener should still understand what each row contributes.

When a row repeats the introduction or another row, reconsider its purpose. Renaming it will not resolve an underlying duplication. Removing or combining a row can be appropriate if no separate contribution emerges.

### “Are you implying the engineers cannot do this themselves?”

“Compiler understanding” was a poor framing for our technical row. It suggested an expertise gap we had not established.

We reframed the discussion around what a framework could make practical: coordinating repeatable experiments, keeping their conditions and results together, or maintaining a corpus over time. Experts may already be capable of doing each individual investigation.

Distinguish expertise from investigation capacity, repetition, coordination and maintenance. A tool can make expert work easier to apply systematically without claiming that engineers lack the necessary knowledge.

If existing expertise is important to the proposal, treat it as part of the working environment. Do not manufacture a capability deficit merely to give the tool a role.

## 6. Develop customer value without overpromising

Customer-first wording starts with the effect on the customer. It does not require every internal research project to invent a new category of customer benefit.

In our discussion, sustained performance improvements were already something the organization could deliver. Repeating that benefit did not distinguish this project. The proposed incremental contribution became making the process supporting those improvements more consistent and less dependent on individual investigations.

We also learned that “more frequent updates” can emphasize release activity while leaving the useful effect implicit. Ask what the customer benefits from in those updates, and why consistency matters to them.

Keep the causal chain visible:

```text
Framework produces findings and evidence
    → engineers review and implement worthwhile changes
    → changes are integrated and delivered
    → customers experience the effects
```

A discovery framework affects the first part directly. The later stages depend on additional work and decisions. Do not compress this chain into an unconditional promise of customer performance gains or a delivery schedule.

The critical follow-up question is whether discovery and evaluation meaningfully constrain the existing process. If the main delay lies elsewhere, the customer effect could be limited. H01 can state the intended benefit while leaving investigation of that connection open.

## 7. Distinguish an objective from a guarantee

We explicitly asked what the project could guarantee to NPU buyers. That question prevented an intended benefit from becoming an unsupported promise.

Use three categories when reviewing wording:

| Statement category | How to handle it |
| --- | --- |
| Intended benefit | Describe the improvement we hope the work will support. |
| Expected project output | State the concrete artifact or capability we intend to produce. |
| Guarantee | Identify exactly what is under our control and what evidence would support the commitment. |

A reproducible report can be a project output. Better performance for every customer workload is a much larger claim. Passing a correctness test is evidence for the checked cases, not a general correctness guarantee. A static metric comparison is different evidence from a measured runtime gain.

Be equally careful with process claims. A research framework cannot by itself guarantee a regular release cadence when implementation and integration are outside its direct control.

If a stronger customer promise requires assumptions about those later stages, make the assumptions available for discussion. Do not resolve them through confident phrasing. It is acceptable for H01 to contain an intended customer benefit that the rest of the research must test and substantiate.

## 8. Give the technical perspective a real purpose

We first described the technical perspective in terms of finding patterns and identifying compiler changes. That overlapped with the framework's introductory objective and risked implying a lack of engineering expertise.

A more useful question was:

> What kind of experiment or engineering capability would become practical with the framework, or be substantially harder to coordinate without it?

This led to possible capabilities such as automated testing for missed optimizations, systematic investigation of a transformation's applicability, and replaying opportunities across compiler revisions.

“Impossible without the tool” is a demanding claim. It is often more accurate to discuss repeatability, coordination or the effort needed to maintain an experiment. Explain the concrete work the framework would enable before giving that work a broad label.

We chose **Technical opportunities** to keep the wording exploratory. A capability mentioned in H01 does not select every possible implementation direction underneath it.

Also distinguish technical enablement from academic novelty. A useful framework may make an established method practical for a new environment. Claims of a new method need their own literature support; they should not be inferred from having built a tool.

## 9. Preserve useful branches without selecting them

A productive discussion can generate more directions than the current proposal will pursue. Record those ideas so they remain available for later consideration.

For this project, we kept candidate directions in separate notes and gave them stable identifiers. They remain explicitly unselected. IDs provide references; they do not express priority or implementation order.

We initially linked the candidates directly from H01. On review, their stronger connection was to the papers that motivated them. We moved the links to the relevant paper notes and recorded the provenance of each idea:

- a demonstrated paper method that could be adapted;
- a future-work question raised by the paper;
- an extension proposed in our own discussion.

This distinction prevents our extensions from being attributed to the authors and prevents interesting literature branches from becoming implied project commitments.

The graph should express the relationship between notes. A link from an objective to a candidate can suggest that the candidate is part of the plan. Place links where their meaning is clear, and state selection status explicitly when needed.

## 10. Use TODOs to keep the discussion moving

A question note can have a TODO section for issues worth revisiting without repeatedly reopening the entire answer. For example, we recorded a task to reconsider the labels in the `Perspective` column.

Keep wording TODOs distinct from unresolved research choices. A label can remain imperfect while the underlying objective is agreed. A choice of validation method or reporting metric is a substantive research question and should retain its actual significance.

Vault-maintenance tasks belong in the separate workspace TODO list. Changing the paper template is a vault-quality task, not an unanswered scientific question.

Do not treat the existence of a TODO as automatic evidence that H01 cannot be accepted. The owner decides whether an issue is material to the answer or can be revisited later.

## 11. Decide when H01 is sufficiently answered

Use these prompts before asking the owner to review the answer:

- Can a listener identify the proposed output and initial target?
- Can they explain the objective without relying on vague terms?
- Are direct users and downstream customers distinguishable?
- Does each perspective communicate a distinct intended consequence?
- Is the intended change relative to the existing situation visible?
- Are intended benefits distinguishable from guarantees?
- Does the text respect existing engineering expertise?
- Are candidate directions and unresolved technical choices still recognizably open?

This is a review aid, not a substitute for the owner's judgment. The owner ultimately stated that H01 was done and answered. That acceptance is the stopping point for drafting this question until new steering or evidence makes revisiting it necessary.

Accepting H01 means we have an agreed objective. It does not mean the objective has been achieved, the framework has been validated or all downstream choices have been made. In particular, accepting our H01 did not settle the reporting metric, validation mechanism or selection among the candidate directions.

The current project answer is in [[questions/H01 - What are we trying to do]]. Treat that note as the working answer; the examples in this guide explain the drafting techniques.

## 12. Working with a colleague or AI collaborator

The collaborator's useful role is to generate candidate wording, ask listener questions, identify ambiguous claims, compare alternatives and preserve the discussion accurately.

Several practices helped us:

1. **Revise small units.** A paragraph, table row or label is easier to assess than a wholesale rewrite.
2. **Explain the effect of a proposed change.** For example: this wording adds diagnosis and generalization as an objective. That gives the owner a chance to accept or reject the added scope.
3. **Ask what an unclear term means.** Repeated synonym generation did not help when we had not agreed what customer “quality” or “consistency” meant.
4. **Keep alternatives reversible.** We placed a possible research perspective in a separate paragraph so the owner could easily decide whether to retain it.
5. **Save when asked, then review the actual document.** Seeing a table in context revealed duplication that was less obvious in isolated chat messages.
6. **Preserve the owner's edits.** Avoid replacing their current draft with an earlier assistant version. Keep unrelated edits out of focused commits.
7. **Commit coherent iterations.** In this workspace, the owner requested a commit for each completed editing iteration. Discussion alone does not require a commit.

An important failure in our process was generating a large vault filled with assumptions, apparent decisions and preselected priorities before the research had reached them. The correction was to rebuild an initially empty structure and fill it incrementally through discussion and explicit editing requests.

The lesson for collaborators is to preserve uncertainty where it actually exists. A detailed note is useful when it records evidence or a deliberately considered proposal; detail by itself does not make a decision justified.

## 13. H02–H08: coverage to develop later

The remaining question notes exist, but this guide does not yet provide detailed answering techniques for them.

| Question | Working note | Guidance status |
| --- | --- | --- |
| H02 — How is it done today? | [[questions/H02 - How is it done today]] | To be developed. |
| H03 — What is new in our approach? | [[questions/H03 - What is new in our approach]] | To be developed. |
| H04 — Who cares and what changes if we succeed? | [[questions/H04 - Who cares and what changes if we succeed]] | To be developed. |
| H05 — What are the risks? | [[questions/H05 - What are the risks]] | To be developed. |
| H06 — How much will it cost? | [[questions/H06 - How much will it cost]] | To be developed. |
| H07 — How long will it take? | [[questions/H07 - How long will it take]] | To be developed. |
| H08 — How will we check success? | [[questions/H08 - How will we check success]] | To be developed. |

## 14. Maintain this guide as the workflow develops

When another H question is worked through, add its successful drafting techniques, the objections that mattered, examples of useful revisions and the owner's acceptance criteria. Distinguish what we actually learned in that discussion from methods we have merely proposed.

Keep this as one Markdown document. Extend it after substantive work; avoid inventing detailed instructions for questions we have not yet explored. Other researchers can adapt the techniques to their own projects without adopting this project's technical scope or candidate directions.
