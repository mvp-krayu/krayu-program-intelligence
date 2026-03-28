# Artifact Lifecycle Register

Stream: A.2 — PiOS Architecture Post-Execution Consolidation
Date: 2026-03-28
Source: ALR-v1

---

## Lifecycle Classification Rules

| State | Definition |
|---|---|
| ACTIVE | Currently canonical, in operation, not superseded |
| SUPERSEDED | Replaced by newer artifact; retained for lineage only |
| EXPERIMENTAL | Provisional; not yet admitted to canonical corpus |
| PARTIAL | Exists but incomplete or missing required components |
| REJECTED | Explicitly excluded from architecture or corpus |
| UNKNOWN | Cannot determine lifecycle state |

---

## Node Lifecycle Register

| Node ID | Path / Label | Lifecycle | Confidence | Basis |
|---|---|---|---|---|
| N-001 | governance_master_capsule.md | ACTIVE | HIGH | GC-01..GC-11 governing constraints; cross-layer reference |
| N-002 | pios_pipeline_specification.md | ACTIVE | HIGH | Canonical 9-stage definition; no replacement found |
| N-003 | pios_runtime_architecture.md | ACTIVE | HIGH | Canonical architecture; stream zone definitions |
| N-004 | pios_execution_contract.md | ACTIVE | HIGH | Non-negotiable Evidence First rule; all layers reference |
| N-005 | program_intelligence_three_layer_model.md | ACTIVE | HIGH | Three-Layer Model confirmed; F-B framing |
| N-006 | 40.2/ Evidence Acquisition | ACTIVE | HIGH | run_01 baseline frozen; run_02 advancing (prospective) |
| N-007 | 40.3/ Reconstruction | ACTIVE | HIGH | PEG (87 nodes, 40 edges); feeds 41.1 semantic elevation |
| N-008 | 40.4/ Telemetry | ACTIVE | HIGH | Telemetry datasets; feeds 40.5 signal computation |
| N-009 | 40.5/ Signal Computation | ACTIVE | HIGH | 8 signals defined; 5 admitted (SIG-001..005) |
| N-010 | 40.6/ Condition+Diagnosis | ACTIVE | HIGH | GC-07 enforced; exclusive input to 40.7 |
| N-011 | 40.7/ Intelligence Synthesis | ACTIVE | HIGH | Intelligence objects; Executive Intelligence Layer |
| N-012 | 40.8/ Agentic Orchestration | PARTIAL | MEDIUM | Naming conflict (AMB-002); thinner execution evidence |
| N-013 | 40.9/ Feedback | PARTIAL | MEDIUM | Defined in spec; execution outputs not confirmed |
| N-014 | 40.11/ Handover Capsule | ACTIVE | HIGH | Authoritative 40.x→50/51.x boundary |
| N-015 | 41.1/ Semantic Elevation | ACTIVE | HIGH | 89→17/42 transformation; evidence-grounded |
| N-016 | 41.2/ PIE Vault | ACTIVE | HIGH | Evidence repository; feeds 41.3 |
| N-017 | 41.3/ Consolidation | ACTIVE | MEDIUM | Present; lower downstream reference density |
| N-018 | 41.4/ Signal Registry | ACTIVE | HIGH | 5 admitted signals; CKR-backed |
| N-019 | 41.5/ Query-Signal Map | ACTIVE | MEDIUM | Referenced by 42.x; moderate evidence density |
| N-020 | 43.1/ Signal-to-Structure Binding | ACTIVE | HIGH | Binding definition; L3/L4 fragments; SSZ/SSI prohibited |
| N-021 | 43.2/ Payload Contract | ACTIVE | HIGH | Binding output shape; 43.3 gate depends on it |
| N-022 | 43.3/ Validation Envelope | ACTIVE | HIGH | 5 records produced; fail-closed |
| N-023 | 44.1/ Projection Definition | ACTIVE | HIGH | L3 explicit anchor (Section 2); no reverse dependency |
| N-024 | 44.2/ Projection Attachment | ACTIVE | HIGH | 5 records with emphasis; input to 42.21 |
| N-025 | 44.3/ Emphasis Attribute | ACTIVE | HIGH | Emphasis attributes defined; rendered in ExecLens |
| N-026 | 44.4/ Projection Closure | ACTIVE | MEDIUM | Present; lower direct reference density |
| N-027 | 42.21/ Runtime Intake | ACTIVE | HIGH | First consumer layer; read-only; no binding production |
| N-028 | 42.22/ Exposure Validation | ACTIVE | HIGH | 5 records validated; provenance chain terminus |
| N-029 | 42.23/ WOW Chain Rewiring | ACTIVE | MEDIUM | 75.x blocked; rewired plan operational |
| N-030 | CKR — Canonical Knowledge Registry | ACTIVE | HIGH | 34 constructs; admission authority |
| N-031 | INT-01 / INT-02 Protocol | ACTIVE | HIGH | Dual-agent model; authority separation |
| N-032 | 51.x Demo Surface | ACTIVE (consumer) | HIGH | ACTIVE as consumer; REJECTED as architecture layer |
| N-ABSENT-001 | Stream 00.2 — Canonical Layer Model | PARTIAL | NONE | Referenced 5x; NOT FOUND in any repo; AMB-001 |

---

## Summary

| Lifecycle | Count |
|---|---|
| ACTIVE | 29 |
| PARTIAL | 3 (N-012, N-013, N-ABSENT-001) |
| SUPERSEDED | 0 |
| EXPERIMENTAL | 0 |
| REJECTED | 0 (as lifecycle state; N-032 rejected as architecture layer only) |
| UNKNOWN | 0 |

---

## Key Finding

No artifacts in the crawl scope are SUPERSEDED. The run_01 baseline is frozen and authoritative. run_02 is advancing but has not yet superseded run_01 outputs. The only PARTIAL artifacts with architectural significance are N-012 (40.8), N-013 (40.9), and the critical absent node N-ABSENT-001 (Stream 00.2).
