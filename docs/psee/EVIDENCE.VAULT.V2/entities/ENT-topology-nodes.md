---
node_class: entity
entity_id: ENT-topology-nodes
entity_family: Topology Nodes
count: 148 (canonical) / 45 (binding envelope)
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Definition
The structural node set representing the BlueEdge platform architecture in two models: the canonical surface (17 domains, 42 capabilities, 89 components = 148 nodes) from `canonical_topology.json`, and the client-specific binding envelope (45 nodes, 62 edges) from `binding_envelope.json`.

## Dual Model Note
These are different scopes, not contradictory. Canonical = pure platform topology across all clients. Binding envelope = client-specific subset with client relationship model applied.

## Source Origin
Canonical: `canonical_topology.json` → produced by `pios emit topology` (S2)
Binding: `clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/psee/runs/run_335c0575a080/binding/binding_envelope.json`

## Sub-families
- **Domains (17):** depth=0 nodes, is_root=true. Represent distinct functional boundaries (e.g., "Edge Data Acquisition", "Platform Infrastructure and Data")
- **Capabilities (42):** depth=1 nodes. Functional services or surface areas within each domain
- **Components (89):** depth=2 leaf nodes. Individual modules, files, services, or functional units

## Role in Claims
- [[CLM-14 Structural Domain Count]] — 17
- [[CLM-15 Structural Capability Count]] — 42
- [[CLM-16 Structural Component Count]] — 89
- [[CLM-17 Cross-Domain Structural Overlaps]] — 0 canonical / 2 envelope
- [[CLM-27 Full Node Inventory 148 Nodes]] — full set

## Exposure Classification
- ZONE-1: full node explorer with IDs, names, depths
- ZONE-2: domain names only (17 domain names are business-meaningful)
- Component-level names (e.g., "RedisCacheModule"): ZONE-1 technical identifiers
