# CE.5 — Single Signal Consumption Rules

**Stream:** CE.5 — Signal Consumption & Propagation Contract
**Artifact type:** CONSUMPTION RULES (NORMATIVE)
**Date:** 2026-04-03
**Input source:** CE.4 signal output packet
**Authority:** CE.5

---

## 1. SCOPE

These rules govern consumption of one signal in isolation.
Each signal is consumed independently.
No rule references, reads, or depends on any other signal.

---

## 2. CONSUMPTION UNIT

The atomic consumption unit is one signal record from the CE.4 output packet:

```
{
  signal_id:      <string>
  state:          COMPLETE | PARTIAL | BLOCKED | COMPUTABLE_PENDING
  output:         <object or null>
}
```

CE.5 reads `signal_id`, `state`, and `output` only.
CE.5 does not read traceability, partiality_reasons, blocking metadata, or CE.4-internal fields.

---

## 3. CONSUMPTION RULES

### Rule C-001 — AVAILABLE signal

**Condition:** CE.4 state = COMPLETE → CE.5 consumption state = AVAILABLE

**Action:**
- Record signal_id
- Record consumption state: AVAILABLE
- Expose output object for downstream field access
- Do not modify output

**Prohibited:**
- Recalculation of any output field
- Enrichment of output object
- Any operation that changes the output value

---

### Rule C-002 — PARTIAL signal

**Condition:** CE.4 state = PARTIAL → CE.5 consumption state = PARTIAL

**Action:**
- Record signal_id
- Record consumption state: PARTIAL
- Expose output object for downstream field access
- Null fields in output remain null — they are not substituted, defaulted, or recalculated
- Do not modify output

**Prohibited:**
- Substituting null fields with default values
- Computing null fields from resolved fields
- Any cross-signal operation to fill null fields

---

### Rule C-003 — BLOCKED signal

**Condition:** CE.4 state = BLOCKED → CE.5 consumption state = BLOCKED

**Action:**
- Record signal_id
- Record consumption state: BLOCKED
- Output is null — no field access is possible
- Do not attempt field extraction

**Prohibited:**
- Treating output=null as a zero value
- Substituting a default output for a BLOCKED signal
- Any operation that recovers a value from a BLOCKED signal

---

### Rule C-004 — COMPUTABLE_PENDING signal (reserved)

**Condition:** CE.4 state = COMPUTABLE_PENDING → CE.5 consumption state = PARTIAL

**Action:** Apply Rule C-002 (same as PARTIAL).

---

### Rule C-005 — Signal absent from CE.4 packet

**Condition:** signal_id referenced but not present in CE.4 output packet

**Action:**
- Do not assign a consumption state
- Do not produce a consumption record
- Surface as structural error: signal reference with no CE.4 entry

**Prohibited:**
- Assigning BLOCKED as a default for an absent signal
- Assigning AVAILABLE as a default for an absent signal
- Producing any consumption record from an absent signal

---

## 4. RULE SELECTION

```
if signal_id NOT IN CE.4 packet:
    → C-005 (structural error)
elif CE.4 state == "BLOCKED":
    → C-003 (BLOCKED)
elif CE.4 state == "COMPLETE":
    → C-001 (AVAILABLE)
elif CE.4 state in ["PARTIAL", "COMPUTABLE_PENDING"]:
    → C-002 or C-004 (PARTIAL)
```

Each signal is evaluated once. Rule selection is deterministic.

---

## 5. CONSUMPTION RECORD OUTPUT

Each successfully consumed signal produces exactly one consumption record:

```
{
  signal_id:          <string>         — from CE.4
  origin:             "CE.4"           — fixed
  consumption_state:  AVAILABLE | PARTIAL | BLOCKED
  output_ref:         <reference to CE.4 output object or null>
}
```

The `output_ref` is a reference to the CE.4 output — not a copy, not a transformation.
