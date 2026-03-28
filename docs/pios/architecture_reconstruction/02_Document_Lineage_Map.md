---
title: Document Lineage Map
type: lineage
status: RECONSTRUCTED
confidence: HIGH
date: 2026-03-28
---

# Document Lineage Map

## Primary Lineage Chain — Core Pipeline

OBSERVED — pios_pipeline_specification.md, execution manifests, boundary enforcement files

```
governance_master_capsule.md (Stream 00)
  └─[VALIDATES]→ pios_execution_contract.md (Stream 40.0)
       └─[VALIDATES]→ 40.2 Evidence Artifacts
            └─[PRODUCES]→ 40.3 Reconstruction Artifacts (PEG, capability map)
                 └─[PRODUCES]→ 40.4 Telemetry Artifacts
                      └─[PRODUCES]→ 40.5 Signal Artifacts (SIG-001..008)
                           └─[PRODUCES]→ 40.6 Condition + Diagnosis Artifacts
                                └─[PRODUCES]→ 40.7 Intelligence Artifacts
                                     └─[PRODUCES]→ 40.8 Orchestration Artifacts
                                          └─[PRODUCES]→ 40.9 Feedback Artifacts
```

---

## Semantic Shaping Lineage (41.x)

RECONSTRUCTED from 43.1, 41.1/semantic_elevation_report.md

```
40.5 Signal Artifacts
  └─[DERIVED_FROM]→ 41.4/signal_registry.json
       └─[PRODUCES]→ 41.4/evidence_mapping_index.json
            └─[PRODUCES]→ 41.5/query_signal_map.json

40.3 Reconstruction (89 components)
  └─[PRODUCES]→ 41.1 Semantic Elevation (17 domains, 42 capabilities)
       └─[PRODUCES]→ 41.2/pie_vault/ (Obsidian navigation)
            └─[PRODUCES]→ 41.3 Semantic Consolidation
```

---

## Binding + Projection Lineage (43.x → 44.x)

OBSERVED — 43.1, 43.2, 43.3, 44.1, 44.2, 43.31-43.33

```
41.4/signal_registry.json
  └─[CONSUMES]→ 43.1 Binding Definition
       └─[REFINES]→ 43.2 Binding Payload Contract
            └─[VALIDATES]→ 43.3 Binding Validation Envelope
                 └─[PRODUCES (via 43.31-43.33)]→ validated_binding_payload.json
                      └─[PRODUCES]→ 44.1 Structural Overlay Projection
                           └─[REFINES]→ 44.2 Projection Attachment Contract
                                └─[PRODUCES (via 44.3)]→ 44.2/projection_attachment.json
```

---

## Consumer Execution Lineage (42.x)

OBSERVED — 42.21, 42.22, 42.23, PIOS-42.1 contract

```
44.2/projection_attachment.json
  └─[CONSUMES]→ 42.21 Runtime Intake
       └─[PRODUCES]→ 42.22 Exposure Validation (emphasis attributes)
            └─[PRODUCES]→ 42.23 WOW Chain Rewiring
                 └─[PRODUCES]→ app/execlens-demo/ (ExecLens surface)
                      └─[PRODUCES]→ 51.8R Demo Surface (PIOS 51.8R)

41.4/signal_registry.json + 41.5/query_signal_map.json
  └─[CONSUMES]→ 42.1 ExecLens Query Execution
       └─[PRODUCES]→ 42.4-42.9 adapters → ExecLens UI panels
```

---

## Framework → Runtime Lineage

OBSERVED — pios_runtime_architecture.md, program_intelligence_three_layer_model.md

```
program_intelligence_three_layer_model.md (Stream 20)
  └─[REFINES]→ pios_runtime_architecture.md (maps 3 layers to runtime modules)
       └─[REFINES]→ pios_pipeline_specification.md (9 operational stages)
            └─[REFINES]→ pios_execution_contract.md (execution rules)

governance_master_capsule.md
  └─[VALIDATES]→ [all streams]
```

---

## Handover Lineage

OBSERVED — 40.11/stream_50_handover_capsule.md

```
40.11 Loop Review
  └─[PRODUCES]→ stream_50_handover_capsule.md
       └─[ADJACENT_TO]→ Stream 50 (Demonstrations)
            └─[ADJACENT_TO]→ 51.x Demo Surface
```

---

## Edge Registry Reference

28 edges documented in document_edge_registry.json.
All edges: source, target, type, evidence anchor, confidence.

Key edge types used: PRODUCES, VALIDATES, CONSUMES, REFINES, DERIVED_FROM, ADJACENT_TO, REFERENCES
