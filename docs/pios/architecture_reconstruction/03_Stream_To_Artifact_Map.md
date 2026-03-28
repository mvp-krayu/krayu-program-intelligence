---
title: Stream-to-Artifact Map
type: stream-map
status: OBSERVED
confidence: HIGH
date: 2026-03-28
---

# Stream-to-Artifact Map

## Governance Streams (00.x)

| Stream | Name | Artifacts | Location |
|---|---|---|---|
| 00 | Krayu Governance | governance_master_capsule.md, governance_operating_model.md | docs/governance/ |
| 00.2 | Canonical Layer Model Restoration | **ABSENT — not found in repo** | UNKNOWN |

## Discipline / Framework Streams (10, 20)

| Stream | Name | Artifacts | Location |
|---|---|---|---|
| 10 | Program Intelligence Discipline | program_intelligence_body_of_knowledge.md, manifesto, definition | docs/program-intelligence-discipline/ |
| 20 | Program Intelligence Framework | three_layer_model.md, pyramid.md, value_loop.md, maturity_model.md | docs/program-intelligence-framework/ |
| 20/40.0 | PiOS Specification | pios_pipeline_specification.md, pios_runtime_architecture.md, pios_execution_contract.md | docs/program-intelligence-framework/pios/ |

## PiOS Runtime Streams (40.x)

| Stream | Name | Key Artifacts | Status |
|---|---|---|---|
| 40.2 | Evidence Connectors | evidence_surface_inventory.md, normalized_evidence_map.md, evidence_classification_map.md | OBSERVED |
| 40.3 | Reverse Engineering Engine | reconstruction/* (12 files), structural_traceability_map.md, PEG | OBSERVED |
| 40.4 | Telemetry Extraction | telemetry_schema.md, telemetry_surface_map.md, 9 telemetry artifacts | OBSERVED |
| 40.5 | Signal Computation Engine | signal_input_matrix.md, signal_output_set.md, signal_traceability_map.md | OBSERVED (PARTIAL — 7/8 signals blocked) |
| 40.6 | Condition + Diagnosis Activation | condition_output_set.md, condition_traceability_map.md, diagnosis artifacts | OBSERVED |
| 40.7 | Intelligence Synthesis | intelligence_output_set.md, diagnosis_boundary_enforcement.md, diagnosis_traceability_map.md | OBSERVED |
| 40.8 | Agentic Orchestration / Delivery | delivery_output_packet.md, delivery_binding_map.md | OBSERVED |
| 40.9 | Feedback | feedback_signal_registry.md, recurrence_detection_report.md, unknown_space_registry.md | OBSERVED |
| 40.10 | Orchestration Control | control_directive_registry.md, control_boundary_enforcement.md | OBSERVED |
| 40.11 | Loop Review + Handover | loop_observation_log.md, stream_50_handover_capsule.md, execution_closure_statement.md | OBSERVED |

## Semantic Shaping Streams (41.x)

| Stream | Name | Key Artifacts | Status |
|---|---|---|---|
| 41.1 | Semantic Elevation | semantic_elevation_report.md, semantic_domain_model.md, capability_map.md | OBSERVED |
| 41.2 | PIE Vault | pie_vault/ (Obsidian vault — 10 domains + 4 capabilities + 9 components), pie_index.md | OBSERVED |
| 41.3 | Semantic Consolidation | semantic_consolidation_report.md | OBSERVED |
| 41.4 | Signal Registry + Evidence Index | signal_registry.json (5 signals), evidence_mapping_index.json | OBSERVED |
| 41.5 | Query-Signal Map | query_signal_map.json (10 queries GQ-001..010), query_response_templates.md | OBSERVED |

## Consumer Execution Streams (42.x)

| Stream | Name | Key Artifacts | Status |
|---|---|---|---|
| 42.1 | ExecLens Query Execution | PIOS-42.1-RUN01-CONTRACT-v1.md | OBSERVED |
| 42.4-42.9 | ExecLens Adapters | execlens_adapter.py, validate_demo_surface.py, etc. | OBSERVED |
| 42.21 | Governed Runtime Intake | runtime_intake_snapshot.json, changelog.md, CLOSURE.md | OBSERVED |
| 42.22 | Runtime Rendering Exposure | exposure_validation_report.md, attribute_lineage.json | OBSERVED |
| 42.23 | WOW Chain Rewiring | rewiring_plan.md, execlens_wowchain_adapter.py | OBSERVED |

## Binding Streams (43.x)

| Stream | Name | Key Artifacts | Status |
|---|---|---|---|
| 43.1 | Binding Definition | signal_to_structure_binding.md | OBSERVED |
| 43.2 | Binding Payload Contract | binding_payload_contract.md | OBSERVED |
| 43.3 | Binding Validation Envelope | binding_validation_envelope.md, validated_binding_payload.json | OBSERVED |
| 43.31 | Binding Materialization | materialization_contract.md, reproducibility_contract.md | OBSERVED |
| 43.32 | Binding Execution | changelog.md, execution_report.md | OBSERVED |
| 43.33 | Binding Payload Production | execution_report.md, replay_record.md | OBSERVED |

## Projection Streams (44.x)

| Stream | Name | Key Artifacts | Status |
|---|---|---|---|
| 44.1 | Structural Overlay Projection | structural_overlay_projection_definition.md | OBSERVED |
| 44.2 | Projection Attachment | projection_attachment_contract.md, projection_attachment.json | OBSERVED |
| 44.3 | Projection Emphasis Attribute | projection_emphasis_attribute.md | OBSERVED |
| 44.4 | Projection Layer Closure | CLOSURE.md, demo_emphasis_rule.md | OBSERVED |

## Demo Surface Streams (51.x)

| Stream | Name | Status | Architecture Role |
|---|---|---|---|
| 51.x | ExecLens Demo Surface | OBSERVED | NOT an architecture layer — Demo surface only |
| 51.8R | Current Demo Baseline | OBSERVED (RUN05 locked) | Consumer of governed artifacts |

## Knowledge Repository (krayu-knowledge)

| Domain | Key Artifacts | Status |
|---|---|---|
| GOV | GOV-00 (CKR) | OBSERVED |
| CAT | CAT-00 | OBSERVED |
| SCI | SCI-00 | OBSERVED |
| INT | INT-00, INT-01, INT-02 | OBSERVED |
| RES | RES-00, RSR/RSP-06..08 | OBSERVED |
