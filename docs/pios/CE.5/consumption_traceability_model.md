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

CE.5 traceability must achieve complete coverage of the expected signal scope.
No expected signal may disappear silently from CE.5 traceability output.

---

## 2. TRACEABILITY RECORD TYPES

CE.5 produces exactly two types of traceability records:

### Type 1 — Consumption Traceability Record

Produced for every signal that is present in the CE.4 output packet.

| Field | Value | Source |
|---|---|---|
| `signal_id` | Canonical signal identifier (e.g., SIG-001) | CE.4 signal record |
| `origin` | "CE.4" | Fixed |
| `consumption_state` | AVAILABLE \| PARTIAL \| BLOCKED | Derived from CE.4 emission state |

```
{
  signal_id:         <string>
  origin:            "CE.4"
  consumption_state: "AVAILABLE" | "PARTIAL" | "BLOCKED"
}
```

### Type 2 — Structural Gap Trace Record

Produced for every signal that is expected at the 40.5 → 40.6 boundary
(per the CE.4 Signal Ledger / governed expected packet surface)
but is absent from the CE.4 output packet.

| Field | Value | Note |
|---|---|---|
| `signal_id` | Expected signal identifier | From Signal Ledger scope |
| `origin` | "CE.4" | Fixed — the expected source is CE.4 |
| `status` | "MISSING" | Structural traceability status only |

```
{
  signal_id: <string>
  origin:    "CE.4"
  status:    "MISSING"
}
```

`status: "MISSING"` is NOT a CE.5 consumption state.
It is a structural traceability status.
No `consumption_state` field is assigned for missing signals.
The closed consumption state vocabulary (AVAILABLE / PARTIAL / BLOCKED) is unchanged.

---

## 3. STRUCTURAL GAP TRACE RULE

**Rule T-001 — Structural gap trace recording**

If a signal expected from the CE.4 authoritative surface (Signal Ledger / governed
expected packet surface) is absent from the CE.4 output packet, CE.5 MUST emit a
structural gap trace record for that signal.

The structural gap trace record makes the absence visible in CE.5 traceability output.
It does not assign a consumption state to the missing signal.
It does not create a new runtime state.
It does not route the missing signal into downstream consumption logic.

---

## 4. TRACEABILITY COMPLETENESS RULE

**Rule T-002 — Traceability completeness**

For every signal in scope at the CE.5 boundary, CE.5 MUST produce exactly one of:

- A consumption traceability record (Type 1), if the signal is present in the CE.4 packet

OR

- A structural gap trace record (Type 2), if the signal is expected but absent from the CE.4 packet

No expected signal may be omitted from CE.5 traceability output.

---

## 5. SCOPE CLARIFICATION

| Signal status | CE.5 traceability output | Record type |
|---|---|---|
| Present in CE.4 packet | Normal consumption record with `consumption_state` | Type 1 |
| Expected but absent from CE.4 packet | Structural gap record with `status: "MISSING"` | Type 2 |

- Type 1 records support consumption routing
- Type 2 records support audit completeness only
- Type 2 records do not enter consumption state logic
- Type 2 records do not enter propagation
- Structural gap handling does not create a new CE.5 runtime state

---

## 6. CURRENT SIGNAL TRACEABILITY — CE.2-R01-MIX

Traceability records for all 8 signals from `runs/pios/40.5/CE.2-R01-MIX/signal_output.json`.
All 8 governed signals are present in the packet — no structural gap records required.

| signal_id | origin | consumption_state | record type |
|---|---|---|---|
| SIG-001 | CE.4 | PARTIAL | Type 1 |
| SIG-002 | CE.4 | AVAILABLE | Type 1 |
| SIG-003 | CE.4 | BLOCKED | Type 1 |
| SIG-004 | CE.4 | AVAILABLE | Type 1 |
| SIG-005 | CE.4 | PARTIAL | Type 1 |
| SIG-006 | CE.4 | BLOCKED | Type 1 |
| SIG-007 | CE.4 | PARTIAL | Type 1 |
| SIG-008 | CE.4 | PARTIAL | Type 1 |

---

## 7. TRACEABILITY SCOPE BOUNDARY

CE.5 traceability records state at the consumption boundary.
They do not record:

- Why a signal is BLOCKED (CE.4: blocking_class, blocking_reason)
- Why a field is null in a PARTIAL signal (CE.4: partiality_reasons)
- What formula produced a field value (CE.4: traceability)
- What computability class a signal belongs to (CE.4: Signal Ledger)

For cause-level traceability, the CE.4 signal record is the authoritative source.
CE.5 traceability is boundary-state traceability only.

---

## 8. TRACEABILITY PRESERVATION RULE

For every signal in scope at the CE.5 boundary, CE.5 MUST produce either:

(1) a normal traceability record (Type 1) if the signal is present in the CE.4 packet, or
(2) a structural gap trace record (Type 2) if the signal is expected but absent.

No expected signal may disappear silently from CE.5 traceability.
All records are immutable once produced — they are not updated during propagation.
Type 2 records are not propagated downstream as consumption inputs.

---

## 9. CONSISTENCY WITH CE.5 ARTIFACTS

| Artifact | Consistency check | Result |
|---|---|---|
| consumption_state_model.md | AVAILABLE / PARTIAL / BLOCKED vocabulary unchanged; MISSING is not a fourth state | CONSISTENT |
| single_signal_consumption_rules.md | C-005 (absent signal → structural error) now has corresponding Type 2 trace record | CONSISTENT |
| propagation_boundary_enforcement.md | Type 2 records do not propagate — boundary enforcement unchanged | CONSISTENT |
| CE.5_EXECUTION_MANIFEST.md | Requires update to reflect structural gap trace rule addition | REQUIRES UPDATE |
