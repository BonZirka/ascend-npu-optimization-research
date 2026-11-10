# Q07 — Initial classifiers and code classification scheme

**Status: open; research deferred.**

**Question:** Which code categories or patterns should the first version recognize, which classifiers could deliver that coverage, and what shared classification scheme is needed to organize and describe them?

## Context

[[questions/H03 - What is new in our approach|H03]] includes selecting promising code regions for investigation. Default search would use a configured set of classifiers; focused search would use a selected subset. Engineer-specified regions can bypass discovery.

Choosing classifiers does not resolve which useful coverage the framework should deliver or whether a common classification scheme is needed. H03 sections 2.2–2.3 describe preparation and prompted agent review of supplied IR as a minimal MVP path, without prerequisite static analysis. Useful category coverage, a shared classification scheme and the value of additional static algorithms or cost models remain open.

## What to investigate

- Candidate code categories and patterns relevant to the target, and why selecting them could support useful investigations.
- Classifier requirements, expected results and the common descriptions or classification scheme needed to understand and compare them.
- Feasible initial coverage, possible default and optional classifiers, and the evidence needed to support those choices.

This question can remain open while the H03 structure and other topics are developed.
