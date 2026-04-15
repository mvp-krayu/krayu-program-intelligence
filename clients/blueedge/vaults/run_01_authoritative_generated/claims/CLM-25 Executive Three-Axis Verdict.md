---
node_class: claim
claim_id: CLM-25
claim_label: Executive Three-Axis Verdict
claim_type: verdict
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

The executive verdicts are Boolean aggregations of resolved concept predicates. STRUCTURE=STRONG because coverage=100% and reconstruction=PASS. COMPLEXITY=LOW because canonical cross-domain overlaps=0. EXECUTION=UNKNOWN because execution_status=NOT_EVALUATED.

**Known risk:** CONCEPT-06 predicate uses `PHASE_1_ACTIVE` and will not correctly match `NOT_EVALUATED` on Stream 10 schema. EXECUTION verdict may not correctly show UNKNOWN on the recomputed run. This is a production risk documented in [[Known Gaps]].

## Authoritative Value

STRUCTURE=STRONG, COMPLEXITY=LOW, EXECUTION=UNKNOWN

## Source Fields

- STRUCTURE: `gauge_state.json` → DIM-01.coverage_percent, DIM-02.state
- COMPLEXITY: `canonical_topology.json` → cross-domain overlap count
- EXECUTION: `gauge_state.json` → state.execution_status

## Upstream Artifacts

- [[ART-01 gauge_state.json]]
- [[CLM-03 Structural Reconstruction Pass-Fail]]
- [[CLM-09 Proven Structural Score]]
- [[CLM-13 Execution Layer Status]]

## Transformation Chain

- Concept predicates → resolver.js evaluation → three-axis verdict

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES — primary LENS surface claim
- Reason: Highest-impact client-facing summary

## Traceability

- Status: FULL
- Caveats: CONCEPT-06 predicate mismatch — see [[Known Gaps]]

## Why It Matters

The three-axis verdict is the highest-level summary of the assessment state. STRUCTURE=STRONG means the platform's structural evidence is complete, coherent, and verified — this backs the 60-point floor. COMPLEXITY=LOW means no structural overlaps or orphaned components were found, reducing integration risk. EXECUTION=UNKNOWN is the pending dimension: it does not mean the platform is problematic; it means the assessment is incomplete until runtime evaluation runs.

## Surfaces

- ExecutiveDecisionBlock in overview.js
- Known gap: CONCEPT-06 predicate mismatch on record
