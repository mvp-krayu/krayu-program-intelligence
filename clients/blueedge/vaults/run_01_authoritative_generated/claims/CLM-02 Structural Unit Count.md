---
node_class: claim
claim_id: CLM-02
claim_label: Structural Unit Count
claim_type: metric
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

30 structural units were admitted through the IG pipeline with 0 excluded. Each unit represents an artifact in the source bundle that passed admissibility classification. The count of 30 is the denominator against which coverage is computed.

## Authoritative Value

30/30

## Source Fields

- `gauge_state.json` → `dimensions.DIM-01.admissible_units`, `DIM-01.required_units`
- `admissibility_log.json` → `summary.admitted`

## Upstream Artifacts

- [[ART-07 admissibility_log.json]]
- [[ART-01 gauge_state.json]]

## Transformation Chain

- IG pipeline admissibility classification

## Exposure

- ZONE: ZONE-1 (count) / ZONE-2 (summary only — "30 core structural elements")
- LENS admissible: YES (count only; individual unit names are ZONE-0/3)
- Reason: Individual file names are technical artifacts not meaningful to executives

## Traceability

- Status: FULL
- Caveats: None

## Surfaces

- RuntimeIntelligence panel
- CONCEPT-02 resolution
