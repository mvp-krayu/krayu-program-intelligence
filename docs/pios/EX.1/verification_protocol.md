# EX.1 — Verification Protocol

**Stream:** EX.1 — Runtime Binding & Verification
**Artifact type:** VERIFICATION PROTOCOL
**Date:** 2026-04-03
**Authority:** EX.1

---

## 1. PURPOSE

This document defines the verification protocol that establishes programmatic compliance
validation for the PiOS v0.4 engine, per EX.H1 RB-006/RB-007. It records the baseline
verification run executed in this stream and the protocol for future verification runs.

---

## 2. VERIFICATION ARTIFACT

**Script:** `scripts/pios/EX.1/runtime_binding_verifier.py`
**Type:** Bounded verification artifact (EX.1 scope)
**Contract:** EX.H1 RB-001..RB-014

**Capabilities:**
1. Invokes `compute_signals.py` with a run_id (RB-001)
2. Passes signal output to `activate_conditions.py` without interposition (RB-002)
3. Writes run_metadata.json, signal_output.json, condition_output.json (RB-005)
4. Validates all 4 compliance domains programmatically (RB-006)
5. Writes validation_result.json with structured domain verdicts (RB-007)
6. Checks regression against certified baseline values (RB-009..RB-011)
7. Exits 0 on PASS, 1 on FAIL or REGRESSION

**Usage:**
```
python3 scripts/pios/EX.1/runtime_binding_verifier.py [--run-id <id>]
```

---

## 3. BASELINE VERIFICATION RUN

**Run ID:** `EX1_baseline_20260403`
**Date:** 2026-04-03
**Telemetry:** STATIC_BASELINE (40.4 STATIC_VARIABLES)
**Engine:** pios-governance-baseline-v0.4, commit `ed95c81`

**Output files:**
- `runs/pios/40.5/EX1_baseline_20260403/signal_output.json`
- `runs/pios/40.6/EX1_baseline_20260403/condition_output.json`
- `runs/pios/EX.1/EX1_baseline_20260403/run_metadata.json`
- `runs/pios/EX.1/EX1_baseline_20260403/validation_result.json`

**Compliance results:**

| Domain | Status | Violations |
|---|---|---|
| Emission | PASS | 0 |
| Consumption | PASS | 0 |
| Propagation | PASS | 0 |
| Traceability | PASS | 0 |
| Overall | COMPLIANT | — |

**Regression check:**

| Check | Result |
|---|---|
| Condition tier regression | PASS |
| Diagnosis state regression | PASS |
| Traceability record count regression | PASS |
| Overall regression | PASS |

**Verified condition states:**

| Condition | Tier | Diagnosis | Diagnosis State |
|---|---|---|---|
| COND-001 | STABLE | DIAG-001 | INACTIVE |
| COND-002 | STABLE | DIAG-002 | INACTIVE |
| COND-003 | STABLE | DIAG-003 | INACTIVE |
| COND-004 | STABLE | DIAG-004 | INACTIVE |
| COND-005 | BLOCKED | DIAG-005 | BLOCKED |
| COND-006 | BLOCKED | DIAG-006 | BLOCKED |
| COND-007 | STABLE | DIAG-007 | INACTIVE |
| COND-008 | STABLE | DIAG-008 | INACTIVE |

**Final verdict: PASS**

---

## 4. VERIFICATION PROTOCOL FOR FUTURE RUNS

### When to run (per EX.H1 RB-006)

Run the verifier before any compliance claim is made and:
- After any GC-002 engine change
- After any GC-003 static baseline change
- Before any VS-CE10C certification closeout
- As part of any EX.1-class runtime binding verification

### How to run

```
cd <repo_root>
python3 scripts/pios/EX.1/runtime_binding_verifier.py --run-id <run_id>
```

The run_id should follow the convention: `EX1_<purpose>_<YYYYMMDD>` (e.g., `EX1_postchan_20260501`)

### What constitutes a pass

All four conditions must be true:
1. Overall verdict: COMPLIANT (all 4 compliance domains PASS)
2. Regression status: PASS (no deviation from certified baseline values, when using static baseline)
3. Zero emission violations
4. Zero propagation violations

### What to do on failure

Per EX.H1 RB-012:
1. Mark the run as REGRESSION-DETECTED or NON-COMPLIANT
2. Halt execution against this engine state for compliance-critical paths
3. Open a CE.11 GC-002 stream to diagnose and correct the issue
4. The prior certified baseline (ce10_validation, commit ed95c81) remains authoritative

---

## 5. COMPLIANCE DOMAINS VERIFIED

### Emission (CE.4 INV-001..INV-007, §3.3)
- All 8 signals have CE.4-vocabulary emission states
- COMPLETE: non-null output
- PARTIAL: non-null output + partiality_reasons
- BLOCKED: null output + blocking_class
- No `note` field in any signal

### Consumption (CE.5 C-001..C-003, PBE-1/PBE-2)
- 8 CE.5 consumption records (one per governed signal)
- Each record: origin = "CE.4", consumption_state ∈ {AVAILABLE, PARTIAL, BLOCKED}
- BLOCKED records: output_ref = null

### Propagation (CE.2 DEC-009, DEC-014)
- All 8 condition_coverage_state values ∈ {BLOCKED, DEGRADED, AT_RISK, STABLE}
- All 8 diagnosis_activation_state values ∈ {BLOCKED, ACTIVE, INACTIVE}
- DEC-014 mapping verified per condition: BLOCKED→BLOCKED, DEGRADED→ACTIVE,
  AT_RISK→ACTIVE, STABLE→INACTIVE

### Traceability (CE.5 T-001/T-002, CE.4 INV-006)
- 8 CE.5 traceability records (Type 1: present signals, Type 2: absent signals)
- Record count equals governed signal count

---

## 6. LIMITATIONS OF THIS PROTOCOL

This verification protocol applies to the static baseline context only.
Per EX.H1 RB-003 and PIOS_V0.4_EXECUTABLE_CERTIFICATION.md:
- Certification covers engine logic; live telemetry will produce different outputs
- Regression check (section 4.3) is only valid for static baseline runs
- Live telemetry runs must declare telemetry_source and are not covered by the
  static baseline regression anchor

This verifier does NOT:
- Integrate into the 42.x runtime API path (EX.3 scope)
- Verify 41.x semantic layer consistency with engine outputs (EX.3 scope)
- Verify the ENL or persona adapter paths (EX.3 scope)
