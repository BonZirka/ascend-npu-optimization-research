# US05 — Review and reproduce a finding

**Status:** discussion draft; proposed behavior and unresolved choices.

**Template:** [[templates/Usage Scenario|Usage scenario template]].

**Shared design basis:** [[usage-scenarios/README#Shared specificity ladder|Specificity ladder]] and [[usage-scenarios/README#Manual workflow exploration before automation|manual workflow exploration before automation]].

## 1. Situation and intended outcome

An engineer receives a candidate finding from a manual investigation or a nightly CI run. The reviewer may be a different person and may use a different execution environment.

The engineer wants to understand the proposed change, reproduce the recorded comparison and decide whether it merits compiler investigation. Passing automated checks and improving a metric supply evidence for review; they do not settle every engineering judgment.

## 2. Actors and trigger

**Primary actor:** compiler engineer reviewing a finding.

**Trigger:** a report or bundle becomes available for review. The producing investigation and agent session need not still be running.

## 3. Starting material and preparation

| Material | Preparation and responsibility |
| --- | --- |
| Finding bundle | Producer supplies code variants, conditions, recorded checks/metric results and the exercised replay recipe. |
| Case material | Bundle contains or identifies the harness, inputs and reference material actually used. |
| External bindings | Reviewer resolves required compiler, tools, runtime, data and hardware in the review environment. |
| Comparison context | Reviewer can inspect compiler/pipeline identities, metric meaning, tolerances and evidence limits before rerunning. |

The finding should be replayable without reconstructing a temporary worker directory or the generating agent's live conversation.

## 4. Main flow

1. The engineer inspects the change, applicability conditions, evidence coverage and reported metric effect.
2. The framework loads the saved finding, verifies required artifacts and resolves compatible external bindings.
3. Replay repeats the saved original/candidate compilation, required checks and metric comparison through the recorded recipe.
4. It stores fresh outcomes and the actual environment identity, linked to the original evidence.
5. The engineer assesses compiler relevance, unsupported assumptions, reproducibility and whether the chosen indicator represents a useful opportunity.
6. The engineer decides to investigate further, request additional evidence, defer or reject the candidate. The review interface and exact disposition model remain open.

## 5. Alternative paths and outcomes

| Event | Proposed handling or decision needed |
| --- | --- |
| Required tool, input or hardware is missing | Report the requirement and preserve the unresolved replay. |
| Review environment differs | Make compatibility decisions explicit. Changed timing conditions require fresh baseline/candidate measurements. |
| Replay does not preserve the reported outcome | Retain both observations and the comparison conditions for investigation. |
| Metric improves but the engineer rejects the edit | Preserve the review reason where supported. Persistent suppression of similar proposals is the proposed D06 research direction. |
| More investigation is requested | How a reviewed finding initiates linked follow-up search remains to design. |

## 6. Result and next action

The engineer obtains a saved comparison they can run and inspect, with original and fresh evidence kept distinct. A useful finding can become an input to a compiler task; implementing or merging a compiler change is separate follow-up work.

A rejected finding can still reveal an inadequate assumption, checking policy or metric. Its interpretation should remain linked to the evidence that prompted the review.

## 7. Architecture and interface implications

- Finding export and replay need a stable recipe and portable artifact references.
- Replay evidence must append to, rather than overwrite, the original record.
- The review experience needs to expose assumptions and checking/metric limits alongside the code change.
- Review decisions and links to further searches may require persistent records. D06 adds open questions about reusing rejection decisions across later searches.

## 8. Intended value and evaluation

**Intended value:** reduce the work required to reproduce and assess a proposed opportunity and make review practical for findings produced unattended.

Evaluate successful independent replays, preparation/review effort, evidence clarity and reviewer judgments of usefulness. Track false positives and replay failures alongside accepted cases.

## 9. Open decisions

- **Deferred:** work through the specificity ladder and manually explore the corresponding workflow before choosing interaction, interface/API and automation designs.
- What is the minimum report and replay interface a reviewer can use efficiently?
- How are environment incompatibility and genuine reproduction failure presented?
- Where are review decisions stored, and how do they relate to team issue tracking?
- What evidence is required to treat a review rejection as a reusable restriction? See D06.
- How does a request for more evidence start a linked investigation?

## 10. Connections

[[usage-scenarios/README|Scenario index]] · [[usage-scenarios/US03 - Nightly CI discovery|US03: nightly producer]]

Basis: [[questions/H03 - What is new in our approach|H03 §2.6]], [[framework/planning/experiment-contract|Replay and environment continuation]], [[directions/D06 - Suppressing engineer-rejected optimization candidates|D06]], [[questions/H08 - How will we check success|H08]].
