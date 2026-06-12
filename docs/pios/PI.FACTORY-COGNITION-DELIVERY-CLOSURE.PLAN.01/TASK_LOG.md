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

---

## Task #1a — Integration validation producer (VR-08/VR-09) — ⚠️ WIRING DONE; vault blocked on a real finding

**Classification of `integration_validation.json` (before patching):**
1. Contains: deterministic cross-artifact consistency assertion (`validation_status` PASS/PARTIAL/FAIL + 12 internal checks IV-01..IV-12) over the run's own outputs.
2. Consumed by: VR-08 (existence) + VR-09 (`validation_status==PASS`) in Phase 8b; label-only proxy in 8a admissibility_log.
3. Created by: `integration_validation_generator.py` (PI.LENS.INTEGRATION-VALIDATION.GENERATOR.01) — existed, **never wired as an orchestrator phase**.
4. Genuine S1 vault requirement: YES — live cross-artifact integrity gate.
5. Historical: producer was run as a separate step historically; requirement is current.
6. Obsolete: NO.
7. Validates something already present: partially (re-reads VR-01..07 artifacts) but adds real cross-consistency assertions.

**Smallest correction applied:** wired the existing generator as **Phase 7i — Integration Validation** (before 8a). No gate weakened. `_resolve_artifact` prefers the run-owned file (RUN_GENERATED), so it's consumed correctly.

**Result (fresh run `run_netbox_factory_cert_07`):** Phase 7i PASS; Phase 8b improved 2 fails → **1 fail**. VR-08 now PASS. **VR-09 still FAIL — but for an HONEST reason:** the generator returned `validation_status: PARTIAL` because two *internal* checks genuinely fail:
- **IV-09 node_count_consistency** — `structural_node_inventory`=2540 vs `dom_layer.total_nodes`=0.
- **IV-11 dom_node_coverage** — 2540 structural nodes have no DOM domain assignment.

**Confirmed root (cert_07 `dom/dom_layer.json`):** 10 domain groups, but `total_nodes: 0`, no `node_to_domain_map`, 0 included nodes. `derivation_basis: RECONCILIATION_CEU_DOMAIN_SYNTHESIS` (empty CEU-synth fallback). **None of the 2540 structural nodes are assigned to a domain.** This is a real domain-cognition gap, correctly surfaced by the integrity gate — not a wiring or check bug.

**Therefore vault closure cannot complete by wiring alone.** Forcing VR-09 to accept PARTIAL would be weakening governance (boundary #6) over a hollow artifact. This is a genuine fork for the operator:

- **Path A — Fix DOM node coverage (upstream).** Make DOM synthesis assign the 2540 structural nodes to the 10 domain groups (populate `node_to_domain_map` / `included_nodes`). Then IV-09/IV-11 genuinely PASS → `validation_status: PASS` → VR-09 PASS → vault closes legitimately. Scope: DOM/domain-cognition layer (likely the same run-owns-outputs class as task #1: the DOM phase reads the manifest's stale `dom_layer_path` and falls back to the empty synth). **Recommended** — an empty DOM layer means hollow domain cognition; declaring vault "complete" over it would ship a deliverable with no domain→node mapping.
- **Path B — S1 accepts PARTIAL as honest bounded result (governance policy).** S1 vault readiness accepts `validation_status: PARTIAL` *with the DOM-coverage gap recorded* (not hidden), reserving PASS for full coverage. Honest qualification, but a governance-policy decision the operator owns.

**Status:** STOPPED for reassessment. Phase 7i committed (legitimate progress: it surfaced the real finding). Did not force-pass.
**Pipeline reach now:** Phases 0L→8a PASS (17 phases incl. 7i), fail-closed at 8b on a genuine DOM-coverage finding.
