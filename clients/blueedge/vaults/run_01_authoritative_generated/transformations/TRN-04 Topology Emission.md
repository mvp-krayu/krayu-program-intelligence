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
Emits canonical platform topology from semantic layer data.

## Inputs
- build_semantic_layer.py embedded dicts (41.1 semantic layer)

## Outputs
- [[ART-04 canonical_topology.json]] — 17 domains / 42 capabilities / 89 components / 148 nodes

## Claims Produced
[[CLM-14 Structural Domain Count]] [[CLM-15 Structural Capability Count]] [[CLM-16 Structural Component Count]] [[CLM-27 Full Node Inventory 148 Nodes]]
