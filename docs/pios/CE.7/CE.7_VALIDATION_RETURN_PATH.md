# CE.7 — Validation Return Path

**Stream:** CE.7 — Engine Remediation Planning
**Artifact type:** VALIDATION RETURN PATH (PLANNING)
**Date:** 2026-04-03
**Authority:** CE.7
**Source:** CE.6 compliance reports, CE.7_REMEDIATION_SEQUENCE.md

---

## 1. PURPOSE

This document defines the re-validation sequence required after CE.8 remediation.
It specifies which CE.6 reports must be re-run, which conditions must be satisfied,
and what a future stream must certify before PiOS v0.4 can be evaluated as
executable-proven.

---

## 2. VALIDATION FRAMEWORK

Re-validation after CE.8 remediation follows the same evidence structure as CE.6.
Each CE.6 compliance report must be re-evaluated against the remediated engine.
A re-evaluation that produces no FAIL results in its domain closes that domain.

Re-validation is the responsibility of the CE.8 certification phase or a dedicated CE.9
(or equivalent) certification stream. CE.7 defines the path; it does not execute it.

---

## 3. PHASE-GATED VALIDATION REQUIREMENTS

### PHASE 1 EXIT GATE — CE.4 Emission Validation

**Trigger:** After CE.4 emission remediation is complete (DOMAIN-1).

**Validation required:**

| Check | Method | Pass condition |
|---|---|---|
| INV-004: BLOCKED payload completeness | Inspect SIG-003, SIG-006 in `compute_signals.py` output | `blocking_class` present in all BLOCKED payloads |
| INV-005: PARTIAL partiality_reasons completeness | Inspect SIG-001, SIG-005, SIG-007, SIG-008 output | `partiality_reasons` present with entry per null field |
| §3.3: Prohibited field absence | Inspect SIG-007, SIG-008 output | No `note` field present in any payload |
| INV-006: Traceability coverage | Re-run validation equivalent to run_03_executable | `traceability_coverage: PASS` |
| All invariants | Structured re-run against CE.4 invariant checklist | INV-001 through INV-007: all PASS |

**CE.6 report to re-evaluate:** `CE.6_EMISSION_COMPLIANCE_REPORT.md`
**Pass condition:** All 8 signals COMPLIANT. Zero violations (V-E-001..V-E-008 all closed).

---

### PHASE 2 EXIT GATE — CE.5 Consumption Layer Validation

**Trigger:** After CE.5 consumption layer implementation is complete (DOMAIN-2).

**Validation required:**

| Check | Method | Pass condition |
|---|---|---|
| CSM-1: Vocabulary | Inspect consumption state values in engine output | Only AVAILABLE / PARTIAL / BLOCKED produced |
| CSM-2 / C-001: COMPLETE → AVAILABLE | Trace SIG-002 and SIG-004 through consumption layer | Both produce consumption_state=AVAILABLE |
| PBE-2: Record structure | Inspect consumption record for each signal | All 8 signals produce `{signal_id, origin, consumption_state, output_ref}` |
| C-002: No null substitution | Inspect PARTIAL signal consumption records | Null fields remain null in output_ref |
| C-003: No extraction on BLOCKED | Inspect BLOCKED signal consumption records | No field extraction attempted on SIG-003, SIG-006 |

**CE.6 report to re-evaluate:** `CE.6_CONSUMPTION_COMPLIANCE_REPORT.md`
**Pass condition:** All consumption requirements (CSM-1, CSM-2, C-001..C-003, PBE-2) satisfied. Zero violations.

---

### PHASE 3 EXIT GATE — CE.2 Propagation Vocabulary Validation

**Trigger:** After CE.2 DEC-009/DEC-014 vocabulary alignment is complete (DOMAIN-3).

**Validation required:**

| Check | Method | Pass condition |
|---|---|---|
| DEC-009 tier vocabulary | Inspect condition tier outputs from activate_conditions.py | Only BLOCKED / DEGRADED / AT_RISK / STABLE produced |
| DEC-014 diagnosis mapping | Inspect diagnosis state outputs per condition | BLOCKED→BLOCKED, DEGRADED→ACTIVE, AT_RISK→ACTIVE, STABLE→INACTIVE |
| Legacy vocabulary absence | Scan activate_conditions.py output | `"complete"`, `"partial"`, `"blocked"` (lowercase) not present as tiers |
| CE.5 P-001 propagation record | Inspect propagation records | `{signal_id, origin, consumption_state, output_ref}` propagated |
| CE.5 P-002 vocabulary | Inspect propagation consumption_state values | Values are AVAILABLE / PARTIAL / BLOCKED exclusively |

**CE.6 report to re-evaluate:** `CE.6_PROPAGATION_COMPLIANCE_REPORT.md`
**Pass condition:** All propagation requirements (P-001, P-002, DEC-009, DEC-014) satisfied. Zero violations.

---

### PHASE 4 EXIT GATE — CE.5 Traceability Validation

**Trigger:** After CE.5 traceability record implementation is complete (DOMAIN-4).

**Validation required:**

| Check | Method | Pass condition |
|---|---|---|
| T-001: Type 2 records | Verify structural gap trace record logic exists | Type 2 record produced if any expected signal absent |
| T-002: Type 1 records | Inspect traceability output for CE.2-R01-MIX run | Type 1 record produced for all 8 signals |
| Type 1 record schema | Inspect record fields | `signal_id`, `origin: "CE.4"`, `consumption_state` present |
| Type 2 record schema | Verify Type 2 record structure | `signal_id`, `origin: "CE.4"`, `status: "MISSING"` — no `consumption_state` |
| T-002 completeness | Count records vs Signal Ledger scope | Record count = Signal Ledger scope count |

**CE.6 report to re-evaluate:** `CE.6_TRACEABILITY_COMPLIANCE_REPORT.md`
**Pass condition:** CE.5 T-001 and T-002 satisfied. run_03_executable equivalent produces `traceability_coverage: PASS`.

---

## 4. FULL RE-VALIDATION SEQUENCE

After all four phases are complete, a full certification re-validation must be executed:

| Step | Action | Governing reference |
|---|---|---|
| V-01 | Re-run emission compliance check against all 8 signals | CE.6_EMISSION_COMPLIANCE_REPORT.md criteria |
| V-02 | Re-run consumption compliance check | CE.6_CONSUMPTION_COMPLIANCE_REPORT.md criteria |
| V-03 | Re-run propagation compliance check | CE.6_PROPAGATION_COMPLIANCE_REPORT.md criteria |
| V-04 | Re-run traceability compliance check | CE.6_TRACEABILITY_COMPLIANCE_REPORT.md criteria |
| V-05 | Confirm gap registry closure | CE.6_GAP_REGISTRY.md — all 18 gaps CLOSED |
| V-06 | Re-evaluate executability verdict | CE.6_EXECUTABILITY_VERDICT.md criteria — all 7 EX-criteria must pass |

---

## 5. CONDITIONS FOR PiOS v0.4 EXECUTABLE-PROVEN STATUS

PiOS v0.4 may be evaluated as executable-proven when ALL of the following hold:

| Condition | Source |
|---|---|
| EX-001 PASS: All 8 signals comply with CE.4 INV-001..INV-007 | V-01 |
| EX-002 PASS: CE.5 AVAILABLE/PARTIAL/BLOCKED vocabulary in use | V-02 |
| EX-003 PASS: CE.5 C-001..C-005 applied | V-02 |
| EX-004 PASS: CE.5 consumption records produced | V-02 |
| EX-005 PASS: CE.2 DEC-009 tier vocabulary in use | V-03 |
| EX-006 PASS: CE.2 DEC-014 diagnosis mapping applied | V-03 |
| EX-007 PASS: traceability_coverage PASS in executable validation | V-04 |
| All 18 CE.6 gaps closed with zero regressions | V-05 |

---

## 6. CERTIFICATION STREAM REQUIREMENT

A successful full re-validation (V-01 through V-06 all passing) must be committed to
`pios-governance-baseline-v0.4` by a CE.8 certification phase or dedicated CE.9 stream.

The certification commit must produce:
- Updated `CE.6_EXECUTABILITY_VERDICT.md` (or a CE.8 equivalent) changing the verdict from
  "NOT executable-proven" to "executable-proven"
- Updated `CE.6_GAP_REGISTRY.md` (or CE.8 equivalent) recording all 18 gaps as CLOSED
- A re-validation report (CE.8_VALIDATION_REPORT or equivalent) confirming each V-01..V-06 step

CE.7 does not produce this certification. CE.7 defines the path to it.
