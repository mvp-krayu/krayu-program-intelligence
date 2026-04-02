# CE.2 — Validation Status

**Stream:** CE.2 — PiOS Core v0.2 Boundary Definition
**Status:** CLOSED — VALIDATED BASELINE
**Date:** 2026-04-02

---

## CE.2 STATUS: CLOSED — VALIDATED BASELINE

This stream is no longer in definition or proof phase.
It is the active PiOS v0.2 activation architecture.

The CE.2 decision ledger (DEC-001 through DEC-014), proof run (CE.2-R01-MIX-v02),
and QA.1-v02 rerun collectively constitute the validated baseline. No further
governed change events are open under CE.2.

---

## VALIDATION EVENTS (CHRONOLOGICAL)

---

### 1. QA.1 — Original Boundary-Defining Fail

**Role:** Established the architectural boundary CE.2 was designed to address.
**Engine:** PiOS v0.1
**Run:** CE.2-R01-MIX
**Artifact:** `runs/pios/ce2/qa1_boundary_confirmation_report.md`

**Finding:** Signal perturbation (SIG-002: 0.682→0.773, SIG-005: 1.125→0.643)
produced no condition state change under v0.1. Root cause: `activate_cond_*`
functions hardcode `condition_coverage_state`; signal values are not evaluated.
Result: 40.9 = 8 NO_CHANGE, 40.10 = 8 NO_ACTION.

**Status:** PRESERVED — authoritative boundary record. Not modified by CE.2.

---

### 2. CE.2 Phase 5 — Proof Run

**Role:** Targeted proof that CE.2 activation model produces signal-reactive
condition state and propagates through the full chain.
**Engine:** PiOS v0.2 (CE.2, DEC-001 through DEC-014)
**Run:** CE.2-R01-MIX-v02
**Artifact:** `runs/pios/40.6/CE.2-R01-MIX-v02/` through `runs/pios/40.10/CE.2-R01-MIX-v02/`
**Script:** `scripts/ce2_proof_run.py`

**Result:** PASS
- 8/8 conditions: state changed from v0.1 vocabulary to CE.2 tier vocabulary
- 5 STATE_CHANGE events at 40.9
- 5 REVIEW_REQUIRED directives at 40.10
- Full signal → binding rule → tier → condition → diagnosis → control trace demonstrated

---

### 3. Scorecard: v0.1-Aligned (`ce2_scorecard_v01_aligned.sh CE.2-R01-MIX`)

**Role:** Confirms v0.1 boundary against v0.1 engine semantics. Documents the
invariance that CE.2 was built to replace.
**Result:** FAIL / SCORECARD STATUS: VALID

**Interpretation:** SYSTEM FAIL means activation assertions 5–8 fail in actual
v0.1 engine outputs. SCORECARD VALID means the schema correctly mapped v0.1
artifacts. This FAIL is the expected result — it is evidence for the boundary,
not evidence of a regression.

**Artifact:** `runs/pios/ce2/qa1_v02/scorecard_v01_aligned.txt`

---

### 4. Scorecard: CE.2-Native (`ce2_scorecard.sh CE.2-R01-MIX-v02`)

**Classification:** NON-AUTHORITATIVE
**Role:** CE.2-native evaluation under new emitted tier semantics.
**Result:** FAIL (structural gap — NOT activation model failure)

**Interpretation:** `ce2_scorecard.sh` was written before the Phase 5 proof run
artifact schema was finalized. It reads artifact paths and field names that do
not match the proof run output:
- 40.9: checks `.changes[].type` → artifact uses `.signals[].classification`
- 40.10: checks `.directives[].type` → artifact uses `.directives[].directive_type`
- 40.7: checks `.diagnoses` array → artifact uses `.intelligence` dict
- 40.6: checks `.diagnoses[].state_transition` → artifact uses `.conditions` dict
- 40.8: checks `delivery_output_packet.json` → file is `delivery_packet.json`
- 40.5/40.11: no v02 artifacts (signals sourced from CE.2-R01-MIX; 40.11 not in proof run scope)

The underlying activation model results are validated by the Phase 5 proof run
(Event 2 above), not by this scorecard. The scorecard schema gap is a known
structural artifact — it does not invalidate CE.2 activation evidence.

**Artifact:** `runs/pios/ce2/qa1_v02/scorecard_ce2_native.txt`

---

### 5. QA.1-v02 — Formal Rerun Against PiOS v0.2

**Role:** Formal confirmation that CE.2 resolves the original QA.1 invariance boundary.
**Engine:** PiOS v0.2 (CE.2, DEC-001 through DEC-014)
**Run:** CE.2-R01-MIX-v02
**Artifact:** `runs/pios/ce2/qa1_v02/qa1_v02_rerun_result.md`

**Result:** PASS
- QA.1 question answered YES under CE.2: signal perturbation causes condition state change
- 5 STATE_CHANGE / 5 REVIEW_REQUIRED confirm activation chain is reachable
- Original boundary is resolved

---

## SUMMARY TABLE

| Event | Role | Engine | Outcome |
|---|---|---|---|
| QA.1 (original) | Boundary-defining fail | PiOS v0.1 | FAIL (expected) |
| CE.2 Phase 5 proof run | Activation model proof | PiOS v0.2 | PASS |
| v0.1-aligned scorecard | v0.1 invariance confirmation | PiOS v0.1 | FAIL / VALID (expected) |
| CE.2-native scorecard | CE.2 activation check | PiOS v0.2 | FAIL (structural gap in scorecard schema) |
| QA.1-v02 | Formal boundary resolution | PiOS v0.2 | PASS |

---

## CURRENT STATE

CE.2 validation is complete. The original architectural boundary (v0.1 hardcoded
condition state activation) is documented, bounded, and resolved.

PiOS v0.2 remains the active version.
QA.2-v02 through QA.4-v02 are pending — see `docs/pios/CE.2/QA_CAMPAIGN_MAP.md`.

The CE.2-native scorecard schema gap is noted. Alignment between `ce2_scorecard.sh`
and the CE.2-R01-MIX-v02 artifact schema is a future normalization task if the
scorecard is to serve as an automated gate.

---

## REFERENCES

- Decision ledger: `docs/pios/CE.2/traceability/ce2_decision_ledger.md`
- QA campaign map: `docs/pios/CE.2/QA_CAMPAIGN_MAP.md`
- Proof run script: `scripts/ce2_proof_run.py`
- QA.1-v02 artifacts: `runs/pios/ce2/qa1_v02/`
