---
node_class: claim
claim_id: CLM-06
claim_label: Runtime Unknown-Space Count
claim_type: metric
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

The unknown-space count is 0. Caveat: this reflects minimum observable state — `us_records` were not available in declared input artifacts. The count of 0 means no unknown-space records were observed, not that the space is proven zero. This distinction must accompany any LENS surface of this claim.

## Authoritative Value

0 (minimum observable state — not proven zero)

## Source Fields

- `gauge_state.json` → `dimensions.DIM-04.total_count`

## Upstream Artifacts

- [[ART-01 gauge_state.json]]

## Transformation Chain

- DIM-04 minimum observable state projection (S4)

## Exposure

- ZONE: ZONE-2 (CONDITIONAL — caveat must be surfaced)
- LENS admissible: CONDITIONAL
- Reason: Caveat (minimum observable state, not proven zero) must accompany

## Traceability

- Status: PARTIAL
- Caveats: us_records not available in declared input artifacts; DIM-04 reflects minimum observable state per GAUGE.STATE.COMPUTATION.CONTRACT.01 §4.5

## Surfaces

- RuntimeIntelligence panel (with caveat)
