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

Reconstruction tests whether the 30 admitted structural units assemble into a coherent program representation. Four axes are tested: COMPLETENESS, STRUCTURAL_LINK, REFERENTIAL_INTEGRITY, and LAYER_CONSISTENCY. All four axes return PASS. Zero violations were recorded. This verdict was emitted by the S1 pios reconstruction stage and is the authoritative basis for CONCEPT-03 and CONCEPT-18 resolution.

## Authoritative Value

PASS

## Source Fields

- `gauge_state.json` → `dimensions.DIM-02.state`

## Upstream Artifacts

- [[ART-01 gauge_state.json]]
- [[ART-03 reconstruction_state.json]]

## Transformation Chain

- IG.RUNTIME/run_01

## Entity Links

N/A

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES
- Reason: Structural consistency confirmed

## Traceability

- Status: FULL
- Caveats: None

## Surfaces

- RuntimeIntelligence panel (DIM-02 state chip)
- CONCEPT-03 resolution
- CONCEPT-18 resolution
