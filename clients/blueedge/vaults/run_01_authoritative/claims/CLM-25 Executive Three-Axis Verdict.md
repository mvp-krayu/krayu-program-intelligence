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
The executive verdicts are Boolean aggregations of resolved concept predicates. STRUCTURE=STRONG because CONCEPT-01 (coverage=100%), CONCEPT-03 (reconstruction PASS), and CONCEPT-14 (heuristic PASS) all resolve true. COMPLEXITY=LOW because no envelope overlap (CONCEPT-08 false) and no orphans (CONCEPT-16 false). EXECUTION=UNKNOWN because CONCEPT-06 should match (completion_points=0 AND execution pending) but the predicate uses PHASE_1_ACTIVE and will not trigger on NOT_EVALUATED. This is a known production risk documented in Known Gaps.

## Authoritative Value
STRUCTURE=STRONG, COMPLEXITY=LOW, EXECUTION=UNKNOWN

## Source Fields
- STRUCTURE: `concepts.json` → CONCEPT-01 ∧ CONCEPT-03 ∧ CONCEPT-14
- COMPLEXITY: `concepts.json` → any of CONCEPT-08 / CONCEPT-09 / CONCEPT-16
- EXECUTION: `concepts.json` → CONCEPT-06

## Upstream Artifacts
- `concepts.json`
- `resolver.js`
- [[CLM-03 Structural Reconstruction Pass-Fail]]
- [[CLM-09 Proven Structural Score]]
- [[CLM-13 Execution Layer Status]]

## Transformation Chain
- concepts.json predicates → resolver.js evaluation against live gauge + topology data → three-axis verdict
- Stage of origin: Derived from S1/S2/S4 (no new data source)

## Entity Links
- Stage of origin: S1/S2/S4 (derived)

## Exposure
- ZONE: ZONE-2
- LENS admissible: YES
- Reason: Highest-impact client-facing summary; primary LENS surface claim

## Traceability
- Status: FULL
- Caveats: CONCEPT-06 predicate uses PHASE_1_ACTIVE — will not match NOT_EVALUATED on recomputed run. EXECUTION verdict may not correctly show UNKNOWN on Stream 10 schema. Must be fixed before LENS surface.


## Why It Matters

The three-axis verdict is the highest-level summary of the assessment state and the primary output for executive decision-making. STRUCTURE=STRONG means the platform's structural evidence is complete, coherent, and verified — this is the evidence backing the 60-point floor. COMPLEXITY=LOW means no structural overlaps or orphaned components were found, which reduces integration risk. EXECUTION=UNKNOWN is the critical pending dimension: it does not mean the platform is problematic, it means the assessment is not finished until runtime evaluation completes. Together, these three verdicts answer the executive question: what do we know, what is the structural health, and what still needs to be measured?

## Surfaces
- ExecutiveDecisionBlock in overview.js
- Known gap: CONCEPT-06 predicate mismatch — PHASE_1_ACTIVE vs NOT_EVALUATED. Production risk on record.
