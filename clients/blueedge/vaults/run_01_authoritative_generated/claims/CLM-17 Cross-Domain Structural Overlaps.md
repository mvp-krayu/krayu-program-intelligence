---
node_class: claim
claim_id: CLM-17
claim_label: Cross-Domain Structural Overlaps
claim_type: metric
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

The canonical topology shows 0 cross-domain overlaps. Cross-domain overlaps indicate structural nodes that participate in more than one domain boundary.

## Authoritative Value

0 (canonical model)

## Source Fields

- `canonical_topology.json` → domain records with `cross_domain=true`


## Upstream Artifacts

- [[ART-04 canonical_topology.json]]


## Transformation Chain

- S2 topology emission / S3 binding projection

## Exposure

- ZONE: ZONE-2 (canonical 0); CONDITIONAL for envelope model
- LENS admissible: YES (canonical); CONDITIONAL (envelope — requires explanation)
- Reason: If envelope overlaps are surfaced in LENS, must explain what they mean

## Traceability

- Status: FULL
- Caveats: None for canonical model

## Surfaces

- TopologyExplorer
