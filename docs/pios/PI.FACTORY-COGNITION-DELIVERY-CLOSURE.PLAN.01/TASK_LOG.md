# Closure Plan — Task Execution Log

**Artifact:** PI.FACTORY-COGNITION-DELIVERY-CLOSURE.PLAN.01 / TASK_LOG
**Status:** IN PROGRESS — one critical-path item at a time, verify + reassess between.

---

## Task #1 — Wire vault grounding-input (run owns its outputs) — ✅ COMPLETE & VERIFIED

**Change:** `scripts/pios/run_client_pipeline.py` `phase_08a_vault` now prefers the current run's own `ceu/grounding_state_v3.json` + `dom/dom_layer.json`, falling back to the manifest only if absent. Fixes cross-run leakage where `source_manifest` hardcoded the prior run (`run_github_netbox_20260520_134600`) — the same defect class as the original SOURCE_REPO bug. The stale-path `load_json` throw (the 2ms Phase-8a fail) is eliminated; structural-only skip now triggers only when THIS run genuinely has no grounding.

**Verification (fresh run `run_netbox_factory_cert_06`):**
- ✅ Vault initializes — 10 artifacts: `coverage_state`, `reconstruction_state`, `gauge_state`, `canonical_topology`, `signal_registry`, `binding_envelope`, `admissibility_log`, `evidence_trace`, `vault_manifest`, `vault_readiness`. Phase 8a = **PASS** (was FAIL in cert_05).
- ✅ SQO S0 appears — `sqo/promotion_state.json`: `s_level: S0`, `current_state: S0`, `qualification_provenance: PIPELINE_GENESIS`, `promotion_eligible: true`. (The S0 init lives in `phase_08a §10`; unblocking 8a unblocked it.)
- ✅ Downstream unlocked — cert_06 now has a `sqo/` dir (cert_05 had none); the pipeline advanced from fail-closing at **8a** to reaching **8b**.

**Newly-exposed gate (for reassessment — NOT part of task #1):**
Phase 8b — Vault Readiness fails 2 of 9 checks:
- VR-01..VR-07 PASS (intake, structure 40.2/40.3/40.4, ceu grounding, dom, binding) — all run-owned.
- **VR-08 + VR-09 FAIL — both require `integration/integration_validation.json`**, which no orchestrator phase produces for a fresh run (`reason: FILE_NOT_FOUND`).

This is the next gate. It was not on the original critical-path list (it is a sub-gate of vault that task #1 revealed). Classification: **B (unfinished integration)** — an integration-validation artifact that historical runs had (the manifest's `integration_validation_path` pointed at the old run) but the fresh orchestrator never generates.

**Reassessment question for the operator:** fold the `integration_validation.json` producer into task #1's vault closure (it is the immediate blocker on the same stage), or treat it as the next discrete item before continuing to original task #2 (`reconciliation_state.json` for SPE)?

**Pipeline reach now:** Phases 0L→8a PASS (16 phases), fail-closed at 8b. Vault + SQO S0 reached; vault readiness blocked on one missing artifact.
