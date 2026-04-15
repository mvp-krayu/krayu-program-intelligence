---
node_class: claim
claim_id: CLM-11
claim_label: Score Band Classification
claim_type: classification
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

The score band is CONDITIONAL. This band reflects the split execution state: the canonical score (60) is proven and the projected score (100) is achievable, but the execution layer has not been evaluated. The band label in raw form is ZONE-1; for LENS, it is rendered as "floor established, ceiling defined."

## Authoritative Value

CONDITIONAL

## Source Fields

- `gauge_state.json` → `score.band_label`

## Upstream Artifacts

- [[ART-01 gauge_state.json]]

## Transformation Chain

- pios compute gauge (S4)

## Exposure

- ZONE: ZONE-1 (raw label) / ZONE-2 (narrative: "floor established, ceiling defined")
- LENS admissible: YES (narrative form)
- Reason: Band label raw text is ZONE-1; narrative form for LENS

## Traceability

- Status: FULL
- Caveats: Band is CONDITIONAL due to execution not evaluated

## Surfaces

- StatusBand component
