---
node_class: transformation
transformation_id: TRN-06
transformation_name: Concept Resolution
stage: S4
command: GAUGE resolver.js
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Purpose
Evaluates business concept predicates against live assessment data to produce executive narrative phrase outputs.

## Inputs
- [[ART-01 gauge_state.json]] — score, dimensions, execution state
- [[ART-04 canonical_topology.json]] — topology data
- concepts.json — 19 active concept predicate definitions
- phrases.json — phrase templates

## Outputs
- Resolved phrases for all active concepts
- Three-axis executive verdict (STRUCTURE / COMPLEXITY / EXECUTION)

## Known Gap
CONCEPT-06 predicate uses `PHASE_1_ACTIVE` and will not match `NOT_EVALUATED` on Stream 10 schema. EXECUTION verdict may render as VERIFIED rather than UNKNOWN for the recomputed run. See [[Known Gaps]].

## Claims Produced
[[CLM-25 Executive Three-Axis Verdict]] [[CLM-26 Executive Narrative Phrase Set]]
