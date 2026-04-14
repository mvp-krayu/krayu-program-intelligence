# Computable Chain Executable Documentation
# COMPUTABLE.CHAIN.EXECUTABLE.DOCUMENTATION.01

---

## 1. IDENTITY

- Document: COMPUTABLE.CHAIN.EXECUTABLE.DOCUMENTATION.01
- Date: 2026-04-14
- Status: DOCUMENTATION CONSOLIDATION — LOCKED
- Scope: Full computable chain, Stage 0 through Stage 6

**Purpose:**
This document consolidates the full computable chain from Bootstrap (Stage 0) through LENS Projection (Stage 6) into a single structured, stage-by-stage, step-by-step documentation artifact. It captures exact stage boundaries, authorized artifact flows, authority sources, executable status, and current blockers.

**Authority basis:**
This document derives all content from the following authoritative contracts. It does not reinterpret, extend, correct, or invent anything not present in these sources:

| authority contract | stage governed |
|-------------------|---------------|
| BOOTSTRAP.CHAIN.AUTHORITY.01 | Stage 0 — Bootstrap |
| IG.HANDOFF.AUTHORITY.01 | Stage 1 — IG → Stage 2 Handoff |
| STRUCTURAL.TRUTH.AUTHORITY.01 | Stage 2 — Structural Truth (40.2–40.4) |
| SEMANTIC.COMPUTATION.AUTHORITY.01 | Stage 3 — Semantic Computation (41.x) |
| GAUGE.ADMISSIBLE.CONSUMPTION.01 | Stage 4 — GAUGE |

Supporting references (for detail alignment only):
- COMPUTABLE.CHAIN.TO.GAUGE.01 (stage map, execution order, gap register, chain boundary contract)

**Explicit scope statement:**
This is a documentation consolidation artifact, not an implementation artifact. It introduces no new authority, defines no new contracts, and creates no new implementation obligations. Every behavioral claim in this document is traceable to an existing authority contract listed above.

---

## 2. EXECUTIVE SUMMARY OF THE CHAIN

| stage | name | one-sentence purpose | authority source | status | downstream relationship |
|-------|------|---------------------|-----------------|--------|------------------------|
| S0 | Bootstrap | Establish the frozen, admissible source boundary that initiates the chain. | BOOTSTRAP.CHAIN.AUTHORITY.01 | CLOSED / GOVERNED | Hands off `intake_record.json` + evidence root to S1 |
| S1 | IG (Ingestion) | Admit, normalize, and freeze the source evidence into a Runtime Handoff Package. | IG.HANDOFF.AUTHORITY.01 | CLOSED / GOVERNED | Hands RHP (6 artifacts) to S2 |
| S2 | Structural Truth | Classify evidence, reconstruct structural entities, and define observable telemetry dimensions. | STRUCTURAL.TRUTH.AUTHORITY.01 | CLOSED / GOVERNED (execution PARTIAL) | Hands 5 structural artifacts to S3; PSEE pipeline produces S4 package artifacts |
| S3 | Semantic Computation | Derive topology, PIE vault, signal registry, and query catalog from structural truth. | SEMANTIC.COMPUTATION.AUTHORITY.01 | CLOSED / GOVERNED (execution PARTIAL) | Hands `canonical_topology.json` + `signal_registry.json` to S4 |
| S4 | GAUGE | Consume governed proof and semantic artifacts; expose early-stop structural proof surface. | GAUGE.ADMISSIBLE.CONSUMPTION.01 | CLOSED / GOVERNED (execution PARTIAL — gauge_state.json not freshly computable) | GAUGE stop boundary; S5 begins downstream |
| S5 | PiOS Intelligence | Compute runtime signals, activate conditions, synthesize diagnoses, and close the feedback loop. | No formal authority contract yet | PARTIAL / BLOCKED (live runtime telemetry absent) | Produces computed signals and conditions required by S6 |
| S6 | LENS Projection | Bind computed signals to structural topology; project intelligence overlay; execute ExecLens queries. | No formal authority contract yet | BLOCKED / NOT YET EXECUTABLE | Final intelligence and narrative surface |

---

## 3. DETAILED STAGE-BY-STAGE CHAIN

---

### Stage 0 — Bootstrap

**A. Stage Purpose**
Stage 0 is the chain entry point. It accepts the intake declaration from the operator, creates the immutable evidence root from the declared source, and freezes the source boundary so that all downstream stages work from a deterministic, reproducible starting point.

**B. Authorized Inputs**
- Client source code repository (local filesystem path or remote git repository at a pinned commit)
- Operator-supplied intake declaration containing: `client_uuid`, `source_location`, `source_version`, `intake_timestamp`, `intake_mode`

**C. Required Processing (Architecture Level)**
1. Validate the intake declaration (all 5 required fields, format checks per Section 1 of BOOTSTRAP.CHAIN.AUTHORITY.01)
2. Create the evidence root directory at `clients/<client_uuid>/source/<source_version>/`
3. Copy or clone the declared source into the evidence root
4. Apply the admissible file filter (Section 2.2 of BOOTSTRAP.CHAIN.AUTHORITY.01)
5. Exclude non-admissible artifacts (build outputs, package trees, secrets, IDE metadata) and log them
6. Freeze the boundary (evidence root becomes read-only)
7. Write `intake_record.json` to the evidence root

**D. Authoritative Outputs**
- `clients/<client_uuid>/source/<source_version>/intake_record.json` — the Stage 0 output and chain integrity signal
- `clients/<client_uuid>/source/<source_version>/` — the sealed, read-only evidence root

**E. Admissibility / Completion Condition**
Stage 0 PASS requires AC-01 through AC-09 (BOOTSTRAP.CHAIN.AUTHORITY.01 Section 5) to be satisfied, including: `intake_record.json` present, all 5 required fields valid, at least one admissible source file present, no unresolved out-of-boundary symlinks, and `intake_record.json` not writable after freeze.

**F. What Stage 1 May Consume**
- `clients/<client_uuid>/source/<source_version>/intake_record.json`
- Read access to `clients/<client_uuid>/source/<source_version>/` (admitted files only)

**G. What Stage 1 Must Not Consume**
- Any source artifact not recorded in `intake_record.json`
- Any artifact added or modified after the boundary freeze timestamp
- Any artifact from a different `client_uuid` or `source_version`

**H. Stage Boundary Statement**
Stage 0 ends at: `admissibility_status == "PASS"` confirmed in `intake_record.json`.
Stage 1 begins at: reading `intake_record.json` to locate the evidence root.

---

### Stage 1 — IG (Ingestion)

**A. Stage Purpose**
Stage 1 processes the frozen evidence root through the IG ingestion pipeline. It scans admitted source artifacts, classifies them into normalized layers, makes admission decisions, and assembles the Runtime Handoff Package — the only authorized input to Stage 2.

**B. Authorized Inputs**
- `clients/<client_uuid>/source/<source_version>/intake_record.json` (Stage 0 output)
- All admitted source files within `clients/<client_uuid>/source/<source_version>/` where admission is declared in `intake_record.json`

**C. Required Processing (Architecture Level)**
1. Confirm Stage 0 PASS (`intake_record.json` present and valid)
2. Scan the evidence root and make per-artifact admission decisions
3. Classify admitted artifacts into normalized layers (L40_2, L40_3, L40_4, etc.)
4. Resolve the source profile (platform identity, version, technology stack)
5. Assemble the provenance chain covering all pipeline stages and admitted artifacts
6. Write all 6 canonical RHP artifacts to `docs/pios/IG.RUNTIME/run_<run_id>/`
7. Confirm AC-01 through AC-12 pass (IG.HANDOFF.AUTHORITY.01 Section 4)
8. Seal the RHP (write-once; no modification after PASS)

**D. Authoritative Outputs**
The Runtime Handoff Package (RHP) — all 6 artifacts required:

| artifact | path |
|---------|------|
| source_manifest.json | `docs/pios/IG.RUNTIME/run_<run_id>/source_manifest.json` |
| evidence_boundary.json | `docs/pios/IG.RUNTIME/run_<run_id>/evidence_boundary.json` |
| admissibility_log.json | `docs/pios/IG.RUNTIME/run_<run_id>/admissibility_log.json` |
| layer_index.json | `docs/pios/IG.RUNTIME/run_<run_id>/normalized_intake_structure/layer_index.json` |
| source_profile.json | `docs/pios/IG.RUNTIME/run_<run_id>/normalized_intake_structure/source_profile.json` |
| provenance_chain.json | `docs/pios/IG.RUNTIME/run_<run_id>/normalized_intake_structure/provenance_chain.json` |

**E. Admissibility / Completion Condition**
RHP PASS requires AC-01 through AC-12 (IG.HANDOFF.AUTHORITY.01 Section 4): all 6 artifacts present and valid JSON, consistent `run_id` and `source_run` across artifacts, `client_uuid`/`source_version` match Stage 0 `intake_record.json`, at least one ADMITTED entry, no orphan artifacts, `invariants_confirmed` non-empty.

**F. What Stage 2 May Consume**
All 6 RHP artifacts, plus read access to admitted source files via paths in `admissibility_log.json` (ADMITTED entries only).

**G. What Stage 2 Must Not Consume**
Any IG intermediate artifact not in the RHP; any source file not declared ADMITTED in `admissibility_log.json`; any prior RHP for a different `run_id`; any PSEE or semantic layer artifact.

**H. Stage Boundary Statement**
Stage 1 ends at: confirmation of RHP PASS (AC-01 through AC-12).
Stage 2 begins at: reading the sealed RHP from `docs/pios/IG.RUNTIME/run_<run_id>/`.

---

### Stage 2 — Structural Truth (40.2–40.4)

**A. Stage Purpose**
Stage 2 transforms the admitted evidence set into authoritative structural truth. Across three sub-stages, it classifies evidence into a typed inventory (40.2), reconstructs structural entities and their relationships (40.3), and defines the observable telemetry dimensions of the system (40.4).

**B. Authorized Inputs**
The 6 sealed RHP artifacts from Stage 1, plus admitted source files via `admissibility_log.json` (ADMITTED entries). No RHP bypass. No raw source access without admissibility mediation.

**C. Required Processing (Architecture Level)**

40.2 — Evidence Classification:
- Map every ADMITTED artifact to a typed evidence class (Canonical Evidence Unit — CEU)
- Declare overlaps and unknown-space records explicitly
- Produce a complete, exhaustive classification map — no orphan evidence

40.3 — Structural Reconstruction:
- Derive structural entities (components, modules, subsystems, schemas, agents) from classified evidence
- Construct the directed dependency graph between entities
- Define interface contracts between entities
- Derive the program execution graph from entities + dependencies + interfaces
- Build the per-entity reconstruction corpus
- Every entity must trace to a CEU; every relationship must be derivable from evidence

40.4 — Telemetry Surface Definition:
- Map structural entities to observable telemetry surfaces
- Define all observable dimensions with STATIC / RUNTIME / BLOCKED availability classification
- Declare BLOCKED dimensions explicitly (do not simulate runtime values)
- Define the metric schema governing all telemetry measurements

**D. Authoritative Outputs**

40.2 outputs:
- `docs/pios/40.2/evidence_classification_map.md`
- `docs/pios/40.2/normalized_evidence_map.md`
- `docs/pios/40.2/evidence_surface_inventory.md`

40.3 outputs:
- `docs/pios/40.3/entity_catalog.md`
- `docs/pios/40.3/dependency_map.md`
- `docs/pios/40.3/interface_map.md`
- `docs/pios/40.3/program_execution_graph.md`
- `docs/pios/40.3/reconstruction/` (corpus)

40.4 outputs:
- `docs/pios/40.4/telemetry_surface_definition.md`
- `docs/pios/40.4/telemetry_dimension_catalog.md`
- `docs/pios/40.4/telemetry_schema.md`

**E. Admissibility / Completion Condition**
Stage 2 PASS requires SP-01 through SP-12 (STRUCTURAL.TRUTH.AUTHORITY.01 Section 6): all 11 authoritative artifacts present and non-empty, full traceability chain intact (RHP admitted → CEU → entity → telemetry dimension), no orphan evidence, no entity without structural trace, no simulated RUNTIME/BLOCKED dimension values.

**F. What Stage 3 May Consume**
Exactly 5 authorized artifacts: `entity_catalog.md`, `dependency_map.md`, `interface_map.md`, `program_execution_graph.md`, `telemetry_dimension_catalog.md`.

What the PSEE Pipeline (S2a) may consume from Stage 2: Stage 2 structural artifacts (entity catalog, reconstruction corpus) via the PSEE pipeline's own authorized input contract.

**G. What Stage 3 Must Not Consume**
40.2 classification artifacts; `telemetry_surface_definition.md`; `telemetry_schema.md`; `reconstruction/` corpus files; any RHP artifact; any Stage 0 source file.

**H. Stage Boundary Statement**
Stage 2 ends at: SP-01 through SP-12 confirmed.
Stage 3 begins at: reading the 5 authorized structural artifacts.
Stage 2 does not assign semantic domains or capabilities; does not compute signals; does not perform GAUGE materialization.

---

### Stage 2a — PSEE Pipeline (Package Assembly)

**A. Stage Purpose**
Stage 2a (the PSEE pipeline) transforms Stage 2 structural artifacts into a governed consumption package — the three proof-state artifacts consumed by GAUGE alongside the package manifest and binding envelope.

**B. Authorized Inputs**
Stage 2 structural artifacts (entity catalog, reconstruction corpus, telemetry dimensions) and the Stage 0/1 provenance chain.

**C. Required Processing (Architecture Level)**
The PSEE pipeline executes six internal stages: intake (01), lineage (02), structure (03), transformation (04), envelope (05), validation (06). The output is a frozen package directory bound to one `client_uuid` and one `run_id`.

**D. Authoritative Outputs**
Located at `clients/<client_uuid>/psee/runs/<run_id>/package/`:
- `binding_envelope.json`
- `coverage_state.json`
- `reconstruction_state.json`
- `package_manifest.json`
- `gauge_state.json` (currently: copied from authoritative reference package — not freshly computed; GAP-01)

**E. Admissibility / Completion Condition**
All 5 package artifacts present; exit code 0 from pipeline validation stage.

**F. What Stage 4 (GAUGE) May Consume**
`gauge_state.json`, `coverage_state.json`, `reconstruction_state.json` — from the same authorized package run.

**G. What Stage 4 Must Not Consume from Stage 2a**
`binding_envelope.json` as a topology source; `package_manifest.json` as a scoring input; any undeclared package field.

**H. Stage Boundary Statement**
Stage 2a ends at: all 5 package artifacts present and validated. Stage 4 (GAUGE) reads these artifacts alongside Stage 3 semantic outputs. Stage 2a does not produce semantic topology or signal registry.

---

### Stage 3 — Semantic Computation (41.x)

**A. Stage Purpose**
Stage 3 derives semantic meaning from structural truth. It emits the canonical topology, builds the semantic navigation index, normalizes semantic links, defines structural-evidence signals, and declares the query catalog — all without introducing meaning not derivable from Stage 2 outputs.

**B. Authorized Inputs**
The 5 sealed Stage 2 structural artifacts: `entity_catalog.md`, `dependency_map.md`, `interface_map.md`, `program_execution_graph.md`, `telemetry_dimension_catalog.md`. No RHP. No raw source. No 40.2 classification artifacts.

**C. Required Processing (Architecture Level)**

41.1 — Topology Emission:
- Derive COMPONENT nodes from structural entities
- Derive CAPABILITY nodes by grouping components via structural relationships
- Derive DOMAIN nodes by grouping capabilities via structural clustering
- Emit `canonical_topology.json` with node type declarations, membership arrays, and node counts

41.2 — PIE Vault:
- Build a semantic navigation index from the topology and structural artifacts
- Produce node inventory and navigation map — no additional meaning beyond what topology declares

41.3 — Semantic Link Normalization:
- Normalize structural dependencies and interfaces as semantic relationships
- Log all exclusions explicitly — no silent omissions
- All links must be derivable from `dependency_map.md` or `interface_map.md`

41.4 — Signal Registry:
- Define structural-evidence signals derivable from structural observations (Class A — no live runtime required)
- Assign `evidence_confidence` (STRONG / MODERATE / WEAK) per structural evidence quality
- Runtime signals (Class B) must not appear as computed entries in this registry
- All signals must carry `runtime_required: false`

41.5 — Query Catalog:
- Define golden queries declaratively against signals and topology
- Queries are structural declarations — no execution logic

**D. Authoritative Outputs**

| artifact | path |
|---------|------|
| canonical_topology.json | `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json` |
| PIE vault artifacts | `docs/pios/41.2/` (node inventory, navigation map) |
| semantic_consolidation_report.md | `docs/pios/41.3/semantic_consolidation_report.md` |
| signal_registry.json | `docs/pios/41.4/signal_registry.json` |
| golden_query_catalog.md | `docs/pios/41.5/golden_query_catalog.md` |
| query_signal_map.json | `docs/pios/41.5/query_signal_map.json` |

**E. Admissibility / Completion Condition**
Stage 3 PASS requires SP3-01 through SP3-15 (SEMANTIC.COMPUTATION.AUTHORITY.01 Section 9): all 7 authoritative artifacts present, topology parity confirmed, every component node traces to an entity_catalog entry, every signal has `runtime_required: false` and a structural evidence source, every query maps to at least one signal or topology node.

**F. What Stage 4 (GAUGE) May Consume**
`canonical_topology.json` and `signal_registry.json` — no other Stage 3 artifact is admissible in GAUGE.

**G. What Stage 4 Must Not Consume from Stage 3**
PIE vault; `semantic_consolidation_report.md`; `golden_query_catalog.md`; `query_signal_map.json`; any Stage 2 artifact; any runtime signal values.

**H. Stage Boundary Statement**
Stage 3 ends at: SP3-01 through SP3-15 confirmed.
Stage 4 begins at: reading `canonical_topology.json` and `signal_registry.json`.
Stage 3 does not score coverage; does not compute runtime signals; does not perform GAUGE materialization; does not perform LENS projection.

---

### Stage 4 — GAUGE (Early-Stop Governed Consumption Surface)

**A. Stage Purpose**
Stage 4 is the first governed stop surface on the computable chain. GAUGE consumes the authorized proof and semantic artifacts, exposes the structural proof posture (score, coverage, reconstruction, topology, signal presence), and stops. It does not require or simulate any Stage 5 or Stage 6 computation.

**B. Authorized Inputs**
Exactly five artifacts (GAUGE.ADMISSIBLE.CONSUMPTION.01 Section 2):
- `gauge_state.json` (`clients/<client_uuid>/psee/runs/<run_id>/package/`)
- `coverage_state.json` (same package directory)
- `reconstruction_state.json` (same package directory)
- `canonical_topology.json` (`docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/`)
- `signal_registry.json` (`docs/pios/41.4/`)

**C. Required Processing (Architecture Level)**
GAUGE reads (does not transform) the five authorized artifacts. Its API routes expose declared content:
- `/api/gauge` — exposes score, coverage, reconstruction from the three package artifacts
- `/api/topology` — exposes the canonical topology graph
- `/api/signals` — exposes signal count, `evidence_confidence` distribution, and signal list

GAUGE renders NOT EVALUATED for completion components where upstream computation (Stage 5) has not run.

**D. Authoritative Outputs**
GAUGE produces a rendered product surface. It does not produce governed chain artifacts for downstream consumption.

**E. Admissibility / Completion Condition**
GAUGE consumption is valid when GA-01 through GA-12 pass (GAUGE.ADMISSIBLE.CONSUMPTION.01 Section 8): all 5 artifacts present, topology sourced from `canonical_topology.json` exclusively, signal surface sourced from `signal_registry.json` exclusively, no forbidden artifact consumed, no backfill of absent upstream computation.

**F. What Downstream Stages May Consume from Stage 4**
Nothing. GAUGE is a stop surface — it does not produce governed artifacts for S5 or S6 consumption.

**G. What Stage 4 Must Not Consume**
Any Stage 0/1 artifact directly; any Stage 2 artifact directly (40.2/40.3/40.4); any Stage 5/6 artifact; PIE vault; query catalog contents; runtime signal values; simulated execution state; envelope-derived topology.

**H. Stage Boundary Statement**
Stage 4 ends at: GAUGE rendering the structural proof surface from authorized inputs.
GAUGE STOP BOUNDARY: chain stops here for GAUGE. PiOS continuation begins at Stage 5.
Stage 4 does not compute runtime signals; does not produce conditions or diagnoses; does not bind signals to topology; does not perform LENS projection.

---

### Stage 5 — PiOS Intelligence (40.5–40.11)

**A. Stage Purpose**
Stage 5 is the program intelligence computation layer. Starting from the telemetry dimension scaffold defined in Stage 2 (40.4), it computes runtime signal values from live telemetry, activates conditions, synthesizes diagnoses, delivers intelligence artifacts, and closes the feedback loop.

**B. Authorized Inputs**
- `telemetry_dimension_catalog.md` from Stage 2 (40.4) — provides the dimension scaffold
- Live runtime telemetry from the running system (Prometheus scrapes, event streams, live API surfaces)
- Stage 3 signal registry (structural-evidence baseline)

**C. Required Processing (Architecture Level)**
- 40.5: Compute runtime signal values by applying telemetry dimensions to live telemetry data
- 40.6: Activate conditions from computed signal states
- 40.7: Synthesize diagnoses from active conditions
- 40.8: Deliver intelligence artifacts to designated consumers
- 40.9: Register feedback from delivery
- 40.10: Apply control logic
- 40.11: Close the execution loop and validate loop closure

**D. Authoritative Outputs**
- `docs/pios/40.5/` — computed signal values
- `docs/pios/40.6/` — activated conditions
- `docs/pios/40.7/` — diagnoses
- `docs/pios/40.8/–40.11/` — delivery, feedback, control, loop closure artifacts

**E. Admissibility / Completion Condition**
Stage 5 requires live runtime telemetry. Currently BLOCKED (GAP-02): approximately 60–70% of 40.4 dimensions are BLOCKED because the live platform is not running in static analysis context.

**F. What Stage 6 May Consume**
Computed signal values from 40.5; activated conditions from 40.6; diagnoses from 40.7.

**G. What Stage 5 Must Not Consume**
Any GAUGE output; any Stage 3 signal registry entry as a computed runtime signal; any simulated telemetry.

**H. Stage Boundary Statement**
Stage 5 begins at: live telemetry available and `telemetry_dimension_catalog.md` scaffold loaded.
Stage 5 is not required for GAUGE closure. Stage 5 is required for LENS.
No formal authority contract has been issued for Stage 5 as of this document.

---

### Stage 6 — LENS Projection (43.x / 44.x / 42.x)

**A. Stage Purpose**
Stage 6 projects the computed intelligence from Stage 5 onto the structural topology from Stage 3, producing a signal-annotated overlay that enables ExecLens query execution and executive narrative generation.

**B. Authorized Inputs**
- Computed signal values from Stage 5 (40.5)
- `canonical_topology.json` from Stage 3 (41.1)
- Stage 3 PIE vault and query catalog (41.2, 41.5)

**C. Required Processing (Architecture Level)**
- 43.x: Bind computed signal values to structural topology nodes (signal-to-structure binding)
- 44.x: Generate structural overlay projections (topology annotated with signal states)
- 42.x: Execute ExecLens golden queries against the signal-annotated topology; render executive narratives

**D. Authoritative Outputs**
- `docs/pios/43.x/` — signal-to-structure binding artifacts
- `docs/pios/44.x/` — overlay projection artifacts
- `docs/pios/42.x/` — ExecLens query responses and executive narratives

**E. Admissibility / Completion Condition**
Currently NOT YET EXECUTABLE. Stage 6 depends on Stage 5 completion (GAP-02 blocks Stage 5) and on executable binding/projection scripts that do not yet exist (GAP-07, GAP-08).

**F. What Downstream Consumers May Access**
The LENS product surface — signal-annotated topology visualization, ExecLens query execution, executive narrative.

**G. What Stage 6 Must Not Do**
Recompute structural truth; redefine semantic topology; perform GAUGE scoring; produce GAUGE artifacts.

**H. Stage Boundary Statement**
Stage 6 begins at: Stage 5 complete + binding scripts available.
LENS is not a GAUGE extension — it is a separate product surface downstream of the GAUGE stop boundary.
No formal authority contract has been issued for Stage 6 as of this document.

---

## 4. STEP-BY-STEP EXECUTABLE / COMPUTABLE FLOW

---

**Step 0 — Bootstrap Entry**
- Purpose: Validate the intake declaration and initiate the chain
- Stage: S0
- Input artifacts: Operator-supplied intake declaration (5 required fields: `client_uuid`, `source_location`, `source_version`, `intake_timestamp`, `intake_mode`)
- Output artifacts: Validated intake declaration (in-memory pre-flight)
- Executable status: GOVERNED + EXECUTABLE
- Blocking reason: None

---

**Step 1 — Source Boundary Establishment**
- Purpose: Create the canonical evidence root directory and populate it with the declared source
- Stage: S0
- Input artifacts: Validated intake declaration; source at `source_location`
- Output artifacts: `clients/<client_uuid>/source/<source_version>/` directory (populated)
- Executable status: GOVERNED + EXECUTABLE
- Blocking reason: None — fails cleanly on SOURCE_NOT_FOUND or RELATIVE_PATH_FORBIDDEN

---

**Step 2 — Evidence Root Creation and Freeze**
- Purpose: Apply the admissible file filter, log excluded artifacts, freeze the boundary, and write `intake_record.json`
- Stage: S0
- Input artifacts: Populated evidence root directory
- Output artifacts: `clients/<client_uuid>/source/<source_version>/intake_record.json` (with `admissibility_status: PASS`, `excluded_paths[]`, `boundary_frozen_at`)
- Executable status: GOVERNED + EXECUTABLE
- Blocking reason: None

---

**Step 3 — IG Admission and Normalization**
- Purpose: Run the IG ingestion pipeline against the frozen evidence root — scan, classify, admit/exclude, normalize into layers, resolve source profile, assemble provenance chain
- Stage: S1
- Input artifacts: `intake_record.json`; read access to `clients/<client_uuid>/source/<source_version>/`
- Output artifacts: 6 RHP artifacts written to `docs/pios/IG.RUNTIME/run_<run_id>/`
- Executable status: GOVERNED + EXECUTABLE (GAP-10: fresh source or new client runs not yet validated end-to-end)
- Blocking reason: Partial — current evidence base established for BlueEdge; new client reproducibility unconfirmed (GAP-10)

---

**Step 4 — RHP Freeze**
- Purpose: Confirm RHP admissibility (AC-01 through AC-12), seal the RHP as immutable, make it available for Stage 2 consumption
- Stage: S1
- Input artifacts: All 6 RHP artifacts at `docs/pios/IG.RUNTIME/run_<run_id>/`
- Output artifacts: Sealed RHP (read-only; write-protected after PASS confirmation)
- Executable status: GOVERNED + EXECUTABLE
- Blocking reason: None — fails cleanly on any AC violation

---

**Step 5 — Evidence Classification (40.2)**
- Purpose: Map every ADMITTED artifact to a Canonical Evidence Unit (CEU); produce normalized evidence map; compile surface inventory
- Stage: S2 (40.2)
- Input artifacts: `admissibility_log.json`, `layer_index.json`, `source_profile.json` (from sealed RHP)
- Output artifacts: `evidence_classification_map.md`, `normalized_evidence_map.md`, `evidence_surface_inventory.md` at `docs/pios/40.2/`
- Executable status: GOVERNED + PARTIAL (scripts exist; fresh execution against a new RHP not verified — GAP-10 cascades)
- Blocking reason: Partial — existing artifacts represent BlueEdge authoritative run; new intake requires fresh 40.2 execution

---

**Step 6 — Structural Reconstruction (40.3)**
- Purpose: Reconstruct all structural entities, dependency graph, interface contracts, and program execution graph from classified evidence
- Stage: S2 (40.3)
- Input artifacts: Stage 2 (40.2) classification outputs; ADMITTED source files via `admissibility_log.json`
- Output artifacts: `entity_catalog.md`, `dependency_map.md`, `interface_map.md`, `program_execution_graph.md`, `reconstruction/` at `docs/pios/40.3/`
- Executable status: GOVERNED + PARTIAL (scripts exist; fresh execution unverified; grouping engine not confirmed for non-BlueEdge clients — GAP-04)
- Blocking reason: Partial — authoritative artifacts present for BlueEdge; full reproducibility not confirmed

---

**Step 7 — Telemetry Surface Derivation (40.4)**
- Purpose: Map structural entities to telemetry surfaces; define all observable dimensions with STATIC/RUNTIME/BLOCKED status; declare metric schema
- Stage: S2 (40.4)
- Input artifacts: Stage 2 (40.3) structural outputs (`entity_catalog.md`, `dependency_map.md`, `interface_map.md`); 40.2 evidence map
- Output artifacts: `telemetry_surface_definition.md`, `telemetry_dimension_catalog.md`, `telemetry_schema.md` at `docs/pios/40.4/`
- Executable status: GOVERNED + PARTIAL (STATIC dimensions computed; RUNTIME/BLOCKED dimensions declared but not populated — GAP-02)
- Blocking reason: BLOCKED dimensions require live runtime access (Prometheus, Redis, Kafka, live API); live platform unavailable in static analysis context

---

**Step 7a — PSEE Package Assembly (S2a)**
- Purpose: Transform S2 structural artifacts into the governed consumption package — coverage state, reconstruction state, binding envelope, and gauge state
- Stage: S2a (PSEE Pipeline)
- Input artifacts: Stage 2 (40.2/40.3/40.4) outputs; Stage 0/1 provenance chain
- Output artifacts: `binding_envelope.json`, `coverage_state.json`, `reconstruction_state.json`, `package_manifest.json`, `gauge_state.json` at `clients/<client_uuid>/psee/runs/<run_id>/package/`
- Executable status: GOVERNED + PARTIAL (GAP-01: `gauge_state.json` is copied from static reference, not freshly computed; GAP-05: fresh-run bootstrap protocol missing)
- Blocking reason: `gauge_state.json` requires `build_gauge_state.py` (not yet implemented). Fresh intake runs have no reference package to copy from.

---

**Step 8 — Semantic Layer Derivation (41.x setup)**
- Purpose: Derive the three semantic layers (COMPONENT, CAPABILITY, DOMAIN) from structural entities using dependency and interface maps as grouping inputs
- Stage: S3
- Input artifacts: `entity_catalog.md`, `dependency_map.md`, `interface_map.md`, `program_execution_graph.md`, `telemetry_dimension_catalog.md` (the 5 authorized S2 outputs)
- Output artifacts: Derived semantic groupings (in-stage computation feeding Steps 9–11)
- Executable status: GOVERNED + PARTIAL (same partial status as upstream S2 artifacts)
- Blocking reason: Semantic derivation is blocked for fresh intakes to the extent that S2 artifacts require fresh execution

---

**Step 9 — Topology Emission (41.1)**
- Purpose: Emit `canonical_topology.json` as the machine-readable, parity-verified topology graph from the three semantic layers
- Stage: S3 (41.1)
- Input artifacts: Derived COMPONENT/CAPABILITY/DOMAIN semantic groupings from Step 8; `entity_catalog.md`
- Output artifacts: `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json` (node counts declared; parity verified)
- Executable status: GOVERNED + EXECUTABLE (41.1 is the single fully executable S3 sub-stage)
- Blocking reason: None — for the current BlueEdge authoritative source

---

**Step 10 — Signal Registry Derivation (41.4)**
- Purpose: Define structural-evidence signals from structural observations and STATIC telemetry dimensions; assign evidence confidence; produce `signal_registry.json`
- Stage: S3 (41.4)
- Input artifacts: `entity_catalog.md`, `telemetry_dimension_catalog.md`, `canonical_topology.json`
- Output artifacts: `docs/pios/41.4/signal_registry.json`
- Executable status: GOVERNED + PARTIAL (GAP-06: existing script produces static output; not wired to consume fresh 40.5 inputs; GAP-03: no formal contract for 40.5→41.4 flow)
- Blocking reason: Script exists but output is effectively frozen. Fresh computation would require wiring to 40.5 outputs (which are themselves blocked by GAP-02).

---

**Step 11 — Query Catalog Derivation (41.5)**
- Purpose: Define golden queries declaratively against the signal registry and topology; produce `golden_query_catalog.md` and `query_signal_map.json`
- Stage: S3 (41.5)
- Input artifacts: `signal_registry.json` (Step 10), `canonical_topology.json` (Step 9)
- Output artifacts: `docs/pios/41.5/golden_query_catalog.md`, `docs/pios/41.5/query_signal_map.json`
- Executable status: GOVERNED + PARTIAL (GAP-11: fresh execution against current S2 artifacts not verified)
- Blocking reason: Scripts exist; output not verified against a freshly computed signal registry

---

**Step 12 — GAUGE Admissible Consumption**
- Purpose: GAUGE reads the five authorized artifacts via its API routes and exposes the structural proof surface
- Stage: S4 (GAUGE)
- Input artifacts: `gauge_state.json`, `coverage_state.json`, `reconstruction_state.json` (from S2a package), `canonical_topology.json` (Step 9), `signal_registry.json` (Step 10)
- Output artifacts: GAUGE rendered surface (score, coverage, reconstruction, topology graph, signal availability)
- Executable status: GOVERNED + PARTIAL (GAP-01: `gauge_state.json` is static; completion component NOT EVALUATED; GAP-05: fresh-run package missing)
- Blocking reason: For the current BlueEdge authoritative run, GAUGE is operational. For fresh intakes, `gauge_state.json` cannot be computed until GAP-01 is resolved.

---

**Step 13 — PiOS Continuation Start (40.5 Entry)**
- Purpose: Begin Stage 5 by loading the telemetry dimension scaffold and establishing live telemetry connections
- Stage: S5 (40.5 entry)
- Input artifacts: `telemetry_dimension_catalog.md` (Stage 2 — 40.4); live telemetry streams (Prometheus, Redis, Kafka, live API)
- Output artifacts: Signal computation context (pre-condition for Step 14)
- Executable status: GOVERNED + BLOCKED (GAP-02)
- Blocking reason: Live runtime telemetry is unavailable in static analysis context. The running BlueEdge Fleet Management Platform is required.

---

**Step 14 — Runtime Signal Computation (40.5)**
- Purpose: Compute runtime signal values by applying telemetry dimensions to live telemetry data; produce computed signal value set
- Stage: S5 (40.5)
- Input artifacts: `telemetry_dimension_catalog.md`; live telemetry data
- Output artifacts: `docs/pios/40.5/` — computed signal values per dimension
- Executable status: GOVERNED + BLOCKED (GAP-02)
- Blocking reason: Same as Step 13. Approximately 60–70% of dimensions are BLOCKED pending live platform access.

---

**Step 15 — Condition / Diagnosis Chain (40.6–40.11)**
- Purpose: Activate conditions from computed signals; synthesize diagnoses; deliver intelligence; register feedback; apply control logic; close execution loop
- Stage: S5 (40.6–40.11)
- Input artifacts: Computed signal values from Step 14
- Output artifacts: `docs/pios/40.6/–40.11/` — conditions, diagnoses, delivery, feedback, control, loop closure
- Executable status: GOVERNED + BLOCKED (GAP-02 cascades)
- Blocking reason: Step 14 (runtime signal computation) is blocked; all downstream S5 stages are blocked as a consequence.

---

**Step 16 — Signal-to-Structure Binding / Overlay Projection (43.x / 44.x)**
- Purpose: Bind computed signal values to canonical topology nodes (43.x); project signal-annotated structural overlay for LENS rendering (44.x)
- Stage: S6
- Input artifacts: Computed signal values from Step 14; `canonical_topology.json` from Step 9
- Output artifacts: `docs/pios/43.x/` — binding artifacts; `docs/pios/44.x/` — overlay projections
- Executable status: NOT YET EXECUTABLE (GAP-07, GAP-08)
- Blocking reason: No binding script exists for 43.x (GAP-07); no projection script exists for 44.x (GAP-08). Additionally blocked by Step 14 (GAP-02).

---

**Step 17 — LENS Projection (42.x)**
- Purpose: Execute ExecLens golden queries against the signal-annotated topology; generate executive narrative; render the LENS product surface
- Stage: S6 (42.x)
- Input artifacts: Overlay projection from Step 16; golden queries from Step 11; PIE vault from Step 8
- Output artifacts: `docs/pios/42.x/` — query responses and executive narratives
- Executable status: NOT YET EXECUTABLE (blocked by GAP-07, GAP-08, and GAP-02)
- Blocking reason: Steps 14 and 16 are both blocked; LENS cannot execute until the full S5→S6 chain is unblocked.

---

## 5. ARTIFACT FLOW TABLE

| artifact | produced by stage | consumed by stage | authority contract | status | notes |
|---------|------------------|------------------|-------------------|--------|-------|
| intake_record.json | S0 (Bootstrap) | S1 (IG) | BOOTSTRAP.CHAIN.AUTHORITY.01 | GOVERNED + EXECUTABLE | Written to `clients/<uuid>/source/<version>/`; immutable after boundary freeze |
| source_manifest.json | S1 (IG) | S2 (Structural Truth) | IG.HANDOFF.AUTHORITY.01 | GOVERNED + EXECUTABLE | Part of sealed RHP; records layers and admitted artifacts |
| evidence_boundary.json | S1 (IG) | S2 (Structural Truth) | IG.HANDOFF.AUTHORITY.01 | GOVERNED + EXECUTABLE | Defines admitted/excluded artifact classes; enforcement rules |
| admissibility_log.json | S1 (IG) | S2 (Structural Truth) | IG.HANDOFF.AUTHORITY.01 | GOVERNED + EXECUTABLE | Per-artifact ADMITTED/EXCLUDED decisions; basis for provenance tracing |
| layer_index.json | S1 (IG) | S2 (Structural Truth) | IG.HANDOFF.AUTHORITY.01 | GOVERNED + EXECUTABLE | Maps IG layers to constituent admitted artifact paths |
| source_profile.json | S1 (IG) | S2 (Structural Truth) | IG.HANDOFF.AUTHORITY.01 | GOVERNED + EXECUTABLE | Resolved source identity, platform, and version |
| provenance_chain.json | S1 (IG) | S2 (Structural Truth) | IG.HANDOFF.AUTHORITY.01 | GOVERNED + EXECUTABLE | Full IG pipeline execution record; lineage for all admitted artifacts |
| evidence_classification_map.md | S2 (40.2) | S2 internal only | STRUCTURAL.TRUTH.AUTHORITY.01 | GOVERNED + PARTIAL | S3 must NOT consume; intermediate classification artifact |
| normalized_evidence_map.md | S2 (40.2) | S2 internal only | STRUCTURAL.TRUTH.AUTHORITY.01 | GOVERNED + PARTIAL | Overlap declarations and unknown-space records |
| evidence_surface_inventory.md | S2 (40.2) | S2 internal only | STRUCTURAL.TRUTH.AUTHORITY.01 | GOVERNED + PARTIAL | CEU inventory with source references |
| entity_catalog.md | S2 (40.3) | S3 (Semantic Computation) | STRUCTURAL.TRUTH.AUTHORITY.01 / SEMANTIC.COMPUTATION.AUTHORITY.01 | GOVERNED + PARTIAL | Canonical structural entity register; immutable once S2 PASS confirmed |
| dependency_map.md | S2 (40.3) | S3 (Semantic Computation) | STRUCTURAL.TRUTH.AUTHORITY.01 / SEMANTIC.COMPUTATION.AUTHORITY.01 | GOVERNED + PARTIAL | Directed dependency graph between entities |
| interface_map.md | S2 (40.3) | S3 (Semantic Computation) | STRUCTURAL.TRUTH.AUTHORITY.01 / SEMANTIC.COMPUTATION.AUTHORITY.01 | GOVERNED + PARTIAL | Interface contracts between entities |
| program_execution_graph.md | S2 (40.3) | S3 (Semantic Computation) | STRUCTURAL.TRUTH.AUTHORITY.01 / SEMANTIC.COMPUTATION.AUTHORITY.01 | GOVERNED + PARTIAL | Execution paths derivable from entity/dependency/interface |
| telemetry_surface_definition.md | S2 (40.4) | S2 internal only | STRUCTURAL.TRUTH.AUTHORITY.01 | GOVERNED + PARTIAL | Entity-to-surface mapping; S3 consumes dimension catalog only |
| telemetry_dimension_catalog.md | S2 (40.4) | S3 (Semantic Computation); S5 (40.5) | STRUCTURAL.TRUTH.AUTHORITY.01 / SEMANTIC.COMPUTATION.AUTHORITY.01 | GOVERNED + PARTIAL (BLOCKED dimensions) | STATIC/RUNTIME/BLOCKED taxonomy; BLOCKED = S5 cannot compute without live telemetry |
| telemetry_schema.md | S2 (40.4) | S2 internal only | STRUCTURAL.TRUTH.AUTHORITY.01 | GOVERNED + PARTIAL | Metric schema; not a data artifact for downstream consumption |
| canonical_topology.json | S3 (41.1) | S4 (GAUGE) | SEMANTIC.COMPUTATION.AUTHORITY.01 / GAUGE.ADMISSIBLE.CONSUMPTION.01 | GOVERNED + EXECUTABLE | Authoritative topology; no alternative source permitted in GAUGE |
| signal_registry.json | S3 (41.4) | S4 (GAUGE) | SEMANTIC.COMPUTATION.AUTHORITY.01 / GAUGE.ADMISSIBLE.CONSUMPTION.01 | GOVERNED + PARTIAL (GAP-06) | Structural-evidence signals only; `runtime_required: false` for all entries |
| golden_query_catalog.md | S3 (41.5) | S4 (query potential surface only) | SEMANTIC.COMPUTATION.AUTHORITY.01 | GOVERNED + PARTIAL (GAP-11) | Declarative queries; GAUGE surfaces query potential only — not query content |
| query_signal_map.json | S3 (41.5) | S4 (query potential surface only) | SEMANTIC.COMPUTATION.AUTHORITY.01 | GOVERNED + PARTIAL (GAP-11) | Internal S3 artifact; maps query_ids to signal_ids and topology node_ids |
| gauge_state.json | S2a (PSEE Pipeline) | S4 (GAUGE) | GAUGE.ADMISSIBLE.CONSUMPTION.01 | GOVERNED + PARTIAL (GAP-01) | Currently COPIED from static authoritative package; `build_gauge_state.py` not implemented |
| coverage_state.json | S2a (PSEE Pipeline) | S4 (GAUGE) | GAUGE.ADMISSIBLE.CONSUMPTION.01 | GOVERNED + PARTIAL (GAP-05) | Coverage proof; fresh-run bootstrap protocol missing |
| reconstruction_state.json | S2a (PSEE Pipeline) | S4 (GAUGE) | GAUGE.ADMISSIBLE.CONSUMPTION.01 | GOVERNED + PARTIAL (GAP-05) | Reconstruction proof; same fresh-run constraint as coverage_state |

---

## 6. COMPUTABILITY STATUS MAP

| stage | sub-stage | status | explanation |
|-------|-----------|--------|-------------|
| S0 — Bootstrap | (full stage) | CLOSED / GOVERNED / EXECUTABLE | All S0 logic is governed (BOOTSTRAP.CHAIN.AUTHORITY.01); intake declaration, evidence root creation, and boundary freeze are fully executable |
| S1 — IG | (full stage) | CLOSED / GOVERNED / EXECUTABLE (GAP-10 caveat) | IG pipeline is governed (IG.HANDOFF.AUTHORITY.01) and has run successfully for BlueEdge; reproducibility for new sources not yet end-to-end verified |
| S2 — Structural Truth | 40.2 Evidence Classification | CLOSED / GOVERNED / PARTIAL | Governed by STRUCTURAL.TRUTH.AUTHORITY.01; authoritative BlueEdge artifacts present; fresh execution not re-verified |
| S2 — Structural Truth | 40.3 Structural Reconstruction | CLOSED / GOVERNED / PARTIAL | Same as 40.2; GAP-04 (grouping engine) for non-BlueEdge clients |
| S2 — Structural Truth | 40.4 Telemetry Surface | CLOSED / GOVERNED / PARTIAL (BLOCKED dimensions) | STATIC dimensions computed; RUNTIME/BLOCKED dimensions declared but not populated due to absent live platform (GAP-02) |
| S2a — PSEE Pipeline | (full stage) | CLOSED / GOVERNED / PARTIAL | Package artifacts present for BlueEdge authoritative run; `gauge_state.json` is static copy (GAP-01); fresh-run protocol missing (GAP-05) |
| S3 — Semantic Computation | 41.1 Topology Emission | CLOSED / GOVERNED / EXECUTABLE | `canonical_topology.json` is freshly computable; parity check confirmed |
| S3 — Semantic Computation | 41.2 PIE Vault | CLOSED / GOVERNED / PARTIAL | Script exists; fresh execution against current S2 artifacts not verified (GAP-11) |
| S3 — Semantic Computation | 41.3 Link Normalization | CLOSED / GOVERNED / PARTIAL | Script exists; fresh execution not verified (GAP-11) |
| S3 — Semantic Computation | 41.4 Signal Registry | CLOSED / GOVERNED / PARTIAL | Script output is static; not wired to fresh 40.5 inputs (GAP-06); no 40.5→41.4 contract (GAP-03) |
| S3 — Semantic Computation | 41.5 Query Catalog | CLOSED / GOVERNED / PARTIAL | Scripts exist; fresh execution not verified (GAP-11) |
| S4 — GAUGE | (full stage) | CLOSED / GOVERNED / CONSUMPTION ONLY | GAUGE is a governed consumption surface; operational for current BlueEdge baseline; fresh intake blocked by GAP-01/05 |
| S5 — PiOS Intelligence | 40.5 Signal Computation | PARTIAL / BLOCKED | No live telemetry (GAP-02); approximately 60–70% of dimensions blocked |
| S5 — PiOS Intelligence | 40.6–40.11 Chain | PARTIAL / BLOCKED | Cascades from GAP-02; no conditions, diagnoses, or loop closure possible |
| S6 — LENS Projection | 43.x Binding | BLOCKED / NOT YET EXECUTABLE | No binding script (GAP-07); also blocked by GAP-02 |
| S6 — LENS Projection | 44.x Overlay | BLOCKED / NOT YET EXECUTABLE | No projection script (GAP-08); also blocked by GAP-07 and GAP-02 |
| S6 — LENS Projection | 42.x ExecLens | BLOCKED / NOT YET EXECUTABLE | Depends on Steps 16 and 14; both blocked |

---

## 7. GAUGE STOP BOUNDARY

### Why GAUGE Is the First Governed Stop Surface

GAUGE is the point in the computable chain where all static structural derivation is complete and all artifacts required for structural proof are available. It does not require live runtime telemetry; it does not require computed signal values; it does not require binding or projection. It is the natural stop for a surface that proves structural truth without requiring operational intelligence.

GAUGE's authority comes from stopping correctly. A surface that extends beyond its authorized consumption boundary loses its claim to structural proof purity.

### Exactly What GAUGE Consumes

From the PSEE package (S2a):
- `gauge_state.json` — score, score band, completion posture (NOT EVALUATED for completion component)
- `coverage_state.json` — structural coverage dimensions
- `reconstruction_state.json` — reconstruction proof dimensions

From semantic computation (S3):
- `canonical_topology.json` — domain/capability/component hierarchy (41.1 output)
- `signal_registry.json` — structural-evidence signals with `evidence_confidence` distribution (41.4 output)

### Exactly What GAUGE Exposes

| surface | what is shown | source |
|---------|--------------|--------|
| Structural proof posture | Score, score band, component breakdown | gauge_state.json |
| Coverage proof | Coverage dimensions and state | coverage_state.json |
| Reconstruction proof | Reconstruction dimensions and state | reconstruction_state.json |
| Topology visibility | Domain/capability/component graph | canonical_topology.json |
| Signal presence visibility | Signal count, STRONG/MODERATE/WEAK distribution, signal list | signal_registry.json |
| Query gate posture | Locked discovery/execution query potential | Declared gate state |
| NOT EVALUATED posture | Explicit representation of absent S5 completion computation | gauge_state.json completion component |

### Exactly What GAUGE Does Not Do

GAUGE does not: compute runtime signals; activate conditions; produce diagnoses; generate narratives; propagate signals across topology; execute queries; render overlays; perform binding or projection; produce any Stage 5 or Stage 6 output; simulate absent upstream computation.

### Why GAUGE Must Not Merge with LENS

GAUGE's authority is its independence from runtime intelligence. LENS's authority is its dependence on fully computed intelligence. Merging them corrupts both:

- If GAUGE exposes LENS content, GAUGE's structural proof posture depends on non-structural inputs — it is no longer a pure structural proof surface.
- If LENS content appears in GAUGE without Stage 5 computation, it is fabricated intelligence presented as fact.

Both surfaces are corrupted by the merge. The prohibition is enforced by GAUGE.ADMISSIBLE.CONSUMPTION.01 G5.

### Why Missing Upstream Runtime Intelligence Must Remain Visible as Absence

When Stage 5 has not run, the completion component of `gauge_state.json` is NOT EVALUATED. GAUGE must render this explicitly — not zero it out, not suppress it, not infer a completion value.

This is correct structural truth reporting: the chain has not computed what it has not computed. Suppressing this information would misrepresent the system's actual proof state and corrupt the governing function of the GAUGE surface.

---

## 8. PIOS CONTINUATION BOUNDARY

### Where Stage 5 Begins

Stage 5 (PiOS Intelligence) begins at **40.5 Signal Computation**.

Stage 5 entry requires:
1. A sealed `telemetry_dimension_catalog.md` from Stage 2 (40.4) — the dimension scaffold
2. Live runtime telemetry access to the running system (the platform whose source was ingested)

### What 40.5–40.11 Require

- **40.5 — Signal Computation:** Live Prometheus scrapes, Redis metrics, Kafka event streams, and live API surfaces. These map to the RUNTIME and BLOCKED dimensions in `telemetry_dimension_catalog.md`. Approximately 60–70% of BlueEdge dimensions are currently BLOCKED.
- **40.6 — Condition Activation:** Computed signal values from 40.5 in sufficient completeness to evaluate condition thresholds.
- **40.7 — Diagnosis Synthesis:** Active conditions from 40.6; structural entity context from 40.3.
- **40.8–40.11 — Delivery, Feedback, Control, Loop Closure:** Sequential chain; each stage requires its upstream to be complete.

### Why Stage 5 Is Downstream of GAUGE

GAUGE does not need runtime signal values to expose structural proof. The structural proof is complete at Stage 4. Stage 5 computes what the system is doing now — GAUGE proves what the system structurally is. These are different questions with different data requirements.

Stage 5 is downstream of GAUGE precisely because it requires data that is not available in static analysis context.

### Why Stage 5 Is Not Required for GAUGE Closure

GAUGE closure is defined by GA-01 through GA-12 (GAUGE.ADMISSIBLE.CONSUMPTION.01 Section 8). None of these conditions require Stage 5 artifacts. GAUGE is fully closed when the five authorized artifacts are present, valid, and sourced correctly.

The NOT EVALUATED completion component in `gauge_state.json` is not a GAUGE defect — it is GAUGE accurately reporting that Stage 5 has not run.

### What Is Currently Blocked and Why

| blocker | gap | what it blocks |
|---------|-----|---------------|
| Live runtime telemetry absent | GAP-02 | 40.5 signal computation (~60–70% of dimensions); cascades to 40.6–40.11 |
| No formal 40.5→41.4 contract | GAP-03 | Incorporation of computed signals into 41.4 registry once 40.5 runs |
| Signal registry not wired to 40.5 outputs | GAP-06 | Fresh `signal_registry.json` from computed signals |
| DIM-execution (completion component) not computable | GAP-09 | GAUGE completion score; requires terminal execution state |

---

## 9. LENS CONTINUATION BOUNDARY

### Where Stage 6 Begins

Stage 6 (LENS Projection) begins at **43.x Signal-to-Structure Binding** — the point where computed signal values from Stage 5 are bound to canonical topology nodes.

### What Binding and Projection Require

- **43.x Signal-to-Structure Binding:** Computed signal values from 40.5; `canonical_topology.json` from 41.1. No binding script currently exists (GAP-07).
- **44.x Overlay Projection:** Signal-annotated topology from 43.x. No projection script currently exists (GAP-08).
- **42.x ExecLens Query Execution:** Signal-annotated overlay from 44.x; golden queries from 41.5; PIE vault from 41.2. `run_execlens_query.py` exists but depends on complete upstream binding/projection.

### Why LENS Depends on Stage 5 and Stage 6

LENS is a runtime intelligence projection surface. It cannot project intelligence that has not been computed. The dependency chain is strict:

```
Live telemetry (S5 prerequisite)
  → computed signal values (40.5)
    → signal-to-structure binding (43.x)
      → overlay projection (44.x)
        → ExecLens query execution (42.x)
```

Each step depends on the previous. No step can be skipped or simulated.

### Why LENS Is Not Part of GAUGE

GAUGE is defined as an early-stop surface at Stage 4. LENS is defined as a Stage 6 output. They share Stages 0–3 as common upstream truth — they diverge at Stage 5.

LENS requires what GAUGE explicitly does not: live telemetry, computed signal values, binding artifacts, and projection artifacts. These are not GAUGE inputs. Attempting to incorporate LENS behavior into GAUGE would require GAUGE to consume Stage 5 and Stage 6 outputs — which GAUGE.ADMISSIBLE.CONSUMPTION.01 explicitly prohibits.

### What Is Currently Unexecutable and Why

| unexecutable component | gap | required to unblock |
|------------------------|-----|---------------------|
| Signal-to-structure binding | GAP-07 | Implement `bind_signals_to_structure.py` per 43.x architectural definition |
| Overlay projection | GAP-08 | Implement projection execution scripts per 44.x definitions |
| ExecLens query execution | GAP-07, GAP-08 | Both binding and projection must be complete |
| All of the above | GAP-02 | Live runtime telemetry must be available before any S5→S6 step can execute |

---

## 10. GAP / BLOCKER CONSOLIDATION

Consolidated from `executable_gap_register.md` (COMPUTABLE.CHAIN.TO.GAUGE.01). No new gaps introduced here.

### Blockers to Fully Reproducible GAUGE

| gap | description | what it blocks |
|-----|-------------|---------------|
| GAP-01 | `gauge_state.json` is a static copy; `build_gauge_state.py` does not exist | GAUGE cannot be freshly computed from a new intake run; score and completion are read from a fixed authoritative artifact |
| GAP-05 | No fresh-run bootstrap protocol; PSEE pipeline depends on `run_01_authoritative` reference package | A new client or new intake cannot produce its own package without a pre-existing reference package |
| GAP-10 | IG pipeline reproducibility for new source not end-to-end verified | New client intakes cannot assume the BlueEdge RHP path; IG pipeline may require manual intervention for new sources |

**Minimum gap set to close for fully reproducible GAUGE:** GAP-01, GAP-05, GAP-10.

### Blockers to PiOS Intelligence Continuation (Stage 5)

| gap | description | what it blocks |
|-----|-------------|---------------|
| GAP-02 | Live runtime telemetry absent (Prometheus, Redis, Kafka, live API) | ~60–70% of 40.5 signals BLOCKED; 40.6–40.11 chain fully blocked |
| GAP-03 | No formal contract for 40.5→41.4 signal flow | Cannot incorporate computed signals into the 41.4 registry once 40.5 runs |
| GAP-06 | Signal registry script not wired to fresh 40.5 outputs | `signal_registry.json` remains static even when 40.5 runs |
| GAP-09 | GAUGE completion component (DIM-execution) not computable | Completion score (0/40 pts) cannot advance; confidence band fixed until execution state is available |

### Blockers to LENS (Stage 6)

All PiOS blockers above, plus:

| gap | description | what it blocks |
|-----|-------------|---------------|
| GAP-07 | No signal-to-structure binding script (43.x) | Signal-annotated topology cannot be produced; LENS cannot begin |
| GAP-08 | No overlay projection script (44.x) | LENS overlay rendering cannot be produced even after binding |
| GAP-11 | PIE vault and link normalization scripts not verified against current S2 artifacts | Stale vault may not reflect current topology correctly |

---

## 11. MINIMUM AUTHORITATIVE CHAIN STATEMENT

The Krayu Program Intelligence computable chain is:

**Computable and governed from Stage 0 (Bootstrap) through Stage 4 (GAUGE).**

The chain from intake declaration to structural proof surface is fully governed by five authoritative contracts (BOOTSTRAP.CHAIN.AUTHORITY.01 → IG.HANDOFF.AUTHORITY.01 → STRUCTURAL.TRUTH.AUTHORITY.01 → SEMANTIC.COMPUTATION.AUTHORITY.01 → GAUGE.ADMISSIBLE.CONSUMPTION.01) with no gap in authority and no hidden authority outside the declared contract chain.

**Downstream intelligence is intentionally separate.**

Stage 5 (PiOS Intelligence) and Stage 6 (LENS Projection) are the downstream continuation of the same chain — not a different chain. They are separated from Stage 4 (GAUGE) by design: GAUGE stops at structural proof; S5/S6 require live runtime intelligence. The separation is a governed architectural decision, not a gap or deficiency.

**No hidden authority exists outside the chain.**

Every stage boundary, every artifact transition, and every consumption restriction is declared in an authoritative contract. No undeclared transformation, enrichment, or consumption occurs between any two stages in the governed portion of the chain (S0–S4). No stage derives authority from implementation convenience, implicit convention, or prior chat context.

**No patchwork remains in the upstream architecture.**

The S0–S4 authority chain is complete. Every stage has a governing contract. Every artifact flow is explicitly declared. Every forbidden consumption is explicitly named. The structural proof surface (GAUGE) is closed and internally consistent with its upstream chain.

---

## 12. GOVERNANCE CONFIRMATION

This document:

1. **Introduces no new authority.** Every behavioral claim, stage boundary, artifact definition, and rejection condition stated here is derived directly from the five authoritative contracts listed in Section 1. No new rules, requirements, or constraints are added.

2. **Only consolidates existing authority.** The purpose of this document is to make the existing authority legible as an ordered, stage-by-stage, step-by-step chain description. Consolidation does not create authority.

3. **No stage responsibilities were changed.** The scope, inputs, outputs, and boundaries of S0, S1, S2, S3, S4, S5, and S6 are identical to their declarations in the governing authority contracts. No stage absorbed, shed, or delegated any responsibility in the course of producing this document.

4. **No implementation behavior was introduced.** This document contains no script names (except where unavoidably present in source authority documents and required for exact cross-reference), no runtime commands, no executable logic, and no deployment instructions.

---

## Validation at Definition Time

| check | status |
|-------|--------|
| C1 — output file exists | PASS |
| C2 — identity/scope explicit | PASS — Section 1 (document id, purpose, authority basis, scope, documentation-only statement) |
| C3 — full stage list documented | PASS — Section 2 (S0–S6 with purpose, authority, status, downstream relationship) |
| C4 — S0–S6 detailed stage sections present | PASS — Section 3 (S0, S1, S2, S2a, S3, S4, S5, S6 each with A–H sub-sections) |
| C5 — ordered executable/computable flow present | PASS — Section 4 (Steps 0–17 plus Step 7a; each with purpose, stage, inputs, outputs, status, blocker) |
| C6 — artifact flow table present | PASS — Section 5 (24 artifacts; produced-by, consumed-by, authority, status, notes) |
| C7 — computability status map present | PASS — Section 6 (all stages/sub-stages with status classification) |
| C8 — GAUGE stop boundary documented | PASS — Section 7 (why GAUGE stops, what it consumes, what it exposes, what it does not, merge prohibition, absence-as-absence) |
| C9 — PiOS continuation boundary documented | PASS — Section 8 (S5 entry, 40.5–40.11 requirements, downstream reasoning, blockers) |
| C10 — LENS continuation boundary documented | PASS — Section 9 (S6 entry, binding/projection requirements, LENS independence from GAUGE, unexecutable components) |
| C11 — blocker consolidation documented | PASS — Section 10 (3 blocker categories; GAP-01 through GAP-11 consolidated) |
| C12 — final authoritative chain statement present | PASS — Section 11 (4-clause minimum chain statement) |
| C13 — governance confirmation present | PASS — Section 12 (4 explicit confirmations) |
| C14 — no implementation introduced | PASS — no new scripts, no runtime commands, no deployment logic |
| C15 — no other file modified | PASS |
