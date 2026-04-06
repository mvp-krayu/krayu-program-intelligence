# Evidence Index

**Document:** evidence_index.md
**Stream ID:** PSEE.RECONCILE.1.WP-05
**Status:** CANONICAL
**Layer:** PSEE → PiOS Authority Chain Validation
**Evaluation mode:** DETECT-ONLY — all reads are read-only; no artifact was modified

---

## 1. Purpose

This index records every file read during system inspection for PSEE.RECONCILE.1.WP-05. All evidence is sourced from the current repository state on branch `work/psee-runtime` at HEAD `52d6813`.

No evidence was invented, inferred, or imported from prior conversation context. All findings in `violation_map.md` are traceable to entries in this index.

---

## 2. Authority Chain Documents (Upstream Dependencies)

| File | Stream | Role |
|---|---|---|
| docs/pios/PSEE.RECONCILE.1.WP-01/psee_runtime_authority_contract.md | WP-01 | Authority rules A-01..A-07; ownership matrix |
| docs/pios/PSEE.RECONCILE.1.WP-02/psee_to_pios_handoff_contract.md | WP-02 | Handoff package definition; 7-artifact payload; transition rules |
| docs/pios/PSEE.RECONCILE.1.WP-03/engine_state_lifecycle_spec.md | WP-03 | Engine state lifecycle; DIM state definitions; invariants INV-01..06 |
| docs/pios/PSEE.RECONCILE.1.WP-04/psee_to_pios_validation_gate.md | WP-04 | 8 validation dimensions; mandatory fields; PASS/FAIL/REJECT model |
| docs/pios/PSEE.RECONCILE.1.WP-04/handoff_admissibility_matrix.md | WP-04 | Condition-to-outcome matrix; PASS/FAIL/REJECT distinctions |
| docs/pios/PSEE.RECONCILE.1.WP-04/handoff_violation_classes.md | WP-04 | 8 violation classes with trigger conditions |

---

## 3. PSEE Runtime Scripts

| File | Stream | Assessment |
|---|---|---|
| scripts/pios/runtime/run_psee_pipeline.sh | PSEE-RUNTIME.1 | COMPLIANT — produces pipeline execution artifacts only |
| scripts/pios/runtime/verify_psee_runtime.sh | PSEE-RUNTIME.2 | **VIOLATION** — VIO-WP05-02 (TRACEABILITY_FAILURE) |
| scripts/pios/runtime/validate_operator_sidecars.sh | PSEE-RUNTIME.3A | COMPLIANT — operator sidecar validation only |
| scripts/pios/runtime/execute_phase_transition.sh | PSEE-RUNTIME.4 | COMPLIANT — sole engine_state.json writer |
| scripts/pios/runtime/materialize_coverage_reconstruction.sh | PSEE-RUNTIME.4C | **INDETERMINATE** — VIO-WP05-03 (BLOCKED state not in WP-03) |
| scripts/pios/runtime/compute_coverage.sh | PSEE-RUNTIME.5A | COMPLIANT — governed DIM-01 computation |
| scripts/pios/runtime/materialize_gauge_state.sh | PSEE-RUNTIME.5 | COMPLIANT — produces gauge_state.json with full authority chain |
| scripts/pios/runtime/compute_reconstruction.sh | PSEE-RUNTIME.6A | COMPLIANT — governed DIM-02 validation |
| scripts/pios/runtime/render_gauge_api.sh | PSEE-RUNTIME.GAUGE-V1 | **VIOLATION** — VIO-WP05-01 (AUTHORITY_FAILURE) |
| scripts/pios/runtime/render_gauge_view.sh | PSEE-RUNTIME.GAUGE-V1 | COMPLIANT — reads from gauge_state.json only |
| scripts/pios/runtime/view_gauge_cli.sh | PSEE-RUNTIME.GAUGE-V1 | COMPLIANT — read-only CLI render |
| scripts/pios/runtime/render_gauge_html.sh | PSEE-UI.REFRESH.1 | COMPLIANT — read-only HTML renderer |

---

## 4. Runtime Output Artifacts (run_01)

All files from `docs/pios/PSEE.RUNTIME/run_01/` were inspected.

### 4a. WP-02 Handoff Package Artifacts

| File | Assessment | Key values |
|---|---|---|
| engine_state.json | COMPLIANT | stream: PSEE-RUNTIME.4; execution_status: PHASE_1_ACTIVE; psee_engine_invoked: true; run_id: run_01 |
| gauge_state.json | COMPLIANT | schema_version: 1.0; stream: PSEE-RUNTIME.5; DIM-01: COMPUTED; DIM-02: PASS; score.canonical: 60; full traceability |
| coverage_state.json | COMPLIANT | stream: PSEE-RUNTIME.5A; state: COMPUTED; coverage_percent: 100.0; authority: PSEE-GAUGE.0 DP-5-02 |
| reconstruction_state.json | COMPLIANT | stream: PSEE-RUNTIME.6A; state: PASS; 0 violations; authority: PSEE-GAUGE.0 DP-6-03 |
| gauge_inputs.json | NOT INSPECTED | Not read during this validation pass |
| gauge_view.json | COMPLIANT | stream: PSEE-RUNTIME.5; gauge_state_source: gauge_state.json; rendering_state: PHASE_1_ACTIVE |
| verification.log | COMPLIANT (conditional) | PASS; 12 checks; 0 failures — but scope mismatch with current script (see VIO-WP05-02) |

### 4b. Non-Handoff Runtime Artifacts

| File | Assessment | Notes |
|---|---|---|
| gauge_api_payload.json | **INDETERMINATE** — VIO-WP05-04 | stream: PSEE-RUNTIME.GAUGE-V1; DIM-01: BLOCKED; DIM-02: BLOCKED — stale; contradicts coverage_state.json/reconstruction_state.json |
| operator_inputs.json | NOT INSPECTED | Operator configuration; not score-related |
| operator_contact.json | NOT INSPECTED | Operator contact; not score-related |
| manifest.json | NOT INSPECTED | Pipeline execution manifest |
| execution.log | NOT INSPECTED | Pipeline execution log |
| execution_trace.log | NOT INSPECTED | Execution trace |
| operator_case_view.md | NOT INSPECTED | PSEE-RUNTIME.1 output |
| PSEE-RUNTIME.*_EXECUTION_LOG.md | NOT INSPECTED | Execution logs for individual streams |

---

## 5. Surface Layer Artifacts

| File | Assessment | Notes |
|---|---|---|
| docs/pios/PSEE.UI/run_01_blueedge_surface/gauge_v1_component.html | COMPLIANT | Rendering output; no governed artifact mutation |
| docs/pios/PSEE.UI/run_01_blueedge_surface/gauge_v2_product.html | COMPLIANT | Product surface; hardcoded demo key; no governed artifact mutation |
| docs/pios/PSEE.UI/run_01_blueedge_surface/PSEE-UI.REFRESH.1_EXECUTION_LOG.md | NOT INSPECTED | Surface stream execution log |

---

## 6. Violations-to-Evidence Map

| Violation ID | Evidence files |
|---|---|
| VIO-WP05-01 | scripts/pios/runtime/render_gauge_api.sh (lines 65–73, 77); docs/pios/PSEE.RUNTIME/run_01/gauge_api_payload.json; docs/pios/PSEE.RUNTIME/run_01/coverage_state.json; docs/pios/PSEE.RUNTIME/run_01/gauge_state.json; WP-01 A-01, A-04 |
| VIO-WP05-02 | scripts/pios/runtime/verify_psee_runtime.sh (full); docs/pios/PSEE.RUNTIME/run_01/verification.log; WP-04 §6 Dim-8 |
| VIO-WP05-03 | scripts/pios/runtime/materialize_coverage_reconstruction.sh (lines 98, 115); WP-03 DIM state definitions; WP-04 §6 coverage_state requirement |
| VIO-WP05-04 | docs/pios/PSEE.RUNTIME/run_01/gauge_api_payload.json; docs/pios/PSEE.RUNTIME/run_01/gauge_state.json; WP-02 §3 artifact list |
