---
node_class: claim
claim_id: CLM-13
claim_label: Execution Layer Status
claim_type: status
exposure: ZONE-2
lens_admissible: CONDITIONAL
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation
NOT_EVALUATED means the execution engine has not yet been run against this structural model. PHASE_1_ACTIVE is the legacy pre-Stream-10 equivalent. Both mean: execution assessment is pending. This drives the completion_points gate (0 until evaluated) and the projected vs canonical score split. NOTE: CONCEPT-06 predicate uses PHASE_1_ACTIVE — will not match NOT_EVALUATED on recomputed run (known semantic gap).

## Authoritative Value
NOT_EVALUATED (Stream 10 schema) / PHASE_1_ACTIVE (legacy)

## Source Fields
- `gauge_state.json` → `state.execution_status`

## Upstream Artifacts
- [[ART-01 gauge_state.json]]
- [[CLM-10 Achievable Score Projected]]
- [[CLM-12 Score Confidence Range]]

## Transformation Chain
- execution_status=NOT_EVALUATED → completion_points=0 → score split active
- execution_status resolved → completion_points computed → score unified

## Entity Links
- Stage of origin: S4
- Known semantic gap: CONCEPT-06 predicate uses PHASE_1_ACTIVE; will not match NOT_EVALUATED on recomputed run

## Exposure
- ZONE: ZONE-2
- LENS admissible: CONDITIONAL
- Reason: "execution layer pending" is admissible in ZONE-2; raw status string (NOT_EVALUATED / PHASE_1_ACTIVE) is ZONE-1 only

## Traceability
- Status: FULL
- Caveats: Legacy/current schema mismatch on execution_status value (PHASE_1_ACTIVE vs NOT_EVALUATED)

## Surfaces
- RuntimeIntelligence DIM display
- ExecutiveDecisionBlock EXECUTION verdict
- CONCEPT-06
