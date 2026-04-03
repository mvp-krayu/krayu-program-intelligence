# EX.2 — Trace Surface Map

**Stream:** EX.2 — Debug / Trace Interface
**Artifact type:** TRACE SURFACE MAP
**Date:** 2026-04-04
**Authority:** EX.2

---

## 1. PURPOSE

This document maps the read-only inspection surfaces exposed by the EX.2 debug
endpoint (`?debug=true`). It describes what data is exposed, where it originates,
and which trace questions each surface answers.

---

## 2. SURFACE INVENTORY

### Surface 1 — Run Archive: Signal Output

**Source:** `runs/pios/40.5/<run_id>/signal_output.json`
**Written by:** `compute_signals.py` (PiOS v0.4 engine, stream 40.5)
**EX.2 access:** read-only, via `signal_path.open()`
**Exposed as:** `signals` dict + `signal_summary` in debug payload

| Field | CE Layer | Trace Question |
|---|---|---|
| `signals[*].state` | CE.4 emission state | Q1, Q2 |
| `signals[*].traceability` | Derivation formula (COMPLETE/PARTIAL) | Q5 |
| `signals[*].partiality_reasons` | Partial input chain (PARTIAL) | Q5 |
| `signals[*].blocking_class` | Blocking classification (BLOCKED) | Q5, Q10 |
| `signals[*].blocking_inputs` | Blocked upstream inputs (BLOCKED) | Q5, Q10 |
| `signals[*].blocking_reason` | Blocking explanation (BLOCKED) | Q5, Q10 |
| `signal_summary` | COMPLETE/PARTIAL/BLOCKED signal lists | Q10 |

---

### Surface 2 — Run Archive: Condition Output

**Source:** `runs/pios/40.6/<run_id>/condition_output.json`
**Written by:** `activate_conditions.py` (PiOS v0.4 engine, stream 40.6)
**EX.2 access:** read-only, via `condition_path.open()`
**Exposed as:** `ce5_consumption_records`, `ce5_traceability_records`, `conditions`, `diagnoses`, summaries

| Field | CE Layer | Trace Question |
|---|---|---|
| `ce5_consumption_records[*].consumption_state` | CE.5 consumption state | Q3 |
| `ce5_traceability_records[*]` | CE.5 Type 1/2 traceability | Q4 |
| `conditions[*].condition_coverage_state` | CE.2 condition tier | Q6 |
| `conditions[*].governing_signal` | Condition←Signal link | Q8 |
| `conditions[*].components` | Condition components | Q6 |
| `diagnoses[*].diagnosis_activation_state` | CE.2 diagnosis state | Q7 |
| `diagnoses[*].originating_condition` | Diagnosis←Condition link | Q8 |
| `condition_summary` | STABLE/BLOCKED condition lists | Q6 |
| `diagnosis_summary` | INACTIVE/BLOCKED diagnosis lists | Q7 |

---

### Surface 3 — Trace Chains (Computed by EX.2)

**Source:** Derived in-process by `build_trace_chains()` — NO recomputation
**Method:** Index join on `governing_signal` and `originating_condition` fields from run archive
**Exposed as:** `trace_chains` list

| Field | Description | Trace Question |
|---|---|---|
| `signal_id` → `condition_id` → `diagnosis_id` | Full chain traversal | Q8 |
| `ce4_emission_state` | From signal archive | Q2, Q10 |
| `ce5_consumption_state` | From consumption record | Q3 |
| `ce2_condition_tier` | From condition archive | Q6 |
| `ce2_diagnosis_state` | From diagnosis archive | Q7 |
| `signal_blocking_*` | From signal archive | Q5, Q10 |
| `condition_blocking_*` | From condition archive | Q6 |

---

### Surface 4 — Run Metadata

**Source:** Live engine invocation via `pios_bridge.get_live_pios_data()`
**Exposed as:** `debug_run_id`, `telemetry_source`, `signal_output_path`, `condition_output_path`

| Field | Trace Question |
|---|---|
| `debug_run_id` | Q9 |
| `telemetry_source` | Q9 (context) |
| `signal_output_path` | Q9 (archive location) |
| `condition_output_path` | Q9 (archive location) |

---

## 3. TRACE QUESTION COVERAGE MATRIX

| Q | Question | Primary Surface | Secondary |
|---|---|---|---|
| Q1 | All signals + states | Surface 1 (`signals`) | Surface 3 |
| Q2 | CE.4 emission states | Surface 1 (`signals[*].state`) | Surface 3 |
| Q3 | CE.5 consumption records | Surface 2 (`ce5_consumption_records`) | Surface 3 |
| Q4 | CE.5 traceability records | Surface 2 (`ce5_traceability_records`) | — |
| Q5 | Inputs / derivation formulas | Surface 1 (traceability/blocking_inputs/partiality_reasons) | Surface 3 |
| Q6 | CE.2 condition states | Surface 2 (`conditions[*].condition_coverage_state`) | Surface 3 |
| Q7 | CE.2 diagnosis states | Surface 2 (`diagnoses[*].diagnosis_activation_state`) | Surface 3 |
| Q8 | Signal→condition→diagnosis chain | Surface 3 (`trace_chains`) | Surface 2 |
| Q9 | Run ID | Surface 4 (`debug_run_id`) | — |
| Q10 | BLOCKED/PARTIAL signals | Surface 1 (`signal_summary`) | Surface 3 |

**Coverage: 10/10 trace questions answered.**

---

## 4. NO-WRITE GUARANTEE

EX.2 performs no writes:
- Run archives are opened read-only (`.open()` default mode = `'r'`)
- `pios_bridge.get_live_pios_data()` invokes the engine (which writes its own archives) — this is the only side effect, and it is governed by the engine contract, not EX.2
- `build_trace_chains()` performs index joins in memory only — no file writes
- No fields are recomputed, synthesized, or modified

**EX.H1 RB-002 compliance: no interposition between engine output and debug surface.**
