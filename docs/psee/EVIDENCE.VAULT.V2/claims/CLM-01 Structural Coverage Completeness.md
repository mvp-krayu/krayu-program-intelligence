---
node_class: claim
claim_id: CLM-01
claim_label: Structural Coverage Completeness
claim_type: metric
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

30 admitted artifacts were cross-referenced against the 30 required units declared in admissibility_log.json. 27 units originate from layer artifacts (L40_2:4 + L40_3:6 + L40_4:17) with 3 root artifacts completing the set. All 30 are present. The coverage_percent=100.0 is the first commercial claim — complete structural evidence. This value was emitted by the S1 pios coverage stage and is the authoritative basis for CONCEPT-01 and CONCEPT-02 resolution.

## Authoritative Value

100.0% (30/30 units)

## Source Fields

- `gauge_state.json` → `dimensions.DIM-01.coverage_percent`
- `coverage_state.json` → `state=COMPUTED`, `coverage_percent=100.0`

## Upstream Artifacts

- [[coverage_state.json]]
- [[admissibility_log.json]]
- [[gauge_state.json]]

## Transformation Chain

- [[IG.RUNTIME/run_01]]

## Entity Links

N/A

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES
- Reason: Admissible as summary

## Traceability

- Status: FULL
- Caveats: None — coverage_state.json → admissibility_log.json → IG.RUNTIME/run_01

## Surfaces

- RuntimeIntelligence panel (`coverage_percent`)
- CONCEPT-01 resolution
- CONCEPT-02 resolution
