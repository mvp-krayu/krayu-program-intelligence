# CE.5 — Single-Signal Consumption Rules

**Stream:** CE.5 — PiOS Signal Consumption & Propagation Contract Definition
**Artifact type:** GOVERNANCE RULES (NORMATIVE)
**Date:** 2026-04-03
**Evidence base:** CE.4 emission states, CE.2 DEC-010/DEC-012/DEC-013,
  `signal_emission_contract_specification.md`, CE.2-R01-MIX binding table
**Authority:** CE.5

---

## 1. PURPOSE

This document defines the governed rules for consuming a single signal field from
the 40.5 output packet in 40.6. "Single-signal" means: one binding table row,
one signal, one field, one binding rule, one tier contribution.

These rules are complete: for every CE.4 emission state, exactly one consumption
path is defined. No ambiguity, no runtime judgment calls.

---

## 2. RULE PRECONDITIONS

For a binding table row to be evaluated, the following preconditions must hold:

1. The `signal_id` is present in the 40.5 output packet
2. The `signal_field` is a valid field name for the signal per its Signal Ledger entry
3. The `binding_rule_id` is a governed binding rule definition (DEC-013)

If any precondition fails, the row is a CS-004 STRUCTURAL_GAP and must not be evaluated.

---

## 3. CONSUMPTION RULES

### Rule SC-001 — COMPLETE signal: field extraction and binding rule evaluation

**Applies to:** Binding table rows where the referenced signal is in state=COMPLETE.

**Precondition guarantee:** CE.4 INV-002 guarantees all output fields are non-null.
Field extraction always succeeds for a COMPLETE signal.

**Procedure:**
```
1. Extract: value = signal.output[signal_field]
2. Assert: value is not null (invariant — violation = CE.4 contract failure, halt)
3. Evaluate: tier = binding_rule.evaluate(value)
4. Emit: tier_contribution = tier
```

**Consumption state produced:** CS-001 ACCEPTED

**Tier source:** Binding rule evaluation (value-reactive per DEC-013).

**Error handling:** A null value from a COMPLETE signal is a CE.4 payload violation.
40.6 MUST NOT apply `BR-NULL-SIGNAL-BLOCKED` as a fallback. The violation must be surfaced.

---

### Rule SC-002 — PARTIAL signal, resolved field: field extraction and binding rule evaluation

**Applies to:** Binding table rows where the referenced signal is in state=PARTIAL,
AND the referenced `signal_field` is non-null in `signal.output`.

**Determination:** Extract `signal.output[signal_field]`. If non-null → SC-002 applies.
If null → SC-003 applies. Determination is field-level, not signal-level.

**Procedure:**
```
1. Extract: value = signal.output[signal_field]
2. Confirm: value is not null (field-level determination)
3. Evaluate: tier = binding_rule.evaluate(value)
4. Emit: tier_contribution = tier
```

**Consumption state produced:** CS-001 ACCEPTED

**Tier source:** Binding rule evaluation.

**Key principle:** The signal's overall PARTIAL state does not affect consumption of
a resolved field. The resolved field is treated identically to a COMPLETE signal field.
Signal-level partiality is a 40.5-internal classification. 40.6 operates field-level.

---

### Rule SC-003 — PARTIAL signal, null field: forced BLOCKED tier

**Applies to:** Binding table rows where the referenced signal is in state=PARTIAL,
AND the referenced `signal_field` is null in `signal.output`.

**Determination:** Extract `signal.output[signal_field]`. If null → SC-003 applies.

**Procedure:**
```
1. Extract: value = signal.output[signal_field]
2. Confirm: value is null
3. Do NOT evaluate binding_rule against null
4. Apply: BR-NULL-SIGNAL-BLOCKED
5. Emit: tier_contribution = BLOCKED
```

**Consumption state produced:** CS-002 FIELD_BLOCKED

**Tier source:** `BR-NULL-SIGNAL-BLOCKED` (CE.2 DEC-013). Not the row's `binding_rule_id`.

**CE.4 metadata:** The `partiality_reasons` entry for this null field exists in the
CE.4-compliant payload but is NOT consumed by 40.6. `failure_class`, `upstream_signal`,
and `cause` are traceability fields for 40.5 governance — they are not routing inputs
for 40.6 consumption.

**Rationale:** The field is not computable in the current context regardless of cause.
40.6 does not need to know why — CE.2 `BR-NULL-SIGNAL-BLOCKED` is the governed response.

---

### Rule SC-004 — BLOCKED signal: forced BLOCKED tier

**Applies to:** Binding table rows where the referenced signal is in state=BLOCKED.

**Determination:** Signal state = BLOCKED → SC-004 applies. All binding table rows
referencing this signal receive SC-004, regardless of `signal_field` reference.

**Procedure:**
```
1. Observe: signal.output = null
2. Do NOT attempt field extraction (output is null, not an object)
3. Apply: BR-NULL-SIGNAL-BLOCKED
4. Emit: tier_contribution = BLOCKED
```

**Consumption state produced:** CS-003 SIGNAL_BLOCKED

**Tier source:** `BR-NULL-SIGNAL-BLOCKED` (CE.2 DEC-013).

**CE.4 metadata:** `blocking_class`, `blocking_inputs`, `blocking_reason` exist in the
payload but are NOT consumed by 40.6. These are CE.4 traceability fields.

**Multi-row consequence:** If a BLOCKED signal appears in multiple binding table rows
(for different conditions or fields), each row independently receives CS-003 → tier=BLOCKED.
There is no single-evaluation fan-out semantics. Each row is independently resolved.

---

### Rule SC-005 — COMPUTABLE_PENDING signal (reserved)

**Applies to:** Binding table rows where the referenced signal is in state=COMPUTABLE_PENDING.

**Status:** EC-STATE-004 is reserved and not active in PiOS v0.3. This rule is defined
to prevent ambiguity if COMPUTABLE_PENDING is activated before CE.5 is revised.

**Procedure:** Treat COMPUTABLE_PENDING identically to PARTIAL:
- Non-null field → SC-002 (ACCEPTED, binding rule evaluation)
- Null field → SC-003 (FIELD_BLOCKED, BR-NULL-SIGNAL-BLOCKED)

**Rationale:** COMPUTABLE_PENDING represents a signal that can eventually emit COMPLETE
but currently has null fields due to pending inputs. The consumption behavior is identical
to PARTIAL from 40.6's perspective — resolved fields are consumed, null fields are BLOCKED.

---

### Rule SC-006 — Missing signal or invalid field reference (structural gap)

**Applies to:** Binding table rows where:
- `signal_id` is not present in the 40.5 packet, OR
- `signal_field` does not exist as a key in `signal.output` for the identified signal

**Procedure:**
```
1. Detect absence (signal not found, or field not found in output object)
2. Classify: CS-004 STRUCTURAL_GAP
3. DO NOT emit a tier contribution
4. Surface as governance error — binding table references non-existent signal/field
```

**Consumption state produced:** CS-004 STRUCTURAL_GAP

**Tier source:** None. CS-004 does not produce a tier contribution.

**Prohibition:** SC-006 MUST NOT default to tier=BLOCKED. A missing signal is not a
BLOCKED signal. It is a contract violation between the binding table and the Signal Ledger.
Defaulting to BLOCKED would silently mask a governance error.

---

## 4. RULE SELECTION LOGIC

For each binding table row, the applicable rule is determined as follows:

```
if signal_id NOT IN packet:
    → SC-006 (CS-004 STRUCTURAL_GAP)

if signal.state == "BLOCKED":
    → SC-004 (CS-003 SIGNAL_BLOCKED)

if signal.state == "COMPLETE":
    → SC-001 (CS-001 ACCEPTED)

if signal.state == "PARTIAL" or "COMPUTABLE_PENDING":
    if signal.output[signal_field] is not null:
        → SC-002 (CS-001 ACCEPTED)
    else if signal.output[signal_field] is null:
        → SC-003 (CS-002 FIELD_BLOCKED)
    else (signal_field not in signal.output):
        → SC-006 (CS-004 STRUCTURAL_GAP)
```

This logic is deterministic. No runtime judgment is required.

---

## 5. TIER OUTPUT TABLE

| Rule | Consumption state | Tier contribution |
|---|---|---|
| SC-001 | CS-001 ACCEPTED | From binding rule evaluation |
| SC-002 | CS-001 ACCEPTED | From binding rule evaluation |
| SC-003 | CS-002 FIELD_BLOCKED | BLOCKED (BR-NULL-SIGNAL-BLOCKED) |
| SC-004 | CS-003 SIGNAL_BLOCKED | BLOCKED (BR-NULL-SIGNAL-BLOCKED) |
| SC-005 (non-null) | CS-001 ACCEPTED | From binding rule evaluation |
| SC-005 (null) | CS-002 FIELD_BLOCKED | BLOCKED (BR-NULL-SIGNAL-BLOCKED) |
| SC-006 | CS-004 STRUCTURAL_GAP | No tier — governance error |

---

## 6. APPLICATION TO CE.2-R01-MIX BASELINE

Verification that all 8 baseline binding rows are covered by governed rules:

| Condition | Signal | Field | Signal state | Applied rule | Consumption state | Tier |
|---|---|---|---|---|---|---|
| COND-001 | SIG-002 | dependency_load_ratio | COMPLETE | SC-001 | CS-001 | AT_RISK |
| COND-002 | SIG-004 | total_edge_density | COMPLETE | SC-001 | CS-001 | STABLE |
| COND-003 | SIG-001 | static_structural_ratio | PARTIAL (resolved) | SC-002 | CS-001 | STABLE |
| COND-004 | SIG-005 | throughput_rate | PARTIAL (resolved) | SC-002 | CS-001 | AT_RISK |
| COND-005 | SIG-003 | output | BLOCKED | SC-004 | CS-003 | BLOCKED |
| COND-006 | SIG-006 | output | BLOCKED | SC-004 | CS-003 | BLOCKED |
| COND-007 | SIG-002 | dependency_load_ratio | COMPLETE | SC-001 | CS-001 | AT_RISK |
| COND-008 | SIG-008 | coord_pressure_component | PARTIAL (resolved) | SC-002 | CS-001 | STABLE |

All 8 rows covered. No SC-006 instances (no structural gaps in CE.2-R01-MIX).
No SC-003 instances in 8-row table (null fields in SIG-001/SIG-005 not referenced).

---

## 7. CONCLUSION

Six consumption rules are defined (SC-001..SC-006). Together they form a complete,
deterministic decision tree for every possible binding table row evaluation.

Rules SC-001 and SC-002 cover successful field consumption (CS-001 ACCEPTED).
Rules SC-003 and SC-004 cover null/blocked field consumption (CS-002/CS-003).
Rule SC-005 extends SC-002/SC-003 to the reserved COMPUTABLE_PENDING state.
Rule SC-006 isolates structural gaps from runtime consumption failures.

No binding table row can produce an ambiguous or unclassified outcome under these rules.
