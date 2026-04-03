# CE.5 — Propagation Semantics

**Stream:** CE.5 — Signal Consumption & Propagation Contract
**Artifact type:** PROPAGATION SPECIFICATION (NORMATIVE)
**Date:** 2026-04-03
**Input source:** CE.5 consumption records
**Authority:** CE.5

---

## 1. DEFINITION

Propagation is the transfer of a CE.5 consumption record to downstream layers.
Propagation is state transfer only. It does not transform, enrich, or derive.

---

## 2. WHAT PROPAGATES

For each consumed signal, exactly the following is propagated:

```
signal_id          — unchanged from CE.4
origin             — "CE.4" (fixed)
consumption_state  — AVAILABLE | PARTIAL | BLOCKED
output_ref         — reference to CE.4 output (unchanged)
```

Nothing else propagates from the CE.5 layer.

---

## 3. WHAT DOES NOT PROPAGATE

The following CE.4 fields do not propagate through CE.5:

| CE.4 Field | Reason |
|---|---|
| traceability | CE.4-internal formula record |
| partiality_reasons | CE.4-internal null cause record |
| blocking_class | CE.4-internal blockage classification |
| blocking_inputs | CE.4-internal input attribution |
| blocking_reason | CE.4-internal cause string |
| canonical_name | Metadata — not a propagation field |
| ckr | Metadata — not a propagation field |

These fields remain in the CE.4 record. They are accessible from the run artifact.
CE.5 does not carry them forward.

---

## 4. PROPAGATION RULES

### Rule P-001 — State-only transfer

CE.5 propagates consumption state as received. The state is not upgraded, downgraded,
or modified during propagation.

### Rule P-002 — Output reference immutability

The CE.4 output object is not copied or transformed. It is passed by reference.
CE.5 does not write to it.

### Rule P-003 — One record per signal

Each signal produces exactly one consumption record. That record propagates exactly once.
No duplication. No fan-out to multiple downstream paths within CE.5.

### Rule P-004 — No cross-signal propagation coupling

The propagation of one signal's consumption record does not affect, trigger, or modify
the propagation of any other signal's consumption record.

### Rule P-005 — No derived propagation

CE.5 does not produce propagation records for signals not present in the CE.4 packet.
No new signal records are created by CE.5.

---

## 5. PROPAGATION BOUNDARY

CE.5 propagation terminates when the consumption record is delivered to the
downstream layer boundary.

What the downstream layer does with the consumption record is not governed by CE.5.
CE.5 guarantees only that what it delivers is identical in state and content
to what CE.4 emitted.
