# CE.4 — Signal Emission Contract Specification

**Stream:** CE.4 — PiOS Signal Emission Contract Definition
**Artifact type:** CONTRACT SPECIFICATION (NORMATIVE)
**Date:** 2026-04-03
**Evidence base:** `signal_emission_surface_assessment.md`, `signal_failure_classification_model.md`, CE.3 analysis artifacts
**Authority:** CE.4 — defines the governed emission contract at 40.5

---

## 1. PURPOSE

This document defines the authoritative contract for all signal emissions from 40.5.
It specifies the canonical emission states, the required payload structure per state,
the prohibited fields, and the semantic obligations of each state.

This contract is the normative baseline. Current 40.5 runtime behavior that deviates
from this contract is a governance gap, not a standard.

---

## 2. CANONICAL EMISSION STATES

Exactly four emission states are governed at 40.5. No other state is valid.

### EC-STATE-001 — COMPLETE

**Semantic:** All required output fields for the signal are resolved to non-null values.
All required input variables were available. All formula paths executed successfully.
The signal is fully computable in the current execution context.

**Downstream semantics:** A COMPLETE signal's output fields may be used by any downstream
binding rule without null-handling. 40.6 receives a fully populated numeric output.

### EC-STATE-002 — PARTIAL

**Semantic:** The signal has at least one resolved output field and at least one unresolved
(null) output field. The signal is partially computable in the current execution context.
The resolved fields are valid and may be consumed. The null fields must not be consumed
as resolved values.

A PARTIAL signal MUST carry `partiality_reason` for each null output field, identifying
whether the null originates from F-1b (input pending) or F-3/F-4 (upstream signal
BLOCKED or PARTIAL). Generic `note` prose does not satisfy this requirement.

**Downstream semantics:** 40.6 binding rules that reference null output fields in a
PARTIAL signal must resolve to tier=BLOCKED via `BR-NULL-SIGNAL-BLOCKED`. Binding rules
that reference resolved output fields treat the signal as locally COMPLETE for that field.

### EC-STATE-003 — BLOCKED

**Semantic:** The signal produced no resolved output. The signal emits `output=null`.
The cause of blockage MUST be identified. BLOCKED may arise from:
- F-1a (structural input absence — temporal class mismatch)
- F-2 (formula absence — structural impossibility)
- Any future failure class that results in total output unavailability

A BLOCKED signal MUST carry `blocking_class` (the governing failure class: F-1a or F-2),
`blocking_inputs` (array of variable IDs or upstream signal IDs responsible), and
`blocking_reason` (human-readable explanation). All three fields are mandatory.

**Downstream semantics:** 40.6 treats output=null from a BLOCKED signal as the trigger
for `BR-NULL-SIGNAL-BLOCKED` → tier=BLOCKED. The payload fields (`blocking_class`,
`blocking_inputs`, `blocking_reason`) are not consumed by 40.6 but are required for
governance traceability.

### EC-STATE-004 — COMPUTABLE_PENDING

**Semantic:** Reserved for future governance. A signal whose formula is verified present
and correct but whose inputs are not yet available in the current run. This state
distinguishes "will become COMPLETE when inputs arrive" from BLOCKED (which implies
a more structural barrier). This state is NOT currently used in v0.1 but is reserved
to prevent F-1b and F-1a from being conflated at the state level.

**Note:** EC-STATE-004 is defined here as a governance reservation. It does not alter
current runtime behavior. Its introduction into the active engine requires a separate
CE-class stream.

---

## 3. REQUIRED PAYLOAD FIELDS PER EMISSION STATE

### 3.1 Fields required for ALL emission states

| Field | Type | Description |
|---|---|---|
| `signal_id` | string | Canonical signal identifier (e.g., SIG-003) |
| `canonical_name` | string | Human-readable signal name (e.g., "Change Concentration") |
| `ckr` | string | Canonical Knowledge Reference (e.g., CKR-008) |
| `state` | enum | One of: COMPLETE, PARTIAL, BLOCKED (or COMPUTABLE_PENDING when introduced) |
| `output` | object or null | Resolved output fields (COMPLETE/PARTIAL) or null (BLOCKED) |

### 3.2 Additional required fields by state

**COMPLETE:**
| Field | Type | Required | Description |
|---|---|---|---|
| `traceability` | object | YES | Formula string per output field |

No null values in `output` are permitted for COMPLETE. A COMPLETE signal with any null
output field is a contract violation.

**PARTIAL:**
| Field | Type | Required | Description |
|---|---|---|---|
| `traceability` | object | YES (primitive) / conditional (derived) | Formula string for formula-based output fields |
| `partiality_reasons` | object | YES | Per null output field: `{"field_name": {"failure_class": "F-1b|F-3|F-4", "cause": "..."}}` |

The `partiality_reasons` field replaces the current `note` field for derived signals.
The `note` field is NOT a valid governed field. Its continued presence in the current
runtime is a legacy surface that CE.4 does not endorse.

**BLOCKED:**
| Field | Type | Required | Description |
|---|---|---|---|
| `blocking_class` | string | YES | Governing failure class (F-1a, F-2, or future class) |
| `blocking_inputs` | array | YES | Variable IDs or signal IDs causing blockage |
| `blocking_reason` | string | YES | Human-readable explanation |

The `output` field for BLOCKED MUST be null. A BLOCKED signal with any non-null output
field is a contract violation.

### 3.3 Prohibited fields

The following fields are NOT part of the governed emission contract and must not appear
in compliant signal payloads:

| Field | Reason |
|---|---|
| `note` | Replaced by `partiality_reasons` (PARTIAL) and `blocking_reason` (BLOCKED). Free-text prose is not governed. |
| Any unlisted field | Only fields explicitly listed in section 3.1–3.2 are permitted per state. |

---

## 4. PAYLOAD SCHEMA — NORMATIVE DEFINITION

### 4.1 COMPLETE signal

```
{
  "signal_id":       <string>,
  "canonical_name":  <string>,
  "ckr":             <string>,
  "state":           "COMPLETE",
  "output":          { <field>: <resolved_value>, ... },   // no null values
  "traceability":    { <field>: <formula_string>, ... }
}
```

### 4.2 PARTIAL signal (primitive — formula-based inputs)

```
{
  "signal_id":           <string>,
  "canonical_name":      <string>,
  "ckr":                 <string>,
  "state":               "PARTIAL",
  "output":              { <field>: <value_or_null>, ... },
  "traceability":        { <field>: <formula_string>, ... },
  "partiality_reasons":  {
    "<null_field>": {
      "failure_class": "F-1b",
      "cause":         <string>
    }
  }
}
```

### 4.3 PARTIAL signal (derived — upstream-dependent)

```
{
  "signal_id":           <string>,
  "canonical_name":      <string>,
  "ckr":                 <string>,
  "state":               "PARTIAL",
  "output":              { <field>: <value_or_null>, ... },
  "partiality_reasons":  {
    "<null_field>": {
      "failure_class": "F-3" | "F-4",
      "upstream_signal": <signal_id>,
      "cause":           <string>
    }
  }
}
```

Note: Derived PARTIAL signals do not carry `traceability` as they compute from signals,
not from variable formulas. `partiality_reasons` identifies the upstream source.

### 4.4 BLOCKED signal

```
{
  "signal_id":       <string>,
  "canonical_name":  <string>,
  "ckr":             <string>,
  "state":           "BLOCKED",
  "output":          null,
  "blocking_class":  "F-1a" | "F-2" | <future_class>,
  "blocking_inputs": [<variable_id_or_signal_id>, ...],
  "blocking_reason": <string>
}
```

---

## 5. EMISSION INVARIANTS

The following invariants MUST hold for any compliant 40.5 emission:

**INV-001:** A signal with `state=COMPLETE` MUST have `output` as a non-null object
with no null field values.

**INV-002:** A signal with `state=PARTIAL` MUST have `output` as a non-null object
with at least one resolved (non-null) field and at least one null field.

**INV-003:** A signal with `state=BLOCKED` MUST have `output=null`.

**INV-004:** A BLOCKED signal MUST carry `blocking_class`, `blocking_inputs`,
and `blocking_reason`. Absence of any of these three fields in a BLOCKED payload
is a contract violation.

**INV-005:** A PARTIAL signal MUST carry `partiality_reasons` with an entry for every
null field in `output`.

**INV-006:** A COMPLETE signal MUST carry `traceability` with an entry for every
field in `output`.

**INV-007:** No signal may emit a state that is not one of: COMPLETE, PARTIAL, BLOCKED
(or COMPUTABLE_PENDING when introduced). Any other string value in the `state` field
is a contract violation.

---

## 6. DOWNSTREAM CONSUMPTION CONSTRAINTS

40.6 (CE.2 binding) may only consume signal output fields as follows:

| Signal state | Field value | 40.6 allowed action |
|---|---|---|
| COMPLETE | Any field | Evaluate via binding rule |
| PARTIAL | Resolved (non-null) field | Evaluate via binding rule |
| PARTIAL | Null field | Apply `BR-NULL-SIGNAL-BLOCKED` → tier=BLOCKED |
| BLOCKED | output=null | Apply `BR-NULL-SIGNAL-BLOCKED` → tier=BLOCKED |

40.6 MUST NOT attempt to evaluate a binding rule against a null output field except via
`BR-NULL-SIGNAL-BLOCKED`. This constraint is already consistent with CE.2 DEC-013 and
is restated here as a downstream consumption contract from the 40.5 perspective.

---

## 7. BOUNDARY STATEMENT

This contract governs the 40.5 → 40.6 handoff exclusively. It does not govern:
- How 40.6 resolves tiers from signal outputs (governed by CE.2)
- How signals are computed internally (governed by signal computation specifications)
- Which signals are valid for inclusion in the signal set (governed by the Signal Ledger)

---

## 8. CONCLUSION

The CE.4 emission contract defines four canonical states (COMPLETE, PARTIAL, BLOCKED,
COMPUTABLE_PENDING reserved), mandatory payload fields per state, seven emission invariants,
and downstream consumption constraints. The current 40.5 runtime violates this contract
in multiple respects (see `signal_emission_surface_assessment.md`). This contract is the
normative baseline that a compliant PiOS v0.3 implementation must satisfy.
