---
node_class: claim
claim_id: CLM-27
claim_label: Full Node Inventory 148 Nodes
claim_type: entity-summary
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation
Every node has a canonical ID, name, depth, and structural type. The full 148-node set is available in the topology API response and browsable in the topology explorer page. Domain-level names are business-meaningful (e.g., "Edge Data Acquisition", "Platform Infrastructure and Data") and are ZONE-2 safe. Component-level names (e.g., "RedisCacheModule", "hasi_bridge.py") are operator-level technical identifiers.

## Authoritative Value
148 nodes: 17 domains + 42 capabilities + 89 components

## Source Fields
- `canonical_topology.json` → `domains[]` (count=17)
- `canonical_topology.json` → `capabilities[]` (count=42)
- `canonical_topology.json` → `components[]` (count=89)

## Upstream Artifacts
- [[ART-04 canonical_topology.json]]
- [[CLM-14 Structural Domain Count]]
- [[CLM-15 Structural Capability Count]]
- [[CLM-16 Structural Component Count]]

## Transformation Chain
- pios emit topology → canonical_topology.json → domains[] + capabilities[] + components[] → 17 + 42 + 89 = 148 total nodes

## Entity Links
- Stage of origin: S2

## Exposure
- ZONE: ZONE-2
- LENS admissible: YES
- Reason: Domain names only at ZONE-2 (e.g., "Edge Data Acquisition", "Platform Infrastructure and Data"); individual component names (e.g., "RedisCacheModule", "hasi_bridge.py") are ZONE-1 (too technical for non-CTO)

## Traceability
- Status: FULL
- Caveats: None

## Surfaces
- Topology explorer (TopologyAddon): full nodes[] array browsable in UI
- Topology API response: complete 148-node inventory available
- Domain-level names: ZONE-2 safe for LENS surface
- Component-level names: ZONE-1 only (operator/CTO audience)
