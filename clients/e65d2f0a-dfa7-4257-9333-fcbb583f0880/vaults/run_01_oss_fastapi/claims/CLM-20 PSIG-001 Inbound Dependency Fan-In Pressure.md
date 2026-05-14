---
node_class: claim
claim_id: CLM-20
claim_label: PSIG-001 Inbound Dependency Fan-In Pressure
claim_type: signal
exposure: PZ-001,PZ-002,PZ-003
lens_admissible: YES
status: ACTIVE
stream_id: PI.SECOND-CLIENT.STEP14F-A.PSIG-VAULT-AUTHORITY-REPAIR.01
---

## Explanation

PSIG-001 measures inbound dependency fan-in pressure at the entity level. A node is flagged HIGH when its inbound dependency count exceeds the run-relative outlier threshold (>2.0x run mean).

Activation state: HIGH. Activation method: RUN_RELATIVE_OUTLIER. Threshold: 2.0x run mean.

Activating entities:
- NODE-009 (primary): fan_in=13, ratio=9.43x — domain DOM-04 (frontend_isolated)
- NODE-008 (secondary): fan_in=10, ratio=7.26x — domain DOM-03 (backend_isolated)
- NODE-010 (secondary): fan_in=9, ratio=6.53x — domain DOM-05 (platform_monorepo)

Signal value: 9.43 (max entity-level ratio). Active in zones: PZ-001, PZ-002, PZ-003.

## Authoritative Value

9.43

## Traceability

- Source: `signal_projection.json:active_conditions_in_scope[PSIG-001]`
- Condition: COND-PSIG-001-01
- Evidence traces: `pressure_zone_state.json:zones[PZ-001/PZ-002/PZ-003]:evidence_trace[PSIG-001]`
- Authority: PROVISIONAL_CKR_CANDIDATE (75.x / 41.x)
- Contract: PI.CONDITION-CORRELATION.ANALYSIS.75X.03 → PI.41X.PRESSURE-ZONE.PROJECTION.01
