---
node_class: claim
claim_id: CLM-22
claim_label: PSIG-004 Structural Surface Pressure
claim_type: signal
exposure: PZ-001,PZ-002,PZ-003
lens_admissible: YES
status: ACTIVE
stream_id: PI.SECOND-CLIENT.STEP14F-A.PSIG-VAULT-AUTHORITY-REPAIR.01
---

## Explanation

PSIG-004 measures structural surface pressure — the volume of capability surface area (outward-facing edges) attributable to a node relative to the run baseline. A node is flagged HIGH when its surface count exceeds the run-relative outlier threshold (>2.0x run mean).

Activation state: HIGH. Activation method: RUN_RELATIVE_OUTLIER. Threshold: 2.0x run mean.

Activating entities:
- NODE-009 (primary): surfaces=13, ratio=4.33x — domain DOM-04 (frontend_isolated)
- NODE-008 (secondary): surfaces=10, ratio=3.33x — domain DOM-03 (backend_isolated)
- NODE-010 (secondary): surfaces=7, ratio=2.33x — domain DOM-05 (platform_monorepo)

Signal value: 4.33 (max entity-level ratio). Active in zones: PZ-001, PZ-002, PZ-003.

## Authoritative Value

4.33

## Traceability

- Source: `signal_projection.json:active_conditions_in_scope[PSIG-004]`
- Condition: COND-PSIG-004-01
- Evidence traces: `pressure_zone_state.json:zones[PZ-001/PZ-002/PZ-003]:evidence_trace[PSIG-004]`
- Authority: PROVISIONAL_CKR_CANDIDATE (75.x / 41.x)
- Contract: PI.CONDITION-CORRELATION.ANALYSIS.75X.03 → PI.41X.PRESSURE-ZONE.PROJECTION.01
