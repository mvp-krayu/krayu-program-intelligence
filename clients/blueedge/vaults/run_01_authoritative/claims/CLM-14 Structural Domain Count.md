---
node_class: claim
claim_id: CLM-14
claim_label: Structural Domain Count
claim_type: count
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation
The 17 domains are the root-level structural nodes in the canonical topology. Each domain represents a distinct functional boundary in the BlueEdge system (e.g., "Edge Data Acquisition", "Platform Infrastructure and Data", "Operational Engineering"). They are the binding contexts for capabilities and components. Domains are depth=0 nodes with is_root=true in the topology model.

## Authoritative Value
17

## Source Fields
- `canonical_topology.json` → `domains[]` (count=17)

## Upstream Artifacts
- [[ART-04 canonical_topology.json]]

## Transformation Chain
- pios emit topology → canonical_topology.json → domains[] count

## Entity Links
- Stage of origin: S2 (pios emit topology → canonical_topology.json)

## Exposure
- ZONE: ZONE-2
- LENS admissible: YES
- Reason: "17 structural domains identified"

## Traceability
- Status: FULL
- Caveats: None

## Surfaces
- TopologySummaryPanel "Domains: 17"
- StatusBand "Domains: 17"
- CONCEPT-17
