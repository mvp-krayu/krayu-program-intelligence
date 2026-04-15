---
node_class: claim
claim_id: CLM-27
claim_label: Full Node Inventory 148 Nodes
claim_type: metric
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

The canonical topology contains 148 total nodes: 17 domains, 42 capabilities, 89 components. For LENS audiences, domain names only are surfaced; component-level names are ZONE-0/3 only.

## Authoritative Value

148 nodes (17 domains / 42 capabilities / 89 components)

## Source Fields

- `canonical_topology.json` → `counts.total_nodes`

## Upstream Artifacts

- [[ART-04 canonical_topology.json]]

## Transformation Chain

- S2 topology emission

## Exposure

- ZONE: ZONE-1 (full node explorer) / ZONE-2 (domain names only)
- LENS admissible: YES (domain names) / CONDITIONAL (component names where client-recognizable)
- Reason: Component-level names may be too technical for non-CTO audiences

## Traceability

- Status: FULL
- Caveats: None

## Surfaces

- TopologyExplorer (full 148-node graph)
- LENS: domain names only (17 domain names as named areas)
