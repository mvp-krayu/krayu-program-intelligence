---
node_class: claim
claim_id: CLM-06
claim_label: Runtime Unknown-Space Count
claim_type: count
exposure: ZONE-2
lens_admissible: CONDITIONAL
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

DIM-04 total_count=0 reflects the minimum observable state from static analysis. It does not claim zero unknown runtime elements — it claims zero are observable in the current evidence basis. The binding_envelope path (client run_335c0575a080) shows 3 unknown_space records. These apply to different evidence scopes and are not contradictory. The caveat recorded in gauge_state.json states: "us_records not available in declared input artifacts." This is a scope boundary, not a structural gap.

## Authoritative Value

0 (NONE) — caveat: minimum observable state

## Source Fields

- `gauge_state.json` → `dimensions.DIM-04.total_count`

## Upstream Artifacts

- [[gauge_state.json]]
- [[binding_envelope (client run_335c0575a080)]]

## Transformation Chain

- [[S-13 terminal state invariant]]

## Entity Links

N/A

## Exposure

- ZONE: ZONE-2
- LENS admissible: CONDITIONAL
- Reason: Caveat must accompany: "No structural unknowns observable in current evidence. Runtime behavior assessment pending."

## Traceability

- Status: PARTIAL
- Caveats: gauge_state.json records "us_records not available in declared input artifacts"; binding_envelope shows 3 unknown_space records in a different evidence scope

## Surfaces

- RuntimeIntelligence panel (DIM-04 "0 records")
- StatusBand ("Runtime Unknown: 0")
- CONCEPT-04 resolution
- CONCEPT-05 resolution
