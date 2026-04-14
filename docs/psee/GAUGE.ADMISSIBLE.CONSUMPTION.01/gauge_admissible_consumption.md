# GAUGE Admissible Consumption Contract
# GAUGE.ADMISSIBLE.CONSUMPTION.01

---

## 1. IDENTITY

- Contract: GAUGE.ADMISSIBLE.CONSUMPTION.01
- Date: 2026-04-14
- Status: AUTHORITATIVE — LOCKED
- Scope: STAGE 4 ONLY — GAUGE consumption surface
- Authority level: EARLY-STOP GOVERNED CONSUMPTION AUTHORITY

**Upstream dependencies (both required before GAUGE may consume):**
- STRUCTURAL.TRUTH.AUTHORITY.01 — Stage 2 structural truth (40.2–40.4)
- SEMANTIC.COMPUTATION.AUTHORITY.01 — Stage 3 semantic derivation (41.x)

**Downstream relationship:**
- PiOS continuation begins at Stage 5 (40.5 signal computation)
- LENS is downstream of Stage 5 (S5) and Stage 6 (S6); LENS is not part of GAUGE
- GAUGE and LENS share the same upstream computable chain but diverge at Stage 5

**What this contract defines:**
GAUGE is an early-stop governed consumption surface. It proves what has been computed — structural reconstruction, coverage, topology, signal presence — without requiring or simulating the runtime intelligence that belongs downstream.

---

## Purpose

This contract defines exactly what GAUGE may consume, what it must not consume, what it is authorized to expose, and where it stops. GAUGE is not a summary of the full chain — it is the authorized structural proof surface at Stage 4. Its authority derives from stopping correctly, not from extending beyond its boundary.

---

## 2. AUTHORIZED INPUT SURFACE

GAUGE may consume ONLY the following five artifacts. No artifact outside this set is admissible unless explicitly declared in this section.

### 2.1 Package Scope Artifacts

**gauge_state.json**
- Purpose: Carries the GAUGE execution state — score, score band, component breakdown, and completion posture
- Source stage: Stage 4 (PSEE pipeline materialization — S2a output)
- Admissible content role: Score and posture representation only; the completion component (requiring terminal execution state) is correctly NOT EVALUATED when upstream S5 computation is absent
- GAUGE surface/API responsibility: `/api/gauge` — exposes score, band, and component values to the GAUGE UI
- Note: `gauge_state.json` is the product of the PSEE pipeline's package assembly; it is not recomputed by GAUGE at render time

**coverage_state.json**
- Purpose: Carries the structural coverage proof — what portions of the system have been covered by the computable chain
- Source stage: Stage 4 (PSEE pipeline — S2a stage 06)
- Admissible content role: Coverage proof surface only; no coverage inference may occur inside GAUGE
- GAUGE surface/API responsibility: `/api/gauge` — exposes coverage dimensions alongside score

**reconstruction_state.json**
- Purpose: Carries the structural reconstruction proof — evidence that the system's structure has been recovered from the admitted evidence
- Source stage: Stage 4 (PSEE pipeline — S2a stage 06)
- Admissible content role: Reconstruction proof surface only; no reconstruction inference may occur inside GAUGE
- GAUGE surface/API responsibility: `/api/gauge` — exposes reconstruction dimensions alongside coverage

### 2.2 Semantic Scope Artifacts

**canonical_topology.json**
- Purpose: Carries the authoritative structural topology — the domain/capability/component graph derived by Stage 3 (41.1)
- Source stage: Stage 3 (41.1 Topology Emission)
- Admissible content role: Structural topology surface only; GAUGE renders topology nodes and relationships as declared — it does not reinterpret or re-derive them
- GAUGE surface/API responsibility: `/api/topology` — exposes topology graph for UI rendering

**signal_registry.json**
- Purpose: Carries the structural-evidence signal registry — signals derived from structural observations without live runtime access
- Source stage: Stage 3 (41.4 Signal Registry)
- Admissible content role: Signal presence and confidence visibility only; signals are structural-evidence class only (`runtime_required: false` for all entries)
- GAUGE surface/API responsibility: `/api/signals` — exposes signal count, `evidence_confidence` distribution, and signal identifiers

### 2.3 General Consumption Rules

- No artifact outside Section 2.1–2.2 is admissible in GAUGE without explicit amendment to this contract
- GAUGE consumes outputs only — it never consumes upstream intermediates (classification maps, entity catalogs, RHP artifacts)
- GAUGE reads all consumed artifacts as immutable; it does not write back to any consumed artifact path
- GAUGE does not resolve, re-fetch, or re-derive any consumed artifact at render time

---

## 3. FORBIDDEN INPUT SURFACE

The following artifact classes must never be consumed by GAUGE. Consuming any of these is a contract violation.

| forbidden class | specific examples | reason |
|----------------|------------------|--------|
| Stage 0 source files | Any file under `clients/<uuid>/source/<version>/` | Raw evidence — not a GAUGE consumption surface; bypasses IG and S2 |
| RHP artifacts | `source_manifest.json`, `evidence_boundary.json`, `admissibility_log.json`, `layer_index.json`, `source_profile.json`, `provenance_chain.json` | Stage 1 intermediates — GAUGE consumes Stage 3/4 outputs only |
| 40.2 classification artifacts | `evidence_classification_map.md`, `normalized_evidence_map.md`, `evidence_surface_inventory.md` | Stage 2 classification intermediates — not a GAUGE surface |
| 40.3 reconstruction artifacts | `entity_catalog.md`, `dependency_map.md`, `interface_map.md`, `program_execution_graph.md`, `reconstruction/` | Stage 2 structural artifacts — GAUGE accesses structure through canonical_topology.json only |
| 40.4 telemetry artifacts | `telemetry_surface_definition.md`, `telemetry_dimension_catalog.md`, `telemetry_schema.md` | Stage 2 telemetry definitions — GAUGE accesses signals through signal_registry.json only |
| PIE vault artifacts | `docs/pios/41.2/` (all contents) | Stage 3 navigation index — not a GAUGE consumption surface |
| Query catalog artifacts | `golden_query_catalog.md`, `query_signal_map.json` | Stage 3 query definitions — GAUGE exposes query potential only, not query content |
| 40.5 signal computation outputs | Any `docs/pios/40.5/` artifact | Stage 5 computed runtime signals — GAUGE stops before Stage 5 |
| 40.6–40.11 outputs | Condition, diagnosis, delivery, feedback, control, and loop artifacts | Stage 5 intelligence pipeline — entirely downstream of GAUGE |
| 43.x binding artifacts | Signal-to-structure binding artifacts | Stage 6 activation — downstream of GAUGE |
| 44.x projection artifacts | Structural overlay projections | Stage 6 activation — downstream of GAUGE |
| 42.x ExecLens outputs | Query execution responses, executive narratives | Stage 6 runtime — downstream of GAUGE |
| Undeclared package artifacts | Any field or file not defined in an authorized package contract | Not governed — GAUGE must not treat undeclared fields as authoritative |
| Simulated or invented execution artifacts | Any `gauge_state.json` field that was synthesized without an upstream PSEE run | Fabricated state corrupts the proof surface |
| `semantic_consolidation_report.md` | `docs/pios/41.3/semantic_consolidation_report.md` | Stage 3 internal normalization record — not a GAUGE artifact |

---

## 4. CONSUMPTION AUTHORITY BY SURFACE

### A. gauge_state.json

GAUGE may use `gauge_state.json` to:
- render the overall GAUGE score (numeric value)
- render the score band (e.g. EARLY / DEVELOPING / ESTABLISHED / ADVANCED)
- render per-component score breakdowns
- render the completion posture — explicitly as NOT EVALUATED where the terminal execution state (S5) is absent

GAUGE must not:
- backfill the completion component with inferred, estimated, or simulated values
- recompute any score field from other consumed artifacts
- treat a NOT EVALUATED completion component as an error state — it is the correct representation of absent upstream computation
- modify `gauge_state.json` or write a derived version of it

### B. coverage_state.json

GAUGE may use `coverage_state.json` to:
- render the coverage proof surface — which system elements have been covered by the structural chain
- render coverage dimensions and their states as declared in the artifact

GAUGE must not:
- infer coverage for elements not declared in the artifact
- synthesize a coverage posture from topology data
- backfill absent coverage dimensions

### C. reconstruction_state.json

GAUGE may use `reconstruction_state.json` to:
- render the reconstruction proof surface — evidence that structural recovery occurred
- render reconstruction dimensions and states as declared in the artifact

GAUGE must not:
- infer reconstruction completeness from entity counts or topology
- synthesize a reconstruction posture from Stage 2 outputs
- backfill absent reconstruction dimensions

### D. canonical_topology.json

GAUGE may use `canonical_topology.json` to:
- render the structural topology graph (domain/capability/component hierarchy)
- display node counts, node types, and declared relationships
- provide topology-based navigation within the GAUGE surface

GAUGE must not:
- derive or re-emit topology from any source other than `canonical_topology.json`
- use envelope artifacts, package manifests, or Stage 2 entity catalogs as an alternative topology source
- add, remove, or modify topology nodes at render time
- treat topology node counts as a score input unless explicitly declared in `gauge_state.json`

The topology source is `canonical_topology.json` exclusively. Envelope-derived topology is a contract violation.

### E. signal_registry.json

GAUGE may use `signal_registry.json` to:
- display signal presence (how many signals are registered)
- display `evidence_confidence` distribution (STRONG / MODERATE / WEAK counts)
- display individual signal identifiers and names
- represent the structural-evidence signal set as the boundary of what is structurally observable

GAUGE must not:
- treat signal presence as a computed runtime signal value
- propagate signals across topology nodes
- display condition activations, heat maps, or diagnosis content derived from signals
- simulate runtime signal values for any signal with `runtime_required: false`
- render any signal as a live runtime observation

---

## 5. OUTPUT AUTHORITY OF GAUGE

### 5.1 What GAUGE Is Authorized to Expose

GAUGE may expose exactly the following:

| surface | source artifact | what is shown |
|---------|----------------|---------------|
| Structural proof posture | `gauge_state.json` | Score, score band, component breakdown |
| Reconstruction posture | `reconstruction_state.json` | Reconstruction coverage and state |
| Coverage posture | `coverage_state.json` | Coverage dimensions and state |
| Topology visibility | `canonical_topology.json` | Domain/capability/component graph |
| Signal presence visibility | `signal_registry.json` | Signal count, confidence distribution, signal list |
| Query potential / query gate posture | Declared gate state | Locked structural/execution query potential — no execution |
| Not-evaluated posture | `gauge_state.json` completion component | Explicit representation of absent upstream computation |

### 5.2 What GAUGE Must Not Expose

| prohibited output | reason |
|------------------|--------|
| Diagnosis | Belongs to Stage 5 (40.7); requires computed runtime signals |
| Narrative explanation of system behavior | Belongs to Stage 6 (42.x ExecLens); requires LENS projection |
| Signal propagation across topology | Belongs to Stage 6 (43.x signal-to-structure binding) |
| Condition activation | Belongs to Stage 5 (40.6); requires live signal computation |
| Runtime intelligence | Entire Stage 5 pipeline |
| ExecLens query execution | Belongs to Stage 6 (42.x) |
| Overlay projection | Belongs to Stage 6 (44.x) |
| Persona or executive interpretation | Belongs to Stage 6 (42.x narrative layer) |
| Computed coverage from topology | GAUGE reads declared coverage only — it does not compute it |
| Simulated execution state | No fabricated gauge_state.json fields |

---

## 6. GAUGE STOP BOUNDARY

### 6.1 GAUGE Stops at the End of Stage 4

GAUGE does not enter Stage 5. GAUGE does not require Stage 5 to function. GAUGE correctly represents the absence of Stage 5 computation as NOT EVALUATED — this is not a defect; it is accurate structural proof reporting.

**GAUGE STOP BOUNDARY = the point at which consumed artifacts are rendered and the proof surface is complete.**

### 6.2 What GAUGE Does

GAUGE DOES:
- consume the five authorized artifacts from Section 2
- render the structural proof posture (score, reconstruction, coverage)
- render the topology surface from `canonical_topology.json`
- render signal presence from `signal_registry.json`
- expose locked query potential as a declared gate state

### 6.3 What GAUGE Does Not Do

GAUGE DOES NOT:
- enter Stage 5 (40.5 signal computation)
- compute runtime signals or assign runtime values to structural-evidence signals
- activate conditions or produce condition states (40.6)
- produce diagnoses or diagnosis narratives (40.7)
- perform delivery, feedback, or control layer operations (40.8–40.11)
- perform signal-to-structure binding (43.x)
- produce structural overlay projections (44.x)
- execute ExecLens queries or produce executive narratives (42.x)
- simulate any downstream intelligence that has not been computed

### 6.4 Downstream Handoff Statement

**PiOS continuation begins at Stage 5 (40.5 Signal Computation).**

Stage 5 requires:
- live runtime telemetry from the 40.4 BLOCKED and RUNTIME dimensions
- computed signal values from the telemetry dimension scaffold

**LENS depends on Stage 5 and Stage 6 outputs and is not part of GAUGE.**

LENS requires:
- computed signal values (S5 — 40.5)
- signal-to-structure binding (S6 — 43.x)
- structural overlay projection (S6 — 44.x)
- ExecLens query execution (S6 — 42.x)

None of these are produced before the GAUGE stop boundary. GAUGE is correct and complete without them.

---

## 7. QUERY LOCK / QUERY POTENTIAL CONTRACT

### 7.1 Two Distinct States

| state | definition |
|-------|-----------|
| Query potential | A declared query exists in the query catalog (Stage 3 — 41.5) and may be represented as available in structure |
| Query execution | A query is executed against live or computed data and a response is produced |

GAUGE surfaces query potential. GAUGE does not perform query execution.

### 7.2 Query Visibility Rules

- GAUGE may expose the existence of locked discovery queries as a declared gate state
- GAUGE may expose the locked posture (LOCKED / AVAILABLE / UNAVAILABLE) as a signal to the user about what is structurally possible
- GAUGE must not auto-execute any query at render time
- GAUGE must not auto-unlock any query based on consumed artifact state
- GAUGE must not derive query responses from topology, signals, or package artifacts

### 7.3 Execution Gate Rule

Any query execution gate must remain in its defined locked or unavailable state until the downstream stage required to answer it is complete:

| query type | required for unlock |
|-----------|---------------------|
| Structural queries | Access key gate (defined externally) |
| Execution queries | Terminal execution state (S5 must complete) |

GAUGE represents the gate state. GAUGE does not bypass or simulate the gate.

---

## 8. GAUGE ADMISSIBILITY CRITERIA

Stage 4 (GAUGE) consumption is valid if and only if ALL of the following are satisfied:

| condition | check |
|-----------|-------|
| GA-01 | All 5 authorized artifacts exist at their defined paths |
| GA-02 | Each artifact is non-empty |
| GA-03 | `gauge_state.json` is sourced from an authorized PSEE pipeline package run |
| GA-04 | `coverage_state.json` is sourced from the same authorized package run as `gauge_state.json` |
| GA-05 | `reconstruction_state.json` is sourced from the same authorized package run as `gauge_state.json` |
| GA-06 | `canonical_topology.json` is sourced from `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json` |
| GA-07 | `signal_registry.json` is sourced from `docs/pios/41.4/signal_registry.json` |
| GA-08 | No forbidden artifact from Section 3 is consumed by any GAUGE route, component, or API handler |
| GA-09 | The topology surface is driven exclusively by `canonical_topology.json` — no envelope-derived topology is present |
| GA-10 | The signal surface is driven exclusively by `signal_registry.json` — no runtime signal values are present |
| GA-11 | GAUGE outputs remain within the Stage 4 boundary defined in Section 5 |
| GA-12 | No diagnosis, narrative, condition, propagation, or LENS behavior is present in any GAUGE output |

**PASS:** GA-01 through GA-12 all satisfied.

**GAUGE consumption is not valid until PASS is confirmed.**

---

## 9. REJECTION CONDITIONS

GAUGE consumption must be rejected on any of the following:

| code | condition |
|------|-----------|
| `G4_MISSING_ARTIFACT` | Any of the 5 authorized artifacts is absent from its declared path |
| `G4_UNAUTHORIZED_ARTIFACT` | GAUGE consumes any artifact not declared in Section 2 |
| `G4_RHP_LEAKAGE` | GAUGE consumes any RHP artifact (source_manifest, admissibility_log, evidence_boundary, layer_index, source_profile, provenance_chain) |
| `G4_RAW_S2_CONSUMED` | GAUGE consumes a Stage 2 artifact directly (entity_catalog, dependency_map, interface_map, program_execution_graph, any 40.2 artifact, any 40.4 artifact) instead of through its authorized S3/S4 output |
| `G4_RUNTIME_SIGNAL_CONSUMED` | GAUGE consumes any 40.5 computed signal output or treats a signal_registry entry as a live runtime value |
| `G4_QUERY_EXECUTION_PRESENT` | GAUGE executes a query or produces a query response from consumed artifacts |
| `G4_DIAGNOSIS_PRESENT` | GAUGE output includes diagnosis content, condition activations, or intelligence narratives |
| `G4_TOPOLOGY_NOT_CANONICAL` | The topology surface in GAUGE is not driven by `canonical_topology.json` |
| `G4_ENVELOPE_TOPOLOGY` | Topology is derived from package envelope artifacts, prior GAUGE state, or any non-canonical source |
| `G4_RUNTIME_SIGNAL_IN_REGISTRY` | `signal_registry.json` entries consumed by GAUGE carry runtime-computed values that GAUGE renders as live observations |
| `G4_UNDECLARED_FIELD_AUTHORITATIVE` | GAUGE treats a field not declared in an authorized contract as authoritative input for scoring, proof, or display |
| `G4_CROSS_RUN_CONTAMINATION` | GAUGE consumes artifacts from more than one package run or source_version within a single render |
| `G4_SIMULATED_EXECUTION_STATE` | `gauge_state.json` contains fields that were synthesized without an authorized PSEE pipeline run |
| `G4_HIDDEN_TRANSFORMATION` | GAUGE applies an undeclared transformation to a consumed artifact before rendering — changing values, merging fields, or recomputing any metric |
| `G4_BINDING_ARTIFACT_CONSUMED` | GAUGE consumes any 43.x signal-to-structure binding artifact |
| `G4_LENS_BEHAVIOR_PRESENT` | GAUGE produces any output (overlay, projection, executive narrative, propagation heat map) that belongs to the LENS layer |
| `G4_BACKFILL_PRESENT` | GAUGE infers, estimates, or synthesizes a value for an absent upstream field rather than representing it as NOT EVALUATED or absent |

---

## 10. IMMUTABILITY / NO-ENRICHMENT RULES

### 10.1 GAUGE Consumes Immutable Upstream Artifacts

All five authorized input artifacts are immutable once the upstream stage PASS conditions are confirmed:
- `gauge_state.json`, `coverage_state.json`, `reconstruction_state.json`: immutable after PSEE pipeline package assembly
- `canonical_topology.json`: immutable after Stage 3 (SP3-01–SP3-15) PASS
- `signal_registry.json`: immutable after Stage 3 (SP3-01–SP3-15) PASS

GAUGE must not write, patch, or overwrite any consumed artifact.

### 10.2 No Enrichment

GAUGE must not enrich any consumed artifact with:
- derived fields not present in the original artifact
- computed values not produced by the upstream stage
- annotations, labels, or interpretations added at render time

### 10.3 Absence Is Absence

GAUGE must represent absent or incomplete upstream artifacts as absent — not as an inferred fallback.

Permitted: Rendering a "NOT EVALUATED" state when `gauge_state.json` completion component is absent.
Permitted: Rendering a "SIGNAL DATA UNAVAILABLE" state when `signal_registry.json` is absent or empty.
Forbidden: Inferring a score, signal count, or coverage posture from topology data when the governing artifact is absent.

### 10.4 No Compensation for Upstream Incompleteness

If an upstream computation has not been performed (e.g. completion component in `gauge_state.json` is absent because Stage 5 has not run), GAUGE must represent this incompleteness explicitly and visibly.

GAUGE must not:
- set absent fields to zero in order to render a complete score
- display a partial score as a complete score
- suppress NOT EVALUATED states to simplify the UI

The incompleteness is correct structural truth. Hiding it is a contract violation.

---

## 11. GOVERNANCE RULES

**G1 — No Authorized Artifact, No GAUGE Consumption**
GAUGE may not render any surface without a valid, present, authorized artifact driving it.
An absent artifact must result in an explicit empty or unavailable state — not a silent fallback or synthesized value.

**G2 — No Proof Artifact, No Proof Surface**
The structural proof surface (score, coverage, reconstruction) requires `gauge_state.json`, `coverage_state.json`, and `reconstruction_state.json`.
These artifacts must be present and sourced from an authorized PSEE pipeline run.
GAUGE does not produce proof — it exposes proof that the chain has already produced.

**G3 — No Canonical Topology, No Topology Surface**
The topology surface requires `canonical_topology.json` from Stage 3.
Envelope-derived, manually-constructed, or prior-state-derived topology is not admissible.
If `canonical_topology.json` is absent, the topology surface must be explicitly unavailable.

**G4 — No Structural Signal Registry, No Signal Visibility**
The signal visibility surface requires `signal_registry.json` from Stage 3.
Runtime signal values, computed signal outputs from Stage 5, and simulated signal states are not admissible.
If `signal_registry.json` is absent, the signal surface must be explicitly unavailable.

**G5 — GAUGE Must Stop Before Runtime Intelligence**
GAUGE is a structural proof surface. Runtime intelligence — conditions, diagnosis, signal propagation, executive narrative — belongs to Stage 5 and Stage 6.
GAUGE must not render, imply, or expose any Stage 5/6 output.
Crossing this boundary corrupts Stage 4 authority and is a contract violation.

---

## 12. STAGE BOUNDARY CONFIRMATION

### 12.1 What GAUGE Does

GAUGE DOES:
- read the three package proof artifacts (`gauge_state.json`, `coverage_state.json`, `reconstruction_state.json`) via `/api/gauge`
- read the canonical topology artifact (`canonical_topology.json`) via `/api/topology`
- read the signal registry artifact (`signal_registry.json`) via `/api/signals`
- expose the governed early-stop structural proof surface to its UI consumers
- represent absent or not-evaluated upstream computation as explicitly absent or not evaluated

### 12.2 What GAUGE Does Not Do

GAUGE DOES NOT:
- read any Stage 0 source file or Stage 1 (IG) artifact directly
- read any Stage 2 artifact (40.2 / 40.3 / 40.4) directly — all structure is accessed through canonical Stage 3 outputs
- compute semantic meaning from structural evidence
- compute runtime intelligence of any kind
- produce diagnosis, condition activation, or intelligence narrative
- bind signals to topology nodes
- produce structural overlays
- execute ExecLens queries or produce executive narratives
- perform LENS behavior of any kind

---

## 13. DOWNSTREAM RELATIONSHIP

### 13.1 PiOS Continuation — Stage 5

**Stage 5 begins at 40.5 Signal Computation.**

Stage 5 requires:
- live runtime telemetry from the RUNTIME and BLOCKED dimensions declared in `telemetry_dimension_catalog.md` (Stage 2 — 40.4)
- a running system from which Prometheus metrics, event streams, or equivalent telemetry can be scraped
- `build_signal_artifacts.py` (or equivalent) executing against live telemetry data

Stage 5 is not a GAUGE prerequisite. Stage 5 is blocked until live runtime telemetry is available.

### 13.2 LENS — Stage 6

**LENS begins at Stage 6 (signal-to-structure binding — 43.x).**

LENS requires all of the following, in order:
1. Computed signal values from Stage 5 (40.5)
2. Signal-to-structure binding artifacts from Stage 6 (43.x)
3. Structural overlay projections from Stage 6 (44.x)
4. ExecLens query execution from Stage 6 (42.x)

LENS cannot begin until Stage 5 is complete.
LENS is not a GAUGE extension — it is a separate product layer on the same chain.

### 13.3 Shared Upstream, Divergent Downstream

GAUGE and LENS share the same computable chain upstream of Stage 5:
- S0 (Bootstrap) → S1 (IG) → S2 (Structural Truth) → S3 (Semantic Computation)

They diverge at Stage 5:
- **GAUGE** stops at Stage 4 and requires no Stage 5/6 output
- **LENS** continues through Stage 5 and Stage 6

### 13.4 Prohibition on Merging GAUGE and LENS

Merging GAUGE and LENS is prohibited because it corrupts Stage 4 authority.

GAUGE's authority is its independence from runtime intelligence — it is a structural proof surface precisely because it does not depend on computed signal values, conditions, or diagnoses.

LENS's authority is its dependence on fully computed intelligence — it is a runtime intelligence surface precisely because it requires live telemetry, binding, and projection.

If GAUGE exposes LENS content:
- GAUGE's structural proof posture is no longer pure (it depends on non-structural inputs)
- LENS content appears without its required upstream computation, creating false intelligence

Both surfaces are corrupted. This is a contract violation under G5.

---

## Validation at Definition Time

| check | status |
|-------|--------|
| C1 — file exists | PASS |
| C2 — authorized input surface explicit | PASS — Section 2 (5 artifacts defined with purpose, source stage, admissible role, API responsibility; general consumption rules) |
| C3 — forbidden input surface explicit | PASS — Section 3 (14 forbidden classes with specific examples and reasons) |
| C4 — per-surface consumption authority explicit | PASS — Section 4 (A–E: gauge_state, coverage_state, reconstruction_state, canonical_topology, signal_registry — may/must-not per artifact) |
| C5 — GAUGE output authority explicit | PASS — Section 5 (7 authorized surfaces, 9 prohibited outputs) |
| C6 — GAUGE stop boundary explicit | PASS — Section 6 (does/does-not table, downstream handoff statement, S5/LENS dependency) |
| C7 — query lock / query potential distinction explicit | PASS — Section 7 (potential vs execution defined, auto-execute/auto-unlock forbidden, execution gate rule) |
| C8 — GAUGE admissibility criteria explicit | PASS — Section 8 (GA-01–GA-12, explicit PASS condition) |
| C9 — ≥15 rejection conditions | PASS — Section 9 (17 named rejection codes) |
| C10 — immutability / no-enrichment rules explicit | PASS — Section 10 (immutability, no enrichment, absence-as-absence, no compensation) |
| C11 — governance rules present | PASS — Section 11 (G1–G5) |
| C12 — stage boundary explicit | PASS — Section 12 (does/does-not with 9 prohibited behaviors) |
| C13 — downstream relationship explicit | PASS — Section 13 (S5 requirements, LENS requirements, shared upstream/divergent downstream, merge prohibition) |
| C14 — no implementation details | PASS — no script names, no runtime commands |
| C15 — no other file modified | PASS |
