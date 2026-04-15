---
node_class: transformation
transformation_id: TRN-04
transformation_name: Topology Emission
stage: S2
command: pios emit topology
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Purpose
Emits the canonical platform topology from normalized structural artifacts (L40.4). Produces canonical_topology.json.

## Inputs
- L40.4 normalized structural output (docs/pios/40_4/)
- L40.3 structural relations
- L40.2 structural extractions

## Outputs
- [[ART-04 canonical_topology.json]] — 17 domains, 42 capabilities, 89 components, 148 nodes

## Rules
Derives domain/capability/component hierarchy from structural normalization. No overlap edges in canonical model. cross_domain_ref on COMP-25 preserved as node field, not edge.

## Claims Produced
[[CLM-14 Structural Domain Count]] [[CLM-15 Structural Capability Count]] [[CLM-16 Structural Component Count]] [[CLM-17 Cross-Domain Structural Overlaps]] [[CLM-27 Full Node Inventory 148 Nodes]]
