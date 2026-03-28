# Document Lineage Report

Stream: A.1 — PiOS L1-L6 Architecture Reconstruction
Date: 2026-03-28
Total edges: 28 (see document_edge_registry.json)

---

## Lineage Method

Edges are derived from:
1. Explicit upstream_contract references in execution manifests
2. Input boundary declarations in boundary_enforcement.md files
3. Authority citations in stream definition files
4. Provenance chain documented in 42.22/exposure_validation_report.md
5. pios_pipeline_specification.md Stage input/output definitions

Similarity was NOT used to establish lineage.
All edges require an explicit anchor.

---

## Core Pipeline Lineage (E-001 through E-007)

| Edge | Source | Target | Type | Confidence |
|---|---|---|---|---|
| E-001 | 40.2 Evidence | 40.3 Reconstruction | PRODUCES | HIGH |
| E-002 | 40.3 Reconstruction | 40.4 Telemetry | PRODUCES | HIGH |
| E-003 | 40.4 Telemetry | 40.5 Signals | PRODUCES | HIGH |
| E-004 | 40.5 Signals | 40.6 Conditions+Diagnosis | PRODUCES | HIGH |
| E-005 | 40.6 Conditions+Diagnosis | 40.7 Intelligence | PRODUCES | HIGH |
| E-006 | 40.7 Intelligence | 40.8 Orchestration | PRODUCES | HIGH |
| E-007 | 40.8 Orchestration | 40.9 Feedback | PRODUCES | HIGH |

## Semantic Shaping Lineage (E-008 through E-010)

| Edge | Source | Target | Type | Confidence |
|---|---|---|---|---|
| E-008 | 40.5 Signals | 41.x Semantic Shaping | PRODUCES | HIGH |
| E-009 | 41.1 Semantic Elevation | 41.4 Signal Registry | PRODUCES | HIGH |
| E-010 | 41.4 Signal Registry | 41.5 Query-Signal Map | PRODUCES | HIGH |

## Binding Lineage (E-011 through E-013)

| Edge | Source | Target | Type | Confidence |
|---|---|---|---|---|
| E-011 | 41.4 Signal Registry | 43.1 Binding Definition | CONSUMES | HIGH |
| E-012 | 43.1 Definition | 43.2 Payload Contract | REFINES | HIGH |
| E-013 | 43.2 Contract | 43.3 Validation Envelope | VALIDATES | HIGH |

## Projection Lineage (E-014 through E-015)

| Edge | Source | Target | Type | Confidence |
|---|---|---|---|---|
| E-014 | 43.3 Validation Envelope | 44.1 Projection | PRODUCES | HIGH |
| E-015 | 44.1 Projection | 44.2 Attachment Contract | REFINES | HIGH |

## Consumer Execution Lineage (E-016 through E-019)

| Edge | Source | Target | Type | Confidence |
|---|---|---|---|---|
| E-016 | 44.2 Projection | 42.21 Runtime Intake | PRODUCES | HIGH |
| E-017 | 42.21 Intake | 42.22 Exposure Validation | PRODUCES | HIGH |
| E-018 | 42.22 Exposure | 42.23 WOW Chain Rewiring | PRODUCES | HIGH |
| E-019 | 42.23 Rewiring | 51.8R Demo Surface | PRODUCES | HIGH |

## Framework / Governance Lineage (E-020 through E-024)

| Edge | Source | Target | Type | Confidence |
|---|---|---|---|---|
| E-020 | governance_master_capsule.md | pios_pipeline_specification.md | VALIDATES | HIGH |
| E-021 | pios_pipeline_specification.md | pios_runtime_architecture.md | REFINES | MEDIUM |
| E-022 | three_layer_model.md | pios_runtime_architecture.md | REFINES | HIGH |
| E-023 | pios_execution_contract.md | 40.2-40.7 boundary enforcement | VALIDATES | HIGH |
| E-024 | 40.11 handover capsule | 51.x demo surface | ADJACENT_TO | HIGH |

---

## Provenance Chain (from 42.22/exposure_validation_report.md)

OBSERVED — complete chain explicitly documented:

```
41.x source artifacts
→ 43.1 signal extraction
→ 43.2 node mapping
→ 43.3 binding validation
→ 44.1 projection definition
→ 44.3 emphasis assignment
→ 44.2 projection attachment
→ 42.22 runtime exposure
```

This provenance chain is the canonical evidence basis for the extended architecture lineage.

---

## Ancestry Rules Applied

- Lineage established only for: explicit derived-from, explicit input/output, validator/contract binding, explicit construct continuity
- NOT established for: semantic similarity, co-location, or naming patterns
- All 28 edges have explicit anchors
