---
title: PiOS Architecture Reconstruction — Index
source_path: docs/pios/architecture_reconstruction/
type: index
status: COMPLETE
confidence: HIGH
stream: A.1 — PiOS L1-L6 Architecture Reconstruction
date: 2026-03-28
---

# PiOS Architecture Reconstruction Index

Stream: A.1 — PiOS L1-L6 Architecture Reconstruction
Branch: feature/pios-architecture-reconstruction
Status: COMPLETE

---

## Method

Evidence-first reverse crawl of Krayu repositories.
No claims made without anchor.
All statements tagged: OBSERVED / RECONSTRUCTED / INFERRED / AMBIGUOUS / REJECTED.

---

## Key Findings

**L1-L6 Verdict: MODIFIED**

- L1-L6 as a standalone 6-layer named model: NOT FOUND as a complete definition in this repo
- The canonical L0-L8 model is referenced (via Stream 00.2) but the defining document is absent
- L3-L6 are partially supported by fragments in 43.1, 44.1, 44.2, 43.2, 43.3
- L1, L2, L7, L8 are not defined in available evidence
- The supported models are the 9-Stage Pipeline (F-A) and the Three-Layer Analytical Model (F-B)

**51.x Verdict: REJECTED as architecture layer**

51.x (ExecLens demo surface) is explicitly a Demo Surface, not an architecture layer.
Authority: 40.11/stream_50_handover_capsule.md

---

## Navigation

### Machine Outputs
- [[architecture_evidence_inventory.json]] — 87 artifacts catalogued
- [[document_node_registry.json]] — 32 document nodes (+ 1 absent)
- [[document_edge_registry.json]] — 28 edges
- [[concept_registry.json]] — 18 concepts
- [[concept_propagation_edges.json]] — 17 propagation edges
- [[layer_candidate_matrix.json]] — 3 layer framings adjudicated
- [[layer_adjudication_matrix.json]] — Layer definitions + L1-L6 verdict
- [[ambiguity_register.json]] — 7 ambiguities registered

### Human Reports
- [[architecture_evidence_inventory.md]]
- [[document_lineage_report.md]]
- [[concept_propagation_report.md]]
- [[layer_candidate_report.md]]
- [[layer_adjudication_report.md]]
- [[boundary_and_exclusion_report.md]]
- [[ambiguity_register.md]]
- [[reconstruction_validation_report.md]]
- [[pios_l1_l6_architecture_paper.md]] — Final paper (generated last)

### Obsidian Surface
- [[01_Layer_Model.md]]
- [[02_Document_Lineage_Map.md]]
- [[03_Stream_To_Artifact_Map.md]]
- [[04_Concept_Propagation_Map.md]]
- [[05_Boundary_Exclusions.md]]
- [[06_Ambiguity_Register.md]]
- [[07_Evidence_Method.md]]

---

## Ambiguity Count: 7

AMB-001 (HIGH IMPACT): Stream 00.2 defining document absent — L0-L8 model not fully reconstructable
AMB-002 (LOW): 40.8 naming conflict (Orchestration vs. Delivery Structuring)
AMB-003 (MEDIUM): L5 mapping boundary unclear
AMB-004 (LOW, RESOLVED-PARTIAL): 40.6 hosts two pipeline stages
AMB-005 (MEDIUM): CKR 34-construct registry not fully enumerable
AMB-006 (LOW): Run continuity gaps between 40.x and 41.x
AMB-007 (MEDIUM): 75.x interpretation layer referenced but absent
