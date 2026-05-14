---
node_class: claim
claim_id: CLM-21
claim_label: PSIG-002 Outbound Fan-Out Pressure
claim_type: signal
exposure: PZ-001,PZ-002,PZ-003
lens_admissible: YES
status: ACTIVE
stream_id: PI.SECOND-CLIENT.STEP14F-A.PSIG-VAULT-AUTHORITY-REPAIR.01
---

## Explanation

PSIG-002 measures outbound dependency fan-out pressure at the domain level. A domain is flagged HIGH when its outbound dependency count exceeds the run-relative outlier threshold (>2.0x run mean). IQR degenerate for this run — mean+2SD fallback boundary of 6.228 applied.

Activation state: HIGH. Activation method: RUN_RELATIVE_OUTLIER. Threshold: 2.0x run mean (fallback: mean+2SD=6.228).

Activating entities:
- DOM-04 (primary): fan_out=13, ratio=9.43x — frontend_isolated
- DOM-03 (secondary): fan_out=10, ratio=7.26x — backend_isolated
- DOM-05 (secondary): fan_out=7, ratio=5.08x — platform_monorepo

Signal value: 9.43 (max domain-level ratio). Active in zones: PZ-001, PZ-002, PZ-003.

## Authoritative Value

9.43

## Traceability

- Source: `signal_projection.json:active_conditions_in_scope[PSIG-002]`
- Condition: COND-PSIG-002-01
- Evidence traces: `pressure_zone_state.json:zones[PZ-001/PZ-002/PZ-003]:evidence_trace[PSIG-002]`
- Authority: PROVISIONAL_CKR_CANDIDATE (75.x / 41.x)
- Contract: PI.CONDITION-CORRELATION.ANALYSIS.75X.03 → PI.41X.PRESSURE-ZONE.PROJECTION.01
- Statistical note: IQR degenerate; mean+2SD fallback boundary=6.228 applied
