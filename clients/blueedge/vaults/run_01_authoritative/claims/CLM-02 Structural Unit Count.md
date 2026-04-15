---
node_class: claim
claim_id: CLM-02
claim_label: Structural Unit Count
claim_type: count
exposure: ZONE-1
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

The 30 admitted units are the specific structural artifacts that passed admissibility scoring in the IG pipeline. Each unit represents a file or artifact from the BlueEdge source that was classified, hashed, and accepted into the evidence boundary. These units are the foundation for all downstream structural claims. The count is sourced from DIM-01 fields across both admitted and required dimensions.

## Authoritative Value

30 admitted / 30 required

## Source Fields

- `gauge_state.json` → `dimensions.DIM-01.admissible_units`
- `gauge_state.json` → `dimensions.DIM-01.required_units`
- `gauge_state.json` → `dimensions.DIM-02.validated_units`

## Upstream Artifacts

- [[ART-01 gauge_state.json]]
- [[ART-07 admissibility_log.json]]

## Transformation Chain

- IG.RUNTIME/run_01

## Entity Links

N/A

## Exposure

- ZONE: ZONE-1 (full detail); ZONE-2 (summary: "30 core structural elements")
- LENS admissible: YES
- Reason: N/A

## Traceability

- Status: FULL
- Caveats: None

## Surfaces

- RuntimeIntelligence panel ("30/30 units")
- StructuralMetrics panel ("Validated Units: 30")
