---
node_class: claim
claim_id: CLM-11
claim_label: Score Band Classification
claim_type: status
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation
CONDITIONAL means a structural floor has been proven but the execution layer has not been evaluated. The score occupies the range [canonical, projected] = [60, 100]. Band transitions: once execution layer is evaluated, score resolves to a single canonical value and band may change to CONFIRMED or similar.

## Authoritative Value
CONDITIONAL

## Source Fields
- `gauge_state.json` → `score.band_label`

## Upstream Artifacts
- [[gauge_state.json]]
- [[CLM-10 Achievable Score Projected]]
- [[CLM-09 Canonical Score Proven]]

## Transformation Chain
- Score range [60, 100] → band_label=CONDITIONAL
- On execution evaluation → band_label resolves to CONFIRMED or equivalent

## Entity Links
- Stage of origin: S4
- Visible in GAUGE: INDIRECT — drives CONCEPT-12 phrase resolution

## Exposure
- ZONE: ZONE-2
- LENS admissible: YES
- Reason: "proven floor established, achievable ceiling defined"

## Traceability
- Status: FULL
- Caveats: None

## Surfaces
- CONCEPT-12 resolution
- `band_label` in gauge state
