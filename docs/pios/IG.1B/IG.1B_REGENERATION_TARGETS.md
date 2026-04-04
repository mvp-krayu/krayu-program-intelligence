# IG.1B — Regeneration Targets

**Stream:** IG.1B  
**Parent:** IG.1  
**Layer:** INGESTION  
**Status:** ACTIVE  
**Date:** 2026-04-04  

---

## 1. PURPOSE

This document defines the regeneration target paths for each sub-stream in scope (40.2, 40.3, 40.4), and the reference comparison paths for existing baseline artifacts. It establishes the complete write-target surface for IG.1C execution and the read-only comparison surface for post-regeneration invariance assessment.

---

## 2. REGENERATION SCOPE

| Sub-stream | Description | Status |
|---|---|---|
| 40.2 | Evidence Classification and Normalization | IN SCOPE — fresh regeneration required |
| 40.3 | Structural Reconstruction | IN SCOPE — fresh regeneration required |
| 40.4 | Telemetry Generation | IN SCOPE — fresh regeneration required |
| 40.5 and above | Downstream PiOS execution | BLOCKED — out of scope for IG.1 |

---

## 3. FRESH REGENERATION TARGET PATHS

All fresh regeneration output must be written to isolated target paths. These paths are separate from the existing baseline artifacts.

### 3.1 Stream 40.2 — Evidence Classification and Normalization

**Regeneration target root:** `docs/pios/runs/run_02_blueedge/40.2/`

| Target File | Description |
|---|---|
| `evidence_classification_map.md` | Classification of all ingested evidence by type and domain |
| `evidence_surface_inventory.md` | Full inventory of evidence surfaces ingested |
| `intake_validation_log.md` | Validation log of intake processing |
| `normalized_evidence_map.md` | Normalized map of evidence after classification |

**Artifact count:** 4  
**Write rule:** fresh generation only — no copy from existing baseline

---

### 3.2 Stream 40.3 — Structural Reconstruction

**Regeneration target root:** `docs/pios/runs/run_02_blueedge/40.3/`

| Target File | Description |
|---|---|
| `dependency_map.md` | Dependency relationships between components |
| `entity_catalog.md` | Catalog of all identified entities |
| `interface_map.md` | Interface surface map |
| `program_execution_graph.md` | Execution graph of program operations |
| `reconstruction_validation_log.md` | Validation log of reconstruction |
| `structural_traceability_map.md` | Traceability of structure back to evidence |
| `reconstruction/architectural_responsibility_zones.md` | Architectural responsibility zone map |
| `reconstruction/capability_domain_map.md` | Capability domain mapping |
| `reconstruction/capability_map.md` | Full capability map |
| `reconstruction/component_inventory.md` | Component inventory |
| `reconstruction/dependency_map.md` | Reconstruction-level dependency map |
| `reconstruction/entity_catalog.md` | Reconstruction-level entity catalog |
| `reconstruction/interface_map.md` | Reconstruction-level interface map |
| `reconstruction/program_coordination_model.md` | Program coordination model |
| `reconstruction/program_execution_graph.md` | Reconstruction-level execution graph |
| `reconstruction/program_structure.md` | Program structural definition |
| `reconstruction/repository_map.md` | Repository map |
| `reconstruction/repository_topology.md` | Repository topology |
| `reconstruction/system_component_map.md` | System component map |
| `traceability/structural_traceability_map.md` | Traceability-layer structural map |

**Artifact count:** 20  
**Write rule:** fresh generation only — no copy from existing baseline

---

### 3.3 Stream 40.4 — Telemetry Generation

**Regeneration target root:** `docs/pios/runs/run_02_blueedge/40.4/`

| Target File | Description |
|---|---|
| `activity_telemetry.md` | Activity-dimension telemetry |
| `delivery_telemetry.md` | Delivery-dimension telemetry |
| `dependency_telemetry.md` | Dependency-dimension telemetry |
| `domain_telemetry.md` | Domain-dimension telemetry |
| `entity_telemetry.md` | Entity-dimension telemetry |
| `interface_telemetry.md` | Interface-dimension telemetry |
| `structural_telemetry.md` | Structural-dimension telemetry |
| `structure_immutability_log.md` | Immutability enforcement log |
| `telemetry_dimension_catalog.md` | Full catalog of telemetry dimensions |
| `telemetry_normalization_spec.md` | Normalization specification |
| `telemetry_schema.md` | Telemetry schema definition |
| `telemetry_surface_definition.md` | Telemetry surface definition |
| `telemetry_surface_map.md` | Telemetry surface map |
| `telemetry_to_peg_mapping.md` | Telemetry-to-PEG mapping |
| `telemetry_traceability_map.md` | Traceability map for telemetry |
| `telemetry_validation_log.md` | Validation log |
| `temporal_telemetry_series.md` | Temporal dimension telemetry |

**Artifact count:** 17  
**Write rule:** fresh generation only — no copy from existing baseline

---

## 4. REFERENCE COMPARISON PATHS

The following existing baseline artifacts are the READ-ONLY comparison surface. They represent the prior execution outputs and are used only for post-regeneration invariance comparison. They must not be written to or used as ingestion inputs.

### 4.1 Stream 40.2 Baseline Reference

**Reference path:** `docs/pios/40.2/`

| Reference File | Comparison Purpose |
|---|---|
| `evidence_classification_map.md` | compare against regenerated classification |
| `evidence_surface_inventory.md` | compare against regenerated inventory |
| `intake_validation_log.md` | compare against regenerated validation log |
| `normalized_evidence_map.md` | compare against regenerated normalized map |

**Access rule:** READ-ONLY — comparison only, post-regeneration

---

### 4.2 Stream 40.3 Baseline Reference

**Reference path:** `docs/pios/40.3/`

| Reference File | Comparison Purpose |
|---|---|
| `dependency_map.md` | compare |
| `entity_catalog.md` | compare |
| `interface_map.md` | compare |
| `program_execution_graph.md` | compare |
| `reconstruction_validation_log.md` | compare |
| `structural_traceability_map.md` | compare |
| `reconstruction/` (all files) | compare |
| `traceability/` (all files) | compare |

**Access rule:** READ-ONLY — comparison only, post-regeneration

---

### 4.3 Stream 40.4 Baseline Reference

**Reference path:** `docs/pios/40.4/`

| Reference File | Comparison Purpose |
|---|---|
| All 17 telemetry files | compare against regenerated telemetry |

**Access rule:** READ-ONLY — comparison only, post-regeneration

---

## 5. READ-ONLY COMPARISON RULE

1. Baseline reference paths (`docs/pios/40.2/`, `docs/pios/40.3/`, `docs/pios/40.4/`) are READ-ONLY under all IG.1 sub-streams
2. No IG.1 execution may write to these paths
3. Comparison must occur only after fresh regeneration is complete and written to `docs/pios/runs/run_02_blueedge/`
4. Comparison results are owned by a future stream (post IG.1C) — not by IG.1B or IG.1C

---

## 6. DOWNSTREAM BLOCKED PATHS

The following are explicitly blocked from any write or execution activity under IG.1:

| Path | Status |
|---|---|
| `docs/pios/40.5/` | BLOCKED — downstream of scope |
| `docs/pios/40.6/` through `40.11/` | BLOCKED — downstream of scope |
| `docs/pios/41.x/` | BLOCKED — separate domain |
| `docs/pios/42.x/` | BLOCKED — separate domain |
| `docs/pios/43.x/` | BLOCKED — separate domain |
| `docs/pios/44.x/` | BLOCKED — separate domain |
| `docs/pios/51.x/` | BLOCKED — separate domain |

---

## 7. TARGET SUMMARY

| Stream | Target Root | Artifact Count | Status |
|---|---|---|---|
| 40.2 | `docs/pios/runs/run_02_blueedge/40.2/` | 4 | PENDING — awaiting IG.1C |
| 40.3 | `docs/pios/runs/run_02_blueedge/40.3/` | 20 | PENDING — awaiting IG.1C |
| 40.4 | `docs/pios/runs/run_02_blueedge/40.4/` | 17 | PENDING — awaiting IG.1C |

**Total fresh regeneration artifacts:** 41

---

## 8. GOVERNANCE

- This target definition is owned by IG.1B
- Target paths are authoritative for IG.1C execution
- No path may be added or removed without a new stream contract
- Downstream execution (40.5+) remains BLOCKED until explicitly authorized
