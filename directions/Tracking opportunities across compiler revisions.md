# Tracking optimization opportunities across compiler revisions

**Status: candidate; not selected.**

Replay discovered cases across compiler revisions to investigate when an opportunity is addressed, reappears or changes.

A framework could turn individual findings into a maintained experimental corpus with associated checks, metrics and provenance.

Open questions: how would cases remain comparable across revisions, and what would distinguish a real change from measurement or representation differences?

## Paper connection

[[papers/LPO]] (§§4.3 and 5.1) records findings and their subsequent compiler fixes. [[papers/PRAGMA]] (§III-C) preserves code together with its experiment history. Automated replay across compiler revisions is an extension proposed in our discussion; neither paper establishes that capability in the form described here.

[[directions/Candidate Directions]] · [[papers/LPO]] · [[papers/PRAGMA]]
