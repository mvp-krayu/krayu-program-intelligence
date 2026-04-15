---
node_class: claim
claim_id: CLM-04
claim_label: Four-Axis Reconstruction Detail
claim_type: verdict
exposure: ZONE-1
lens_admissible: CONDITIONAL
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

Each axis probes a distinct structural consistency property. COMPLETENESS performs a presence check against all required units. STRUCTURAL_LINK validates edge integrity across the assembled representation. REFERENTIAL_INTEGRITY confirms ID cross-reference coherence. LAYER_CONSISTENCY validates mutual compatibility across layers 40.2, 40.3, and 40.4. All four axes return PASS. These results are present only in run_authoritative_recomputed_01; the legacy run_01_authoritative schema does not include axis_results.

## Authoritative Value

- COMPLETENESS: PASS
- STRUCTURAL_LINK: PASS
- REFERENTIAL_INTEGRITY: PASS
- LAYER_CONSISTENCY: PASS

## Source Fields

- `reconstruction_state.json` → `axis_results`

## Upstream Artifacts

- [[ART-03 reconstruction_state.json]]
- run_authoritative_recomputed_01

## Transformation Chain

- run_authoritative_recomputed_01

## Entity Links

N/A

## Exposure

- ZONE: ZONE-1 (full); ZONE-2 (conditional — CTO audience only)
- LENS admissible: CONDITIONAL
- Reason: CTO audience required for ZONE-2 axis-level detail

## Traceability

- Status: FULL (recomputed run); PARTIAL (run_01_authoritative — axis_results absent in legacy schema)
- Caveats: axis_results not present in legacy run_01_authoritative schema

## Surfaces

- StructuralMetrics panel ("Recon Axes: 4")
- `axis_results` in run_authoritative_recomputed_01 (individual axis results not rendered in current GAUGE UI)
