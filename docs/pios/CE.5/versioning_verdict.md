# CE.5 — Versioning Verdict

**Stream:** CE.5 — PiOS Signal Consumption & Propagation Contract Definition
**Artifact type:** VERSIONING DETERMINATION (AUTHORITATIVE)
**Date:** 2026-04-03
**Evidence base:** CE.4 versioning verdict, CE.5 governance analysis, PiOS version
  boundary criteria, `signal_consumption_contract.md`, `downstream_invariants.md`
**Authority:** CE.5

---

## 1. PURPOSE

This document determines whether CE.5 defines a new PiOS version boundary (PiOS v0.4)
or extends PiOS v0.3 without creating a new version boundary.

The determination applies the same versioning criteria used to establish PiOS v0.2 (CE.2)
and PiOS v0.3 (CE.4).

---

## 2. VERSION BOUNDARY CRITERIA

A new PiOS version boundary is justified when a CE-class stream:

1. Extends governed coverage to a previously ungoverned layer or boundary
2. Introduces a new governance object class that did not previously exist
3. Changes or augments the governed behavior of any existing layer
4. Creates new invariants that constrain downstream behavior

A CE-class stream does NOT create a new version boundary when it:
- Validates existing behavior without changing governance scope
- Documents previously implicit behavior without adding new constraints
- Provides traceability or compilation artifacts for an already-defined version

---

## 3. CE.5 ANALYSIS

### Test 1 — Does CE.5 extend governed coverage to a previously ungoverned boundary?

**Finding: YES**

The 40.5 → 40.6 consumption boundary was partially stated in CE.4 Section 6
("Downstream Consumption Constraints") but was not fully governed. CE.4 stated
*what* 40.6 must do with each emission state (evaluate binding rule or apply
BR-NULL-SIGNAL-BLOCKED). CE.5 formalizes this into:

- A closed consumption state model (CS-001..CS-004)
- A complete consumption rule set (SC-001..SC-006)
- A multi-signal aggregation model (AG-001..AG-006)
- 7 propagation rules (PR-001..PR-007)
- 9 downstream invariants (DI-001..DI-009)
- 11 prohibited consumption patterns (PC-001..PC-011)

The consumption boundary is now fully governed. Prior to CE.5, it was partially governed
at best (CE.4 Section 6 was a constraint statement, not a complete protocol definition).

---

### Test 2 — Does CE.5 introduce new governance object classes?

**Finding: YES**

CE.5 introduces:
- **Consumption states** (CS-001..CS-004): a new governance object class not defined by CE.4 or CE.2
- **Consumption rules** (SC-001..SC-006): a new governed rule class for the consumption protocol
- **Prohibited consumption patterns** (PC-001..PC-011): a new governed prohibition catalog

These are not present in CE.4 (which defines emission states) or CE.2 (which defines
activation rules). CE.5 defines the consumption-side counterpart to CE.4's emission-side model.

---

### Test 3 — Does CE.5 change or augment the governed behavior of existing layers?

**Finding: NO**

CE.5 does not change 40.5 (CE.4 governs). CE.5 does not change 40.6–40.10 (CE.2 governs).

CE.5 formalizes the protocol for the handoff between these two governed layers. The
underlying behavior was already implied by CE.4 + CE.2. CE.5 makes that protocol explicit
and governed, but does not require any change to existing layer implementations.

This is the same pattern as CE.4 vs CE.2: CE.4 governed 40.5 emission without changing
40.6–40.10. CE.5 governs the handoff without changing either side.

---

### Test 4 — Does CE.5 create new invariants that constrain downstream behavior?

**Finding: YES — but additive, not restrictive**

CE.5 defines 9 downstream invariants (DI-001..DI-009). These constrain what downstream
layers may assume — they provide guarantees, not restrictions on existing behavior.

DI-009 explicitly states that CE.2 DEC-001..DEC-014 are unchanged. The new invariants
add clarity, not new restrictions on 40.7–40.10 behavior.

---

## 4. VERSION DETERMINATION

### Summary of test results

| Test | Result | Weight |
|---|---|---|
| 1 — Ungoverned boundary now governed | YES | Strong indicator of version boundary |
| 2 — New governance object classes | YES | Strong indicator of version boundary |
| 3 — Existing layer behavior changed | NO | Indicator AGAINST escalation |
| 4 — New downstream invariants (additive) | YES (additive) | Weak-to-moderate indicator |

### Decision

**CE.5 defines PiOS v0.4.**

**Rationale:**

Tests 1 and 2 together are decisive. CE.5 governs a previously ungoverned boundary
and introduces new governance object classes (consumption states, consumption rules).
This is the same standard by which CE.4 defined PiOS v0.3: CE.4 governed a previously
ungoverned boundary (40.5 emission) and introduced new governance object classes
(emission states, computability classes, Signal Ledger).

Test 3 (no existing behavior changes) does not prevent a version boundary. CE.4 also
did not change CE.2 behavior — it governed an upstream boundary. CE.5 governs an
interface boundary between two already-governed layers.

The governance stack progression is:
```
PiOS v0.2  CE.2   40.6 → 40.10 (activation, propagation, directives)
PiOS v0.3  CE.4   40.5 (signal emission, computability, Signal Ledger)
PiOS v0.4  CE.5   40.5 → 40.6 (consumption handoff protocol)
```

---

## 5. PiOS v0.4 BOUNDARY STATEMENT

**PiOS v0.4 is defined by the addition of the CE.5 Signal Consumption Contract to
the PiOS governance stack, formalizing the 40.5 → 40.6 consumption handoff protocol
that connects CE.4 (emission) and CE.2 (activation), with CE.4 and CE.2 invariants unchanged.**

---

## 6. WHAT PiOS v0.4 ADDS

**New governance artifacts:**
- Consumption state model: CS-001..CS-004 (closed set)
- Single-signal consumption rules: SC-001..SC-006 (complete decision tree)
- Multi-signal aggregation model: AG-001..AG-006
- Propagation semantics: PR-001..PR-007
- Downstream invariants: DI-001..DI-009
- Prohibited consumption patterns: PC-001..PC-011

**Unchanged governance:**
- CE.4: Signal Emission Contract, Signal Ledger, computability model
- CE.2: DEC-001..DEC-014, binding rules, tier resolution, diagnosis, delivery

**Coverage extension:**
```
PiOS v0.3:  [ 40.5 emission ] + [ 40.6 → 40.10 activation/propagation ]
PiOS v0.4:  [ 40.5 emission ] + [ 40.5 → 40.6 handoff protocol ] + [ 40.6 → 40.10 activation/propagation ]
```

---

## 7. WHAT PiOS v0.4 DOES NOT MEAN

- PiOS v0.4 does NOT require engine changes in 40.5, 40.6, or any downstream layer
- PiOS v0.4 does NOT change the Signal Ledger entries (CE.4)
- PiOS v0.4 does NOT change binding rules or binding table schema (CE.2)
- PiOS v0.4 does NOT change tier resolution, diagnosis mapping, or directive logic
- PiOS v0.4 does NOT change QA.1–QA.4 validation findings (CE.2 certified and unchanged)

---

## 8. DEFERRED GOVERNANCE ITEMS (GC-*)

The following governance questions are identified but explicitly deferred from CE.5:

**GC-CE5-001:** Should `blocking_class` distinction (F-1a vs F-2) inform repair routing
at any layer? Currently invisible to 40.7+. Resolution requires a new CE-class stream
with explicit scope.

**GC-CE5-002:** CS-004 (STRUCTURAL_GAP) handling. CE.5 defines it as a governance error
but does not specify how 40.6 should surface it operationally (halt, log-and-skip, etc.).
Operational error handling protocol required.

**GC-CE5-003:** COMPUTABLE_PENDING (EC-STATE-004) activation. When this reserved state
is introduced, SC-005 becomes active. No additional governance changes required at CE.5
level, but the activation event requires a governed CE-class stream.

**GC-CE5-004:** Derived-of-derived signals. CE.4 DP-006 prohibits transitive propagation
without intermediate inspection. If derived-of-derived signals are introduced, CE.5
consumption rules must be extended to address multi-level derivation at the consumption
boundary.

---

## 9. CONCLUSION

**Verdict: PiOS v0.4**

CE.5 satisfies the version boundary criteria. It governs a previously ungoverned
boundary and introduces new governance object classes without changing existing
layer behavior. PiOS v0.4 is defined by CE.5 completing the governance stack across
the 40.5 → 40.6 handoff interface.
