---
node_class: claim
claim_id: CLM-17
claim_label: Cross-Domain Structural Overlaps
claim_type: count
exposure: ZONE-2
lens_admissible: CONDITIONAL
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation
The canonical topology model (17/42/89) has no cross-domain overlap edges — the single cross_domain_ref on COMP-25 ("DOM-01") is a known source peculiarity preserved as a node field, not an edge. The binding_envelope for client run_335c0575a080 shows 2 structural overlaps: OVL-01 (DOM-03↔DOM-05-C) and OVL-02 (DOM-04↔DOM-05-D). These are different evidence layers and are not contradictory — canonical answers what is structurally present; binding_envelope answers how the client's system specifically structures that presence.

## Authoritative Value
0 in canonical model; 2 in binding_envelope (run_335c0575a080)

## Source Fields
- `canonical_topology.json` → `topology.summary.overlap_edges_count` = 0
- `binding_envelope` → `constraint_flags.overlap_count` = 2 (run_335c0575a080)

## Upstream Artifacts
- [[ART-04 canonical_topology.json]]
- binding_envelope run_335c0575a080

## Transformation Chain
- Canonical: topology.summary.overlap_edges_count=0
- Envelope: OVL-01 (DOM-03↔DOM-05-C), OVL-02 (DOM-04↔DOM-05-D) → overlap_count=2

## Entity Links
- Stage of origin: S2 (canonical) / binding derivation (envelope path)

## Exposure
- ZONE: ZONE-2
- LENS admissible: CONDITIONAL
- Reason: ZONE-2 YES for canonical (0 overlaps); CONDITIONAL for envelope (2 overlaps — scope must be stated)

## Traceability
- Status: FULL for both models
- Caveats: Two distinct evidence layers — canonical and binding_envelope. Values are not contradictory; scope must be explicit when surfacing either value.

## Surfaces
- TopologySummaryPanel "Structural overlaps: 0 (OVL flag absent)"
- StatusBand "Cross-Domain: 0"
- CONCEPT-08 / CONCEPT-09
