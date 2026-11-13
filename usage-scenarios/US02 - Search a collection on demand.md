# US02 — Search a collection on demand

**Status:** discussion draft; proposed behavior and unresolved choices.

**Template:** [[templates/Usage Scenario|Usage scenario template]].

**Shared design basis:** [[usage-scenarios/README#Shared specificity ladder|Specificity ladder]] and [[usage-scenarios/README#Manual workflow exploration before automation|manual workflow exploration before automation]].

## 1. Situation and intended outcome

An engineer has a collection of existing kernels or IR snapshots and wants to look for opportunities without an identified problem in each input. This is a deliberately launched search campaign; the engineer need not open a separate task for every kernel.

The desired outcome is a reviewable set of candidate opportunities and a record of which inputs were investigated under the available budget.

## 2. Actors and trigger

**Primary actor:** compiler engineer or optimization investigator.

**Trigger:** a manual request to investigate a chosen collection, perhaps before planning optimization work. A collection can also be used by the separately scheduled CI scenario, US03.

## 3. Starting material and preparation

| Material | Preparation and responsibility |
| --- | --- |
| Input collection | Engineer supplies existing artifacts or references that can be snapshotted. Corpus acquisition remains a setup task. |
| Per-input context | Shared profiles cover compatible inputs; explicit overrides supply different shapes, routes or harnesses where needed. |
| Investigation selection | Whole-input, specified ranges or selected region-discovery capability, resolved explicitly for each input. |
| Search focus | Optional categories/hypotheses guide selection; concrete classifier coverage remains open research. |
| Shared and per-input limits | A campaign budget caps the total work; individual input settings remain within it. |

Generating new test programs is a separate tentative extension. This scenario starts with existing supplied material.

## 4. Main flow

1. The engineer chooses a collection, search focus, supported profiles and campaign limits.
2. The framework resolves the inputs, preserves their identities and reports unsupported or incomplete cases.
3. A selected allocation policy chooses which supported input or region to investigate next. Whole-input and specified-range modes can bypass discovery.
4. Each case follows the candidate generation, checking and comparison process used in US01.
5. The framework retains case-level outcomes and remaining campaign budget, allowing interrupted work to continue.
6. It returns findings with their evidence and a campaign summary that identifies completed, pending, failed and unsupported work.

## 5. Alternative paths and outcomes

| Event | Proposed handling or decision needed |
| --- | --- |
| One input lacks a compatible route | Record the limitation; whether to continue other cases is a campaign policy to define. |
| An input consumes its allowance | Preserve its progress and apply the campaign's next-case policy. |
| Several candidates express the same opportunity | Retain provenance; how to group findings for review remains open. |
| Shared budget is exhausted | Stop scheduling additional work and retain unfinished cases. |
| No cases produce a qualifying finding | Report the exercised cases and evidence limits. |

## 6. Result and next action

The engineer receives individual reproducible findings plus a campaign-level account of work and resource use. Each finding can be inspected independently through US05.

The summary should support decisions about where further engineer investigation is justified. A finding count alone does not establish the number of distinct compiler opportunities.

## 7. Architecture and interface implications

- Requests must represent multiple inputs with shared configuration and controlled overrides.
- Case scheduling needs explicit budget allocation and durable progress.
- Reports need traceability from a campaign to cases, variants, trials and findings.
- Grouping repeated patterns and presenting a manageable review set may affect usability; their mechanisms remain open.

## 8. Intended value and evaluation

**Intended value:** spread bounded investigation across existing code with less manual launching and tracking of individual experiments.

Evaluate distinct useful findings, case coverage, review effort and resource use. Record selection/allocation policy because a heavily favored input can reduce coverage elsewhere.

## 9. Open decisions

- **Deferred:** work through the specificity ladder and manually explore the corresponding workflow before choosing interaction, interface/API and automation designs.
- How should work be allocated across a heterogeneous collection?
- Does the first corpus route investigate entire inputs or require region discovery?
- How are equivalent opportunities grouped without hiding distinct applicability conditions?
- What campaign summary makes unfinished work and evidence coverage clear?

## 10. Connections

[[usage-scenarios/README|Scenario index]] · [[usage-scenarios/US01 - Investigate a particular kernel|US01: individual case]] · [[usage-scenarios/US03 - Nightly CI discovery|US03: scheduled discovery]]

Basis: [[questions/H03 - What is new in our approach|H03 input modes, collection budgets and search policy]], [[questions/Q07 - Initial classifiers and code classification scheme|Q07: discovery]].
