# Computable Chain Execution Order
# COMPUTABLE.CHAIN.TO.GAUGE.01 — Deliverable 4

## Identity

- Contract: COMPUTABLE.CHAIN.TO.GAUGE.01
- Date: 2026-04-14
- Mode: EXECUTION ORDER DEFINITION ONLY — NO IMPLEMENTATION

---

## Rule

Steps marked `UNKNOWN — CONTRACT NOT YET IMPLEMENTED` have no authorized script.
Steps with known commands are defined from existing governed scripts.
Step order is fixed. No step may be reordered.

---

## STEP 0 — Bootstrap: Establish raw source boundary

```
Execution type : Manual / external
Command        : (no script — raw source directory population)
Input          : Client source code repository; raw intake files
Output         : clients/<uuid>/source/<version>/  (populated)
Stop condition : All required source artifacts present and readable
Gap            : None — S0 is always executable
```

---

## STEP 1 — IG Ingestion Pipeline

```
Execution type : bash script
Command        : bash scripts/ig/run_ig_pipeline.sh \
                   --client <uuid> \
                   --source <path-to-client-source> \
                   --run-id <run_id> \
                   --log-level INFO

Input          : clients/<uuid>/source/<version>/
Output         : clients/<uuid>/ig/runs/<run_id>/payload_manifest.json
                 Runtime Handoff Package (RHP):
                   docs/pios/IG.RUNTIME/run_<run_id>/source_manifest.json
                   docs/pios/IG.RUNTIME/run_<run_id>/evidence_boundary.json
                   docs/pios/IG.RUNTIME/run_<run_id>/admissibility_log.json
                   docs/pios/IG.RUNTIME/run_<run_id>/normalized_intake_structure/
Stop condition : exit code 0 (IG_SUCCESS); payload_manifest.json present
Gap            : GAP-10 (IG reproducibility for new source revision unverified)
```

---

## STEP 2 — 40.2: Evidence Classification and Inventory

```
Execution type : python3
Command        : python3 scripts/pios/40.2/scan_repository.sh
                 python3 scripts/pios/40.2/classify_files.py
                 python3 scripts/pios/40.2/build_evidence_inventory.py
                 python3 scripts/pios/40.2/extract_entities.py
                 python3 scripts/pios/40.2/normalize_entities.py
                 python3 scripts/pios/40.2/validate_intake.py

Input          : RHP from STEP 1; client source tree
Output         : docs/pios/40.2/evidence_classification_map.md
                 docs/pios/40.2/normalized_evidence_map.md
                 docs/pios/40.2/evidence_surface_inventory.md
Stop condition : validate_intake.py exits 0; all 40.2 artifacts present
Gap            : None — scripts exist; status PARTIAL only due to runtime telemetry absence downstream
```

---

## STEP 3 — 40.3: Structural Reconstruction

```
Execution type : python3
Command        : python3 scripts/pios/40.3/extract_perm_entities.py
                 python3 scripts/pios/40.3/validate_reconstruction.py

Input          : docs/pios/40.2/ artifacts
Output         : docs/pios/40.3/entity_catalog.md
                 docs/pios/40.3/dependency_map.md
                 docs/pios/40.3/interface_map.md
                 docs/pios/40.3/program_execution_graph.md
                 docs/pios/40.3/reconstruction/  (full corpus)
Stop condition : validate_reconstruction.py exits 0
Gap            : GAP-04 (grouping engine verification for non-BlueEdge clients)
```

---

## STEP 4 — 40.4: Telemetry Surface Definition

```
Execution type : python3
Command        : python3 scripts/pios/40.4/build_telemetry_artifacts.py
                 python3 scripts/pios/40.4/validate_telemetry_artifacts.py

Input          : docs/pios/40.3/ artifacts; admissibility_log.json from STEP 1
Output         : docs/pios/40.4/telemetry_surface_definition.md
                 docs/pios/40.4/telemetry_dimension_catalog.md
                 docs/pios/40.4/telemetry_schema.md
                 (runtime telemetry dimensions: BLOCKED without live platform access)
Stop condition : validate_telemetry_artifacts.py exits 0 (static dimensions only)
Gap            : GAP-02 (live runtime telemetry required for runtime dimensions)
```

---

## STEP 5 — PSEE End-to-End Pipeline (S2a)

```
Execution type : python3
Command        : python3 scripts/psee/run_end_to_end.py \
                   --client <uuid> \
                   --source <path> \
                   --run-id <run_id> \
                   --target gauge \
                   --log-level INFO

Input          : STEP 1 RHP; STEP 2-4 structural artifacts; existing demo package (reference)
Output         : clients/<uuid>/psee/runs/<run_id>/package/binding_envelope.json
                 clients/<uuid>/psee/runs/<run_id>/package/coverage_state.json
                 clients/<uuid>/psee/runs/<run_id>/package/reconstruction_state.json
                 clients/<uuid>/psee/runs/<run_id>/package/package_manifest.json
                 clients/<uuid>/psee/runs/<run_id>/package/gauge_state.json  (COPIED from demo — not computed)
Stop condition : exit code 0 (PIPELINE_COMPLETE); all package artifacts present
Gap            : GAP-01 (gauge_state.json is copied, not computed)
                 GAP-05 (fresh-run bootstrap protocol missing)
```

---

## STEP 6 — 41.1: Topology Emission

```
Execution type : python3
Command        : python3 scripts/pios/41.1/build_semantic_layer.py

Input          : docs/pios/40.3/entity_catalog.md (STEP 3 output); build_semantic_layer.py DOMAINS/CAPABILITIES/COMPONENTS dicts
Output         : docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json
                 (17 domains, 42 capabilities, 89 components, 148 nodes)
Stop condition : canonical_topology.json written; parity_check.py validates counts
Gap            : None — EXECUTABLE
```

---

## STEP 7 — 41.2: PIE Vault

```
Execution type : python3
Command        : python3 scripts/pios/41.2/build_pie_vault.py
                 python3 scripts/pios/41.2/validate_pie_vault.py

Input          : docs/pios/40.3/ reconstruction corpus; STEP 6 canonical_topology.json
Output         : docs/pios/41.2/ (PIE index, node inventory, navigation map)
Stop condition : validate_pie_vault.py exits 0
Gap            : GAP-11 (fresh execution not verified in this session)
```

---

## STEP 8 — 41.3: Semantic Link Normalization

```
Execution type : python3
Command        : python3 scripts/pios/41.3/build_link_normalization.py
                 python3 scripts/pios/41.3/validate_link_normalization.py

Input          : docs/pios/41.2/ PIE vault (STEP 7); docs/pios/40.3/dependency_map.md; docs/pios/40.3/interface_map.md
Output         : docs/pios/41.3/semantic_consolidation_report.md
Stop condition : validate_link_normalization.py exits 0
Gap            : GAP-11 (fresh execution not verified)
```

---

## STEP 9 — 41.4: Signal Registry

```
Execution type : python3
Command        : python3 scripts/pios/41.4/build_signals.py
                 python3 scripts/pios/41.4/validate_signals.py

Input          : docs/pios/40.4/ telemetry dimensions (STEP 4); STEP 6 canonical_topology.json
                 NOTE: currently wired to static structural-evidence signals only
                 (live 40.5 computed signal values NOT yet input — see GAP-03)
Output         : docs/pios/41.4/signal_registry.json
                 docs/pios/41.4/executive_signal_report.md
Stop condition : validate_signals.py exits 0; signal_registry.json present
Gap            : GAP-03 (no formal 40.5→41.4 input bundle contract)
                 GAP-06 (script output is static — not freshly computed from live telemetry)
```

---

## STEP 10 — 41.5: Query Catalog

```
Execution type : python3
Command        : python3 scripts/pios/41.5/build_golden_queries.py
                 python3 scripts/pios/41.5/validate_golden_queries.py

Input          : docs/pios/41.4/signal_registry.json (STEP 9); STEP 6 canonical_topology.json
Output         : docs/pios/41.5/golden_query_catalog.md
                 docs/pios/41.5/query_signal_map.json
Stop condition : validate_golden_queries.py exits 0
Gap            : GAP-11 (fresh execution not verified)
```

---

## STEP 11 — gauge_state.json Computation (GAUGE materialization)

```
Execution type : python3
Command        : UNKNOWN — CONTRACT NOT YET IMPLEMENTED
                 (expected: python3 scripts/psee/build_gauge_state.py \
                    --client <uuid> --run-id <run_id>)

Input          : clients/<uuid>/psee/runs/<run_id>/package/coverage_state.json
                 clients/<uuid>/psee/runs/<run_id>/package/reconstruction_state.json
                 PSEE execution state (S-13 or S-Tx) — NOT YET AVAILABLE
                 PSEE-GAUGE.0/gauge_score_model.md (scoring rules)
Output         : clients/<uuid>/psee/runs/<run_id>/package/gauge_state.json (computed)
Stop condition : gauge_state.json written; score validates against gauge_score_model.md
Gap            : GAP-01 (script does not exist)
                 GAP-09 (execution state required for completion component)
```

---

## STEP 12 — GAUGE Runtime (GAUGE stop boundary)

```
Execution type : Next.js dev/production server
Command        : cd app/gauge-product && npm run dev
                 (or: npm run build && npm start)

Input          : STEP 5 package artifacts (coverage, reconstruction, gauge_state)
                 STEP 6 canonical_topology.json
                 STEP 9 signal_registry.json
Output         : GAUGE product UI at http://localhost:3000
                 Surfaces: score, coverage, reconstruction, topology graph, signal availability
Stop condition : Server running; /api/gauge returns 200; /api/topology returns 200; /api/signals returns 200
Gap            : GAP-01 (gauge_state.json reflects static state until STEP 11 is implemented)

GAUGE STOP BOUNDARY — chain stops here for GAUGE
```

---

## STEP 13 — 40.5: Signal Computation (PiOS continuation begins)

```
Execution type : python3
Command        : python3 scripts/pios/40.5/build_signal_artifacts.py
                 python3 scripts/pios/40.5/validate_signal_artifacts.py

Input          : docs/pios/40.4/ telemetry dimensions WITH live runtime data (required)
Output         : docs/pios/40.5/ computed signal values (currently mostly BLOCKED)
Stop condition : validate_signal_artifacts.py exits 0; no BLOCKED signals
Gap            : GAP-02 (live runtime telemetry absent — most signals remain BLOCKED)
```

---

## STEP 14 — 40.6-40.11: Conditions, Diagnosis, Delivery, Feedback, Control, Loop

```
Execution type : python3 (sequential chain)
Command        : python3 scripts/pios/40.6/build_condition_artifacts.py
                 python3 scripts/pios/40.7/build_diagnosis_artifacts.py
                 python3 scripts/pios/40.8/build_delivery_artifacts.py
                 python3 scripts/pios/40.9/build_feedback_artifacts.py
                 python3 scripts/pios/40.10/build_control_artifacts.py
                 python3 scripts/pios/40.11/validate_loop_closure.py

Input          : STEP 13 computed signal values
Output         : docs/pios/40.6/–40.11/ (conditions, diagnoses, delivery, feedback, control, loop record)
Stop condition : validate_loop_closure.py exits 0
Gap            : GAP-02 cascades through all stages (blocked signals = blocked conditions = blocked diagnoses)
```

---

## STEP 15 — 43.x: Signal-to-Structure Binding (LENS pre-condition)

```
Execution type : python3
Command        : UNKNOWN — CONTRACT NOT YET IMPLEMENTED
                 (expected: python3 scripts/pios/43.x/bind_signals_to_structure.py)

Input          : STEP 13-14 computed signals and conditions
                 STEP 6 canonical_topology.json (structural topology)
Output         : Signal-annotated topology binding artifacts
Stop condition : All signals bound to structural nodes; binding validation passes
Gap            : GAP-07 (no executable binding script)
```

---

## STEP 16 — 44.x: Overlay Projection

```
Execution type : python3
Command        : UNKNOWN — CONTRACT NOT YET IMPLEMENTED
                 (expected: python3 scripts/pios/44.x/build_overlay_projection.py)

Input          : STEP 15 signal-annotated topology binding
Output         : Structural overlay projection artifacts (44.x output)
Stop condition : Overlay projection artifacts emitted; validated
Gap            : GAP-08 (no executable projection script)
```

---

## STEP 17 — LENS Projection (ExecLens)

```
Execution type : python3 / Next.js
Command        : python3 scripts/pios/42.1/run_execlens_query.py  (query execution)
                 python3 scripts/pios/42.2/render_executive_narrative.py  (narrative)
                 python3 scripts/pios/42.3/execlens_cli.py  (CLI surface)
                 (or: ExecLens Next.js app at app/execlens-demo/)

Input          : STEP 15-16 binding + projection artifacts; golden queries from STEP 10
Output         : ExecLens interactive query responses; executive narrative; LENS projection surface
Stop condition : All golden queries execute; narrative rendered
Gap            : GAP-07, GAP-08 (upstream binding/projection unexecutable)
```

---

## Chain Summary

```
STEP 0   Bootstrap                           EXECUTABLE
STEP 1   IG Pipeline                         EXECUTABLE
STEP 2   40.2 Evidence Classification        PARTIAL
STEP 3   40.3 Structural Reconstruction      PARTIAL
STEP 4   40.4 Telemetry Extraction           PARTIAL
STEP 5   PSEE End-to-End Pipeline            PARTIAL
STEP 6   41.1 Topology Emission              EXECUTABLE
STEP 7   41.2 PIE Vault                      PARTIAL
STEP 8   41.3 Link Normalization             PARTIAL
STEP 9   41.4 Signal Registry                PARTIAL
STEP 10  41.5 Query Catalog                  PARTIAL
STEP 11  gauge_state.json Computation        UNKNOWN (NOT IMPLEMENTED)
STEP 12  GAUGE Runtime                       EXECUTABLE (static baseline)
─────────────────────────────── GAUGE STOP BOUNDARY ──────────────────────────
STEP 13  40.5 Signal Computation             PARTIAL (BLOCKED by GAP-02)
STEP 14  40.6-40.11 Conditions/Diagnosis     PARTIAL (BLOCKED by GAP-02)
STEP 15  43.x Signal Binding                 UNKNOWN (NOT IMPLEMENTED)
STEP 16  44.x Overlay Projection             UNKNOWN (NOT IMPLEMENTED)
STEP 17  LENS Projection                     PARTIAL (blocked by STEP 15-16)
```
