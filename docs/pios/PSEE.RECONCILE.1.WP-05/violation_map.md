# System Violation Map

**Document:** violation_map.md
**Stream ID:** PSEE.RECONCILE.1.WP-05
**Status:** CANONICAL
**Layer:** PSEE → PiOS Authority Chain Validation
**Evaluation mode:** DETECT-ONLY — no remediation, no reprocessing, no mutation

---

## 1. Purpose

This document maps all authority-chain violations detected during system inspection against the WP-01 → WP-04 governance contracts. Inspection covered all PSEE runtime scripts, runtime output artifacts, and surface layers present in the repository.

Violation classification follows WP-04 violation classes. Where evidence is insufficient to classify, the finding is recorded as INDETERMINATE.

---

## 2. Inspection Scope

| Layer | Files inspected |
|---|---|
| PSEE runtime scripts | scripts/pios/runtime/*.sh (12 scripts) |
| Runtime output artifacts | docs/pios/PSEE.RUNTIME/run_01/ (all files) |
| Surface layer | docs/pios/PSEE.UI/run_01_blueedge_surface/ |
| Governance contracts | docs/pios/PSEE.RECONCILE.1.WP-01/ through WP-04/ |

---

## 3. Violation Inventory

### Finding 1 — AUTHORITY_FAILURE

**ID:** VIO-WP05-01
**Class:** AUTHORITY_FAILURE
**Severity:** FAIL
**Location:** `scripts/pios/runtime/render_gauge_api.sh` — PSEE-RUNTIME.GAUGE-V1

**Description:**
`render_gauge_api.sh` reads DIM-01 and DIM-02 states directly from `coverage_state.json` and `reconstruction_state.json` (lines 65–73), not from `gauge_state.json`. Per WP-01 Rule A-01 and A-04, `gauge_state.json` is the sole authority for all score-related state — including DIM states — after PSEE production.

**Evidence:**
- `render_gauge_api.sh` line 65: `COV_STATE="$(jq -r '.state' "$COV_FILE")"` — reads from coverage_state.json
- `render_gauge_api.sh` line 70: `REC_STATE="$(jq -r '.state' "$REC_FILE")"` — reads from reconstruction_state.json
- `gauge_state.json` (run_01) contains authoritative DIM-01 state: `"state": "COMPUTED"` and DIM-02 state: `"state": "PASS"` (lines 12, 24)
- `gauge_api_payload.json` (run_01) records: `coverage.state = "BLOCKED"`, `reconstruction.state = "BLOCKED"` — in direct contradiction with the corresponding authoritative values in `gauge_state.json` and in `coverage_state.json` at the time of gate evaluation

**Contradiction confirmed:**
- `docs/pios/PSEE.RUNTIME/run_01/gauge_api_payload.json` — DIM-01: BLOCKED, DIM-02: BLOCKED
- `docs/pios/PSEE.RUNTIME/run_01/coverage_state.json` — state: COMPUTED
- `docs/pios/PSEE.RUNTIME/run_01/reconstruction_state.json` — state: PASS
- `docs/pios/PSEE.RUNTIME/run_01/gauge_state.json` — DIM-01 state: COMPUTED, DIM-02 state: PASS

`render_gauge_api.sh` was invoked at PSEE-RUNTIME.4C phase, when coverage_state.json still held BLOCKED. It was not re-invoked after PSEE-RUNTIME.5A updated coverage_state.json to COMPUTED. The result is a stale artifact whose DIM states contradict the authority aggregate.

**WP-01 violation:** Rule A-01 — gauge_state.json is the sole score authority. Rule A-04 — DIM states must be read from gauge_state.json, not from source artifacts, after production.

**Gate consequence:** If gauge_api_payload.json were treated as a handoff artifact, the contradiction between its BLOCKED DIM states and gauge_state.json would trigger STRUCTURE_FAILURE (inconsistent run state across artifacts). gauge_api_payload.json is not in the WP-02 handoff package, so the gate is not directly triggered. However, the authority bypass and stale artifact are governance violations under WP-01.

---

### Finding 2 — TRACEABILITY_FAILURE

**ID:** VIO-WP05-02
**Class:** TRACEABILITY_FAILURE
**Severity:** FAIL
**Location:** `scripts/pios/runtime/verify_psee_runtime.sh` — PSEE-RUNTIME.2

**Description:**
`verify_psee_runtime.sh` (current script on disk) verifies only 5 check groups covering pipeline execution artifacts: `operator_case_view.md`, `manifest.json`, `execution.log`, pipeline forbidden-path compliance, and output namespace compliance. The script does NOT verify `gauge_state.json`, `coverage_state.json`, `reconstruction_state.json`, or `gauge_inputs.json` — the core scored artifacts of the PSEE handoff package.

The `verification.log` produced from run_01 records 12 PASS checks and includes a Check 6 (engine_state.json / gauge_view.json state consistency) that is absent from the current script on disk. This indicates the current script has diverged from the version that produced run_01's verification.log.

**Evidence:**
- `scripts/pios/runtime/verify_psee_runtime.sh` — 5 check sections, no verification of gauge_state.json or DIM artifacts
- `docs/pios/PSEE.RUNTIME/run_01/verification.log` — 12 PASS items, includes Check 6: "State consistent: engine_state=PHASE_1_ACTIVE / gauge_view rendering_state=PHASE_1_ACTIVE"
- Check 6 not present in current script on disk — script-log provenance divergence

**WP-04 violation:** Gate §6 requires `verification.log` to record PASS with zero failures — this requirement is met by run_01's verification.log (0 failures, 12 PASS). However, the verification scope is limited: gauge_state.json integrity, score component correctness, and DIM authority references are not verified. A fresh execution of the current script would produce a different verification.log than the one in run_01.

**WP-04 violation:** Gate Dim-8 (Governance Traceability) — verification.log does not verify the traceability chain for score components or authority references in gauge_state.json.

---

### Finding 3 — INDETERMINATE

**ID:** VIO-WP05-03
**Class:** INDETERMINATE — STATE_FAILURE candidate
**Severity:** INDETERMINATE
**Location:** `scripts/pios/runtime/materialize_coverage_reconstruction.sh` — PSEE-RUNTIME.4C

**Description:**
`materialize_coverage_reconstruction.sh` produces `coverage_state.json` and `reconstruction_state.json` with `state = "BLOCKED"` when the execution phase has not satisfied the DIM availability phase gates. The BLOCKED state is declared as "authoritative — not a stub" in the script header.

BLOCKED is not defined in WP-03 §6 as a valid DIM state. WP-04 gate §6 requires `coverage_state.json.state = "COMPUTED"` and `reconstruction_state.json.state` IN `{PASS, PARTIAL, FAIL}`. BLOCKED satisfies neither requirement.

**Evidence:**
- `materialize_coverage_reconstruction.sh` line 98: `DIM01_STATE="BLOCKED"`, line 115: `DIM02_STATE="BLOCKED"`
- Script header: "value = null, state = BLOCKED (authoritative — not a stub)"
- `docs/pios/PSEE.RUNTIME/run_01/gauge_api_payload.json` confirms BLOCKED was materialized in run_01
- WP-03 lifecycle spec: DIM state values COMPUTED/PASS/PARTIAL/FAIL — BLOCKED not listed
- WP-04 gate §6: `coverage_state.json.state` must be COMPUTED; `reconstruction_state.json.state` must be IN {PASS, PARTIAL, FAIL}

**Reason for INDETERMINATE:**
The BLOCKED state is a phase-gate guard: it prevents handoff when DIM computation has not yet occurred. If a BLOCKED package were submitted to the WP-04 gate, it would correctly trigger STATE_FAILURE and be rejected. No evidence in the repository shows a BLOCKED package was ever submitted to the gate. The design intent (prevent handoff) is consistent with governance requirements; the documentation gap (BLOCKED not in WP-03 DIM state vocabulary) is the governance failure, not the runtime behavior.

**Governance gap confirmed:** WP-03 does not define BLOCKED as an authorized DIM state. This is a documentation deficit in the authority chain. A full STATE_FAILURE classification would require evidence of a BLOCKED package being submitted to or bypassing the gate.

---

### Finding 4 — INDETERMINATE

**ID:** VIO-WP05-04
**Class:** INDETERMINATE — BOUNDARY_CONTAMINATION candidate
**Severity:** INDETERMINATE
**Location:** `docs/pios/PSEE.RUNTIME/run_01/gauge_api_payload.json`

**Description:**
`gauge_api_payload.json` is not a WP-02 handoff artifact. It is produced by `render_gauge_api.sh` (PSEE-RUNTIME.GAUGE-V1) as a phase-aware rendering output. It is stored in the same runtime directory as the seven WP-02 handoff artifacts.

`gauge_api_payload.json` contains stale BLOCKED DIM states that contradict the authoritative COMPUTED/PASS states in `gauge_state.json`, `coverage_state.json`, and `reconstruction_state.json` in the same run. This creates an ambiguity risk: a consumer reading from the run directory cannot determine from artifact names alone which files are governed handoff artifacts and which are rendering outputs.

**Evidence:**
- `docs/pios/PSEE.RUNTIME/run_01/gauge_api_payload.json` — stream: "PSEE-RUNTIME.GAUGE-V1"; DIM states: BLOCKED
- `docs/pios/PSEE.RUNTIME/run_01/gauge_state.json` — stream: "PSEE-RUNTIME.5"; DIM states: COMPUTED/PASS
- Both files share `run_id = "run_01"` and coexist in the same directory

**Reason for INDETERMINATE:**
No evidence shows a PiOS consumer has read gauge_api_payload.json as authoritative. gauge_api_payload.json is not in the WP-02 handoff package definition. The risk is latent, not confirmed. BOUNDARY_CONTAMINATION requires that a non-PSEE system has actually written to or influenced a governed artifact — not that a stale non-handoff artifact is present in the runtime directory.

---

## 4. Violation Summary Table

| ID | Class | Severity | Location | WP-01/WP-04 rule |
|---|---|---|---|---|
| VIO-WP05-01 | AUTHORITY_FAILURE | FAIL | render_gauge_api.sh | WP-01 A-01, A-04; WP-04 Dim-1 |
| VIO-WP05-02 | TRACEABILITY_FAILURE | FAIL | verify_psee_runtime.sh | WP-04 §6 Dim-8 |
| VIO-WP05-03 | INDETERMINATE | INDETERMINATE | materialize_coverage_reconstruction.sh | WP-03 DIM state vocabulary; WP-04 §6 |
| VIO-WP05-04 | INDETERMINATE | INDETERMINATE | gauge_api_payload.json (run_01) | WP-04 Dim-6 (latent) |

---

## 5. Compliant Components

The following components are consistent with WP-01 through WP-04 authority requirements:

| Component | Stream | Assessment |
|---|---|---|
| execute_phase_transition.sh | PSEE-RUNTIME.4 | COMPLIANT — sole engine_state.json writer; correct stream reference |
| materialize_gauge_state.sh | PSEE-RUNTIME.5 | COMPLIANT — reads from governed source artifacts; writes gauge_state.json with full authority chain; schema_version present |
| render_gauge_view.sh | PSEE-RUNTIME.GAUGE-V1 | COMPLIANT — reads gauge_state.json (ENGINE_FED path); does not recompute |
| compute_coverage.sh | PSEE-RUNTIME.5A | COMPLIANT — reads from IG.RUNTIME governed inputs; writes coverage_state.json with PSEE-GAUGE.0 authority |
| compute_reconstruction.sh | PSEE-RUNTIME.6A | COMPLIANT — validates against IG.RUNTIME governed inputs; writes reconstruction_state.json with PSEE-GAUGE.0 authority |
| validate_operator_sidecars.sh | PSEE-RUNTIME.3A | COMPLIANT — read-only validation of operator sidecar fields; no score influence |
| view_gauge_cli.sh | PSEE-RUNTIME.GAUGE-V1 | COMPLIANT — read-only rendering from gauge_api_payload.json; no authority claims |
| run_psee_pipeline.sh | PSEE-RUNTIME.1 | COMPLIANT — produces operator_case_view.md, execution.log, manifest.json; reads only from PSEE.RUNTIME namespace |
| gauge_state.json (run_01) | PSEE-RUNTIME.5 | COMPLIANT — schema_version present; full traceability and authority chain; all required fields present |
| engine_state.json (run_01) | PSEE-RUNTIME.4 | COMPLIANT — stream, run_id, execution_status, psee_engine_invoked all correct |
| coverage_state.json (run_01) | PSEE-RUNTIME.5A | COMPLIANT — state: COMPUTED; authority: PSEE-GAUGE.0 DP-5-02 |
| reconstruction_state.json (run_01) | PSEE-RUNTIME.6A | COMPLIANT — state: PASS; authority: PSEE-GAUGE.0 DP-6-03 |
| gauge_view.json (run_01) | PSEE-RUNTIME.5 | COMPLIANT — reads from gauge_state.json and engine_state.json; correct stream reference |
| docs/pios/PSEE.UI/ surface files | PSEE-UI | COMPLIANT — rendering surfaces only; no governed artifact mutation |

---

## 6. Deterministic Conclusion

**Active violations:** 2 (VIO-WP05-01, VIO-WP05-02)
**Indeterminate findings:** 2 (VIO-WP05-03, VIO-WP05-04)

The run_01 handoff package (engine_state.json, gauge_state.json, coverage_state.json, reconstruction_state.json, gauge_inputs.json, gauge_view.json, verification.log) does not itself contain AUTHORITY_FAILURE or TRACEABILITY_FAILURE artifacts. The violations are:
- A rendering utility (render_gauge_api.sh) that bypasses the authority aggregate and produces a stale non-handoff artifact with contradictory state
- A verification script (verify_psee_runtime.sh) whose scope covers pipeline execution artifacts but not the full handoff package scored artifacts, with a documented script-log divergence

The handoff package for run_01 as currently committed would pass the WP-04 gate checks for the 7 required artifacts. The violations identified (VIO-WP05-01, VIO-WP05-02) are systemic governance deficiencies in the runtime toolchain, not artifact-level defects in the specific committed run_01 package.

Correction path per WP-04 violation class rules:
- VIO-WP05-01: render_gauge_api.sh must read DIM states from gauge_state.json, not from source artifacts, when gauge_state.json has been produced
- VIO-WP05-02: verify_psee_runtime.sh must be updated to include verification of gauge_state.json, coverage_state.json, reconstruction_state.json integrity; script must match the version that produced the committed verification.log
- VIO-WP05-03 / VIO-WP05-04: WP-03 must be updated to define BLOCKED as an authorized DIM state with explicit phase-gate semantics; gauge_api_payload.json should be clearly distinguished from handoff artifacts

**System admissibility verdict:** QUALIFIED — run_01 handoff package is materially compliant for gate evaluation; systemic toolchain violations are present and require correction.
