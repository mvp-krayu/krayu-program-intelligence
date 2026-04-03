# CE.5 — Downstream Invariants

**Stream:** CE.5 — PiOS Signal Consumption & Propagation Contract Definition
**Artifact type:** INVARIANT SPECIFICATION (NORMATIVE)
**Date:** 2026-04-03
**Evidence base:** CE.4 INV-001..INV-007, CE.2 DEC-001..DEC-014,
  `single_signal_consumption_rules.md`, `propagation_semantics.md`
**Authority:** CE.5

---

## 1. PURPOSE

This document states what layers 40.7 through 40.10 may assume about the consumption
surface, given CE.4 and CE.5 guarantees together.

These invariants are the combined output of:
- CE.4 emission invariants (what 40.5 guarantees about its output)
- CE.5 consumption rules (what 40.6 is required to do with that output)

Downstream layers may reason from these invariants without inspecting 40.5 payloads
or re-evaluating binding rules.

---

## 2. INVARIANT CLASSIFICATION

**Class A — Derived from CE.4 alone**
Invariants that hold because CE.4 governs the 40.5 packet.
CE.5 restates them as downstream-observable consequences.

**Class B — Derived from CE.5 consumption rules**
Invariants that hold because CE.5 governs how 40.6 consumes the packet.

**Class C — Derived from CE.4 + CE.5 combined**
Invariants that require both CE.4 emission guarantees and CE.5 consumption rules.

---

## 3. INVARIANTS

### DI-001 — Every condition has exactly one governed state  [Class C]

Every condition in the 40.6 output carries exactly one `condition_coverage_state`
from the governed tier vocabulary: `BLOCKED | DEGRADED | AT_RISK | STABLE`.

**Sources:**
- CE.4 guarantees every signal has exactly one governed emission state (INV-001)
- CE.5 SC-001..SC-004 guarantee every binding row produces exactly one tier contribution
- CE.2 DEC-009 guarantees max-tier produces exactly one winning tier
- CE.2 DEC-011 guarantees the winning tier is emitted directly as condition state

No condition may carry an ungoverned, absent, or multi-valued state.

---

### DI-002 — A STABLE condition has no BLOCKED or AT_RISK contributions  [Class C]

If a condition emits `condition_coverage_state=STABLE`, then every binding table row
for that condition produced tier=STABLE.

**Contrapositive:** If any binding row for a condition produced tier=BLOCKED, DEGRADED,
or AT_RISK, the condition state cannot be STABLE (DEC-009 max-tier would select the
higher tier).

**Consequence for 40.7:** A STABLE condition state is not a suppressed AT_RISK or
BLOCKED. It means no signal field contributing to that condition crossed its
threshold or was null/blocked.

---

### DI-003 — A BLOCKED condition has at least one CS-002 or CS-003 row  [Class C]

If a condition emits `condition_coverage_state=BLOCKED`, then at least one binding
table row for that condition produced tier=BLOCKED from either:
- CS-002 FIELD_BLOCKED (null field in PARTIAL signal, SC-003 rule applied)
- CS-003 SIGNAL_BLOCKED (BLOCKED signal, SC-004 rule applied)

**Consequence for 40.7:** A BLOCKED condition state is always traceable to a specific
signal or signal field that was null/blocked. The traceability path is:
binding row → signal field null or BLOCKED → BR-NULL-SIGNAL-BLOCKED → tier=BLOCKED → condition BLOCKED.

---

### DI-004 — CE.4 metadata is not a condition state input  [Class B]

Layers 40.7 through 40.10 will never receive CE.4 metadata fields (`partiality_reasons`,
`blocking_class`, `blocking_inputs`, `blocking_reason`, `traceability`) as inputs to their
activation or routing logic. These fields exist only in the 40.5 packet and are not
projected downstream by 40.6 consumption.

**Consequence:** 40.7 diagnosis routing, synthesis state assignment, and 40.10 directive
generation are entirely independent of why a signal was null. CE.4 failure class distinction
(F-1a vs F-2 vs F-3) is invisible to 40.7+.

---

### DI-005 — Signal-level partiality is not a condition attribute  [Class B]

The emission state of a signal (COMPLETE, PARTIAL, BLOCKED) is not propagated as an
attribute of the condition. `condition_coverage_state` reflects the tier outcome of
binding rule evaluation, not the signal's emission state.

**Example:**
- SIG-001 is PARTIAL, but `static_structural_ratio` = 0.875 (resolved).
- COND-003 binds to this field via BR-STRUCTURAL-RATIO-001.
- Binding rule evaluation: 0.875 < threshold → STABLE.
- `COND-003.condition_coverage_state` = STABLE, not PARTIAL.

40.7 sees COND-003 as STABLE — the PARTIAL emission state of SIG-001 is invisible.

---

### DI-006 — No cross-condition contamination is possible  [Class B]

No tier contribution produced during consumption of signal fields for condition A
can affect condition B. Aggregation is condition-local (AG-002). Fan-out from a
shared signal is isolated (QA.4 validated).

**Consequence for 40.7:** When DIAG-001 activates or deactivates, it is caused solely
by the binding rows for COND-001. Changes to COND-007's binding rows (even under
the same signal, same rule) cannot affect DIAG-001's activation state.

---

### DI-007 — Governed coverage: all 8 signals, all 8 conditions  [Class A + B]

In PiOS v0.3 with CE.4-compliant 40.5 emission:
- All 8 signals carry governed emission states (CE.4 INV-001)
- All 8 binding rows produce governed tier contributions (CE.5 SC-001..SC-004)
- All 8 conditions produce governed `condition_coverage_state` values

No condition is ungoverned. No condition state is produced from an unregistered
signal or an unresolvable field reference.

---

### DI-008 — BLOCKED from CC-005 signals is indistinguishable from BLOCKED from CC-003  [Class A + B]

At 40.7+, a BLOCKED condition state arising from SIG-003 (CC-005, FORMULA_ABSENCE)
is indistinguishable from one arising from SIG-006 (CC-005 / F-1b-style — all inputs
event-based). Both produce CS-003 SIGNAL_BLOCKED → tier=BLOCKED → condition BLOCKED
→ diagnosis BLOCKED.

**Consequence:** 40.7 routing does not distinguish NON_COMPUTABLE signals from
temporarily-BLOCKED signals. This distinction exists at CE.4 level (computability
class, `blocking_class`). It is intentionally not surfaced downstream — downstream
layers diagnose and direct based on condition state, not on 40.5 implementation detail.

**Implication for repair routing:** If repair routing ever needs to distinguish
CC-005 (formula-absent) from CC-003 (time-series absent) or F-2 from F-1a, that
routing must operate from the CE.4 Signal Ledger, not from 40.7+ pipeline state.

---

### DI-009 — CE.2 DEC-001..DEC-014 invariants are preserved  [Class A]

CE.5 does not alter, extend, or supersede any CE.2 decision. DEC-001 through DEC-014
remain in full force. The governance stack is additive:

```
CE.2:  40.6 → 40.10 activation, tier resolution, propagation
CE.4:  40.5 emission contract, signal computability, Signal Ledger
CE.5:  40.5 → 40.6 consumption handoff protocol
```

No CE.5 invariant requires a behavior change in any layer governed by CE.2.
No CE.4 invariant requires a behavior change in any layer governed by CE.2.
PiOS v0.3 CE.2 behavior is certified and unchanged.

---

## 4. INVARIANT SUMMARY TABLE

| Invariant | Class | Layer that benefits | Key guarantee |
|---|---|---|---|
| DI-001 | C | 40.7–40.10 | Every condition has exactly one governed state |
| DI-002 | C | 40.7–40.10 | STABLE → no higher-tier contributions present |
| DI-003 | C | 40.7–40.10 | BLOCKED → at least one CS-002/CS-003 binding row |
| DI-004 | B | 40.7–40.10 | CE.4 metadata not a downstream input |
| DI-005 | B | 40.7–40.10 | Signal partiality not a condition attribute |
| DI-006 | B | 40.7–40.10 | No cross-condition contamination possible |
| DI-007 | A+B | 40.7–40.10 | All 8 conditions fully governed |
| DI-008 | A+B | 40.7–40.10 | CC-005 BLOCKED indistinguishable from other BLOCKED at condition level |
| DI-009 | A | 40.7–40.10 | CE.2 DEC-001..DEC-014 unchanged |

---

## 5. CONCLUSION

CE.5 defines 9 downstream invariants (DI-001..DI-009) in three classes.
These invariants allow 40.7 through 40.10 to reason from condition states alone,
without knowledge of the CE.4 emission surface or CE.5 consumption details.

The layered guarantee is:
- CE.4 guarantees: a structurally complete, consistent signal output packet
- CE.5 guarantees: deterministic, complete, loss-free consumption of that packet into condition states
- CE.2 guarantees: deterministic, traceable, zero-leakage propagation from condition states to directives
