# Usage scenarios

**Status: discussion drafts for review.** These describe proposed user journeys for AscendNPU-IR optimization discovery. They inform architecture, interfaces and the pitch; unresolved choices are recorded in each document. Current MVP planning is recorded in [[questions/H07 - How long will it take|H07]]. Assigning a scenario or extension to a delivery stage requires a scope decision.

Every scenario follows [[templates/Usage Scenario|the shared template]], including preparation, user/framework actions, alternative outcomes, deliverables, implications, value and open decisions. Stable US identifiers are references, not implementation priorities.

| ID | Scenario | Initiation and purpose |
| --- | --- | --- |
| US01 | [[usage-scenarios/US01 - Investigate a particular kernel\|Investigate a particular kernel]] | Engineer initiates a bounded investigation of a chosen kernel or IR region. |
| US02 | [[usage-scenarios/US02 - Search a collection on demand\|Search a collection on demand]] | Engineer launches a campaign over existing inputs without a known problem in every case. |
| US03 | [[usage-scenarios/US03 - Nightly CI discovery\|Nightly CI discovery]] | A scheduled CI job routinely seeks opportunities without waiting for a noticed problem. |
| US04 | [[usage-scenarios/US04 - Investigate an optimization hypothesis\|Investigate an optimization hypothesis]] | Engineer focuses a single-input or collection search on a suspected opportunity or pass interaction. |
| US05 | [[usage-scenarios/US05 - Review and reproduce a finding\|Review and reproduce a finding]] | Engineer independently reproduces and assesses a candidate from manual or scheduled search. |

## Relationships

Engineer-initiated and CI-initiated investigations provide different operational contexts. A collection is usable in either. A hypothesis is a possible focus within a chosen investigation. Review follows findings from any producer.

These scenarios are distinct from the input modes in [[questions/H03 - What is new in our approach|H03]]: whole-input, specified-range and region-discovery modes can serve several journeys. Recovery and environment continuation are branches within them, supported by [[framework/planning/experiment-contract|the experiment contract]]. Review-based suppression remains a separate proposed research direction, [[directions/D06 - Suppressing engineer-rejected optimization candidates|D06]].

## Scenario-specific starting information

Each scenario needs its own account of the information and guidance its users can supply. The relevant starting points may differ, overlap or remain incomplete as the scenario develops. Derive them during that scenario's manual workflow exploration.

The code-only, region, bottleneck, hypothesis and candidate-rewrite examples discussed for [[usage-scenarios/US01 - Investigate a particular kernel|US01]] are starting points for that scenario. Other journeys need their own treatment. For example, broad [[usage-scenarios/US03 - Nightly CI discovery|nightly CI discovery]] starts from a configured corpus and project settings and delegates opportunity selection; it requires no per-kernel range or hypothesis from an engineer.

The shared requirement is to establish the meaningful inputs and intended delegation for each scenario before choosing its interaction design. The amount of supplied guidance and ongoing engineer involvement are separate choices.

## Manual workflow exploration before automation

**Design principle adopted from the project-owner discussion, 2026-11-13: no automation before workflow optimization.** Here, optimization means improving the investigation workflow through manual trial and error.

First exercise the relevant workflow manually with existing tools, observe how intent and context are conveyed, and refine it from that experience. Use those observations to choose interaction, interface/API and automation designs. CLI, editor integration, an agent conversation and a dedicated workspace remain candidates to examine.

**Deferred work:** identify the meaningful starting information and guidance for each scenario and explore its manual interactions before settling those designs. The existing scenario flows provide proposals for that exploration; manual trials and interface selection remain pending.

## How to develop these drafts

Discuss one journey at a time, starting with what the user already has and the preparation they would need. Resolve its user-visible behavior, then trace the consequences for interfaces and architecture. Keep unselected choices in the open-decisions section and link any later adopted decision to its basis. Cross-scenario dependencies should stay explicit.

The scenarios can supply short examples and selling points for [[Pitch Presentation]]. The presentation can summarize them while these documents retain the details.
