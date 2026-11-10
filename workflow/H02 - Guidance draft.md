# Draft guidance for answering H02

**Status: draft for review.** General workflow: [[how-to-0-to-1]]. The project-specific answer is separate: [[questions/H02 - How is it done today]].

## What H02 should establish

H02 asks how the outcome described in H01 is pursued today and what limits the current approaches under relevant conditions. The reader should understand the comparison against which the proposed project will be considered.

Start from your project's intended outcome and the people it concerns. Depending on the project, the relevant comparison could involve products, services, habits, organizational practices, technical methods or combinations of these. Identify the alternatives that matter to this proposal.

## 1. Choose the comparison context

Write down three things before drafting:

- The need or outcome from H01 that you are examining.
- The people or organizations whose situation you are describing.
- The conditions that matter: for example, location, scale, available equipment, operating environment or purchasing constraints.

This bounds what “today” means. Practices in one team describe that team's circumstances. A method described in a paper establishes something about its documented setting. Keep those scopes visible.

The following are illustrative investigations, with no assumed findings:

| Possible project | Current alternatives to investigate | A concrete question |
| --- | --- | --- |
| A delivery service for business customers with specific delivery windows | Existing carriers and customers' own delivery arrangements | How do customers currently arrange those deliveries, and what happens when their requirements change? |
| A navigation product for visitors to large venues | Signs, printed maps, existing applications and assistance from staff | How do visitors currently find a destination, and under which circumstances do they seek additional help? |
| A technical method for reducing inference memory use | Existing implementations and published methods under comparable conditions | Which methods are applicable to the intended models and equipment, and what evidence describes their memory requirements? |

Choose the relevant alternatives before making claims about their limitations. Include approaches that work well. If you have found no satisfactory existing approach, explain the scope and basis of that finding.

## 2. Describe how the relevant approaches work

Give enough detail for the reader to understand what each approach provides and where it applies. Select a form suited to the subject:

- For a service or product, describe what people obtain, how they access it and the conditions attached to it.
- For an organizational practice, describe how work starts, the main activities and the result produced.
- For a technical method, describe its purpose, inputs, assumptions and reported evidence.

Use a concrete example where it clarifies the account. An actual customer experience, completed task or published experiment can expose missing details that a general description hides. Record where the example came from and how far it supports the broader description.

Existing tools may be relevant, but a list of tool names rarely explains how the need is addressed. Explain their role when it matters to the comparison.

## 3. Relate limitations to the intended outcome

For each limitation you might include, ask:

1. Under which conditions does it arise?
2. What evidence supports it?
3. How does it affect the outcome in H01?
4. Is addressing it within the proposed project's scope?

A relevant tradeoff may be sufficient motivation for an experiment even when the existing approach performs its intended role well. Describe the conditions in which a different result would be valuable.

Keep symptoms and explanations distinguishable. In our compiler example, a kernel running slower on one accelerator provides a reason to investigate. That comparison alone does not establish a missed compiler optimization or identify its cause.

A difficulty may also belong in the description of the operating environment without becoming a project objective. We recorded difficult IR and substantial manual validation effort without agreeing that the proposed framework would solve those problems.

## 4. Preserve uncertainty and extract useful questions

Identify the basis for substantive statements: direct observation, a stakeholder's account, documentation, a published study or an unconfirmed assumption. Use wording that preserves the scope of that evidence.

For example, “we have not established whether this activity takes place” accurately records a gap in our knowledge. It does not support a claim that the activity is absent.

Move substantive unanswered questions into linked notes. For each, record:

- The question itself.
- The claim or decision its answer could affect.
- What is currently known and where an answer might come from.
- Its status.

Questions about a particular organization or customer context may require interviews, records or observations. Questions about methods elsewhere may require literature or product research. Some uncertainties will require experiments. Choose the source according to the question.

A question records something to establish. A direction records a possible line of work. Investigating alternatives broadly does not commit the project to implementing them. Keep wording and document-maintenance tasks in TODOs.

## 5. Decide which gaps need attention now

Before starting another interview or reading exercise, ask: **What would answering this question change?**

Investigate a gap now when it could overturn the central description, materially change the objective or support a claim essential to the current proposal. Make a consequential uncertainty explicit if it cannot yet be resolved.

Other questions can remain open while drafting continues. For example, learning the frequency of an activity may add little when the broader question of how priorities are chosen already captures its relevant role.

When speaking to stakeholders, start with a concrete case and the specific information you need. A recent example may be enough for an initial description; claims about typical costs or frequency require broader support. Keep the investigation proportionate to the claims you intend to make.

Questions about implementation requirements or evaluation may become important later. Record them without making all their answers prerequisites for the current H02 draft.

## 6. Assemble and review the answer

Use headings that reflect the subject. Our project used “Current practices,” “Identifying slow cases” and “Investigating an optimization task.” Another project might organize its answer around available services, customer choices or families of technical methods.

Keep the main explanation readable. Put unanswered questions in a final linked section, with supporting detail available where needed. Preserve alternative rewrites separately until the relevant reviewer chooses a version.

Before moving on, check:

- Can the reader identify the need, context and relevant current alternatives?
- Does the description explain what those alternatives provide?
- Are claimed limitations relevant to H01 and supported within their stated scope?
- Are hypotheses and gaps in knowledge recognizable?
- Could an unresolved question invalidate a central claim? If so, is that dependence explicit?
- Can the reader understand the answer without following every supporting link?

These checks support a judgment about readiness for the next stage. The project may still need interviews, experiments or a wider review. Revisit H02 when their findings change its account.

## Worked example from our project

In [[questions/H02 - How is it done today|the AscendNPU-IR answer]], we recorded reported practices and kept suspected sources of optimization tasks qualified. We preserved questions about task selection, existing proactive searches and investigation tools. We also recorded broader questions about terminology and methods used elsewhere.

A proposed shorter rewrite was saved separately. The original structure was preferred, with unanswered questions moved to the bottom. We then considered H02 sufficient to move forward while those linked questions remained open.

This illustrates how a usable proposal answer and an unfinished research agenda can coexist. The stakeholder roles, technical problems and section headings belong to that example; other projects should establish their own.
