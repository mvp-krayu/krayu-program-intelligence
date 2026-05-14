# Minimum Orchestration Chain
## PI.LENS.PIPELINE-ORCHESTRATOR-BLUEEDGE-REFERENCE.01

**Generated:** 2026-05-01  
**Reference Client:** BlueEdge (run_be_orchestrated_fixup_01)  
**Purpose:** Define the minimum deterministic sequence of steps required to produce all governed outputs from a registered client source, treating the orchestrator as a black box that must be extended.

---

## Definition

The **minimum orchestration chain** is the smallest set of ordered, deterministic steps that, given only:
- `client.yaml`
- `source_manifest.json`

produces all governed outputs through Phase 9 (selector update) without operator intervention at any phase boundary.

**Current state:** The chain requires 9 steps. Steps 1–6 currently require external execution outside `run_client_pipeline.py`. Steps 7–9 are owned by the orchestrator.

---

## Chain Steps

### STEP 1 — Source Intake
**Input:** Registered `archive_path` from `source_manifest.json`  
**Output:** `canonical_repo/`, `intake_manifest.json`, `source_boundary_doc`, `intake_record.json`, `archive_extraction_log.json` (BE-01 through BE-05)  
**Current owner:** External (PI.BLUEEDGE.CLEAN-INTAKE.01 or equivalent)  
**Orchestrator gap:** No invocation. Phase 1 validates BE-00 presence; Phase 2 validates BE-01+BE-02 presence. If absent, fails closed with no generation fallback.  
**Required action to close:** Add `phase_00_source_intake` that invokes the intake contract when `canonical_repo` is absent.

---

### STEP 2 — Structural Analysis (40.x)
**Input:** `canonical_repo/` (BE-01)  
**Output:** `40.2/structural_node_inventory.json`, `40.3/structural_topology_log.json`, `40.4/canonical_topology.json` (BE-06 through BE-08)  
**Current owner:** External (PI.BLUEEDGE.STRUCTURAL-PIPELINE.40X.01)  
**Orphaned scripts:** `scan_repository.sh`, `extract_entities.py`, `classify_files.py` (40.2); `extract_perm_entities.py` (40.3); `build_telemetry_artifacts.py` (40.4) — exist in `scripts/pios/40.x/` but not invoked  
**Orchestrator gap:** Phase 3 validates existence of 40.x artifacts. If absent, prints REMEDIATION message referencing external contract. No script invocation.  
**Required action to close:** Wire 40.x scripts into a generation sub-phase inside `phase_03_40x_structural`. Or create `phase_03_generate` that invokes them when artifacts are absent.

---

### STEP 3 — CEU Grounding
**Input:** `canonical_repo/` (BE-01), structural artifacts (BE-06 through BE-10)  
**Output:** `ceu_grounding_registry.json` (BE-11)  
**Current owner:** External (CEU Grounding Pipeline, PROD-04)  
**Orchestrator gap:** BE-11 is read by Phase 5 (native path) with no prior validation phase. No generation path exists.  
**Required action to close:** Add `phase_04b_ceu_grounding` that generates `ceu_grounding_registry.json` when absent, or validates its existence before Phase 5.

---

### STEP 4 — Integrated Pipeline (Grounding State + Integration Validation)
**Input:** `canonical_repo/` (BE-01), structural artifacts, CEU grounding (BE-11)  
**Output:** `grounding_state_v3.json` (BE-12), `integration_validation.json` (BE-13)  
**Current owner:** External (PI.BLUEEDGE Integrated Pipeline, PROD-05)  
**Orchestrator gap:** Phase 4 validates BE-12 readiness_gate but has no generation path. BE-13 has no validation phase at all. Both required by Phase 8a.  
**Required action to close:** Add generation sub-phase for grounding state. Add validation gate for integration_validation before Phase 8a.

---

### STEP 5 — DOM Layer Construction
**Input:** Structural artifacts (BE-06 through BE-10), grounding state (BE-12)  
**Output:** `dom_path_domain_layer.json` (BE-14)  
**Current owner:** External (PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01, PROD-06)  
**Location anomaly:** BE-14 lives under `docs/`, not `clients/` — not client-scoped  
**Orchestrator gap:** BE-14 is read by Phase 5 and Phase 8a with no prior validation phase. No generation path exists.  
**Required action to close:** Add DOM layer generation from structural artifacts or validate before Phase 5. Move to client-scoped path.

---

### STEP 6 — Binding Envelope Construction (Phase 5)
**Input:** BE-11 + BE-14 (native path) OR BE-C1 (conformance path)  
**Output:** `binding_envelope.json` (BE-15)  
**Current owner:** ORCHESTRATOR (phase_05_build_binding_envelope)  
**Status:** OWNED — no gap if upstream steps 3 and 5 are complete  
**Note:** BlueEdge uses conformance path (BE-C1); native path requires BE-11 and BE-14 both present.

---

### STEP 7 — E2E Signal Pipeline (Phase 6+7)
**Input:** BE-15 (native) OR BE-C2, BE-C3, BE-C4 (conformance)  
**Output:** BE-16, BE-17, BE-18, BE-19, BE-20  
**Current owner:** ORCHESTRATOR (phase_06_and_07_e2e)  
**Status:** OWNED — no gap if BE-15 is produced

---

### STEP 8 — Vault Construction + Reports (Phase 8a + 8b)
**Input:** BE-12, BE-13, BE-14, BE-C5 (vault); vault artifacts (reports)  
**Output:** BE-21 through BE-36  
**Current owner:** ORCHESTRATOR (phase_08a_vault + phase_08b_lens_reports)  
**Status:** OWNED (generation) — gap in input validation for BE-13 and BE-14  
**Note:** BE-13 and BE-14 are assumed present with no prior validation gate.

---

### STEP 9 — Selector Update (Phase 9)
**Input:** BE-30, BE-33  
**Output:** BE-37, BE-38, BE-39  
**Current owner:** ORCHESTRATOR (phase_09_selector_update)  
**Status:** OWNED — no gap if reports produced

---

## Chain Summary

| Step | Name | Owner | Status |
|------|------|--------|--------|
| 1 | Source Intake | EXTERNAL | NOT_OWNED — no generation path |
| 2 | Structural Analysis (40.x) | EXTERNAL + ORPHANED_SCRIPTS | NOT_OWNED — scripts exist, not wired |
| 3 | CEU Grounding | EXTERNAL | NOT_OWNED — no validation or generation |
| 4 | Integrated Pipeline | EXTERNAL | NOT_OWNED — validation-only for grounding state; no gate for integration_validation |
| 5 | DOM Layer Construction | EXTERNAL | NOT_OWNED — assumed present, no path |
| 6 | Binding Envelope | ORCHESTRATOR | OWNED (Phase 5) |
| 7 | E2E Signal Pipeline | ORCHESTRATOR | OWNED (Phase 6+7) |
| 8 | Vault + Reports | ORCHESTRATOR | OWNED (Phase 8a+8b) — gap in input validation |
| 9 | Selector Update | ORCHESTRATOR | OWNED (Phase 9) |

**Orchestrator owns:** Steps 6–9 (4 of 9 steps)  
**External execution required:** Steps 1–5 (5 of 9 steps)  
**Deterministic from registration:** NO — requires 5 external steps before orchestrator can proceed

---

## Minimum Work to Close the Chain

To make the chain deterministic from `client.yaml` + `source_manifest.json`:

1. **Wire 40.x scripts into phase_03** — closes Step 2 gap using existing repo scripts
2. **Add grounding generation to phase_04** — closes Step 4 gap (grounding_state_v3)
3. **Add integration phase (intake + DOM)** — closes Steps 1, 3, 5 via new pre-pipeline phase
4. **Add integration_validation validation gate before phase_08a** — closes unvalidated BE-13 input
5. **Update source_manifest schema** — require `dom_layer_path` and `integration_validation_path` at registration time

Minimum new code: 3 new phase functions + 5 sub-invocations + schema update.  
Estimated artifact coverage after closure: 39/39 artifacts deterministically producible from registration.

---

## Conformance Path Alternative

If Steps 1–5 are formally declared as a **client conformance artifact set** (analogous to `fastapi_conformance_path`):

- Each client must produce a conformance artifact bundle covering BE-01 through BE-14 before orchestrator invocation
- Orchestrator validates bundle presence at startup (not phase-by-phase)
- Phases 1–5 become pure consumers of the bundle
- This closes the determinism gap **without modifying phases 1–5** but shifts the burden to a client-specific conformance production contract

This is a valid architectural alternative but must be explicitly declared, not arrived at by default.
