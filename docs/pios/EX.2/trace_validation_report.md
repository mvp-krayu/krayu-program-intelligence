# EX.2 — Trace Validation Report

**Stream:** EX.2 — Debug / Trace Interface
**Artifact type:** TRACE VALIDATION REPORT
**Date:** 2026-04-04
**Authority:** EX.2

---

## 1. VALIDATION SCOPE

This report records the EX.2 trace validation run executed on 2026-04-04.
The validation confirms that all 10 mandatory trace questions are answerable
from the debug payload produced by `scripts/pios/EX.2/pios_debug_adapter.py`.

---

## 2. VALIDATION METHOD

**Script:** `/tmp/ex2_validate.py` (deterministic Python, read-only)
**Input:** stdout of `python3 scripts/pios/EX.2/pios_debug_adapter.py`
**Engine state:** STATIC_BASELINE telemetry
**Run ID verified:** `EX3_live_20260403_211622`

**Command:**
```bash
cd /Users/khorrix/Projects/k-pi-core && \
python3 scripts/pios/EX.2/pios_debug_adapter.py 2>/dev/null | \
python3 /tmp/ex2_validate.py
```

---

## 3. VALIDATION RESULTS

| Q | Trace Question | Field Checked | Result |
|---|---|---|---|
| Q1 | All signals + states | `signals` — 8 entries present | PASS |
| Q2 | CE.4 emission states | `signals[*].state` — present in all 8 | PASS |
| Q3 | CE.5 consumption records | `ce5_consumption_records` — 8 entries | PASS |
| Q4 | CE.5 traceability records | `ce5_traceability_records` — 8 entries | PASS |
| Q5 | Inputs / derivation formulas | `traceability` / `blocking_inputs` / `partiality_reasons` (state-dependent) — all 8 have at least one | PASS |
| Q6 | CE.2 condition states | `conditions[*].condition_coverage_state` — 8 conditions | PASS |
| Q7 | CE.2 diagnosis states | `diagnoses[*].diagnosis_activation_state` — 8 diagnoses | PASS |
| Q8 | Signal→condition→diagnosis chain | `trace_chains` — 8 chains, 8 with condition link | PASS |
| Q9 | Run ID | `debug_run_id` — non-null | PASS |
| Q10 | BLOCKED / PARTIAL signals | `signal_summary` — keys: COMPLETE, PARTIAL, BLOCKED | PASS |

**Overall: 10/10 PASS**

---

## 4. Q5 FIELD RESOLUTION NOTE

Q5 checks "inputs / derivation formulas." The engine produces state-dependent
fields for this information:

| Signal state | Field present | Signals |
|---|---|---|
| COMPLETE | `traceability` | SIG-002, SIG-004 |
| PARTIAL | `traceability` + `partiality_reasons` | SIG-001, SIG-005, SIG-007, SIG-008 |
| BLOCKED | `blocking_class` + `blocking_inputs` + `blocking_reason` | SIG-003, SIG-006 |

All three field sets expose upstream input chains. Q5 is satisfied by the
presence of at least one of `traceability`, `blocking_inputs`, or
`partiality_reasons` per signal.

---

## 5. PAYLOAD SPOT-CHECK

Selected fields verified from the EX3_live_20260403_211622 run:

| Field | Expected (static baseline) | Observed | Result |
|---|---|---|---|
| `telemetry_source` | STATIC_BASELINE | STATIC_BASELINE | PASS |
| `signal_summary.COMPLETE` count | 2 | 2 | PASS |
| `signal_summary.PARTIAL` count | 4 | 4 | PASS |
| `signal_summary.BLOCKED` count | 2 | 2 | PASS |
| `conditions` count | 8 | 8 | PASS |
| `diagnoses` count | 8 | 8 | PASS |
| BLOCKED conditions | COND-005, COND-006 | COND-005, COND-006 | PASS |
| BLOCKED diagnoses | DIAG-005, DIAG-006 | DIAG-005, DIAG-006 | PASS |
| `trace_chains` count | 8 | 8 | PASS |
| chains with condition link | 8 | 8 | PASS |

---

## 6. REGRESSION ANCHORS

For future validation runs against STATIC_BASELINE, the following must hold:

| Anchor | Expected Value |
|---|---|
| `signals` count | 8 |
| `ce5_consumption_records` count | 8 |
| `ce5_traceability_records` count | 8 |
| `conditions` count | 8 |
| `diagnoses` count | 8 |
| BLOCKED conditions | COND-005, COND-006 |
| BLOCKED diagnoses | DIAG-005, DIAG-006 |
| COMPLETE signals | SIG-002, SIG-004 |
| BLOCKED signals | SIG-003, SIG-006 |
| `trace_chains` with condition_id present | 8 of 8 |

Deviation from these anchors on a static baseline run = REGRESSION DETECTED.

---

## 7. RESULT: PASS

EX.2 trace validation is complete. All 10 mandatory trace questions are
answerable from the debug payload. The read-only constraint is satisfied.
No recomputation is performed.
