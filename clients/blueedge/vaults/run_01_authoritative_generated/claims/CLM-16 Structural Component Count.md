---
node_class: claim
claim_id: CLM-16
claim_label: Structural Component Count
claim_type: metric
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

The canonical topology contains 89 structural components at the leaf level. These are the most granular nodes in the topology map. Individual component names (e.g., specific module filenames) are ZONE-0/3 only; the count is ZONE-2 safe.

## Authoritative Value

89

## Source Fields

- `canonical_topology.json` → `counts.components`

## Upstream Artifacts

- [[ART-04 canonical_topology.json]]

## Transformation Chain

- S2 topology emission

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES
- Reason: Safe — topology summary

## Traceability

- Status: FULL
- Caveats: None

## Surfaces

- TopologyExplorer component count
