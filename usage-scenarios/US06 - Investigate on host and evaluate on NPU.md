# US06 — Investigate on host and evaluate on NPU

**Status:** discussion draft; proposed behavior and unresolved choices.

**Template:** [[templates/Usage Scenario|Usage scenario template]].

**Shared design basis:** [[usage-scenarios/README#Scenario-specific starting information|Scenario-specific starting information]] and [[usage-scenarios/README#Manual workflow exploration before automation|manual workflow exploration before automation]].

## 1. Situation and intended outcome

An engineer investigates an AscendNPU-IR kernel on a machine without an NPU. They want to propose and assess alternatives using the host capabilities available to them, then perform the device-dependent part of the comparison on an NPU machine later.

The investigation carries the same saved code snapshot from the host to the NPU machine. An initial search may use a host-side metric, while the later NPU stage evaluates runtime. These are stages of one usage scenario. The original and candidate code versions remain available for both assessments; earlier results retain their original meaning.

The desired outcome is a continued investigation that preserves useful host work and establishes device-side evidence when hardware becomes available.

## 2. Actors and trigger

**Primary actor:** engineer investigating the kernel on a host without an NPU.

**Supporting actor:** the same engineer or another operator who later runs the saved comparison in an NPU-capable environment.

**Trigger:** an investigation starts before NPU access is available and later continues from its saved snapshot with device-dependent evaluation. This scenario can occur within an engineer-initiated campaign or a scheduled investigation.

## 3. Starting material and preparation

### Information carried through the stages

| Stage | Available material |
| --- | --- |
| Start on the host | Code, an investigation goal and any engineer guidance. |
| Save host progress | Original/candidate versions, available host checks and metric results, context and outstanding work. |
| Continue on the NPU machine | The saved snapshot plus device execution bindings and the device-side evaluation metric, potentially runtime in place of the host metric. |

Changing the metric is part of this continued investigation. Guidance about regions, bottlenecks or hypotheses comes from the originating scenario and can be retained with the snapshot.

| Material | Preparation and responsibility |
| --- | --- |
| Original and candidate snapshots | Preserve the original kernel/IR, submitted alternatives, pipeline variants and case identities. |
| Host investigation setup | Identify the tools, dialect context, supported compilation/checking steps and any metric genuinely available without an NPU. Their concrete coverage remains to establish. |
| Saved experiment state | Retain assumptions, completed results, pending operations, context/reports, recipes and budget usage independently of the host process. |
| NPU comparison setup | Supply or resolve the required compiler, target, runtime, harness, inputs and hardware bindings when continuing on the device machine. |
| Evaluation objective | Identify the host metric, if any, and the later device metric with its checkpoint, parameters, comparison criterion and measurement protocol. The later objective may differ. |

The host work can produce a proposed improvement and evidence for the exercised host metric/checks. Runtime improvement on the NPU remains to be established by the later comparison.

## 4. Main flow

1. The engineer starts a host investigation with the available code and guidance. The investigation records which requested stages are host-capable and which depend on later NPU access.
2. The engineer and agent explore alternatives. Supported host compilation, checking and metric steps produce recorded outcomes; unavailable stages remain explicit.
3. The investigation saves the exact original/candidate versions, their evidence and enough state and context to continue. Candidate-selection and stopping policy before device feedback remain to design.
4. The engineer makes the saved experiment available on an NPU-capable machine. Initial manual trials can transfer the material and invoke the second stage directly; transfer and remote scheduling interfaces remain open.
5. The device-side execution resolves environment bindings and determines which completed work is compatible. A different compiler, target or effective recipe requires an explicit linked comparison rather than reusing incompatible evidence.
6. The NPU stage assesses the saved snapshot using the selected device-side metric. This can be runtime even when the host used a static metric. Record the assessment recipe and preserve the code identities and prior results.
7. Required compilation continues to runnable artifacts. The saved original and candidates undergo the selected behavior checks and paired device-metric comparison under comparable conditions. Runtime assessment records its own protocol and samples.
8. Results are appended to the investigation, including failures and candidates that do not improve the new metric. Device feedback can guide further proposals in the continued investigation; its exact interaction remains to design.

## 5. Alternative paths and outcomes

| Event | Proposed handling or decision needed |
| --- | --- |
| Host lacks a supported compiler/checker or useful metric | Record the available proposal work and its evidence limits. Which host-only route is worthwhile requires investigation. |
| NPU access is delayed | Keep the saved candidates and pending operations usable without keeping the original host session alive. |
| Required harness, inputs or dependencies are absent on the NPU machine | Identify the missing binding or material before dependent execution. |
| A host-improving candidate is slower on the NPU | Preserve both metric-specific outcomes. A host indicator and a runtime measurement can rank candidates differently. |
| A device-side behavior check fails | Retain the failure evidence; the candidate does not qualify under that checking policy. |
| Hardware or runtime conditions differ from earlier device measurements | Obtain a fresh original/candidate comparison under the current conditions. |
| Transfer or device execution is interrupted | Continue from durable state and reconcile incomplete operations, using explicit compatibility rules. |

## 6. Result and next action

The host produces a portable investigation snapshot with proposed alternatives, available evidence and outstanding work. It may include results under a host-side metric.

The NPU stage adds behavior-check and comparison evidence for the selected device-side objective. The engineer can inspect the original/candidate result under each metric, determine whether an opportunity merits compiler work, or continue the investigation using the new evidence.

Changing the objective does not require recreating the code snapshot or discarding earlier investigation results. Candidate eligibility is evaluated against the selected checks and objective for that comparison.

## 7. Architecture and interface implications

- Code snapshots and candidate identities need to remain usable independently of the metric under which they were first assessed.
- Execution recipes must distinguish completed host work, deferred device work and a new assessment objective.
- The portable record must preserve artifacts, context, provenance and spent budgets across machines.
- Capability resolution must distinguish an unsupported route from a supported operation whose hardware is currently unavailable.
- New metric/check settings require linked records; existing evidence must retain its recorded configuration.
- A delayed device evaluation may change candidate ranking or later search decisions. Selection, continuation and resource policies need manual exploration.

No particular CLI, transfer mechanism, remote executor or storage schema is selected by this scenario.

## 8. Intended value and evaluation

**Intended value:** enable useful investigation before NPU access is available and retain that work for later device evaluation or investigation under another metric.

Evaluate the effort needed to continue on another machine, repeated work avoided, completeness of retained state and evidence, and useful findings after device comparison. If host screening is used to reduce NPU work, measure its cost and how many useful candidates it retains. Resource savings remain a hypothesis to evaluate.

## 9. Open decisions

- **Manual exploration first:** identify useful starting positions and try host-to-NPU continuation before choosing interaction, interface/API and automation designs.
- Which proposal, compilation, checking and metric steps can actually run on the supported host environment without an NPU?
- How is a deferred device stage declared while preserving the requested checking/evaluation requirements?
- What determines which candidates are saved or prioritized before device feedback, particularly when the later metric differs?
- What material must travel with the snapshot, and which dependencies can be resolved externally?
- How does an engineer specify the device-side metric and whether search should continue after the saved candidates are evaluated?
- Which work remains reusable across environment/objective changes, and what must be executed again?
- How are budgets and progress handled across the two stages and linked investigations?

## 10. Connections

[[usage-scenarios/README|Scenario index]] · [[usage-scenarios/US01 - Investigate a particular kernel|US01: kernel investigation]] · [[usage-scenarios/US02 - Search a collection on demand|US02: campaign]] · [[usage-scenarios/US03 - Nightly CI discovery|US03: scheduled search]]

Basis: project-owner discussion, 2026-11-13; [[framework/planning/experiment-contract|Experiment records, pipeline variants and environment continuation]], [[questions/H03 - What is new in our approach|H03 §§2.4–2.6]], [[questions/Q06 - Metrics for assessing LLVM IR and MLIR improvements|Q06]], [[questions/Q08 - Compilation continuation and validation routes|Q08]].
