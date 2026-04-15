---
node_class: artifact
artifact_id: ART-04
artifact_name: canonical_topology.json
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Purpose
Canonical platform topology produced by S2. Contains the full 17/42/89 node tree with domain/capability/component hierarchy. The authoritative source for all topology claims in the GAUGE product.

## Producing Step
`pios emit topology` (S2) → canonical_topology.json

## Consuming Steps
`/api/topology` → buildCanonicalRenderModel() → topology explorer, TopologySummaryPanel, StatusBand

## Structure Summary
17 domain nodes (depth=0, is_root=true), 42 capability nodes (depth=1), 89 component nodes (depth=2). 148 total nodes. overlap_edges_count=0. signals_count=0 in canonical model. Each node has: node_id, label, type, depth, is_root, grounding, evidence_refs, cross_domain_ref.

## Claims Grounded
[[CLM-14 Structural Domain Count]] [[CLM-15 Structural Capability Count]] [[CLM-16 Structural Component Count]] [[CLM-17 Cross-Domain Structural Overlaps]] [[CLM-27 Full Node Inventory 148 Nodes]]

## Note
COMP-25 has a cross_domain_ref to "DOM-01" — this is a known source peculiarity preserved as a node field, not a structural overlap edge.

## Authoritative Path
`clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/canonical_topology.json`
