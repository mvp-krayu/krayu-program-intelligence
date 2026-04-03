# CE.5 — Consumption State Model

**Stream:** CE.5 — Signal Consumption & Propagation Contract
**Artifact type:** STATE MODEL (NORMATIVE)
**Date:** 2026-04-03
**Input source:** CE.4 signal emission states
**Authority:** CE.5

---

## 1. DEFINITION

The CE.5 consumption layer exposes signal state from CE.4 to downstream layers.
It does not interpret state. It does not transform state.
It reads the CE.4 emission state and maps it to the CE.5 consumption vocabulary.

---

## 2. CONSUMPTION STATE VOCABULARY — CLOSED SET

Exactly three consumption states are defined. No other state is valid.

```
AVAILABLE   Signal output is fully present. All output fields are non-null.
PARTIAL     Signal output is present with one or more null fields.
BLOCKED     Signal output is absent. output = null.
```

---

## 3. MAPPING FROM CE.4 EMISSION STATES

| CE.4 Emission State | CE.5 Consumption State |
|---|---|
| COMPLETE | AVAILABLE |
| PARTIAL | PARTIAL |
| BLOCKED | BLOCKED |
| COMPUTABLE_PENDING (reserved) | PARTIAL |

The mapping is read-only. CE.5 does not modify the CE.4 emission record.

---

## 4. STATE PROPERTIES

### AVAILABLE

- Source: CE.4 state = COMPLETE
- Output object: present, non-null
- All output fields: non-null
- Downstream: all referenced fields may be consumed directly

### PARTIAL

- Source: CE.4 state = PARTIAL or COMPUTABLE_PENDING
- Output object: present, non-null
- Output fields: mix of resolved (non-null) and unresolved (null) values
- Downstream: resolved fields may be consumed; null fields are not consumable

### BLOCKED

- Source: CE.4 state = BLOCKED
- Output object: null
- No fields available for consumption
- Downstream: no field extraction possible

---

## 5. CONSTRAINTS

- CE.5 MUST NOT assign a consumption state not derived from the CE.4 emission record
- CE.5 MUST NOT modify the CE.4 emission record to change the resulting state
- CE.5 MUST NOT invent a state for a signal absent from the CE.4 output packet
- A signal with no CE.4 entry is a structural error — it carries no consumption state
