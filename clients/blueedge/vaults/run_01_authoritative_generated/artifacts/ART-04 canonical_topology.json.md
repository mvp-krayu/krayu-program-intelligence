---
node_class: artifact
artifact_id: ART-04
artifact_name: canonical_topology.json
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Purpose
Canonical platform topology. Maps 148 nodes across 17 domains, 42 capabilities, 89 components.

## Producing Step
S2 topology emission (`emit_canonical_topology.py`)

## Key Fields
- `counts.domains`: 17
- `counts.capabilities`: 42
- `counts.components`: 89
- `counts.total_nodes`: 148
- `domains`: array of 17 domain objects with domain_name, capability_ids, component_ids

## Claims Grounded
[[CLM-14 Structural Domain Count]] [[CLM-15 Structural Capability Count]] [[CLM-16 Structural Component Count]] [[CLM-17 Cross-Domain Structural Overlaps]] [[CLM-27 Full Node Inventory 148 Nodes]]

## Authoritative Path
`clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/canonical_topology.json`
