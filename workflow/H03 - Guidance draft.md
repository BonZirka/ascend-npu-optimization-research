# Draft guidance for answering H03

**Status: draft for review.** General workflow: [[how-to-0-to-1]]. Project answer: [[questions/H03 - What is new in our approach]].

## What H03 should establish

H03 explains **what we propose to do differently, how it would work and why we expect it to help**. Connect the outcome in H01 to the comparison established in H02.

**H03 is the main source of open research directions in this workflow.** Developing the mechanism exposes unresolved assumptions, competing designs and gaps in evidence. Identifying and structuring those directions is an explicit output of answering H03.

The contribution may be a method, product, service, language feature or an adaptation of existing work. Establish what is different for the intended setting. Claim academic novelty only when the project requires it and the evidence supports it.

## 1. State the contribution and its boundary

Start with a short account of:

- What the proposal introduces or changes.
- Where and for whom it will initially apply.
- What result it should produce.
- What improvement we hope to demonstrate.

Explain the mechanism behind that improvement. For example, our intended expert-time saving comes from offloading variant construction, repeated checks and reproduction packaging. Whether useful findings justify generation, execution and review costs remains a hypothesis.

Name consequential exclusions. Our framework identifies potential opportunities; explaining their compiler-side cause or automatically implementing optimization passes is separate work. Avoid quietly adding those objectives while explaining the approach.

## 2. Sketch the mechanism before detailing its parts

Choose a structure suited to the proposal: a user journey, interaction model, experimental procedure, technical pipeline or another useful account.

Show how someone starts, what happens and what they receive. Identify responsibilities and external dependencies. Separate material supplied to the process from information it must produce or infer.

We used six activities: provide input, prepare context, generate an alternative, check and compare, use feedback, and produce a finding. These are a worked example. Other projects need their own structure; conceptual activities need not become separate components, agents or execution stages.

## 3. Make each part concrete through small reviews

Discuss one part at a time. For each, establish:

| Aspect | Question to settle |
| --- | --- |
| Inputs | What must be supplied, and what is optional? |
| Behavior | What happens, under whose control and within which boundaries? |
| Outputs | What does the next participant or activity receive? |
| Decisions | Which choices are explicit configuration, and what is the default? |
| Exceptions | What happens when requirements are missing, work fails or results are inconclusive? |

Use precise examples to expose ambiguity. We distinguished an editable IR range from surrounding read-only context, and an edited candidate file from the diff constructed by the framework.

Keep enough technical detail to explain responsibilities and feasibility. Exact schemas, command syntax and implementation choices can remain supporting design work unless the argument depends on them.

## 4. Choose a coherent baseline

A catalogue of possibilities does not yet describe a proposed solution. Select ordinary behavior so a reader can follow one complete case. Record consequential alternatives separately.

Keep three distinctions visible:

- **Proposed design:** the intended behavior and contracts.
- **MVP coverage:** the subset to implement first.
- **Unverified capability:** something whose feasibility still needs evidence.

For our baseline, the agent reviews supplied IR, edits a working copy and receives check results. Search stops at the first qualifying finding or its configured limits. Additional analyses, specialized editing tools and more elaborate search policies remain research options.

This settles a proposal without claiming it has been implemented or validated.

## 5. Check that the parts compose

Walk through a normal case, an unsuccessful case and a relevant interruption. Check that each activity receives what it needs and preserves the information needed later.

Review combined dependencies. In our project, individually plausible compilation, validation and metric tools may still be incompatible at the selected IR checkpoints. These combinations require investigation.

Allow later requirements to revise earlier sections. Reproducible findings required a shared execution recipe during initial evaluation. Recovery required persistence throughout the investigation. Neither could be confined to the final step.

Keep different kinds of evidence distinct. Successful compilation, matching tested results and a better metric value support different claims. Record coverage and unresolved conditions rather than collapsing them into “works.”

## 6. Establish research directions and explain confidence

Revisit each part of the mechanism for choices that warrant investigation. For each resulting direction, record:

- What to investigate and why it matters to the proposal.
- The open questions or decisions it addresses.
- A possible investigation and the evidence it should produce.
- Its role in the proposal and selection status: core feasibility, optional comparison or later extension; selected or unselected.

A question identifies something to establish; a direction describes a line of work for investigating it. Not every unknown needs a separate direction, and recording one does not commit the project to pursuing it.

For each supporting example or paper, identify:

- What it demonstrates in its own setting.
- Which part we propose to reuse or adapt.
- What remains unestablished in our setting.

Literature can support individual mechanisms without proving the project's overall benefit. Explain the remaining causal argument and the conditions under which it would fail. Evaluation details belong in H08; H03 must still make clear what needs demonstration.

Put substantive uncertainties in linked question notes, including the decision or claim their answers could change. Keep unselected possibilities as directions and editorial work as TODOs. An unresolved feasibility dependency must remain visible even when the proposal is ready for discussion.

## 7. Review readiness and stop drafting

H03 is sufficiently answered when a reader can explain:

- What changes relative to H02, and how that supports H01.
- How one complete case proceeds and what it produces.
- The baseline behavior, responsibilities and important boundaries.
- Why the benefit is plausible, and what evidence is still missing.
- Which choices are settled for the proposal and which remain open.
- Which research directions emerged, why they matter and whether they are selected.

Keep the central explanation understandable without following every link. Retain detailed design notes as support; they need not all fit into the pitch.

The project owner accepts the answer. Acceptance permits progress with a stated proposal; it does not establish feasibility, demonstrate the benefit or close the linked research questions. Revisit H03 when evidence changes its assumptions.
