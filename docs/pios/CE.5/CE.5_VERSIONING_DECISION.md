# CE.5 — Versioning Decision

**Stream:** CE.5 — Signal Consumption & Propagation Contract
**Artifact type:** VERSIONING DECISION (AUTHORITATIVE)
**Date:** 2026-04-03
**Branch:** feature/ce5-consumption-propagation-contract
**Authority:** CE.5

---

## 1. CONTEXT

CE.5 defined the governed protocol for consuming CE.4 signal outputs at the 40.5 → 40.6
boundary and propagating those outputs downstream without transformation, recomputation,
or interpretation.

**CE.4 dependency:** CE.5 is structurally dependent on CE.4. Its consumption state vocabulary
maps directly from CE.4 emission states (consumption_state_model.md, Section 3). Its
propagation rules reference CE.4 output as the boundary input. CE.5 cannot be coherently
evaluated without CE.4 as the upstream layer.

---

## 2. VERSIONING TEST RESULTS

Tests apply the same framework used in CE.4_DECISION.md: four questions, each answered
YES or NO, each supported by direct evidence from committed CE.5 artifacts.

---

### V-001 — New governed boundary introduced

**Result: YES**

**Evidence:**
`propagation_boundary_enforcement.md` — Section 1 states: *"This document defines what the
CE.5 propagation boundary enforces. The boundary separates what CE.5 is responsible for from
what it must not do."* Sections 2 and 3 define the upstream boundary (CE.4 → CE.5) and
downstream boundary (CE.5 → downstream layer) as distinct governed surfaces.

Prior to CE.5, the 40.5 → 40.6 handoff had no governing protocol. CE.4 stated what the
40.5 packet contains. CE.2 states what 40.6 does with activation inputs. Neither governed
the consumption act itself — the protocol by which CE.4 outputs become CE.2 inputs.
CE.5 governs that act.

**Justification:**
The governed boundary at `40.5 → 40.6 consumption handoff` did not exist in CE.4 or CE.2.
CE.5 establishes it as a first-class governed surface with explicit intake enforcement and
delivery enforcement. This satisfies the new governed boundary criterion.

---

### V-002 — New governance object classes introduced

**Result: YES**

**Evidence:**

1. **Consumption states** — `consumption_state_model.md`, Section 2:
   Defines a closed set: AVAILABLE, PARTIAL, BLOCKED. These are distinct from CE.4
   emission states (COMPLETE/PARTIAL/BLOCKED). AVAILABLE is a new state label not present
   in CE.4. PARTIAL and BLOCKED carry different semantics at the consumption layer (field-level
   vs signal-level availability) from their CE.4 emission counterparts.

2. **Consumption rules** — `single_signal_consumption_rules.md`, Section 3:
   Rules C-001..C-005 define a governed decision tree for per-signal field consumption.
   This rule class does not exist in CE.4 or CE.2.

3. **Propagation rules** — `propagation_semantics.md`, Section 4:
   Rules P-001..P-005 define state-only transfer semantics. This rule class does not exist
   in CE.4 or CE.2.

4. **Structural gap trace records** — `consumption_traceability_model.md`, Section 2:
   Type 2 records `{signal_id, origin, status: "MISSING"}` are a new governance object class.
   Rules T-001 and T-002 govern when they must be emitted and what completeness requires.
   No equivalent object class exists in CE.4 or CE.2.

**Justification:**
Four new governance object classes are introduced. None are extensions of existing CE.4 or CE.2
objects — they are distinct classes defined at the consumption layer. This satisfies the new
governance object classes criterion.

---

### V-003 — Existing layer semantics extended or constrained

**Result: YES (constrained, not modified)**

**Evidence:**

`propagation_boundary_enforcement.md`, Section 5:
*"CE.5 is a pass-through layer. Input state = Output state. Input signal set = Output signal set.
No new information is created at CE.5."*

`propagation_boundary_enforcement.md`, Section 4 (Boundary Violations — Prohibited):
CE.5 explicitly prohibits: binding rule application within CE.5, combining two signal states
to produce a condition state, producing derived fields, carrying CE.4 traceability fields
forward as active inputs.

`single_signal_consumption_rules.md`, Rules C-001..C-005:
Each rule specifies exactly what is permitted for each CE.4 emission state. Rule C-003
(BLOCKED signal) prohibits treating output=null as a zero value, substituting a default
output, or recovering a value from a BLOCKED signal. Rule C-005 prohibits assigning any
consumption state to an absent signal.

**Justification:**
CE.5 constrains what downstream consumers may do with CE.4 outputs. It does not modify CE.4
semantics or CE.2 activation semantics — it enforces a consumption protocol that prevents
both upstream reinterpretation and downstream fabrication. The constraint is additive: it
adds restrictions at a previously ungoverned boundary without altering either upstream or
downstream layers.

---

### V-004 — Downstream invariants altered or newly enforced

**Result: YES (newly enforced; none altered)**

**Evidence:**

`propagation_semantics.md`, Rules P-001..P-005:

- **P-001** (State-only transfer): consumption state propagates unchanged — no upgrade or downgrade
- **P-002** (Output reference immutability): CE.4 output object is not copied or transformed
- **P-003** (One record per signal): exactly one consumption record per signal, no duplication
- **P-004** (No cross-signal propagation coupling): one signal's propagation does not affect another
- **P-005** (No derived propagation): CE.5 produces no propagation records for signals absent from CE.4 packet; structural gap trace records are traceability-only and do not propagate

`consumption_traceability_model.md`, Rules T-001..T-002:

- **T-001** (Structural gap trace): CE.5 MUST emit a structural gap trace record for any expected-but-absent signal
- **T-002** (Traceability completeness): every in-scope signal must be represented by exactly one record — either Type 1 or Type 2

These invariants are not present in CE.4 (which governs emission, not consumption) or CE.2
(which governs activation from tier contributions, not from the CE.4 packet directly).

**Justification:**
Seven new invariants (P-001..P-005, T-001..T-002) are introduced at the consumption boundary.
None modify existing CE.4 or CE.2 invariants. All are novel constraints that did not exist
before CE.5.

---

## 3. VERSION VERDICT

**CE.5 defines PiOS v0.4 (governance-defined baseline).**

All four versioning tests return YES:

| Test | Result |
|---|---|
| V-001 — New governed boundary | YES |
| V-002 — New governance object classes | YES |
| V-003 — Existing layer semantics constrained | YES |
| V-004 — New downstream invariants enforced | YES |

**PiOS v0.4 boundary:**

PiOS v0.4 is defined by the addition of the CE.5 Signal Consumption Contract to the PiOS
governance stack, governing the 40.5 → 40.6 consumption handoff protocol as a distinct
governed layer between CE.4 (signal emission) and CE.2 (condition activation).

**Governance stack:**

```
PiOS v0.2   CE.2   40.6 → 40.10   Condition activation, tier resolution, propagation, directives
PiOS v0.3   CE.4   40.5            Signal emission, computability model, Signal Ledger
PiOS v0.4   CE.5   40.5 → 40.6    Consumption handoff protocol
```

CE.4 and CE.2 invariants are unchanged. CE.5 adds governed coverage at the handoff interface.

---

## 4. EXECUTABILITY STATUS

**CE.5 is governance-defined ONLY.**
**CE.5 is NOT executable-proven.**

No run artifacts exist for CE.5. No QA campaign has been executed against a CE.5-governed
consumption layer. The CE.5_EXECUTION_MANIFEST.md validates governance artifact consistency
only — it does not constitute an executable proof.

Executable certification requires: (1) an engine implementation of the C-001..C-005 consumption
rules and P-001..P-005 propagation rules, and (2) a QA run demonstrating that the engine
produces correct consumption records and propagation behavior against CE.4-compliant signal
outputs.

---

## 5. DEPENDENCY STATEMENT

CE.5 promotion requires CE.4 baseline promotion first.

CE.5's consumption state model maps directly from CE.4 emission states
(consumption_state_model.md, Section 3 — AVAILABLE←COMPLETE, PARTIAL←PARTIAL, BLOCKED←BLOCKED).
CE.5's propagation rules reference CE.4 output as the authoritative input packet.
CE.5 cannot be promoted as a governance baseline while CE.4 remains unpromoted.

---

## 6. PROMOTION CONDITIONS

CE.5 is eligible for canonical promotion when all three conditions are met:

1. **CE.4 promoted** — CE.4 merged to canonical governance branch and declared PiOS v0.3 governance baseline
2. **Versioning verdict committed** — this artifact (`CE.5_VERSIONING_DECISION.md`) committed on `feature/ce5-consumption-propagation-contract`
3. **No contract conflicts** — no CE.5 artifact conflicts with CE.4 or CE.2 invariants as currently committed

Condition 1 is not yet met as of this writing.
Conditions 2 and 3 are met upon commit of this artifact.
