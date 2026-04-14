# Computable Chain Stage Map
# COMPUTABLE.CHAIN.TO.GAUGE.01 — Deliverable 1

## Identity

- Contract: COMPUTABLE.CHAIN.TO.GAUGE.01
- Date: 2026-04-14
- Branch: wip/gauge-psee-hygiene-snapshot
- Mode: ARCHITECTURE DEFINITION ONLY — NO IMPLEMENTATION

---

## Stage Map

| Stage | Name | Purpose | Input | Computation | Output | Governed Artifact | Status |
|-------|------|---------|-------|-------------|--------|-------------------|--------|
| S0 | Bootstrap | Establish raw evidence boundary — source repository + intake files | Client source code repo; raw input files (configs, manifests, telemetry exports, docs) | None — artifact collection only | Raw source tree; raw intake directory | `clients/<uuid>/source/` | EXECUTABLE |
| S1 | IG (Ingestion) | Normalize and admit raw evidence into a governed intake boundary | S0 raw source tree | IG.5 → IG.4 → IG.3 → IG.7 → IG.6 → IG.7-normalizer pipeline; evidence scanning, classification, admissibility decision, normalization, provenance chain assembly | Runtime Handoff Package (RHP): `source_manifest.json`, `evidence_boundary.json`, `admissibility_log.json`, `layer_index.json`, `source_profile.json`, `provenance_chain.json` | `docs/pios/IG.RUNTIME/run_01/` | EXECUTABLE |
| S2 | Structural Truth | Classify evidence, reconstruct structural entities, extract observable telemetry dimensions | S1 RHP (admitted artifact set) | 40.2: evidence inventory + classification; 40.3: entity catalog, dependency map, interface map, reconstruction validation; 40.4: telemetry surface definition, schema, dimension catalog | Evidence classification map; entity catalog; dependency map; reconstruction corpus; telemetry dimension set | `docs/pios/40.2/`, `docs/pios/40.3/`, `docs/pios/40.4/` | PARTIAL |
| S2a | PSEE Pipeline | Transform S2 structural artifacts into governed consumption package | S2 structural artifacts; S0/S1 RHP | 6 stages: intake (01) → lineage (02) → structure (03) → transformation (04) → envelope (05) → validation (06) | `binding_envelope.json`, `coverage_state.json`, `reconstruction_state.json`, `package_manifest.json` | `clients/<uuid>/psee/runs/<run_id>/package/` | PARTIAL |
| S3 | Semantic Computation | Elevate structural truth into semantic topology, signal registry, navigable PIE, and query catalog | S2 structural artifacts (entity catalog, reconstruction corpus, dependency map) | 41.1: semantic domain/capability/component model → topology JSON emission; 41.2: PIE vault (navigable semantic index); 41.3: semantic link normalization; 41.4: signal computation from structural evidence; 41.5: golden query catalog from signal+topology | `canonical_topology.json`; signal registry; PIE vault; query catalog | `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json`; `docs/pios/41.4/signal_registry.json`; `docs/pios/41.5/query_signal_map.json` | PARTIAL |
| S3-41.1 | Topology Emission | Emit canonical structural topology JSON from governed semantic layer | 41.1 semantic domain/capability/component Python dicts (build_semantic_layer.py) | `scripts/pios/41.1/build_semantic_layer.py` | `canonical_topology.json` (17 domains, 42 capabilities, 89 components, 148 nodes) | `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json` | EXECUTABLE |
| S3-41.2 | PIE Vault | Build navigable semantic index from entity + capability model | S3 semantic domain model, entity catalog | `scripts/pios/41.2/build_pie_vault.py` | PIE index, node inventory, navigation map, render manifest | `docs/pios/41.2/` | PARTIAL |
| S3-41.3 | Semantic Link Normalization | Normalize relationship and link representations across semantic layer | S3 semantic outputs, S2 dependency/interface maps | `scripts/pios/41.3/build_link_normalization.py` | Consolidated semantic link report | `docs/pios/41.3/` | PARTIAL |
| S3-41.4 | Signal Registry | Build governed signal list from structural evidence observations | S2 telemetry dimensions + S3 semantic layer | `scripts/pios/41.4/build_signals.py` | `signal_registry.json` (5 signals; evidence_confidence: STRONG/MODERATE/WEAK) | `docs/pios/41.4/signal_registry.json` | PARTIAL |
| S3-41.5 | Query Catalog | Define golden queries from signal registry and semantic topology | S3-41.4 signal registry; S3-41.1 topology | `scripts/pios/41.5/build_golden_queries.py` | `query_signal_map.json`; golden query catalog | `docs/pios/41.5/` | PARTIAL |
| S4 | GAUGE Materialization | Combine structural proof package + semantic outputs into GAUGE-consumable runtime state; expose as Next.js product surface | S2a package artifacts; S3 canonical_topology.json; S3 signal_registry.json | gauge_state.json population (MISSING as computable step — currently static); GAUGE Next.js API routes read package + semantic artifacts | GAUGE runtime: score display, coverage/reconstruction state, topology graph, signal availability | `clients/<uuid>/psee/runs/<run_id>/package/gauge_state.json`; GAUGE Next.js app | PARTIAL |
| S5 | PiOS Continuation | Compute program intelligence from runtime telemetry — signals, conditions, diagnoses, delivery, feedback, loop closure | S2 telemetry dimensions (40.4) with live runtime data; S3 signal specs | 40.5: signal computation from live telemetry; 40.6: condition activation; 40.7: diagnosis synthesis; 40.8: delivery; 40.9: feedback; 40.10: control; 40.11: loop closure | Computed signal values; active conditions; diagnosis set; delivery artifacts; feedback registry; execution loop record | `docs/pios/40.5/`–`40.11/` | PARTIAL |
| S6 | LENS Projection | Project computed intelligence onto structural topology; render ExecLens navigation and narrative surface | S5 computed signals; S3 canonical topology; S4 GAUGE baseline | 43.x signal-to-structure binding; 44.x overlay projection; 42.x ExecLens query execution and narrative rendering | Signal-annotated topology; execution narrative; ExecLens query responses | `docs/pios/43.x/`, `docs/pios/44.x/`, `docs/pios/42.x/` | PARTIAL |

---

## Status Key

| status | meaning |
|--------|---------|
| EXECUTABLE | Script exists; inputs defined; can be run end-to-end; produces fresh output |
| PARTIAL | Script or artifacts exist; some inputs are blocked (runtime telemetry), frozen, or manually authored |
| FROZEN | Artifacts exist; no executable script produces them from first principles; manual authoring only |
| MISSING | No script exists; no contract for computation; cannot be run |

---

## Status Summary

| stage | status |
|-------|--------|
| S0 — Bootstrap | EXECUTABLE |
| S1 — IG | EXECUTABLE |
| S2 — Structural Truth (40.2–40.4) | PARTIAL |
| S2a — PSEE Pipeline (envelope production) | PARTIAL |
| S3-41.1 — Topology Emission | EXECUTABLE |
| S3-41.2 — PIE Vault | PARTIAL |
| S3-41.3 — Semantic Link Normalization | PARTIAL |
| S3-41.4 — Signal Registry | PARTIAL |
| S3-41.5 — Query Catalog | PARTIAL |
| S4 — GAUGE Materialization | PARTIAL |
| S5 — PiOS Continuation (40.5–40.11) | PARTIAL |
| S6 — LENS Projection (43.x, 44.x, 42.x) | PARTIAL |

**EXECUTABLE stages: S0, S1, S3-41.1 (3 of 12)**
**PARTIAL stages: all others (9 of 12)**
**FROZEN stages: 0**
**MISSING stages: 0 at stage level (but gaps exist within stages — see executable_gap_register.md)**

---

## Critical Note: GAUGE is Not a Separate Truth System

GAUGE is S4 — an earlier-stop consumption surface on the same chain as LENS.

GAUGE reads structural proof artifacts produced by S2a and semantic artifacts from S3.
GAUGE stops before S5 (signal computation requires live telemetry GAUGE does not need).
LENS begins at S5 and requires the full chain.

The chain is one. GAUGE and LENS share the same upstream stages.
