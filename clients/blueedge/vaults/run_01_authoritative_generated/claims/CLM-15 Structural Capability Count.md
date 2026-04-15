---
node_class: claim
claim_id: CLM-15
claim_label: Structural Capability Count
claim_type: metric
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

The canonical topology contains 42 capability surfaces — the mid-level structural groupings between domains and components.

## Authoritative Value

42

## Source Fields

- `canonical_topology.json` → `counts.capabilities`

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

- TopologyExplorer capability count
