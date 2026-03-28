# Reconstruction Validation Report

Stream: A.1 — PiOS L1-L6 Architecture Reconstruction
Date: 2026-03-28

---

## Validation Rules Applied

### Rule 1 — Every claim has anchor

PASS — All claims in architecture paper, layer reports, and concept maps reference specific file paths and section numbers.

Claims without sufficient anchors are registered as AMBIGUOUS in the ambiguity register (7 ambiguities).
No claims made without evidence; uncertain claims tagged explicitly.

### Rule 2 — Every edge has evidence + confidence

PASS — All 28 edges in document_edge_registry.json have:
- explicit evidence anchor (file path + section or content reference)
- confidence level (HIGH/MEDIUM)
- rationale

No edges established from similarity alone.

### Rule 3 — Ambiguities listed

PASS — 7 ambiguities registered:
- AMB-001 (HIGH): Stream 00.2 absent
- AMB-002 (LOW): 40.8 naming
- AMB-003 (MEDIUM): L5 mapping
- AMB-004 (LOW, RESOLVED-PARTIAL): 40.6 dual stages
- AMB-005 (MEDIUM): CKR completeness
- AMB-006 (LOW): run continuity
- AMB-007 (MEDIUM): 75.x absence

### Rule 4 — No narrative-only layers

PASS — All layer candidates backed by at minimum one artifact observation. No layers invented from theory or narrative.

### Rule 5 — No demo promoted without proof

PASS — 51.x explicitly EXCLUDED from architecture. Exclusion backed by 40.11/stream_50_handover_capsule.md.

### Rule 6 — Node/edge counts reconcile

PASS:
- Nodes: 32 documented nodes + 1 absent node (N-ABSENT-001)
- Edges: 28 edges
- All edges reference source and target nodes that exist in node registry
- Machine output counts match human report counts

### Rule 7 — If L1-L6 not proven → reject or modify

PASS — L1-L6 is MODIFIED (not rejected outright because L3-L6 have partial support; not confirmed because L1-L2 are undefined and L0-L8 defining document is absent).

Modification rationale: The 9-Stage Pipeline and Three-Layer Model are confirmed. The L-number system is partially supported. The complete 6-layer framing cannot be confirmed from available evidence.

---

## Artifact Checklist

| Artifact | Status |
|---|---|
| architecture_evidence_inventory.json | COMPLETE |
| architecture_evidence_inventory.md | COMPLETE |
| document_node_registry.json | COMPLETE (32 nodes + 1 absent) |
| document_edge_registry.json | COMPLETE (28 edges) |
| document_lineage_report.md | COMPLETE |
| concept_registry.json | COMPLETE (18 concepts) |
| concept_propagation_edges.json | COMPLETE (17 edges) |
| concept_propagation_report.md | COMPLETE |
| layer_candidate_matrix.json | COMPLETE (3 framings) |
| layer_candidate_report.md | COMPLETE |
| layer_adjudication_matrix.json | COMPLETE |
| layer_adjudication_report.md | COMPLETE |
| ambiguity_register.json | COMPLETE (7 ambiguities) |
| ambiguity_register.md | COMPLETE |
| boundary_and_exclusion_report.md | COMPLETE |
| 00_Index.md | COMPLETE |
| 01_Layer_Model.md | COMPLETE |
| 02_Document_Lineage_Map.md | COMPLETE |
| 03_Stream_To_Artifact_Map.md | COMPLETE |
| 04_Concept_Propagation_Map.md | COMPLETE |
| 05_Boundary_Exclusions.md | COMPLETE |
| 06_Ambiguity_Register.md | COMPLETE |
| 07_Evidence_Method.md | COMPLETE |
| pios_l1_l6_architecture_paper.md | COMPLETE (generated last) |

---

## Final Validation Status

| Validation Gate | Status |
|---|---|
| Evidence inventory exists | PASS |
| Lineage graph exists | PASS |
| Concept propagation exists | PASS |
| Layers adjudicated | PASS |
| Obsidian surface created | PASS |
| Ambiguities registered | PASS |
| Final paper generated last | PASS |
| Final paper is traceable | PASS |
