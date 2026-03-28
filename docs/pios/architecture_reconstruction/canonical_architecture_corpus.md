# Canonical Architecture Corpus

Stream: A.2 — PiOS Architecture Post-Execution Consolidation
Date: 2026-03-28
Source: CAC-v1
Filter: ACTIVE lifecycle AND HIGH confidence (from ALR-v1 + ACR-v1)

---

## Corpus Summary

| Total canonical nodes | 26 |
|---|---|
| Excluded (PARTIAL/MEDIUM/NONE) | 7 (N-012, N-013, N-017, N-019, N-026, N-029, N-ABSENT-001) |
| Excluded (51.x as architecture layer) | 0 (N-032 included as consumer boundary) |

---

## Zone A — Governance and Framework (5 nodes)

| Corpus ID | Node | Path | Role |
|---|---|---|---|
| CC-001 | N-001 | docs/governance/governance_master_capsule.md | 11 governing constraints (GC-01..GC-11) |
| CC-002 | N-002 | docs/program-intelligence-framework/pios/pios_pipeline_specification.md | 9-Stage Pipeline canonical definition |
| CC-003 | N-003 | docs/program-intelligence-framework/pios/pios_runtime_architecture.md | Stream zones and execution model |
| CC-004 | N-004 | docs/program-intelligence-framework/pios/pios_execution_contract.md | Non-negotiable execution rules |
| CC-005 | N-005 | docs/program-intelligence-framework/program_intelligence_three_layer_model.md | Three-Layer Analytical Model |

---

## Zone B — Observability Layer (40.2–40.4, 3 nodes)

| Corpus ID | Node | Path | Pipeline Stage |
|---|---|---|---|
| CC-006 | N-006 | docs/pios/40.2/ | Stage 1 — Evidence Acquisition |
| CC-007 | N-007 | docs/pios/40.3/ | Stage 2 — Reconstruction (PEG: 87 nodes, 40 edges) |
| CC-008 | N-008 | docs/pios/40.4/ | Stage 3 — Telemetry Extraction |

---

## Zone C — Intelligence Layer (40.5–40.6, 2 nodes)

| Corpus ID | Node | Path | Pipeline Stage |
|---|---|---|---|
| CC-009 | N-009 | docs/pios/40.5/ | Stage 4 — Signal Computation (8 defined, 5 admitted) |
| CC-010 | N-010 | docs/pios/40.6/ | Stages 5+6 — Condition+Diagnosis Activation |

---

## Zone D — Executive Intelligence Layer (40.7, 1 node)

| Corpus ID | Node | Path | Pipeline Stage |
|---|---|---|---|
| CC-011 | N-011 | docs/pios/40.7/ | Stage 7 — Intelligence Synthesis |

---

## Zone E — Pipeline Boundary (1 node)

| Corpus ID | Node | Path | Role |
|---|---|---|---|
| CC-012 | N-014 | docs/pios/40.11/stream_50_handover_capsule.md | Authoritative 40.x→51.x boundary; 51.x read-only constraint |

---

## Zone F — Semantic Shaping Layer L4 (41.x, 3 nodes)

| Corpus ID | Node | Path | Role |
|---|---|---|---|
| CC-013 | N-015 | docs/pios/41.1/semantic_elevation_report.md | 89→17/42 transformation |
| CC-014 | N-016 | docs/pios/41.2/ | PIE Vault — evidence repository |
| CC-015 | N-018 | docs/pios/41.4/signal_registry.md | 5 admitted signals (SIG-001..005); CKR-backed |

---

## Zone G — Binding Layer (43.x, 3 nodes)

| Corpus ID | Node | Path | Role |
|---|---|---|---|
| CC-016 | N-020 | docs/pios/43.1/signal_to_structure_binding.md | Binding definition; L3/L4 fragment evidence; SSZ/SSI prohibited |
| CC-017 | N-021 | docs/pios/43.2/ | Binding output payload shape |
| CC-018 | N-022 | docs/pios/43.3/ | Validation gate; 5 records pass to 44.x |

---

## Zone H — Projection Layer (44.x, 3 nodes)

| Corpus ID | Node | Path | Role |
|---|---|---|---|
| CC-019 | N-023 | docs/pios/44.1/structural_overlay_projection_definition.md | L3 explicit anchor (Section 2); structural overlay definition |
| CC-020 | N-024 | docs/pios/44.2/ | 5 records with emphasis attributes; input to 42.21 |
| CC-021 | N-025 | docs/pios/44.3/ | Emphasis attributes; primary/secondary distinction |

---

## Zone I — Consumer Execution Layer L6 (42.x, 2 nodes)

| Corpus ID | Node | Path | Role |
|---|---|---|---|
| CC-022 | N-027 | docs/pios/42.21/ | Runtime intake; governed read-only consumption |
| CC-023 | N-028 | docs/pios/42.22/ | 5 records validated; provenance chain terminus |

---

## Zone J — Governance/Knowledge (2 nodes)

| Corpus ID | Node | Path | Role |
|---|---|---|---|
| CC-024 | N-030 | krayu-knowledge/canonical_knowledge_registry.md | 34 governed constructs; signal admission authority |
| CC-025 | N-031 | docs/pios/ (INT-01/INT-02) | Dual-agent model; authority separation |

---

## Zone K — Consumer Boundary (1 node, included for completeness)

| Corpus ID | Node | Path | Role |
|---|---|---|---|
| CC-026 | N-032 | docs/pios/51.x/ | ExecLens surface; 4 signals; READ-ONLY consumer; REJECTED as architecture layer |

---

## Nodes Excluded from Canonical Corpus

| Node | Reason |
|---|---|
| N-012 (40.8) | PARTIAL lifecycle — naming conflict; thinner evidence |
| N-013 (40.9) | PARTIAL lifecycle — execution artifacts not confirmed |
| N-017 (41.3) | MEDIUM confidence — lower downstream reference density |
| N-019 (41.5) | MEDIUM confidence — moderate evidence density |
| N-026 (44.4) | MEDIUM confidence — lower direct reference density |
| N-029 (42.23) | MEDIUM confidence — WOW chain in compensated mode (75.x blocked) |
| N-ABSENT-001 | NONE confidence — Stream 00.2 not found in any repo |

---

## Corpus Architecture Map

```
Governance/Framework (CC-001..CC-005)
    │
    ├── 9-Stage Pipeline: Stages 1-7 (CC-006..CC-011)
    │     Observability Layer: CC-006, CC-007, CC-008
    │     Intelligence Layer: CC-009, CC-010
    │     Executive Intelligence Layer: CC-011
    │
    ├── Pipeline Boundary (CC-012) ──→ 51.x excluded as layer
    │
    ├── Semantic Shaping L4 (CC-013, CC-014, CC-015)
    │
    ├── Binding Layer (CC-016, CC-017, CC-018)
    │
    ├── Projection Layer (CC-019, CC-020, CC-021)
    │
    ├── Consumer Execution L6 (CC-022, CC-023)
    │
    ├── Governance/Knowledge (CC-024, CC-025)
    │
    └── Consumer Boundary (CC-026) [not an architecture layer]
```
