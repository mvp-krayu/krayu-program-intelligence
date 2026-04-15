---
node_class: claim
claim_id: CLM-03
claim_label: Structural Reconstruction Pass-Fail
claim_type: verdict
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

The reconstruction state is determined by testing 30 admitted units across four structural axes. All four axes returned PASS. This means the structural model is internally consistent: all units are complete, properly linked, referentially intact, and layer-consistent. A single FAIL on any axis would produce an overall FAIL.

## Authoritative Value

PASS

## Source Fields

- `gauge_state.json` → `dimensions.DIM-02.state`
- `reconstruction_state.json` → `state=PASS`

## Upstream Artifacts

- [[ART-03 reconstruction_state.json]]
- [[ART-01 gauge_state.json]]

## Transformation Chain

- IG.RUNTIME structural reconstruction validation (S1)

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES — "structural consistency confirmed"
- Reason: Audience-appropriate rephrasing required

## Traceability

- Status: FULL
- Caveats: None — all axis_results=PASS

## Surfaces

- RuntimeIntelligence panel
- CONCEPT-03 resolution
