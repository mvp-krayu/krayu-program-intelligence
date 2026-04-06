# Consumption Impact Map

**Document:** impact_map.md
**Stream ID:** PSEE.RECONCILE.1.WP-06
**Status:** CANONICAL
**Layer:** RECONCILIATION / CONSUMPTION IMPACT
**Evaluation mode:** DETECT-ONLY — no remediation, no redesign, no remediation suggestions

---

## 1. Purpose

This document evaluates each WP-05 violation for its potential to propagate into PiOS consumption. For each violation, the analysis determines whether a valid execution path exists by which the violation can influence a PiOS consumer.

All findings are bounded strictly to evidence present in the three allowed input files:
- WP-05 `violation_map.md`
- WP-04 `handoff_admissibility_matrix.md`
- WP-02 `psee_to_pios_handoff_contract.md`

No other repository material was consulted.

---

## 2. Classification Rule

| Impact value | Meaning |
|---|---|
| TRUE | Evidence shows a valid direct or indirect consumption path into PiOS |
| FALSE | Evidence shows no valid consumption path into PiOS |
| INDETERMINATE | Evidence is insufficient to prove TRUE or FALSE within the allowed input set |

---

## 3. Impact Analysis

---

### VIO-WP05-01 — AUTHORITY_FAILURE

**ID:** VIO-WP05-01
**Class:** AUTHORITY_FAILURE
**WP-05 severity:** FAIL
**Affected artifact:** `gauge_api_payload.json` (produced by `render_gauge_api.sh`)

---

**Handoff relevance:** NO

WP-02 §3 defines the exclusive handoff payload as: gauge_state.json, coverage_state.json, reconstruction_state.json, gauge_inputs.json, gauge_view.json, verification.log. `gauge_api_payload.json` does not appear in this list. It is not a WP-02 handoff artifact.

**Consumption path analysis:**

WP-02 §6 defines what PiOS MAY do with an ADMISSIBLE handoff: "Read all artifact fields for intake processing." This clause refers to the artifact set defined in §3 — not all files present in the run directory. `gauge_api_payload.json` is not in the §3 artifact set; therefore §6 does not establish a consumption path for it.

WP-04 admissibility matrix §3 maps gate conditions to outcomes. The gate evaluates the 7-artifact package per WP-04 gate §5 (per WP-05 reference). `gauge_api_payload.json` is not in the gate evaluation scope. The gate has no opinion on it.

WP-02 T-06 states: "All values consumed by PiOS MUST be traceable to a specific PSEE stream." `gauge_api_payload.json` does carry stream = "PSEE-RUNTIME.GAUGE-V1", so T-06 alone does not bar consumption. However, consuming its stale BLOCKED DIM states over the authoritative COMPUTED/PASS states in gauge_state.json would constitute a DIM state override — forbidden by WP-02 §7 ("Override any DIM state | A-04 (WP-01)").

**Indirect path:** `gauge_api_payload.json` coexists in the same run directory as the WP-02 §3 handoff artifacts. If a PiOS consumer reads beyond the defined package (i.e., reads all files from the run directory rather than the §3-enumerated list), it would encounter `gauge_api_payload.json`. This would require the consumer to violate WP-02 §3/§6. No evidence in the allowed inputs confirms or denies whether PiOS reads beyond the defined package.

**Consumption path:** NO direct path. Indirect path possible only through PiOS violation of WP-02 §3/§6. Evidence insufficient to confirm or deny indirect path.

**Impact:** INDETERMINATE

**Evidence:**
- WP-02 §3: handoff payload defined as 6 artifacts; gauge_api_payload.json absent
- WP-02 §6: PiOS consumption rights restricted to admitted handoff package artifacts
- WP-02 §7: override of DIM states is forbidden
- WP-05 VIO-WP05-01: "gauge_api_payload.json is not in the WP-02 handoff package, so the gate is not directly triggered"
- WP-04 admissibility matrix §3: gate evaluation bounded to defined package; no row for gauge_api_payload.json

---

### VIO-WP05-02 — TRACEABILITY_FAILURE

**ID:** VIO-WP05-02
**Class:** TRACEABILITY_FAILURE
**WP-05 severity:** FAIL
**Affected artifact:** `verification.log` (produced by `verify_psee_runtime.sh`)

---

**Handoff relevance:** YES

WP-02 §3 lists `verification.log` as a required handoff artifact with required state "PASS N/0 confirmed | verify_psee_runtime.sh". `verification.log` is explicitly inside the WP-02 handoff package.

**Consumption path analysis:**

WP-02 §8 Mount Preconditions require PiOS to check, before intake begins: "verification.log is present and records PASS N/0" (precondition 6). This is a direct read of a handoff artifact by PiOS during the admissibility verification step.

WP-04 admissibility matrix §4 lists "verification.log PASS with 0 failures" as one of the 12 simultaneous requirements for PASS state. A gate that returns PASS after reading this artifact proceeds to permit PiOS intake.

The violation: `verify_psee_runtime.sh` on disk verifies only pipeline execution artifacts (operator_case_view.md, manifest.json, execution.log). It does NOT verify gauge_state.json content, score component correctness, DIM authority references, or the integrity of the scored artifact chain. Additionally, the current script on disk lacks Check 6 (engine_state/gauge_view consistency) that appears in the run_01 verification.log, indicating script-log provenance divergence.

The produced `verification.log` records PASS with 0 failures. PiOS reads this and concludes full verification passed. PiOS's precondition 6 check (WP-02 §8) passes. The WP-04 gate §6 requirement for verification.log PASS passes.

**Effect:** PiOS proceeds to intake on the basis of a verification.log that confirms only 3 pipeline artifacts and a state consistency check — not the scored artifact chain (gauge_state.json authority references, DIM computation traceability, confidence legitimacy). A consumer relying on verification.log as the integrity certification of the full scored artifact set receives a misleading signal.

**Consumption path:** DIRECT. `verification.log` is a WP-02 §3 handoff artifact. PiOS reads it per WP-02 §8 precondition 6. The TRACEABILITY_FAILURE propagates through verification.log directly into the PiOS admissibility determination, causing a gate and precondition check to pass on incomplete evidence.

**Impact:** TRUE

**Evidence:**
- WP-02 §3: verification.log is a required handoff artifact
- WP-02 §8, precondition 6: PiOS MUST NOT begin intake unless verification.log is present and records PASS N/0 — this check passes on the basis of the incomplete verification.log
- WP-04 admissibility matrix §4, row: "verification.log PASS with 0 failures" — gate PASS requires this; gate returns PASS; PiOS intake permitted
- WP-04 admissibility matrix §3, row: "All 8 dimensions PASS → PASS → YES → YES → Proceed to intake" — verification.log is one of the 12 simultaneous PASS requirements
- WP-05 VIO-WP05-02: "verification scope is limited: gauge_state.json integrity, score component correctness, and DIM authority references are not verified"; "A fresh execution of the current script would produce a different verification.log than the one in run_01"
- WP-02 T-03: "PiOS MUST verify admissibility before consuming any artifact" — PiOS does this check, but the verification.log it relies on does not cover the full scored artifact chain

---

### VIO-WP05-03 — INDETERMINATE (STATE_FAILURE candidate)

**ID:** VIO-WP05-03
**Class:** INDETERMINATE — STATE_FAILURE candidate
**WP-05 severity:** INDETERMINATE
**Affected artifacts:** `coverage_state.json`, `reconstruction_state.json` (when state = BLOCKED)

---

**Handoff relevance:** YES

WP-02 §3 lists both as required handoff artifacts with required states: coverage_state.json state = COMPUTED; reconstruction_state.json state IN {PASS, PARTIAL, FAIL}. Both are inside the WP-02 handoff package.

**Consumption path analysis:**

The violation is that BLOCKED DIM states are not defined in WP-03 governance, creating a documentation gap. BLOCKED artifacts have required state values that do not satisfy WP-02 §3 or WP-02 §4 admissibility criteria.

WP-02 §4 NON-ADMISSIBLE conditions include: "Any required field is null where a non-null value is required." BLOCKED coverage_state.json fails the condition `coverage_state.json.state = COMPUTED` in WP-04 admissibility matrix §4.

WP-04 admissibility matrix §3: "Any dimension fails (package evaluable) → FAIL → NO → NO → Return to PSEE for correction." A BLOCKED coverage_state.json would trigger STATE_FAILURE (WP-04 handoff_violation_classes.md §3 from WP-05 context) → FAIL → NON-ADMISSIBLE.

WP-04 admissibility matrix §2: FAIL outcome → "NON-ADMISSIBLE → PiOS consumption FORBIDDEN → Package returned to PSEE; violation logged."

WP-02 §4: "NON-ADMISSIBLE handoffs MUST NOT be consumed by PiOS under any condition."

**Gate as barrier:** The WP-04 gate explicitly evaluates coverage_state.json.state against the required value COMPUTED. A package containing BLOCKED artifacts fails this check → gate returns FAIL or REJECT → NON-ADMISSIBLE → PiOS intake forbidden. This is the barrier.

**Path to PiOS under existing gate:** No valid execution path exists. BLOCKED artifacts cannot pass the WP-04 gate. WP-04 admissibility matrix §7 states: "A FAIL or REJECT outcome for a given package state is permanent for that state. The same package in the same state MUST NOT be re-evaluated in expectation of a different outcome."

**Consumption path:** NONE within the defined gate enforcement. BLOCKED artifacts are rejected at the gate. The gate's explicit coverage_state.json.state = COMPUTED requirement is a direct barrier.

**Impact:** FALSE

**Evidence:**
- WP-02 §3: coverage_state.json required state = COMPUTED; BLOCKED is not COMPUTED → condition unmet
- WP-02 §4 NON-ADMISSIBLE: "coverage_state.json.state = COMPUTED" is an ADMISSIBLE condition; failure → NON-ADMISSIBLE → consumption FORBIDDEN
- WP-04 admissibility matrix §4: "coverage_state.json.state = COMPUTED" required for PASS; BLOCKED fails this
- WP-04 admissibility matrix §2: FAIL outcome → PiOS consumption FORBIDDEN
- WP-04 admissibility matrix §3: "Any dimension fails (package evaluable) → FAIL → NO → NO → Return to PSEE for correction"
- WP-05 VIO-WP05-03: "If a BLOCKED package were submitted to the WP-04 gate, it would correctly trigger STATE_FAILURE and be rejected. No evidence in the repository shows a BLOCKED package was ever submitted to the gate."

---

### VIO-WP05-04 — INDETERMINATE (BOUNDARY_CONTAMINATION candidate)

**ID:** VIO-WP05-04
**Class:** INDETERMINATE — BOUNDARY_CONTAMINATION candidate
**WP-05 severity:** INDETERMINATE
**Affected artifact:** `gauge_api_payload.json` (not a handoff artifact; stale BLOCKED DIM states)

---

**Handoff relevance:** NO

WP-02 §3 handoff payload does not include `gauge_api_payload.json`. This artifact is outside the defined handoff package.

**Consumption path analysis:**

This finding overlaps with VIO-WP05-01 on the question of whether `gauge_api_payload.json` can reach PiOS. The distinction is in classification basis: VIO-WP05-04 addresses the co-location risk (stale artifact in the same directory as handoff artifacts, sharing run_id), not the authority bypass in the producing script.

WP-02 §3 defines the exclusive handoff payload. The co-location of a non-handoff artifact in the run directory does not extend PiOS's consumption rights. WP-02 §6 restricts PiOS to the defined package.

WP-02 T-06: "All values consumed by PiOS MUST be traceable to a specific PSEE stream." This requirement is permissive in the sense that `gauge_api_payload.json` does carry a PSEE stream origin. However, the exclusive consumption boundary in WP-02 §3 takes precedence.

**Indirect path:** If PiOS reads the full run directory (instead of the §3-enumerated list), it would encounter `gauge_api_payload.json` with run_id = "run_01" matching the handoff package run_id. A consumer that treats run_id as the only discriminator would be unable to distinguish it from handoff artifacts without schema-level filtering. No evidence in the allowed inputs addresses whether PiOS implements such filtering or reads the full directory.

**Consumption path:** NO direct path per WP-02 §3. Indirect path cannot be confirmed or denied from the allowed inputs.

**Impact:** INDETERMINATE

**Evidence:**
- WP-02 §3: gauge_api_payload.json not in defined payload; no consumption right exists by definition
- WP-02 §6: PiOS consumption restricted to admitted handoff package
- WP-02 T-06: PSEE stream provenance present in gauge_api_payload.json — does not establish consumption right but is not a disqualifier
- WP-04 admissibility matrix: gate scope bounded to 7-artifact package; gauge_api_payload.json outside gate scope
- WP-05 VIO-WP05-04: "No evidence shows a PiOS consumer has read gauge_api_payload.json as authoritative"; "The risk is latent, not confirmed"

---

## 4. Impact Summary Table

| ID | Class | Handoff artifact | Direct path | Impact |
|---|---|---|---|---|
| VIO-WP05-01 | AUTHORITY_FAILURE | NO | NO — indirect only; unconfirmed | INDETERMINATE |
| VIO-WP05-02 | TRACEABILITY_FAILURE | YES | YES — verification.log read by PiOS per WP-02 §8.6 | TRUE |
| VIO-WP05-03 | INDETERMINATE (STATE_FAILURE) | YES | NO — gate rejects BLOCKED per WP-04 mat. §3 | FALSE |
| VIO-WP05-04 | INDETERMINATE (BOUNDARY_CONT.) | NO | NO — indirect only; unconfirmed | INDETERMINATE |

**TRUE:** 1 (VIO-WP05-02)
**FALSE:** 1 (VIO-WP05-03)
**INDETERMINATE:** 2 (VIO-WP05-01, VIO-WP05-04)

---

## 5. Deterministic Conclusion

One violation has a confirmed consumption path into PiOS: **VIO-WP05-02 (TRACEABILITY_FAILURE)**.

The verification.log is a WP-02 §3 handoff artifact. PiOS reads it as a mandatory precondition before intake (WP-02 §8.6). The verification.log records PASS but covers only pipeline execution artifacts — not the scored artifact chain. PiOS's admissibility determination proceeds on the basis of an incomplete verification. The TRACEABILITY_FAILURE propagates directly through the verification.log artifact into PiOS intake authorization.

No other violation has a confirmed direct consumption path:
- VIO-WP05-01: gauge_api_payload.json is not in the WP-02 handoff package; no direct path
- VIO-WP05-03: BLOCKED artifacts are rejected by the gate before reaching PiOS
- VIO-WP05-04: gauge_api_payload.json is not in the WP-02 handoff package; no direct path

Two violations (VIO-WP05-01, VIO-WP05-04) have unresolved indirect risk through potential PiOS directory reads beyond the defined package. This risk cannot be classified as TRUE or FALSE from the allowed input set alone.
