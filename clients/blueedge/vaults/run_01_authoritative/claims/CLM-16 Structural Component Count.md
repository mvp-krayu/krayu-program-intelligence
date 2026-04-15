---
node_class: claim
claim_id: CLM-16
claim_label: Structural Component Count
claim_type: count
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation
Components are the leaf-level structural nodes representing individual modules, files, services, or functional units. 89 components across 42 capability surfaces across 17 domains = 148 total nodes. Components are depth=2 nodes in the topology model.

## Authoritative Value
89

## Source Fields
- `canonical_topology.json` → `components[]` (count=89)

## Upstream Artifacts
- [[canonical_topology.json]]
- [[CLM-14 Structural Domain Count]]
- [[CLM-15 Structural Capability Count]]

## Transformation Chain
- pios emit topology → canonical_topology.json → components[] count
- 17 domains + 42 capabilities + 89 components = 148 total nodes (summary.nodes_count)

## Entity Links
- Stage of origin: S2

## Exposure
- ZONE: ZONE-2
- LENS admissible: YES
- Reason: "89 structural components identified"

## Traceability
- Status: FULL
- Caveats: None

## Surfaces
- TopologySummaryPanel "Components: 89"
- summary.nodes_count=148 total
