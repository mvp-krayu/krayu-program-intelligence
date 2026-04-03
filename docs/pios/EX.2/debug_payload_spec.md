# EX.2 — Debug Payload Specification

**Stream:** EX.2 — Debug / Trace Interface
**Artifact type:** DEBUG PAYLOAD SPEC
**Date:** 2026-04-04
**Authority:** EX.2

---

## 1. PURPOSE

This document specifies the complete JSON structure returned by the EX.2 debug
endpoint (`?debug=true`). All fields are derived from live run archives — no
synthetic values.

---

## 2. PAYLOAD STRUCTURE

```json
{
  "debug_run_id":        "<string>  — run ID used for this engine invocation",
  "telemetry_source":   "<string>  — STATIC_BASELINE or LIVE_TELEMETRY",
  "stream":             "EX.2",
  "signal_output_path": "<string>  — relative path to signal_output.json",
  "condition_output_path": "<string> — relative path to condition_output.json",

  "signals":            { ... },  // CE.4 signal outputs — see §3
  "ce5_consumption_records":  { ... },  // CE.5 consumption — see §4
  "ce5_traceability_records": { ... },  // CE.5 traceability — see §4
  "conditions":         { ... },  // CE.2 condition states — see §5
  "diagnoses":          { ... },  // CE.2 diagnosis states — see §5
  "trace_chains":       [ ... ],  // signal→condition→diagnosis — see §6
  "signal_summary":     { ... },  // COMPLETE/PARTIAL/BLOCKED lists — see §7
  "condition_summary":  { ... },  // STABLE/BLOCKED condition lists — see §7
  "diagnosis_summary":  { ... }   // INACTIVE/BLOCKED diagnosis lists — see §7
}
```

---

## 3. signals

Dict keyed by engine signal ID (`SIG-001`..`SIG-008`). Each entry:

```json
{
  "signal_id":        "SIG-NNN",
  "canonical_name":   "<abbreviation>",
  "ckr":              "CKR-NNN",
  "state":            "COMPLETE | PARTIAL | BLOCKED | COMPUTABLE_PENDING",
  "output":           { <signal value fields> } | null,

  // COMPLETE or PARTIAL signals:
  "traceability":     { <formula / component derivation map> },        // optional
  "partiality_reasons": { <component: {failure_class, cause, ...}> },  // optional (PARTIAL only)

  // BLOCKED signals:
  "blocking_class":   "<blocking category>",
  "blocking_inputs":  [ <list of blocked upstream inputs> ],
  "blocking_reason":  "<human-readable explanation>"
}
```

**CE.4 state vocabulary** (enforced by pios_bridge):
- `COMPLETE` — all inputs resolved, full output present
- `PARTIAL` — some inputs resolved, partial output present
- `BLOCKED` — no inputs resolved, output null
- `COMPUTABLE_PENDING` — computable but deferred

---

## 4. ce5_consumption_records and ce5_traceability_records

Both are dicts keyed by engine signal ID.

**ce5_consumption_records** entry:
```json
{
  "signal_id":          "SIG-NNN",
  "consumption_state":  "AVAILABLE | PARTIAL | BLOCKED",
  "consuming_conditions": [ "COND-NNN", ... ]
}
```

**ce5_traceability_records** entry:
```json
{
  "signal_id":      "SIG-NNN",
  "record_type":    "TYPE_1 | TYPE_2",
  "lineage":        { ... },
  "consumed_by":    [ "COND-NNN", ... ]
}
```

---

## 5. conditions and diagnoses

**conditions** dict keyed by `COND-NNN`:
```json
{
  "condition_id":              "COND-NNN",
  "canonical_name":            "<name>",
  "governing_signal":          "SIG-NNN",
  "condition_coverage_state":  "BLOCKED | DEGRADED | AT_RISK | STABLE",
  "activation_state":          "ACTIVE | INACTIVE",
  "components":                { ... },
  "blocking_inputs":           [ ... ],   // if BLOCKED
  "blocking_reason":           "<reason>" // if BLOCKED
}
```

**CE.2 condition tier vocabulary:**
- `STABLE` — all evidence present, condition well-covered
- `AT_RISK` — partial evidence, condition at risk
- `DEGRADED` — significant evidence gaps
- `BLOCKED` — governing signal BLOCKED, condition cannot be evaluated

**diagnoses** dict keyed by `DIAG-NNN`:
```json
{
  "diagnosis_id":               "DIAG-NNN",
  "canonical_name":             "<name>",
  "dvar":                       "<diagnosis variable>",
  "originating_condition":      "COND-NNN",
  "diagnosis_activation_state": "BLOCKED | ACTIVE | INACTIVE",
  "blocking_inputs":            [ ... ],   // if BLOCKED
  "blocking_reason":            "<reason>" // if BLOCKED
}
```

---

## 6. trace_chains

List of dicts — one per engine signal (8 entries). Each entry spans all three CE layers:

```json
{
  // Signal node (CE.4)
  "signal_id":              "SIG-NNN",
  "signal_name":            "<abbreviation>",
  "ckr":                    "CKR-NNN",
  "ce4_emission_state":     "COMPLETE | PARTIAL | BLOCKED | COMPUTABLE_PENDING",
  "ce5_consumption_state":  "AVAILABLE | PARTIAL | BLOCKED | null",
  "signal_output_present":  true | false,
  "signal_traceability":    { ... } | null,
  "signal_partiality":      { ... } | null,
  "signal_blocking_class":  "<class>" | null,
  "signal_blocking_inputs": [ ... ] | null,
  "signal_blocking_reason": "<reason>" | null,

  // Condition node (CE.2)
  "condition_id":              "COND-NNN" | null,
  "condition_name":            "<name>" | null,
  "ce2_condition_tier":        "BLOCKED | DEGRADED | AT_RISK | STABLE | null",
  "condition_activation":      "ACTIVE | INACTIVE | null",
  "condition_components":      { ... } | null,
  "condition_blocking_inputs": [ ... ] | null,
  "condition_blocking_reason": "<reason>" | null,

  // Diagnosis node (CE.2)
  "diagnosis_id":              "DIAG-NNN" | null,
  "diagnosis_name":            "<name>" | null,
  "dvar":                      "<variable>" | null,
  "ce2_diagnosis_state":       "BLOCKED | ACTIVE | INACTIVE | null",
  "diagnosis_blocking_inputs": [ ... ] | null,
  "diagnosis_blocking_reason": "<reason>" | null
}
```

---

## 7. Summary Fields

**signal_summary:**
```json
{
  "COMPLETE": [ "SIG-NNN", ... ],
  "PARTIAL":  [ "SIG-NNN", ... ],
  "BLOCKED":  [ "SIG-NNN", ... ],
  "signal_output_completeness": "<ratio string>"
}
```

**condition_summary:**
```json
{
  "STABLE":  [ "COND-NNN", ... ],
  "BLOCKED": [ "COND-NNN", ... ]
}
```

**diagnosis_summary:**
```json
{
  "INACTIVE": [ "DIAG-NNN", ... ],
  "BLOCKED":  [ "DIAG-NNN", ... ]
}
```

---

## 8. STATIC BASELINE EXPECTED VALUES

At `telemetry_source: STATIC_BASELINE` (EX.2 verification run 2026-04-04):

| Metric | Value |
|---|---|
| signals count | 8 |
| COMPLETE signals | SIG-002, SIG-004 |
| PARTIAL signals | SIG-001, SIG-005, SIG-007, SIG-008 |
| BLOCKED signals | SIG-003, SIG-006 |
| ce5_consumption_records count | 8 |
| ce5_traceability_records count | 8 |
| conditions count | 8 |
| STABLE conditions | COND-001..004, COND-007..008 |
| BLOCKED conditions | COND-005, COND-006 |
| diagnoses count | 8 |
| INACTIVE diagnoses | DIAG-001..004, DIAG-007..008 |
| BLOCKED diagnoses | DIAG-005, DIAG-006 |
| trace_chains count | 8 |
| chains with condition link | 8 |
