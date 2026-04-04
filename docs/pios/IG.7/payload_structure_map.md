# IG.7 — Payload Structure Map

**Stream:** IG.7
**Date:** 2026-04-04

---

## Run Namespace → Payload Schema Mapping

| Run Namespace Path | Payload Field | Notes |
|---|---|---|
| `adapter_binding.md` → `source.kind` | `source.kind` | Extracted from `source.kind:` field |
| `adapter_binding.md` → `profile.admissibility` | `source.admissibility` | Must be `GOVERNED` |
| `adapter_binding.md` → `profile.resolution` | `source.resolution` | Must be `DETERMINISTIC` |
| `adapter_binding.md` → `baseline_anchor` | `baseline_anchor` | Git anchor tag |
| `run_manifest.md` → `date` | `date` | Run date |
| `40.2/` directory listing (sorted) | `layers.L40_2.artifacts` | 4 files (run_07) |
| `40.3/` directory listing (sorted) | `layers.L40_3.artifacts` | 6 files (run_07) |
| `40.4/` directory listing (sorted) | `layers.L40_4.artifacts` | 17 files (run_07) |

---

## Layer Contents (run_07_source_profiled_ingestion)

### L40_2 — Evidence Layer (4 artifacts)
| Artifact | Role |
|---|---|
| `evidence_classification_map.md` | Evidence type classification |
| `evidence_surface_inventory.md` | Surface coverage inventory |
| `intake_validation_log.md` | Intake gate validation |
| `normalized_evidence_map.md` | Normalized evidence index |

### L40_3 — Structural Layer (6 artifacts)
| Artifact | Role |
|---|---|
| `dependency_map.md` | Component dependency graph |
| `entity_catalog.md` | Entity registry |
| `interface_map.md` | Interface surface map |
| `program_execution_graph.md` | Execution dependency graph |
| `reconstruction_validation_log.md` | Reconstruction gate result |
| `structural_traceability_map.md` | Structure → evidence trace |

### L40_4 — Telemetry Layer (17 artifacts)
| Artifact | Role |
|---|---|
| `activity_telemetry.md` | Activity signals |
| `delivery_telemetry.md` | Delivery signals |
| `dependency_telemetry.md` | Dependency signals |
| `domain_telemetry.md` | Domain signals |
| `entity_telemetry.md` | Entity signals |
| `interface_telemetry.md` | Interface signals |
| `structural_telemetry.md` | Structural signals |
| `structure_immutability_log.md` | Immutability gate |
| `telemetry_dimension_catalog.md` | Dimension registry |
| `telemetry_normalization_spec.md` | Normalization rules |
| `telemetry_schema.md` | Schema definition |
| `telemetry_surface_definition.md` | Surface boundaries |
| `telemetry_surface_map.md` | Surface index |
| `telemetry_to_peg_mapping.md` | PEG binding map |
| `telemetry_traceability_map.md` | Telemetry → evidence trace |
| `telemetry_validation_log.md` | Telemetry gate result |
| `temporal_telemetry_series.md` | Temporal signal series |

---

## Provenance Chain

```
payload_manifest.json
  └── governance: IG.6 (orchestration_gate)
  └── source_profile_layer: IG.5
  └── admissibility: GOVERNED
  └── determinism: VERIFIED
  └── baseline_anchor: pios-core-v0.4-final
```
