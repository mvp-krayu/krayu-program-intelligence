---
node_class: claim
claim_id: CLM-24
claim_label: PSIG-003 Inbound Coupling Ratio Not Activated
claim_type: signal
exposure: NOT_ACTIVATED
lens_admissible: YES
status: ACTIVE
stream_id: PI.SECOND-CLIENT.STEP14F-A.PSIG-VAULT-AUTHORITY-REPAIR.01
---

## Explanation

PSIG-003 is the Inbound Coupling Ratio signal. It measures the ratio of inbound coupling edges relative to total structural surface at the entity level. Status for run_01_oss_fastapi: NOT_ACTIVATED — signal evaluation was performed; no entities exceeded the activation threshold for this signal.

Activation state: NOT_ACTIVATED.

## Authoritative Value

NOT_ACTIVATED

## Traceability

- Source: `signal_projection.json:signals_not_activated`
- Authority: PROVISIONAL_CKR_CANDIDATE (75.x / 41.x)
- Contract: PI.CONDITION-CORRELATION.ANALYSIS.75X.03 → PI.41X.PRESSURE-ZONE.PROJECTION.01
