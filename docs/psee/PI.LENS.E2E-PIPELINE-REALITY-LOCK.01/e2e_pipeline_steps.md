# End-to-End Pipeline Steps
## PI.LENS.E2E-PIPELINE-REALITY-LOCK.01

**Generated:** 2026-05-01  
**Source evidence:** PI.LENS.PIPELINE-CONFORMANCE.FASTAPI.01, PI.LENS.PIPELINE-ORCHESTRATOR-BLUEEDGE-REFERENCE.01, PI.LENS.PIPELINE-ORCHESTRATOR-IMPLEMENTATION.01, PI.LENS.FASTAPI.40X-STRUCTURAL-BOOTSTRAP.01  
**No scripts executed. No artifacts created outside this directory.**

---

## Scope

This document covers the complete pipeline from client registration to final selector output for the LENS multi-client orchestrator (`run_client_pipeline.py`). Steps are ordered by dependency. Steps 1–9 (pre-orchestrator) must complete before `run_client_pipeline.py` can proceed. Steps 10–17 are owned by the orchestrator.

---

## Step 1 — Client Registration

**Name:** Client Registration  
**Description:** Operator authors `client.yaml` and `source_manifest.json` for a new client. These files define all paths the orchestrator reads. This is the only fully operator-driven step; all subsequent steps depend on it.  
**Input artifacts:**
- Operator-authored content
- BlueEdge reference schema (for field validation)

**Output artifacts:**
- `clients/<alias>/client.yaml`
- `clients/<alias>/sources/<source_id>/source_manifest.json`

**Producer:** Manual (operator)  
**Orchestrator role:** Consumer (reads at startup)  
**Status — BlueEdge:** COMPLETE (exists: `clients/blueedge/client.yaml`, `clients/blueedge/sources/source_01/source_manifest.json`)  
**Status — FastAPI:** COMPLETE (exists: `clients/fastapi/client.yaml`, `clients/fastapi/sources/source_01/source_manifest.json`) — with known field gaps (`dom_layer_path`, `integration_validation_path` absent)

---

## Step 2 — Source Intake

**Name:** Source Intake  
**Description:** Raw source archive (or local directory) is extracted to a canonical repository directory. Produces intake manifests documenting file count, extraction log, and boundary identity. This step runs BEFORE the orchestrator. The orchestrator has no generation path for these outputs.  
**Input artifacts:**
- Raw source archive (`archive_path` from `source_manifest.json`)

**Output artifacts:**
- `<extracted_path>/` — canonical source directory (all source files)
- `<intake_path>/intake_manifest.json`
- `<intake_path>/source_boundary_doc`
- `<intake_path>/intake_record.json`
- `<intake_path>/archive_extraction_log.json`

**Producer:** External intake contract (BlueEdge: `PI.BLUEEDGE.CLEAN-INTAKE.01`; FastAPI: `PRODUCTIZE.RAW.SOURCE.INTAKE.01`)  
**Producer callable:** NO — external contract scripts not present in repo; BlueEdge archive at external filesystem path  
**Orchestrator role:** Validates outputs in Phase 1 and Phase 2; cannot generate  

**Status — BlueEdge:** COMPLETE (extracted path: `clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/intake/canonical_repo`; source archive at external path — not re-runnable from repo alone)  
**Status — FastAPI:** PARTIAL (source directory exists at `clients/e65d2f0a.../input/intake/source/fastapi-backend/` — 87 files; archive_path uses MANIFEST_FILE_PROXY; underlying source is a local directory, not a true archive)

---

## Step 3 — Phase 1: Source Boundary Validation

**Name:** Source Boundary Validation  
**Description:** Orchestrator opens `archive_path` as a binary file, computes SHA256, and compares to `source_manifest.sha256`. Pass = file exists and hash matches. VALIDATION ONLY — no artifacts generated. Fail = FileNotFoundError or hash mismatch.  
**Input artifacts:**
- `source_manifest['archive_path']` — must be a readable binary file
- `source_manifest['sha256']` — expected hash value

**Output artifacts:** NONE (validation gate only)  
**Producer:** `run_client_pipeline.py → phase_01_source_boundary` (lines 125–149)  
**Producer callable:** YES  
**Status — BlueEdge:** PASS (archive_path is SHA256 manifest file of canonical_repo; hash matches)  
**Status — FastAPI:** PASS (MANIFEST_FILE_PROXY: `fastapi-backend.manifest.sha256` exists; SHA256=`b93be45319f28dfb04269c42c0b14f6288f8b2328d9490962e83c4941ced86bb`)

---

## Step 4 — Phase 2: Intake Verification

**Name:** Intake Verification  
**Description:** Orchestrator verifies `extracted_path` directory exists and contains files via `rglob`. VALIDATION ONLY — no artifacts generated.  
**Input artifacts:**
- `source_manifest['extracted_path']` — must be an existing directory with files

**Output artifacts:** NONE (validation gate only)  
**Producer:** `run_client_pipeline.py → phase_02_intake` (lines 154–163)  
**Producer callable:** YES  
**Status — BlueEdge:** PASS (`clients/6a6fcdbc.../psee/intake/canonical_repo` exists)  
**Status — FastAPI:** PASS (`clients/e65d2f0a.../input/intake/source/fastapi-backend/` exists, 87 files)

---

## Step 5 — Structural Analysis (40.x Generation)

**Name:** Client Source Structural Analysis  
**Description:** Raw source is analyzed to produce three JSON structural artifacts: a node inventory (files and directories with IDs), a topology log (CONTAINS/IMPORTS relations between nodes), and a canonical topology (domain/cluster normalization). These run BEFORE the orchestrator validates them. The orchestrator has no generation path — the 5 scripts in `scripts/pios/40.x/` are incompatible with client source analysis (they target k-pi-core self-analysis). No generic client-source structural scanner exists in the repo.  
**Input artifacts:**
- Extracted source directory (from Step 2)

**Output artifacts:**
- `<structure_path>/40.2/structural_node_inventory.json`
- `<structure_path>/40.3/structural_topology_log.json`
- `<structure_path>/40.4/canonical_topology.json`

**Producer — BlueEdge:** External (PI.BLUEEDGE.STRUCTURAL-PIPELINE.40X.01) — scripts not in repo  
**Producer — FastAPI:** `scripts/pios/40.2/bootstrap_fastapi_40x.py` (client-specific, one-time bootstrap)  
**Generic producer:** DOES NOT EXIST — no client-agnostic structural scanner in repo  
**Producer callable:** NO (generic); YES for FastAPI specifically via bootstrap_fastapi_40x.py  
**Orchestrator role:** Validates outputs in Phase 3; cannot generate  

**Status — BlueEdge:** COMPLETE (artifacts at `clients/6a6fcdbc.../psee/structure/40.2/, 40.3/, 40.4/`)  
**Status — FastAPI:** COMPLETE (artifacts at `clients/e65d2f0a.../psee/runs/run_02_oss_fastapi/structure/40.2/, 40.3/, 40.4/`; 124 nodes, 123 relations, 14 clusters — generated by bootstrap_fastapi_40x.py)

---

## Step 6 — Phase 3: Structural Verification

**Name:** 40.x Structural Verification  
**Description:** Orchestrator checks existence of all 3 structural artifact files and reads `total_nodes` from 40.2. VALIDATION ONLY — no artifacts generated. Fail = any file missing.  
**Input artifacts:**
- `<structure_path>/40.2/structural_node_inventory.json` (JSON with `total_nodes` field)
- `<structure_path>/40.3/structural_topology_log.json` (existence check only)
- `<structure_path>/40.4/canonical_topology.json` (existence check only)

**Output artifacts:** NONE (validation gate only)  
**Producer:** `run_client_pipeline.py → phase_03_40x_structural` (lines 168–185)  
**Producer callable:** YES  
**Status — BlueEdge:** PASS  
**Status — FastAPI:** PASS (after bootstrap_fastapi_40x.py generated artifacts — 124 nodes confirmed)

---

## Step 7 — CEU Grounding and Integrated Pipeline

**Name:** CEU Grounding and Integration Validation Generation  
**Description:** CEU entities are grounded to the structural node inventory; grounding state is produced at PASS gate. Integration validation is produced by a separate integrated pipeline run. Both are required by downstream phases. This runs BEFORE the orchestrator. The orchestrator has no generation path for either artifact.

Sub-step 7a: CEU Grounding → `ceu_grounding_registry.json`, `grounding_state_v3.json`  
Sub-step 7b: Integration Pipeline → `integration_validation.json`

**Input artifacts:**
- Extracted source directory (Step 2)
- Structural artifacts (Step 5)

**Output artifacts:**
- `ceu_grounding_registry.json`
- `grounding_state_v3.json` (must contain `readiness_gate: PASS`)
- `integration_validation.json`

**Producer — BlueEdge:** External (CEU Grounding Pipeline + PI.BLUEEDGE Integrated Pipeline)  
**Producer — FastAPI:** NOT PRODUCED — only `grounding_state_v2.json` exists; v3 absent (GAP-REG-02)  
**Orchestrator role:** Phase 4 validates `grounding_state_v3.json` gate; Phase 8a reads `integration_validation.json` without prior validation gate  

**Status — BlueEdge:** COMPLETE (at `clients/6a6fcdbc.../psee/runs/run_blueedge_integrated_01/grounding_state_v3.json` and `integration_validation.json`)  
**Status — FastAPI:** BLOCKED — `grounding_state_v3.json` absent (GAP-REG-02); `ceu_grounding_registry.json` status unverified; `integration_validation.json` absent

---

## Step 8 — Phase 4: CEU Grounding Verification

**Name:** Readiness Gate  
**Description:** Orchestrator reads `grounding_state_v3.json` and checks `readiness_gate == PASS`. VALIDATION ONLY — no artifacts generated. Fail = file absent or gate not PASS.  
**Input artifacts:**
- `source_manifest['grounding_state_path']` — must contain `readiness_gate: PASS`

**Output artifacts:** NONE (validation gate only)  
**Producer:** `run_client_pipeline.py → phase_04_ceu_grounding` (lines 190–213)  
**Producer callable:** YES  
**Status — BlueEdge:** PASS  
**Status — FastAPI:** BLOCKED (GAP-REG-02: `grounding_state_v3.json` absent; only v2 exists)

---

## Step 9 — DOM Layer Construction

**Name:** DOM Path Domain Layer Construction  
**Description:** Domain-level path mapping is derived from structural and grounding artifacts, producing `dom_path_domain_layer.json`. This artifact is required by Phase 5 (native path) and Phase 8a. It is not generated by any orchestrator phase. For BlueEdge it was produced by `PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01` and stored in `docs/` (not `clients/`). For FastAPI, `dom_layer_path` field is absent from `source_manifest.json`.  
**Input artifacts:**
- Structural artifacts (Step 5)
- Grounding state (Step 7)

**Output artifacts:**
- `dom_path_domain_layer.json`

**Producer — BlueEdge:** External (PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01)  
**Producer — FastAPI:** UNKNOWN — no producer defined; field absent from source_manifest  
**Orchestrator role:** Phase 5 and Phase 8a read this artifact; no validation gate; assumed present  

**Status — BlueEdge:** COMPLETE (`docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/dom_path_domain_layer.json` — stored in docs/ not clients/)  
**Status — FastAPI:** MISSING — `dom_layer_path` field not in `source_manifest.json`; no artifact produced

---

## Step 10 — Phase 5: Binding Envelope Construction

**Name:** Binding Envelope Construction  
**Description:** Orchestrator builds `binding_envelope.json` from CEU registry + DOM layer (native path) or copies pre-computed conformance artifact (conformance path). BlueEdge uses conformance path. Native path requires `ceu_grounding_registry.json` + `dom_layer_path`. This is the first step the orchestrator generates an artifact.  
**Input artifacts:**
- Native path: `ceu_grounding_registry.json` + `dom_path_domain_layer.json`
- Conformance path: `<fastapi_conformance_path>/binding_envelope_fastapi_compatible.json`

**Output artifacts:**
- `clients/<alias>/psee/runs/<run_id>/binding/binding_envelope.json`

**Producer:** `run_client_pipeline.py → phase_05_build_binding_envelope` (lines 217–426)  
**Producer callable:** YES  
**Status — BlueEdge:** COMPLETE (via conformance path; conformance artifacts at `docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed/`)  
**Status — FastAPI:** NOT REACHED (blocked at Phase 4)

---

## Step 11 — Phase 6+7: E2E Signal Pipeline

**Name:** 75.x Activation + 41.x Projection  
**Description:** Orchestrator runs `run_end_to_end.py` as a subprocess (native path) or copies pre-computed conformance signal artifacts (conformance path). BlueEdge uses conformance path. Produces 5 signal state files and 2 projection files.  
**Input artifacts:**
- Native path: `binding_envelope.json` + `scripts/pios/run_end_to_end.py`
- Conformance path: `<fastapi_conformance_path>/signal_projection_fastapi_compatible.json` + others

**Output artifacts:**
- `runs/<run_id>/75.x/condition_correlation_state.json`
- `runs/<run_id>/75.x/pressure_zone_state.json`
- `runs/<run_id>/75.x/pressure_candidate_state.json`
- `runs/<run_id>/41.x/signal_projection.json`
- `runs/<run_id>/41.x/pressure_zone_projection.json`

**Producer:** `run_client_pipeline.py → phase_06_and_07_e2e` (lines 431–507); invokes `scripts/pios/run_end_to_end.py`  
**Producer callable:** YES (`run_end_to_end.py` exists)  
**Status — BlueEdge:** COMPLETE (via conformance path)  
**Status — FastAPI:** NOT REACHED

---

## Step 12 — Phase 8a: Vault Construction

**Name:** Vault Construction  
**Description:** Orchestrator builds 9 vault artifacts from grounding state, DOM layer, integration validation, and signal registry. This is the most input-dependent phase — requires 4 external pre-existing inputs.  
**Input artifacts:**
- `grounding_state_v3.json` (from Step 7)
- `dom_path_domain_layer.json` (from Step 9)
- `integration_validation.json` (from Step 7)
- Signal registry (from conformance path or Phase 6+7)

**Output artifacts:**
- `runs/<run_id>/vault/coverage_state.json`
- `runs/<run_id>/vault/reconstruction_state.json`
- `runs/<run_id>/vault/gauge_state.json`
- `runs/<run_id>/vault/canonical_topology.json`
- `runs/<run_id>/vault/signal_registry.json`
- `runs/<run_id>/vault/binding_envelope.json`
- `runs/<run_id>/vault/admissibility_log.json`
- `runs/<run_id>/vault/evidence_trace.json`
- `runs/<run_id>/vault/vault_manifest.json`

**Producer:** `run_client_pipeline.py → phase_08a_vault` (lines 512–892)  
**Producer callable:** YES  
**Status — BlueEdge:** COMPLETE (via conformance path; all inputs present)  
**Status — FastAPI:** NOT REACHED

---

## Step 13 — Phase 8b: Lens Report Generation

**Name:** Lens Report Generation  
**Description:** Orchestrator invokes `scripts/pios/lens_report_generator.py` as a subprocess, which in turn invokes `scripts/pios/export_graph_state.mjs`. Produces complete LENS report tree for the run.  
**Input artifacts:**
- All vault artifacts from Step 12

**Output artifacts:**
- `clients/<alias>/lens/runs/<run_id>/` — full report tree (index.html, manifest, PDF reports, graph_state.json)
- `clients/<alias>/lens/runs/<run_id>/report_manifest.json`
- `clients/<alias>/lens/runs/<run_id>/graph_state.json`

**Producer:** `run_client_pipeline.py → phase_08b_lens_reports` (lines 896–921); invokes `scripts/pios/lens_report_generator.py`  
**Producer callable:** YES (`lens_report_generator.py` exists)  
**Status — BlueEdge:** COMPLETE  
**Status — FastAPI:** NOT REACHED

---

## Step 14 — Phase 9: Selector Update

**Name:** Selector Update  
**Description:** Orchestrator writes `selector.json` and `available_runs.json` to the client's lens/selector directory. Creates directory if absent. This step never fails closed.  
**Input artifacts:**
- Report tree from Step 13
- Existing `available_runs.json` (if any prior runs exist)

**Output artifacts:**
- `clients/<alias>/lens/selector/selector.json`
- `clients/<alias>/lens/selector/available_runs.json`

**Producer:** `run_client_pipeline.py → phase_09_selector_update` (lines 926–971)  
**Producer callable:** YES  
**Status — BlueEdge:** COMPLETE (`clients/blueedge/lens/selector/available_runs.json` exists)  
**Status — FastAPI:** NOT REACHED

---

## Step Summary

| Step | Name | Owner | BlueEdge | FastAPI |
|------|------|--------|----------|---------|
| 1 | Client Registration | Manual | COMPLETE | COMPLETE (field gaps) |
| 2 | Source Intake | External | COMPLETE | PARTIAL (proxy only) |
| 3 | Phase 1: Boundary Validation | Orchestrator | PASS | PASS |
| 4 | Phase 2: Intake Verification | Orchestrator | PASS | PASS |
| 5 | Structural Analysis (40.x) | External (no generic script) | COMPLETE | COMPLETE (bootstrap only) |
| 6 | Phase 3: Structural Verification | Orchestrator | PASS | PASS |
| 7 | CEU Grounding + Integration Pipeline | External | COMPLETE | BLOCKED (GAP-REG-02) |
| 8 | Phase 4: Readiness Gate | Orchestrator | PASS | BLOCKED |
| 9 | DOM Layer Construction | External | COMPLETE (docs/ path) | MISSING (field absent) |
| 10 | Phase 5: Binding Envelope | Orchestrator | COMPLETE (conformance) | NOT REACHED |
| 11 | Phase 6+7: Signal Pipeline | Orchestrator | COMPLETE (conformance) | NOT REACHED |
| 12 | Phase 8a: Vault Construction | Orchestrator | COMPLETE (conformance) | NOT REACHED |
| 13 | Phase 8b: Lens Reports | Orchestrator | COMPLETE | NOT REACHED |
| 14 | Phase 9: Selector Update | Orchestrator | COMPLETE | NOT REACHED |

**Total steps: 14**  
**Orchestrator-owned (generator role): Steps 10–14 (5 steps)**  
**External pre-conditions: Steps 1–9 (9 steps)**  
**BlueEdge: All 14 steps complete (conformance path)**  
**FastAPI: Blocked at Step 7 (GAP-REG-02)**
