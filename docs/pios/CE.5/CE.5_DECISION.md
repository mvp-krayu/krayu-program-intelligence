# CE.5 — Closure Decision

**Stream:** CE.5 — PiOS Signal Consumption & Propagation Contract Definition
**Artifact type:** STREAM CLOSURE DECISION (AUTHORITATIVE)
**Date:** 2026-04-03
**Status:** CLOSED — AUTHORITATIVE BASELINE
**Authority:** CE.5

---

## A. STREAM IDENTIFICATION

**Stream:** CE.5 — PiOS Signal Consumption & Propagation Contract Definition
**Governed by:** CE.4_FINAL_GOVERNANCE_STATE.md (CE.4), CE.2 DEC-001..DEC-014 (CE.2)
**Branch:** feature/ce5-consumption-propagation-contract
**Baseline derived from:** ce2-v0.2-baseline (CE.2 certified baseline, commit 1245ec5)

---

## B. SCOPE EXECUTED

CE.5 defined the canonical governance contract for the 40.5 → 40.6 signal consumption
and propagation handoff. The following governance questions were resolved:

1. **What does 40.6 observe when it consumes the CE.4-compliant 40.5 packet?**
   → Closed consumption state model: CS-001 (ACCEPTED), CS-002 (FIELD_BLOCKED),
     CS-003 (SIGNAL_BLOCKED), CS-004 (STRUCTURAL_GAP)

2. **What must 40.6 do for each CE.4 emission state?**
   → Closed consumption rule set: SC-001..SC-006 (complete decision tree)

3. **How do multiple tier contributions aggregate per condition?**
   → Multi-signal aggregation model: AG-001..AG-006
   → DEC-009 max-tier sole aggregation mechanism confirmed

4. **What propagates across the 40.5 → 40.6 boundary and what is discarded?**
   → Propagation semantics: PR-001..PR-007
   → CE.4 metadata discarded at 40.6 boundary (not consumed downstream)
   → Condition tier is the sole propagating artifact

5. **What can 40.7–40.10 assume?**
   → Downstream invariants: DI-001..DI-009
   → CE.2 DEC-001..DEC-014 unchanged and preserved

6. **What behaviors are explicitly prohibited?**
   → Prohibition catalog: PC-001..PC-011

7. **Does CE.5 define a new PiOS version?**
   → YES: PiOS v0.4

---

## C. ARTIFACTS PRODUCED

| Artifact | Type | Status |
|---|---|---|
| `signal_consumption_contract.md` | CONTRACT SPECIFICATION | COMPLETE |
| `consumption_state_model.md` | GOVERNANCE MODEL | COMPLETE |
| `single_signal_consumption_rules.md` | GOVERNANCE RULES | COMPLETE |
| `multi_signal_aggregation_model.md` | GOVERNANCE MODEL | COMPLETE |
| `propagation_semantics.md` | GOVERNANCE SPECIFICATION | COMPLETE |
| `downstream_invariants.md` | INVARIANT SPECIFICATION | COMPLETE |
| `prohibited_consumption_patterns.md` | PROHIBITION CATALOG | COMPLETE |
| `versioning_verdict.md` | VERSIONING DETERMINATION | COMPLETE |
| `CE.5_DECISION.md` | STREAM CLOSURE DECISION | COMPLETE |

---

## D. GOVERNANCE DEFINITIONS — CLOSED

The following governance objects are now defined and closed:

### Consumption States (closed set)
```
CS-001   ACCEPTED          — field resolved, binding rule evaluated
CS-002   FIELD_BLOCKED     — null field in PARTIAL signal, BR-NULL-SIGNAL-BLOCKED applied
CS-003   SIGNAL_BLOCKED    — BLOCKED signal (output=null), BR-NULL-SIGNAL-BLOCKED applied
CS-004   STRUCTURAL_GAP    — binding table error, no tier contribution
```

### Consumption Rules (complete decision tree)
```
SC-001   COMPLETE signal → field extract → binding rule evaluation
SC-002   PARTIAL signal, resolved field → same as SC-001
SC-003   PARTIAL signal, null field → BR-NULL-SIGNAL-BLOCKED → tier=BLOCKED
SC-004   BLOCKED signal → BR-NULL-SIGNAL-BLOCKED → tier=BLOCKED
SC-005   COMPUTABLE_PENDING → treat as PARTIAL (reserved)
SC-006   Missing signal or field → CS-004 STRUCTURAL_GAP → no tier
```

### Aggregation Rules (per condition)
```
AG-001   Independent row evaluation — no row observes another row's tier
AG-002   Per-condition scope — no cross-condition tier pooling
AG-003   DEC-009 max-tier sole aggregation mechanism
AG-004   Single winner, no escalation within same tier
AG-005   Complete tier vocabulary only — no CS-004 in aggregation pool
AG-006   Tier emitted directly as condition_coverage_state (DEC-011)
```

### Propagation Rules
```
PR-001   Causal completeness — every condition change traceable to signal field
PR-002   No amplification — signal change isolated to declaring conditions only
PR-003   No suppression — BLOCKED tier cannot be downgraded
PR-004   No causal inversion — AT_RISK cannot produce STABLE
PR-005   Metadata isolation — CE.4 metadata not a downstream input
PR-006   No synthetic states — governed tier vocabulary only
PR-007   Packet immutability — 40.6 reads 40.5 packet read-only
```

### Downstream Invariants
```
DI-001   Every condition has exactly one governed state
DI-002   STABLE → no higher-tier contributions present
DI-003   BLOCKED → at least one CS-002/CS-003 binding row
DI-004   CE.4 metadata not a downstream input
DI-005   Signal partiality not a condition attribute
DI-006   No cross-condition contamination possible
DI-007   All 8 signals and conditions fully governed in PiOS v0.4
DI-008   CC-005 BLOCKED indistinguishable from other BLOCKED at condition level
DI-009   CE.2 DEC-001..DEC-014 unchanged
```

### Prohibited Consumption Patterns
```
PC-001   Null field passed to threshold rule (silent zero substitution)
PC-002   Missing signal → STABLE default
PC-003   Missing signal → BLOCKED default
PC-004   blocking_class used for tier routing
PC-005   partiality_reasons failure_class used for tier
PC-006   Count-based tier aggregation
PC-007   Signal emission state as condition attribute
PC-008   Shared mutable state across fan-out rows
PC-009   New tier from CE.4 metadata
PC-010   BLOCKED → STABLE silent degradation (most critical)
PC-011   note field consumed as routing input
```

---

## E. VERSIONING DETERMINATION

**CE.5 defines PiOS v0.4.**

**PiOS v0.4 boundary statement:**

> PiOS v0.4 is defined by the addition of the CE.5 Signal Consumption Contract to
> the PiOS governance stack, formalizing the 40.5 → 40.6 consumption handoff protocol
> that connects CE.4 (emission) and CE.2 (activation), with CE.4 and CE.2 invariants unchanged.

**PiOS governance stack (complete):**

```
PiOS v0.2   CE.2   40.6 → 40.10 (activation, tier resolution, diagnosis, delivery, directives)
PiOS v0.3   CE.4   40.5 (signal emission, computability, Signal Ledger)
PiOS v0.4   CE.5   40.5 → 40.6 (consumption handoff protocol)
```

---

## F. BOUNDARY CONDITIONS — WHAT CE.5 DOES NOT CHANGE

The following are explicitly not changed by CE.5:

- CE.4 Signal Emission Contract — emission states, payload invariants, failure classes
- CE.4 Signal Ledger — all 8 entries unchanged
- CE.4 Computability model — CC-001..CC-005
- CE.4 Dependency propagation rules — DP-001..DP-007
- CE.4 governance_status=PARTIALLY_GOVERNED (documentation debt D-001/D-002 still open)
- CE.2 DEC-001..DEC-014 — all decisions unchanged
- CE.2 QA.1–QA.4 validation findings — certified baseline unchanged
- Binding rules BR-* definitions — governed by CE.2 DEC-013
- Binding table schema — governed by CE.2 DEC-012
- 40.7–40.10 behavior — governed by CE.2

---

## G. DEFERRED GOVERNANCE

Four items deferred out of scope (see `versioning_verdict.md` GC-CE5-001..004):

- GC-CE5-001: blocking_class distinction for repair routing
- GC-CE5-002: CS-004 operational error handling protocol
- GC-CE5-003: COMPUTABLE_PENDING (EC-STATE-004) activation stream
- GC-CE5-004: Derived-of-derived signal consumption boundary extension

---

## H. SCOPE COMPLIANCE STATEMENT

CE.5 executed strictly within its declared scope. No CE.5 artifact:
- Redefined emission states (CE.4 domain)
- Redefined signal semantics (CE.4 domain)
- Changed Signal Ledger entries (CE.4 domain)
- Introduced new signal states (CE.4 domain)
- Redefined binding rules (CE.2 domain)
- Redefined tier resolution (CE.2 domain)
- Changed diagnosis mapping (CE.2 domain)

No CE.5-SCOPE-VIOLATION occurred during stream execution.

---

## I. CLOSURE STATEMENT

CE.5 is CLOSED.

The PiOS Signal Consumption Contract is defined. The 40.5 → 40.6 handoff protocol
is fully governed. PiOS v0.4 is the authoritative governance baseline.

```
Stream:    CE.5
Status:    CLOSED — AUTHORITATIVE
Version:   PiOS v0.4
Branch:    feature/ce5-consumption-propagation-contract
Date:      2026-04-03
```

---

END OF CE.5
