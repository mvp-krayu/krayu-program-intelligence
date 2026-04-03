# CE.6 — Traceability Compliance Report

**Stream:** CE.6 — Engine Compliance & Executable Validation
**Artifact type:** COMPLIANCE REPORT (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.6
**Traceability chain under evaluation:** Signal Ledger → CE.4 emission → CE.5 consumption → CE.6

---

## 1. PURPOSE

This report evaluates whether the PiOS v0.1 engine preserves full traceability across
the Signal Ledger → emission → consumption chain as required by the governance contracts.

Traceability is evaluated across three distinct traceability obligations:

1. **CE.4 emission traceability** — `traceability` field per CE.4 INV-006
2. **CE.5 consumption traceability** — Type 1 and Type 2 records per T-001/T-002
3. **Executable validation traceability** — `runs/pios/40.5/run_03_executable/signal_validation_report.json`

---

## 2. CE.4 EMISSION TRACEABILITY

**Requirement (INV-006):** A COMPLETE signal MUST carry `traceability` with an entry for
every field in `output`.

**CE.4 §4.2 note:** Derived PARTIAL signals do not carry `traceability` — they carry
`partiality_reasons` instead.

### Traceability field assessment by signal

| Signal | State | traceability field | Status |
|---|---|---|---|
| SIG-001 | PARTIAL | Present (for resolved fields) | PASS |
| SIG-002 | COMPLETE | Present (all output fields covered) | PASS |
| SIG-003 | BLOCKED | N/A | N/A |
| SIG-004 | COMPLETE | Present (all output fields covered) | PASS |
| SIG-005 | PARTIAL | Present (for resolved fields) | PASS |
| SIG-006 | BLOCKED | N/A | N/A |
| SIG-007 | PARTIAL (derived) | Absent — correct per CE.4 §4.3 | PASS |
| SIG-008 | PARTIAL (derived) | Absent — correct per CE.4 §4.3 | PASS |

**CE.4 traceability field coverage: PASS for all applicable signals**

However, the `run_03_executable/signal_validation_report.json` records:

```json
"traceability_coverage": "FAIL"
```

This indicates that the executable run revealed a traceability coverage gap not captured
by the static signal-level assessment above. The exact gap is not elaborated in the report,
but its presence confirms that CE.4 traceability requirements are not fully satisfied
at the executable level.

**CE.4 traceability verdict: FAIL (executable evidence)**

---

## 3. CE.5 CONSUMPTION TRACEABILITY

**Requirement (T-001):** CE.5 MUST emit a structural gap trace record (Type 2) for every
expected signal absent from the CE.4 output packet.

**Requirement (T-002):** For every signal in scope, CE.5 MUST produce either a Type 1
or Type 2 traceability record. No expected signal may be omitted.

### Engine assessment

The engine (`activate_conditions.py`) does not produce CE.5 traceability records.
Neither Type 1 consumption traceability records nor Type 2 structural gap trace records
are produced by the engine.

CE.5 traceability is a governance output defined at the 40.5 → 40.6 boundary.
The engine does not produce any artifact corresponding to this output.

The `consumption_traceability_model.md` section 6 records expected Type 1 records for
all 8 signals (CE.2-R01-MIX run). These records are governance-defined only.
No executable equivalent exists in the engine.

**CE.5 traceability coverage: NOT IMPLEMENTED**

---

## 4. SIGNAL LEDGER TRACEABILITY

**Requirement:** All 8 governed signals (SIG-001 through SIG-008) defined in the CE.4
Signal Ledger (`signal_ledger_specification.md`) must be traceable through the emission →
consumption chain with no silent disappearances.

### Ledger coverage in CE.2-R01-MIX run

| Signal | In CE.4 packet | In activation output | Traceability status |
|---|---|---|---|
| SIG-001 | YES | YES (condition evaluation uses signal state) | Present — no CE.5 record |
| SIG-002 | YES | YES | Present — no CE.5 record |
| SIG-003 | YES | YES | Present — no CE.5 record |
| SIG-004 | YES | YES | Present — no CE.5 record |
| SIG-005 | YES | YES | Present — no CE.5 record |
| SIG-006 | YES | YES | Present — no CE.5 record |
| SIG-007 | YES | YES | Present — no CE.5 record |
| SIG-008 | YES | YES | Present — no CE.5 record |

All 8 signals are behaviorally present in both layers. No signal disappears silently.
However, the absence of CE.5 traceability records means this coverage is unverifiable
from traceability output alone — it can only be inferred from the code.

**Signal Ledger traceability completeness: BEHAVIORALLY INTACT — NOT GOVERNED**

---

## 5. EXECUTABLE VALIDATION TRACEABILITY

Evidence from `runs/pios/40.5/run_03_executable/signal_validation_report.json`:

```json
{
  "status": "PASS",
  "parity_check_against_run_02": "PASS",
  "state_match": "PASS",
  "traceability_coverage": "FAIL",
  "losslessness_status": "PASS"
}
```

**Interpretation:**
- `state_match: PASS` — signal emission states match expected values
- `losslessness_status: PASS` — no signal data is lost in transmission
- `traceability_coverage: FAIL` — traceability fields do not fully satisfy CE.4 INV-006 coverage
- `status: PASS` — overall run status reflects state/value parity, NOT governance compliance

The run_03_executable validation confirms execution determinism but does NOT certify
CE.4 emission contract compliance or CE.5 consumption compliance.

---

## 6. TRACEABILITY COMPLIANCE SUMMARY

| Traceability dimension | Status |
|---|---|
| CE.4 INV-006 traceability fields (static) | PASS for applicable signals |
| CE.4 traceability coverage (executable) | **FAIL** |
| CE.5 Type 1 consumption records | **NOT IMPLEMENTED** |
| CE.5 Type 2 structural gap trace records | **NOT IMPLEMENTED** |
| Signal Ledger → activation chain (behavioral) | INTACT (ungoverned) |

---

## 7. VIOLATION CATALOG

| ID | Requirement | Description |
|---|---|---|
| V-T-001 | CE.4 INV-006 | Traceability coverage FAIL confirmed in run_03_executable |
| V-T-002 | CE.5 T-001 | No structural gap trace records produced by engine |
| V-T-003 | CE.5 T-002 | No CE.5 consumption traceability records produced by engine |

---

## 8. TRACEABILITY COMPLIANCE VERDICT

Full traceability across the governed chain (Signal Ledger → emission → consumption) is
NOT preserved by the PiOS v0.1 engine.

CE.4 traceability is partially implemented (traceability fields present for applicable
signals) but fails the executable coverage check.

CE.5 traceability is entirely absent from the engine implementation.

**Traceability compliance status: FAIL**
