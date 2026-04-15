---
node_class: claim
claim_id: CLM-05
claim_label: Escalation Clearance
claim_type: verdict
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

Escalation clearance is CLEAR. This is an S-13 invariant: the S-13 terminal state is unreachable if there are open escalations. Because the run reached S-13, escalation clearance is guaranteed at 100. This is a derived claim — there is no direct measurement of escalations; it is logically entailed by the terminal state.

## Authoritative Value

CLEAR

## Source Fields

- `gauge_state.json` → `dimensions.DIM-03.state_label`

## Upstream Artifacts

- [[ART-01 gauge_state.json]]

## Transformation Chain

- S-13 terminal state invariant (S4)

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES — "no blocking conditions found"
- Reason: Derivation rule (S-13 invariant) is ZONE-1 only

## Traceability

- Status: FULL
- Caveats: Derived claim — not directly measured; entailed by S-13 terminal state

## Surfaces

- RuntimeIntelligence panel
