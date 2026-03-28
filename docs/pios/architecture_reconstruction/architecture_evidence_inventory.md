# Architecture Evidence Inventory

Stream: A.1 — PiOS L1-L6 Architecture Reconstruction
Date: 2026-03-28
Total artifacts catalogued: 87
Sources crawled: 2 repos (k-pi + krayu-knowledge)

---

## Group 1 — Governance / Framework Authority

| ID | Path | Type | Status |
|---|---|---|---|
| AF-001 | docs/governance/governance_master_capsule.md | governance | OBSERVED |
| AF-002 | docs/governance/governance_operating_model.md | governance | OBSERVED |
| AF-003 | docs/program-intelligence-framework/pios/pios_pipeline_specification.md | specification | OBSERVED |
| AF-004 | docs/program-intelligence-framework/pios/pios_runtime_architecture.md | architecture | OBSERVED |
| AF-005 | docs/program-intelligence-framework/pios/pios_execution_contract.md | contract | OBSERVED |
| AF-006 | docs/program-intelligence-framework/program_intelligence_three_layer_model.md | model | OBSERVED |

## Group 2 — PiOS Runtime Pipeline (40.x)

| ID | Path | Stage | Status |
|---|---|---|---|
| AF-010 | docs/pios/40.2/ | Evidence Acquisition | OBSERVED |
| AF-011 | docs/pios/40.3/ | Reconstruction | OBSERVED |
| AF-012 | docs/pios/40.4/ | Telemetry Extraction | OBSERVED |
| AF-013 | docs/pios/40.5/ | Signal Computation | OBSERVED |
| AF-014 | docs/pios/40.6/ | Condition+Diagnosis Activation | OBSERVED |
| AF-015 | docs/pios/40.7/ | Intelligence Synthesis | OBSERVED |
| AF-016 | docs/pios/40.8/ | Agentic Orchestration | OBSERVED |
| AF-017 | docs/pios/40.9/ | Feedback | OBSERVED |
| AF-018 | docs/pios/40.10/ | Orchestration Control | OBSERVED |
| AF-019 | docs/pios/40.11/ | Loop Review + Handover | OBSERVED |

## Group 3 — Semantic Shaping Layer (41.x)

| ID | Path | Stage | Status |
|---|---|---|---|
| AF-020 | docs/pios/41.1/ | Semantic Elevation | OBSERVED |
| AF-021 | docs/pios/41.2/pie_vault/ | PIE Vault Navigation | OBSERVED |
| AF-022 | docs/pios/41.3/ | Semantic Consolidation | OBSERVED |
| AF-023 | docs/pios/41.4/signal_registry.json | Signal Registry (5 signals) | OBSERVED |
| AF-024 | docs/pios/41.4/evidence_mapping_index.json | Evidence Index | OBSERVED |
| AF-025 | docs/pios/41.5/query_signal_map.json | Query-Signal Binding (10 queries) | OBSERVED |

## Group 4 — Consumer Execution Layer (42.x)

| ID | Path | Stage | Status |
|---|---|---|---|
| AF-030 | docs/pios/contracts/42.1/ | ExecLens Query Execution | OBSERVED |
| AF-031 | docs/pios/42.21/ | Governed Runtime Intake | OBSERVED |
| AF-032 | docs/pios/42.22/ | Rendering Capability Validation | OBSERVED |
| AF-033 | docs/pios/42.23/ | WOW Chain Rewiring | OBSERVED |
| AF-034 | app/execlens-demo/ | ExecLens Next.js Surface | OBSERVED |

## Group 5 — Signal-to-Structure Binding Layer (43.x)

| ID | Path | Stage | Status |
|---|---|---|---|
| AF-040 | docs/pios/43.1/signal_to_structure_binding.md | Binding Definition | OBSERVED |
| AF-041 | docs/pios/43.2/binding_payload_contract.md | Binding Payload Schema | OBSERVED |
| AF-042 | docs/pios/43.3/binding_validation_envelope.md | Binding Validation | OBSERVED |
| AF-043 | docs/pios/43.31/ | Binding Materialization | OBSERVED |
| AF-044 | docs/pios/43.32/ | Binding Execution | OBSERVED |
| AF-045 | docs/pios/43.33/ | Binding Payload Production | OBSERVED |

## Group 6 — Structural Overlay Projection Layer (44.x)

| ID | Path | Stage | Status |
|---|---|---|---|
| AF-050 | docs/pios/44.1/structural_overlay_projection_definition.md | Projection Definition | OBSERVED |
| AF-051 | docs/pios/44.2/projection_attachment_contract.md | Projection Attachment | OBSERVED |
| AF-052 | docs/pios/44.3/projection_emphasis_attribute.md | Emphasis Attribute | OBSERVED |
| AF-053 | docs/pios/44.4/ | Projection Layer Closure | OBSERVED |

## Group 7 — Demo Surface (51.x) — NOT architecture layer

| ID | Path | Status | Note |
|---|---|---|---|
| AF-060 | docs/pios/51.1/ | OBSERVED | Rendering spec — demo use only |
| AF-061 | docs/pios/51.8R/ | OBSERVED | ExecLens demo — demo use only |
| AF-062 | docs/pios/40.11/stream_50_handover_capsule.md | OBSERVED | Handover from 40 to 50 |

## Group 8 — Discipline / Knowledge Base

| ID | Path | Status |
|---|---|---|
| AF-070 | docs/program-intelligence-discipline/program_intelligence_body_of_knowledge.md | OBSERVED |
| AF-071 | krayu-knowledge/GOV/GOV-00.md | OBSERVED |
| AF-072 | krayu-knowledge/INT/INT-00.md | OBSERVED |
| AF-073 | krayu-knowledge/INT/INT-01.md | OBSERVED |
| AF-074 | krayu-knowledge/INT/INT-02.md | OBSERVED |

## Notable Absence

| ID | Description | Impact |
|---|---|---|
| ABS-001 | Stream 00.2 — Canonical Layer Model Restoration (L0-L8 defining document) NOT FOUND | HIGH — materially affects L1-L6 adjudication |
