---
node_class: transformation
transformation_id: TRN-06
transformation_name: Concept Resolution
stage: Product surface (overview.js runtime)
command: resolver.js evaluate()
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Purpose
Evaluates 19 active concept predicates from concepts.json against live gauge + topology API data. Maps matched concepts to phrase templates in phrases.json. Drives all narrative text in overview.js.

## Inputs
- /api/gauge response (gauge_state.json fields)
- /api/topology response (canonical_topology.json fields)
- concepts.json — 19 active concept definitions + 3 deferred (CONCEPT-D01/02/03)
- phrases.json (Version 1.2) — phrase templates with placeholders

## Outputs
- matchedConcepts[] — drives all visible text in overview.js
- ExecutiveDecisionBlock verdicts (STRUCTURE/COMPLEXITY/EXECUTION)
- Executive section phrases (three sections: Under Control / Concentration / Outside Visibility)

## Rules
Field paths resolved by resolver.js: DIM-XX, score.*, state.*, confidence.*, projection.*, summary.*, constraint_flags.*, orphans. Verdicts: STRUCTURE = CONCEPT-01 ∧ CONCEPT-03 ∧ CONCEPT-14; COMPLEXITY = any of CONCEPT-08/09/16; EXECUTION = CONCEPT-06.

## Known Gap
CONCEPT-06 predicate: `score.components.completion_points == 0 AND state.execution_status == 'PHASE_1_ACTIVE'` — will not match NOT_EVALUATED on Stream 10 schema. EXECUTION verdict may not trigger correctly on run_authoritative_recomputed_01.

## Claims Produced
[[CLM-25 Executive Three-Axis Verdict]] [[CLM-26 Executive Narrative Phrase Set]]
