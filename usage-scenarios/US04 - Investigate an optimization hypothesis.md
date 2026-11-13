# US04 — Investigate an optimization hypothesis

**Status:** discussion draft; proposed behavior and unresolved choices.

**Template:** [[templates/Usage Scenario|Usage scenario template]].

## 1. Situation and intended outcome

An engineer has a particular opportunity in mind: for example, range/precision information through casts might permit simplification, or an existing pass might become useful at another pipeline position. A specific input exhibiting a useful effect may still be unknown.

The engineer wants concrete witnesses and their applicability conditions. The hypothesis is a search focus, not an established diagnosis or a requirement that the agent confirm it.

## 2. Actors and trigger

**Primary actor:** compiler engineer investigating an optimization task or broader optimization epic.

**Trigger:** a suspected opportunity, an analysis of generated code or a decision to explore a particular category. The focus can be applied to one input or an existing collection.

## 3. Starting material and preparation

| Material | Preparation and responsibility |
| --- | --- |
| Hypothesis and restrictions | Engineer describes what to investigate and any established conditions. Unestablished assumptions remain visible. |
| Existing examples | One or more kernels/IR snapshots, with supplied case configurations and context. |
| Search dimensions | Engineer authorizes IR edits, supported pipeline variants or both. Concrete allowed pass spaces depend on integration support. |
| Reference and evaluation recipe | Fixed baseline plus comparable checking and metric settings. |
| Case and resource limits | Define available inputs/configurations and the allowed investigation budget. |

The scenario can use supplied shapes/types/layouts and existing test material. Automatically inventing new tests or an arbitrary pass-order search is not assumed.

## 4. Main flow

1. The engineer supplies the hypothesis, examples, known conditions and permitted changes.
2. The framework resolves the input mode and supported scope, including any focused region-selection method.
3. The agent proposes candidates addressing the hypothesis; assumptions required by a candidate remain linked to it.
4. Where supported, comparisons distinguish original IR with another pipeline, rewritten IR with the baseline pipeline, and their combination.
5. The framework applies the configured checks and metric comparison to the supplied cases and records positive, negative and unresolved outcomes.
6. The engineer receives concrete candidate witnesses and the tested conditions; further generalization or compiler diagnosis is a subsequent decision.

## 5. Alternative paths and outcomes

| Event | Proposed handling or decision needed |
| --- | --- |
| Requested pass changes are unsupported | Report the scope limitation; obtain an explicit revised scope before changing the investigation. |
| Candidate needs an additional assumption | Record it as unresolved until established by checking or review. |
| Improvement disappears later in compilation | Retain checkpoint-specific evidence and the downstream result. |
| Only certain supplied configurations improve | Report those conditions and the tested cases without claiming universal applicability. |
| No supporting witness is found | Report the explored cases and limits; the hypothesis remains unestablished. |

## 6. Result and next action

A result links each useful alternative to its original, pipeline, case configuration, assumptions and checking/metric evidence. It can show which tested combinations yielded a useful effect.

The engineer decides whether to investigate a new transformation, analysis or existing-pass placement. A better result alone does not establish why the compiler originally missed it.

## 7. Architecture and interface implications

- The request must carry a search focus and distinguish user-provided facts from hypotheses.
- IR variants, pipeline variants and case configurations need independent identities joined by trials.
- Reports must expose deliberate comparison differences and conditions of applicability.
- Support for configuring categories or pass alternatives requires capability discovery and explicit boundaries.

## 8. Intended value and evaluation

**Intended value:** offload repeated experiments around a focused question and produce concrete evidence for planning compiler work.

Evaluate useful witnesses, breadth of tested applicability, failed/inconclusive cases and investigation effort. Attribute a finding to a specific cause only when further evidence supports that explanation.

## 9. Open decisions

- How should a hypothesis be expressed: instructions, a named category, supplied examples or a combination?
- What classifiers and bounded pass spaces can the integration actually support?
- How should the framework select comparisons across supplied cases and variants?
- What evidence would justify generalizing from individual witnesses to an optimization family?

## 10. Connections

[[usage-scenarios/README|Scenario index]] · [[usage-scenarios/US01 - Investigate a particular kernel|US01]] · [[usage-scenarios/US02 - Search a collection on demand|US02]]

Basis: [[framework/planning/experiment-contract|Kernel/pipeline comparison contract]], [[research/Candidate optimization families|Candidate families]], [[directions/D02 - Systematic investigation of applicability|D02]], [[questions/Q07 - Initial classifiers and code classification scheme|Q07]].
