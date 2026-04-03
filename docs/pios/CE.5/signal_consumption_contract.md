# CE.5 — Signal Consumption Contract Specification

**Stream:** CE.5 — PiOS Signal Consumption & Propagation Contract Definition
**Artifact type:** CONTRACT SPECIFICATION (NORMATIVE)
**Date:** 2026-04-03
**Evidence base:** `CE.4_FINAL_GOVERNANCE_STATE.md`, `signal_emission_contract_specification.md`,
  `dependency_propagation_rules.md`, CE.2 DEC-001 through DEC-014, `runs/pios/40.5/CE.2-R01-MIX/signal_output.json`
**Authority:** CE.5 — defines the governed consumption contract at the 40.5 → 40.6 boundary

---

## 1. PURPOSE

This document defines the authoritative contract for how 40.6 consumes the 40.5 signal
output packet. CE.4 governs what 40.5 emits. CE.2 governs what 40.6 computes from
consumed signal values. CE.5 governs the handoff protocol between them.

CE.5 does not redefine emission states (CE.4), computability classes (CE.4), or
condition activation logic (CE.2). It defines:

- The consumption state model: what 40.6 observes when it attempts to consume a signal field
- Per-emission-state consumption rules: exactly what 40.6 must do for each CE.4 emission state
- Multi-signal aggregation: how multiple field consumption results resolve per condition
- Propagation semantics: how consumed values flow through 40.6 → 40.10
- Downstream invariants: what 40.7–40.10 may assume given CE.4 + CE.5 guarantees
- Prohibited consumption patterns: behaviors that violate this contract

This contract is non-negotiable within PiOS v0.3 and its successors unless explicitly
superseded by a governed CE-class stream.

---

## 2. SCOPE BOUNDARY

**CE.5 governs:** The protocol by which 40.6 reads the CE.4-compliant 40.5 output packet,
evaluates binding rules against field values, and produces tier contributions per DEC-010
that feed DEC-009 precedence resolution.

**CE.5 does not govern:**
- How 40.5 computes or emits signals (CE.4)
- Signal computability classes or failure classes (CE.4)
- The Signal Ledger (CE.4)
- Condition activation binding rules themselves — `BR-*` rule definitions (CE.2 DEC-012/DEC-013)
- Tier precedence resolution (CE.2 DEC-009)
- Diagnosis activation mapping (CE.2 DEC-014)
- Downstream state propagation through 40.7 → 40.10 (CE.2)

CE.5 scope is bounded: 40.5 packet receipt at 40.6 boundary through tier contribution
emission per binding table row. No further.

---

## 3. CONSUMPTION SURFACE DEFINITION

### 3.1 Interface Object

The 40.5 → 40.6 interface delivers a **signal output packet** — a keyed collection of
signal emission records, each conforming to the CE.4 payload contract.

Structure (normative from CE.4):

```
{
  "signals": {
    "<signal_id>": {
      "signal_id":    <string>,
      "canonical_name": <string>,
      "ckr":          <string>,
      "state":        "COMPLETE" | "PARTIAL" | "BLOCKED" | "COMPUTABLE_PENDING",
      "output":       <object or null>,
      ...state-specific payload fields...
    },
    ...
  }
}
```

### 3.2 Consumption Unit

The atomic unit of consumption is a **binding table row** (DEC-012 schema):

```
condition_id  |  signal_id  |  signal_field  |  binding_rule_id  |  tier_contribution
```

For each binding table row, 40.6 must:
1. Locate the signal identified by `signal_id` in the 40.5 packet
2. Extract the value at `signal_field` from `signal.output`
3. Evaluate the extracted value against the governed binding rule (`binding_rule_id`)
4. Produce exactly one `tier_contribution` from the governed tier vocabulary

The result of step 4 is the **consumption outcome** for that binding table row.

### 3.3 Current binding surface summary

The CE.2-R01-MIX baseline binding table contains 8 rows (one per condition). QA.2
extended to 11 rows for multi-signal conflict validation. The canonical production
binding table is 8 rows — one signal, one field, one rule per condition.

All 8 binding rules are value-reactive (DEC-013). Each resolves to exactly one tier
from the governed vocabulary: `BLOCKED | DEGRADED | AT_RISK | STABLE`.

---

## 4. EMISSION STATE ALIGNMENT

CE.5 consumption rules operate on CE.4 canonical emission states. The CE.5 contract
term mapping is:

| CE.5 contract term | CE.4 canonical state | EC state ID |
|---|---|---|
| VALID | COMPLETE | EC-STATE-001 |
| (field-resolved PARTIAL) | PARTIAL (resolved field) | EC-STATE-002 |
| (field-null PARTIAL) | PARTIAL (null field) | EC-STATE-002 |
| BLOCKED | BLOCKED | EC-STATE-003 |
| UNDEFINED | Not a CE.4 emission state — see note |  |

**UNDEFINED note:** "UNDEFINED" in CE.5 contract language refers to a field reference
that cannot resolve to a numeric value — specifically: a null field within a PARTIAL
signal (previously described as "UNDEFINED" in SIG-007 note field). This is not a
CE.4 emission state. CE.5 classifies this as FIELD_BLOCKED (CS-002) in the consumption
state model. See `consumption_state_model.md`.

COMPUTABLE_PENDING (EC-STATE-004) is reserved. When active, it MUST be treated as
PARTIAL for consumption purposes — its resolved fields are consumed normally; its
null fields trigger FIELD_BLOCKED. See Section 5.4.

---

## 5. CONSUMPTION RULES BY EMISSION STATE

### 5.1 COMPLETE signal

A COMPLETE signal (EC-STATE-001) guarantees all output fields are resolved and non-null
(CE.4 INV-002).

**Consumption rule:**
40.6 MUST extract the `signal_field` value directly from `signal.output`.
The value is guaranteed non-null. The binding rule is evaluated against this value.
No null-handling is required. No `BR-NULL-SIGNAL-BLOCKED` is applied.

**Consumption outcome:** One tier contribution from binding rule evaluation.

### 5.2 PARTIAL signal — resolved field

A PARTIAL signal (EC-STATE-002) may have a resolved (non-null) `signal_field`.

**Consumption rule:**
If the `signal_field` referenced in the binding table row is non-null in `signal.output`,
40.6 MUST treat that field as locally resolved. The binding rule is evaluated against
this value. No null-handling is required. The signal's partial state does not propagate
to this field's consumption outcome.

**Consumption outcome:** One tier contribution from binding rule evaluation.
The signal's overall state (PARTIAL) is transparent at field-level consumption.

### 5.3 PARTIAL signal — null field

A PARTIAL signal (EC-STATE-002) with a null `signal_field` carries a governed
`partiality_reasons` entry for that field (CE.4 INV-003).

**Consumption rule:**
If the `signal_field` referenced in the binding table row is null in `signal.output`,
40.6 MUST apply `BR-NULL-SIGNAL-BLOCKED` (CE.2 DEC-013). The `partiality_reasons`
metadata for that field is not consumed by 40.6 — it is a 40.5-internal traceability
artifact. 40.6 does not inspect `failure_class`, `cause`, or `upstream_signal`.

**Consumption outcome:** tier=BLOCKED (from `BR-NULL-SIGNAL-BLOCKED`).

### 5.4 BLOCKED signal

A BLOCKED signal (EC-STATE-003) guarantees `output=null` (CE.4 INV-004).
The `blocking_class`, `blocking_inputs`, and `blocking_reason` fields are present
but not consumed by 40.6.

**Consumption rule:**
40.6 observes `output=null`. It MUST apply `BR-NULL-SIGNAL-BLOCKED` (CE.2 DEC-013).
The blockage metadata is not consumed by 40.6. The BLOCKED signal produces a single
tier=BLOCKED for all binding table rows that reference it.

**Consumption outcome:** tier=BLOCKED (from `BR-NULL-SIGNAL-BLOCKED`).

### 5.5 COMPUTABLE_PENDING signal (reserved)

COMPUTABLE_PENDING (EC-STATE-004) is not active in PiOS v0.3. When introduced:

**Consumption rule:**
Treat COMPUTABLE_PENDING identically to PARTIAL. Resolved fields → binding rule
evaluation. Null fields → `BR-NULL-SIGNAL-BLOCKED` → tier=BLOCKED.

**Consumption outcome:** Field-level resolution determines tier contribution.

---

## 6. CONSUMPTION INVARIANTS

**CI-001:** 40.6 MUST NOT evaluate a binding rule against a null `signal_field` value
using any rule other than `BR-NULL-SIGNAL-BLOCKED`. Null is not a numeric input.

**CI-002:** 40.6 MUST NOT consume `partiality_reasons`, `blocking_class`, `blocking_inputs`,
or `blocking_reason` from the signal payload. These are CE.4 traceability fields.
They are not binding rule inputs.

**CI-003:** 40.6 MUST NOT infer signal computability class (CC-001..CC-005) from the
signal payload. Computability is a Signal Ledger property, not a runtime consumption input.

**CI-004:** 40.6 MUST NOT apply a different binding rule to a signal field based on the
signal's overall emission state. Binding rule selection is governed by the binding table
row (`binding_rule_id`), not by the signal's state. The state informs null-handling only.

**CI-005:** 40.6 MUST NOT aggregate tier contributions from multiple signals using any
method other than CE.2 DEC-009 max-tier resolution. Averaging, scoring, weighting,
and weighted precedence are all prohibited.

**CI-006:** 40.6 MUST produce exactly one tier contribution per binding table row.
A binding table row MUST NOT produce zero contributions or multiple contributions.

**CI-007:** Every binding table row MUST reference a signal that is present in the
40.5 packet. A signal reference with no matching packet entry is a structural gap —
it MUST NOT be treated as BLOCKED. It is a binding table error requiring governance
resolution.

---

## 7. BOUNDARY STATEMENT

CE.5 governs the 40.5 → 40.6 consumption handoff protocol.
CE.4 governs what the 40.5 packet contains.
CE.2 governs what 40.6 does with tier contributions after consumption.

No CE.5 rule modifies CE.4 emission semantics.
No CE.5 rule modifies CE.2 activation semantics.
CE.5 defines the protocol at the intersection of the two.

---

## 8. CONCLUSION

CE.5 establishes the consumption contract at the 40.5 → 40.6 boundary.
It defines four consumption states (CS-001..CS-004), five per-emission-state
consumption rules, seven consumption invariants, and prohibited patterns.

CE.5 is the third governance layer in the PiOS stack:
- CE.2: condition activation (40.6 → 40.10)
- CE.4: signal emission (40.5)
- CE.5: consumption handoff (40.5 → 40.6 interface)
