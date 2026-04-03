# CE.5 — Consumption State Model

**Stream:** CE.5 — PiOS Signal Consumption & Propagation Contract Definition
**Artifact type:** GOVERNANCE MODEL (NORMATIVE)
**Date:** 2026-04-03
**Evidence base:** CE.4 emission states (EC-STATE-001..004), CE.2 DEC-009, DEC-013,
  CE.2-R01-MIX binding surface, `signal_output.json` field-level analysis
**Authority:** CE.5

---

## 1. PURPOSE

This document defines the closed set of consumption states that arise when 40.6
processes a binding table row against the 40.5 signal output packet.

A consumption state describes what 40.6 observes at the moment it attempts to
consume a specific signal field for a specific condition. It is not a signal-level
state (that is CE.4 territory). It is a field-level binding outcome.

---

## 2. CONSUMPTION STATE — CLOSED SET

Exactly four consumption states are governed. No other state is valid.

```
CS-001   ACCEPTED
CS-002   FIELD_BLOCKED
CS-003   SIGNAL_BLOCKED
CS-004   STRUCTURAL_GAP
```

---

## 3. CONSUMPTION STATE DEFINITIONS

### CS-001 — ACCEPTED

**Trigger conditions:**
- Signal state = COMPLETE, AND the referenced `signal_field` is non-null (guaranteed)
- Signal state = PARTIAL, AND the referenced `signal_field` is non-null (locally resolved)
- Signal state = COMPUTABLE_PENDING (reserved), AND the referenced `signal_field` is non-null

**Semantics:**
The field value is present and numeric. The governing binding rule is evaluated against
this value. A tier contribution is produced from the binding rule evaluation result.

**Tier contribution source:** Binding rule evaluation (value-reactive, per DEC-013).

**40.6 action:** Extract field → evaluate binding rule → emit tier contribution.

**CE.4 state alignment:**
- COMPLETE → CS-001 (guaranteed for all referenced fields)
- PARTIAL → CS-001 (only for resolved fields in `output`)

---

### CS-002 — FIELD_BLOCKED

**Trigger conditions:**
- Signal state = PARTIAL, AND the referenced `signal_field` is null in `signal.output`
- Signal state = COMPUTABLE_PENDING (reserved), AND the referenced `signal_field` is null

**Semantics:**
The signal is present and partially resolved, but the specific field referenced by the
binding table row is null. The CE.4 `partiality_reasons` for this field is not consumed.
40.6 treats the null field as an unresolvable input.

This is the consumption state that corresponds to what the CE.5 contract term "UNDEFINED"
describes in legacy notation — a field reference that yields null within a PARTIAL signal.
The CE.5 governance term for this is FIELD_BLOCKED, not UNDEFINED. UNDEFINED is not a
governed consumption state.

**Tier contribution source:** `BR-NULL-SIGNAL-BLOCKED` (CE.2 DEC-013) → tier=BLOCKED.

**40.6 action:** Detect null field → apply `BR-NULL-SIGNAL-BLOCKED` → emit tier=BLOCKED.

**CE.4 state alignment:**
- PARTIAL → CS-002 (for null fields only)

---

### CS-003 — SIGNAL_BLOCKED

**Trigger conditions:**
- Signal state = BLOCKED (`output=null` at signal level)

**Semantics:**
The signal produced no output. Every binding table row referencing this signal by
any field resolves to CS-003. There is no field-level differentiation — the entire
signal output is null.

**Tier contribution source:** `BR-NULL-SIGNAL-BLOCKED` (CE.2 DEC-013) → tier=BLOCKED.

**40.6 action:** Detect `output=null` → apply `BR-NULL-SIGNAL-BLOCKED` → emit tier=BLOCKED.

**CE.4 state alignment:**
- BLOCKED → CS-003 (for all binding table rows referencing this signal)

**Distinction from CS-002:** CS-002 arises within a PARTIAL signal at field level.
CS-003 arises at signal level — no field extraction is possible. Both produce tier=BLOCKED
via `BR-NULL-SIGNAL-BLOCKED` but arise from different CE.4 emission states and have
different CE.4 traceability structures (partiality_reasons vs blocking_class).

---

### CS-004 — STRUCTURAL_GAP

**Trigger conditions:**
- A binding table row references a `signal_id` that is not present in the 40.5 output packet
- A binding table row references a `signal_field` that does not exist in `signal.output` for
  a COMPLETE or PARTIAL signal (field name mismatch, schema change, or registration error)

**Semantics:**
A structural gap is not a governed emission state and not a runtime signal failure.
It indicates an inconsistency between the binding table and the 40.5 packet — either
a signal that should be present is absent, or a field reference is incorrect.

**Tier contribution source:** None. CS-004 is a governance error, not a runtime-resolvable condition.

**40.6 action:** CS-004 MUST NOT be silently treated as tier=BLOCKED or any other tier.
It MUST be surfaced as a structural violation requiring governance resolution.

**CE.4 state alignment:** CS-004 is a binding table error, not a CE.4 emission state.
It indicates the binding table references a signal or field not registered in the Signal Ledger
or not present in the packet, which violates CE.4 Signal Ledger authority.

---

## 4. CONSUMPTION STATE RESOLUTION TABLE

For each binding table row, consumption state is determined by:

| Signal state (CE.4) | Field value | Consumption state | Tier contribution |
|---|---|---|---|
| COMPLETE | non-null | CS-001 ACCEPTED | binding rule evaluation |
| PARTIAL | non-null (for referenced field) | CS-001 ACCEPTED | binding rule evaluation |
| PARTIAL | null (for referenced field) | CS-002 FIELD_BLOCKED | tier=BLOCKED (BR-NULL-SIGNAL-BLOCKED) |
| BLOCKED | n/a (output=null) | CS-003 SIGNAL_BLOCKED | tier=BLOCKED (BR-NULL-SIGNAL-BLOCKED) |
| COMPUTABLE_PENDING | non-null | CS-001 ACCEPTED | binding rule evaluation |
| COMPUTABLE_PENDING | null | CS-002 FIELD_BLOCKED | tier=BLOCKED (BR-NULL-SIGNAL-BLOCKED) |
| (signal absent from packet) | n/a | CS-004 STRUCTURAL_GAP | governance error — no tier |
| (field absent from output) | n/a | CS-004 STRUCTURAL_GAP | governance error — no tier |

---

## 5. CURRENT CONSUMPTION STATE MAP — CE.2-R01-MIX

Under the CE.2-R01-MIX baseline binding table (8 rows, one per condition):

| Condition | Signal | Field | Signal state | Consumption state | Tier |
|---|---|---|---|---|---|
| COND-001 | SIG-002 | dependency_load_ratio | COMPLETE | CS-001 ACCEPTED | AT_RISK |
| COND-002 | SIG-004 | total_edge_density | COMPLETE | CS-001 ACCEPTED | STABLE |
| COND-003 | SIG-001 | static_structural_ratio | PARTIAL (resolved) | CS-001 ACCEPTED | STABLE |
| COND-004 | SIG-005 | throughput_rate | PARTIAL (resolved) | CS-001 ACCEPTED | AT_RISK |
| COND-005 | SIG-003 | output | BLOCKED | CS-003 SIGNAL_BLOCKED | BLOCKED |
| COND-006 | SIG-006 | output | BLOCKED | CS-003 SIGNAL_BLOCKED | BLOCKED |
| COND-007 | SIG-002 | dependency_load_ratio | COMPLETE | CS-001 ACCEPTED | AT_RISK |
| COND-008 | SIG-008 | coord_pressure_component | PARTIAL (resolved) | CS-001 ACCEPTED | STABLE |

Notes:
- COND-003 and COND-008 reference resolved fields from PARTIAL signals → CS-001 (not CS-002)
- COND-005/COND-006 reference BLOCKED signals → CS-003
- No CS-002 or CS-004 instances in the CE.2-R01-MIX baseline binding table
- The null fields in SIG-001, SIG-005, SIG-007, SIG-008 are not referenced by the 8-row
  CE.2-R01-MIX binding table — they produce no CS-002 events in the baseline

---

## 6. LEGACY TERM ALIGNMENT

| Legacy / informal term | Governed CE.5 term | Notes |
|---|---|---|
| VALID (CE.5 contract draft) | CS-001 ACCEPTED | From COMPLETE or resolved PARTIAL field |
| PARTIAL (CE.5 contract draft) | CS-001 or CS-002 | Depends on field resolution |
| BLOCKED (CE.5 contract draft) | CS-003 SIGNAL_BLOCKED | From BLOCKED signal |
| UNDEFINED (CE.5 contract draft / SIG-007 note) | CS-002 FIELD_BLOCKED | Null field in PARTIAL signal |
| (not previously defined) | CS-004 STRUCTURAL_GAP | Binding table / packet inconsistency |

The terms VALID, PARTIAL, BLOCKED, UNDEFINED from CE.5 contract draft language are not
governed consumption states. They are informal references. CS-001 through CS-004 are the
governed consumption state vocabulary.

---

## 7. CONCLUSION

The consumption state model defines exactly four consumption states:
- CS-001 (ACCEPTED): field resolved, binding rule evaluated, tier contribution produced
- CS-002 (FIELD_BLOCKED): field null in PARTIAL signal, tier=BLOCKED produced
- CS-003 (SIGNAL_BLOCKED): signal BLOCKED, tier=BLOCKED produced
- CS-004 (STRUCTURAL_GAP): binding table error, no tier, governance resolution required

CS-001 and CS-002/CS-003 account for all runtime consumption outcomes.
CS-004 is a governance error state, not a runtime tier source.
