---
node_class: claim
claim_id: CLM-23
claim_label: PSIG-006 Structural Blind-Spot Activation
claim_type: signal
exposure: NONE
lens_admissible: YES
status: ACTIVE
stream_id: PI.SECOND-CLIENT.STEP14F-A.PSIG-VAULT-AUTHORITY-REPAIR.01
---

## Explanation

PSIG-006 is the Structural Blind-Spot signal. It activates when entities have zero measurable outbound structural connections within the analysis scope (theoretical baseline condition). Activation is binary — an entity either meets the blind-spot criterion or does not.

Activation state: ACTIVATED. Activation method: THEORETICAL_BASELINE. Threshold: binary (1).

Activated entities (9): DOM-01, DOM-02, NODE-001, NODE-002, NODE-003, NODE-004, NODE-005, NODE-006, NODE-007.

Signal value: 0.20 (activation ratio). No pressure zone assigned — PSIG-006 activates as a structural condition but is not a zone-forming pressure candidate for run_01_oss_fastapi.

## Authoritative Value

0.20 (activation ratio); 9 entities activated

## Traceability

- Source: `signal_projection.json:active_conditions_in_scope[PSIG-006]`
- Condition: COND-PSIG-006-01
- Activated entity set: `pressure_zone_state.json:structural_blind_spot_entities`
- Authority: PROVISIONAL_CKR_CANDIDATE (75.x / 41.x)
- Contract: PI.CONDITION-CORRELATION.ANALYSIS.75X.03 → PI.41X.PRESSURE-ZONE.PROJECTION.01
- Note: Zone not assigned — no pressure candidate designation
