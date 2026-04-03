# CE.5 — Consumption Traceability Model

**Stream:** CE.5 — Signal Consumption & Propagation Contract
**Artifact type:** TRACEABILITY MODEL (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.5

---

## 1. PURPOSE

This document defines the traceability record that CE.5 preserves for each consumed signal.
Traceability at CE.5 level records what was consumed, from where, and in what state.
It does not record why a signal is in a given state — that is CE.4 traceability.

---

## 2. REQUIRED TRACEABILITY FIELDS

For each consumed signal, CE.5 preserves exactly three fields:

| Field | Value | Source |
|---|---|---|
| `signal_id` | Canonical signal identifier (e.g., SIG-001) | CE.4 signal record |
| `origin` | "CE.4" | Fixed — all CE.5 inputs originate from CE.4 |
| `consumption_state` | AVAILABLE \| PARTIAL \| BLOCKED | Derived from CE.4 emission state per consumption state model |

These three fields constitute the CE.5 traceability record for a signal.
No additional fields are required. No additional fields are permitted.

---

## 3. TRACEABILITY RECORD STRUCTURE

```
{
  signal_id:         <string>
  origin:            "CE.4"
  consumption_state: "AVAILABLE" | "PARTIAL" | "BLOCKED"
}
```

---

## 4. CURRENT SIGNAL TRACEABILITY — CE.2-R01-MIX

Traceability records for all 8 signals from `runs/pios/40.5/CE.2-R01-MIX/signal_output.json`:

| signal_id | origin | consumption_state |
|---|---|---|
| SIG-001 | CE.4 | PARTIAL |
| SIG-002 | CE.4 | AVAILABLE |
| SIG-003 | CE.4 | BLOCKED |
| SIG-004 | CE.4 | AVAILABLE |
| SIG-005 | CE.4 | PARTIAL |
| SIG-006 | CE.4 | BLOCKED |
| SIG-007 | CE.4 | PARTIAL |
| SIG-008 | CE.4 | PARTIAL |

---

## 5. TRACEABILITY SCOPE BOUNDARY

CE.5 traceability records state at the consumption boundary.
They do not record:

- Why a signal is BLOCKED (CE.4: blocking_class, blocking_reason)
- Why a field is null in a PARTIAL signal (CE.4: partiality_reasons)
- What formula produced a field value (CE.4: traceability)
- What computability class a signal belongs to (CE.4: Signal Ledger)

For cause-level traceability, the CE.4 signal record is the authoritative source.
CE.5 traceability is boundary-state traceability only.

---

## 6. TRACEABILITY PRESERVATION RULE

A CE.5 traceability record MUST be produced for every signal present in the CE.4 packet.
No signal may pass through CE.5 without a traceability record.
The traceability record is immutable once produced — it is not updated during propagation.
