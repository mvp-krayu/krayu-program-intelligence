---
node_class: claim
claim_id: CLM-04
claim_label: Four-Axis Reconstruction Detail
claim_type: metric
exposure: ZONE-1
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

Reconstruction is evaluated across four axes. Each axis tests a distinct structural property of the admitted unit set. All four returned PASS: COMPLETENESS=PASS, STRUCTURAL_LINK=PASS, REFERENTIAL_INTEGRITY=PASS, LAYER_CONSISTENCY=PASS. The axis names are technical PSEE terms; for LENS audiences with CTO context, axis names plus verdicts may be shown.

## Authoritative Value

COMPLETENESS=PASS, STRUCTURAL_LINK=PASS, REFERENTIAL_INTEGRITY=PASS, LAYER_CONSISTENCY=PASS

## Source Fields

- `gauge_state.json` → `dimensions.DIM-02.axis_results`
- `reconstruction_state.json` → `axis_results`

## Upstream Artifacts

- [[ART-03 reconstruction_state.json]]
- [[ART-01 gauge_state.json]]

## Transformation Chain

- IG.RUNTIME structural reconstruction validation (S1)

## Exposure

- ZONE: ZONE-1 (full axis table) / ZONE-2 conditional (CTO audience: axis names + verdicts)
- LENS admissible: CONDITIONAL (CTO) / NO (CEO)
- Reason: Axis names are technical — phrased narratively for non-technical LENS

## Traceability

- Status: FULL
- Caveats: None

## Surfaces

- RuntimeIntelligence axis table
- CONCEPT-03 resolution detail
