# Canonical Contract Violations
## PI.LENS.PIPELINE-ORCHESTRATOR-BLUEEDGE-REFERENCE.01

**Generated:** 2026-05-01  
**Reference Client:** BlueEdge (run_be_orchestrated_fixup_01)  
**Purpose:** Enumerate violations of the canonical E2E contract promise by the current orchestrator implementation, derived from BlueEdge lifecycle reconstruction.

---

## Canonical E2E Contract Promise

From `run_client_pipeline.py` documentation and conformance analysis:

> "The pipeline is client-agnostic — all artifact paths resolved through `client.yaml` + `source_manifest.json`. Registering a new client enables a complete pipeline run."

This is the **promise under test**. Each violation below is a gap where the promise is not fulfilled by the current implementation.

---

## VIOLATION-01: Phases 1–4 Are Pure Validation Gates With No Generation Fallback

**Severity:** CRITICAL  
**Violated promise:** Client-agnostic execution from registration  
**Observed behavior:** Phases 1–4 check for the presence of artifacts but have zero invocation path to generate them when absent. A registered client that lacks intake, structural, or grounding artifacts will fail at each gate with no automated recovery.

**Evidence:**
- `phase_01_source_boundary` opens `archive_path` as binary — no fetch or extraction
- `phase_02_canonical_repo` checks `canonical_repo` exists — no extraction from archive
- `phase_03_40x_structural` prints `REMEDIATION: Re-execute PI.BLUEEDGE.STRUCTURAL-PIPELINE.40X.01` — no script invocation
- `phase_04_readiness_gate` checks `readiness_gate == PASS` in grounding_state_v3.json — no grounding generation

**Gap origin:** Canonical contract was designed with BlueEdge as reference — BlueEdge pre-produced all phase 1–4 artifacts externally before orchestrator was invoked. The orchestrator was never designed to generate them; it was designed to validate that they exist.

**Impact:** O(clients × phases) external bootstrap scripts required to onboard each new client.

---

## VIOLATION-02: 40.x Generation Scripts Exist in Repo but Are Orphaned from Orchestrator

**Severity:** HIGH  
**Violated promise:** Orchestrator owns structural analysis  
**Observed behavior:** Five scripts in `scripts/pios/40.x/` participate in the structural artifact production chain but are never invoked by `run_client_pipeline.py`:
- `scripts/pios/40.2/scan_repository.sh`
- `scripts/pios/40.2/extract_entities.py`
- `scripts/pios/40.2/classify_files.py`
- `scripts/pios/40.3/extract_perm_entities.py`
- `scripts/pios/40.4/build_telemetry_artifacts.py`

The orchestrator's own REMEDIATION message in `phase_03_40x_structural` references a *contract* (PI.BLUEEDGE.STRUCTURAL-PIPELINE.40X.01) rather than these scripts, despite the scripts being in scope.

**Gap origin:** Scripts were likely written for the BlueEdge structural pipeline before `run_client_pipeline.py` existed. They were never wired into the orchestrator's invocation chain.

**Impact:** Phase 3 gap cannot be closed by the orchestrator itself even though the generation capability exists in the repository. Operators must manually invoke the scripts or write new bootstrap scripts (as was done for FastAPI).

---

## VIOLATION-03: BE-11 (CEU Grounding Registry) Has No Validation Gate and No Generation Path

**Severity:** HIGH  
**Violated promise:** All required inputs are managed by the pipeline  
**Observed behavior:** `phase_05_build_binding_envelope` reads `ceu_grounding_registry.json` on the native path with no prior validation that the file exists. If absent and `fastapi_conformance_path` is not set, Phase 5 raises `FileNotFoundError`. No phase validates or generates this artifact.

**Gap origin:** BE-11 is produced by the CEU Grounding Pipeline (PROD-04), an external contract whose scripts are outside `run_client_pipeline.py` scope.

**Impact:** Native-path Phase 5 execution is silently broken for any client lacking a pre-existing CEU grounding registry. BlueEdge is protected by the conformance path bypass; new clients are not.

---

## VIOLATION-04: BE-13 (Integration Validation) Has No Validation Gate and No Generation Path

**Severity:** HIGH  
**Violated promise:** Vault construction is deterministic from registration  
**Observed behavior:** `phase_08a_vault` reads `integration_validation_path` from source_manifest and uses it as an admissibility proxy. No validation phase checks existence before Phase 8a. If absent or not registered, Phase 8a fails.

**Gap origin:** `integration_validation.json` is produced by PI.BLUEEDGE Integrated Pipeline (PROD-05). BlueEdge source_manifest has this field. FastAPI source_manifest does not — it was never added to the registration schema.

**Impact:** Phase 8a cannot run for FastAPI without `fastapi_conformance_path` even if all earlier phases pass.

---

## VIOLATION-05: BE-14 (DOM Path Domain Layer) Is Not Client-Scoped

**Severity:** HIGH  
**Violated promise:** All artifacts are resolvable from client registration  
**Observed behavior:** `dom_path_domain_layer.json` lives under `docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/` — a docs path, not a client-scoped path. This file is required by both Phase 5 and Phase 8a via `dom_layer_path` in `source_manifest.json`.

**Structural violation:** The DOM layer is a client-specific artifact (it reflects the domain structure of a specific client's codebase) but is stored outside the client directory tree. No convention exists for how new clients should produce or register their `dom_path_domain_layer.json`.

**Gap origin:** BlueEdge DOM layer was produced by a recompute conformance contract that wrote its output to a docs path. This path was then hardcoded into the BlueEdge source_manifest. The pattern was not generalized.

**Impact:** New client onboarding requires a client-specific DOM layer generation contract whose output must be manually registered in source_manifest — outside the orchestrator's awareness.

---

## VIOLATION-06: Source Manifest Schema Is Not Enforced at Registration Time

**Severity:** MEDIUM  
**Violated promise:** Registration contract ensures pipeline readiness  
**Observed behavior:** `PI.LENS.FASTAPI.CLIENT-SOURCE-REGISTRATION.01` produced a `source_manifest.json` missing `dom_layer_path` and `integration_validation_path`. These fields are required by Phases 5 and 8a. The registration contract was not aware of these requirements and produced no validation error.

**Gap origin:** The registration contract was modeled on the visible source_manifest fields without reference to the orchestrator's full field consumption map. No schema validator was applied.

**Impact:** Future client registrations will silently omit required fields, only discovered at Phase 5 or Phase 8a execution. Each omission requires a manual fix outside the registration flow.

---

## VIOLATION-07: Conformance Path Is a STAGE_NOT_AUTOMATED Bypass, Not a First-Class Path

**Severity:** MEDIUM  
**Violated promise:** The orchestrator owns the complete signal and binding pipeline  
**Observed behavior:** BlueEdge reaches Phase 9 via `fastapi_conformance_path` — pre-computed conformance artifacts injected at Phases 5, 6+7, and 8a. This bypasses native signal computation, DOM majority-vote, and grounding state derivation. The conformance path is labeled `STAGE_NOT_AUTOMATED` in the contract.

**Structural consequence:** The orchestrator's production path for BlueEdge is the conformance bypass. This means the orchestrator has never run its native generation path (Phases 5–8a) for BlueEdge end-to-end. The native path is untested at production scale for the reference client.

**Impact:** If conformance artifacts diverge from what native execution would produce, the discrepancy is undetectable within the orchestrator. Semantic validation is the conformance production contract's responsibility, not the orchestrator's.

---

## Violation Summary

| ID | Description | Severity |
|----|-------------|----------|
| VIOLATION-01 | Phases 1–4 validate only; no generation fallback | CRITICAL |
| VIOLATION-02 | 40.x scripts orphaned from orchestrator | HIGH |
| VIOLATION-03 | BE-11 (CEU grounding registry) unvalidated, no generation | HIGH |
| VIOLATION-04 | BE-13 (integration_validation) unvalidated, not in FastAPI registration | HIGH |
| VIOLATION-05 | BE-14 (DOM layer) not client-scoped, no generation path | HIGH |
| VIOLATION-06 | Source manifest schema not enforced at registration | MEDIUM |
| VIOLATION-07 | Conformance path is STAGE_NOT_AUTOMATED bypass for reference client | MEDIUM |

**Total violations:** 7  
**Critical:** 1 | **High:** 4 | **Medium:** 2

---

## Conclusion

The canonical E2E contract promise — *client-agnostic execution from registration* — is violated at seven documented points. The violations are not isolated bugs; they reflect a structural design pattern where the orchestrator was built *after* the reference client's artifacts were already produced, making it a validator of a pre-existing state rather than a generator of a new one.

Closing these violations requires the `UPGRADE_TO_TRUE_ORCHESTRATOR` remediation path defined in `PI.LENS.PIPELINE-CONFORMANCE.FASTAPI.01/conformance_decision.json`.
