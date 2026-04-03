# EX.H1 — Handover Decision

**Stream:** EX.H1 — Execution Handover (CE → EX Transition)
**Artifact type:** HANDOVER DECISION (NORMATIVE)
**Date:** 2026-04-03
**Authority:** EX.H1
**Status:** CLOSED

---

## 1. STREAM PURPOSE

EX.H1 was initiated post-CE.11 to formally transition the Krayu Program Intelligence
Discipline from governance definition streams (CE.x) to execution streams (EX.x).
The transition establishes what is fixed, what execution may do, and how execution
remains governed.

---

## 2. ARTIFACTS PRODUCED

| # | Artifact | Status |
|---|---|---|
| 1 | `EX.H1_EXECUTION_BASELINE.md` | COMPLETE |
| 2 | `EX.H1_RUNTIME_BINDING_RULES.md` | COMPLETE |
| 3 | `EX.H1_EXECUTION_PRINCIPLES.md` | COMPLETE |
| 4 | `EX.H1_SYSTEM_BOUNDARY.md` | COMPLETE |
| 5 | `EX.H1_STREAM_DEFINITION.md` | COMPLETE |
| 6 | `EX.H1_DECISION.md` | COMPLETE |

---

## 3. DECISION QUESTIONS

### Q1: Is execution now formally separated from governance?

**YES.**

The handover establishes a clear structural separation:

- **CE streams** define governance: contracts, invariants, boundaries, versioning.
  CE streams produce locked artifacts. Once closed, CE artifacts are immutable.

- **EX streams** operate under governance: they invoke, validate, bridge, and
  ingest — but they do not define. No EX stream may produce a governance artifact,
  modify a contract, or introduce behavior not traceable to a locked CE artifact.

The separation is enforced structurally (CE vs EX namespace), operationally
(execution principles P1–P4 apply only to EX streams), and procedurally
(any governance need discovered in an EX stream must trigger a new CE stream
before implementation).

The four EX stream types (EX.1–EX.4) are the exhaustive set of permitted
execution operations. Anything outside this set requires a CE.11-governed
extension.

---

### Q2: Is PiOS v0.4 the enforced runtime baseline?

**YES.**

EX.H1_EXECUTION_BASELINE.md records:
- PiOS v0.4 is the ONLY valid execution baseline
- All locked governance artifacts (CE.4, CE.5, CE.2 DEC-001..DEC-014, CE.9,
  CE.11, CE.10C) are bound to the EX runtime
- Rule RB-001 mandates that only the certified engine at commit `ed95c81` (or
  a CE.11-governed successor) may be used
- Rule RB-002 mandates no interposition between engine components
- Rules RB-009..RB-011 establish the regression anchor against the certified
  baseline outputs

An EX stream that invokes any other engine implementation, uses any other signal
vocabulary, or produces any other tier vocabulary is non-compliant.

---

### Q3: Can execution proceed without governance ambiguity?

**YES.**

The full governance stack is resolved:

| Question | Resolved By |
|---|---|
| What states can a signal have? | CE.4 INV-001..INV-007 (COMPLETE, PARTIAL, BLOCKED, COMPUTABLE_PENDING) |
| What states can a consumption record have? | CE.5 C-001, CSM-1 (AVAILABLE, PARTIAL, BLOCKED) |
| How is condition tier derived? | CE.9 + CE.10: per-condition-instance via derive_condition_tier() |
| What are the valid tier values? | CE.2 DEC-009 (BLOCKED, DEGRADED, AT_RISK, STABLE) |
| How does tier map to diagnosis? | CE.2 DEC-014 (BLOCKED→BLOCKED, DEGRADED→ACTIVE, AT_RISK→ACTIVE, STABLE→INACTIVE) |
| What validation is required after a change? | CE.11 VTM (deterministic triggers VT-001..VT-007) |
| When is a new version required? | CE.11 versioning governance (PATCH/MINOR/MAJOR criteria) |
| What is forbidden? | CE.11 PP-001..PP-009 |
| How must execution be traced? | CE.11 traceability model + EX.H1 RB-003..RB-007 |
| What may external systems do? | EX.H1 SB-001..SB-009 |

No governance question relevant to EX stream execution is unresolved. The
CE.9 ambiguity resolution (binding rule authority, per-condition-instance scope,
CE.8 shim supersession) closed the last set of open questions. CE.11 closed
the governance meta-level (how changes are managed). EX.H1 closes the transition.

---

## 4. TRANSITION RECORD

```
BEFORE EX.H1:  CE.x streams define governance
               EX-class execution is ungoverned (no formal execution model)
               Runtime behavior rules not specified
               System boundary not formally defined

AFTER EX.H1:   CE.x streams: CLOSED / LOCKED
               EX.x streams: formally defined and governed
               Runtime binding: 14 rules (RB-001..RB-014)
               Execution principles: 4 binding constraints (P1..P4)
               System boundary: 9 rules (SB-001..SB-009)
               Allowed stream types: EX.1, EX.2, EX.3, EX.4
```

**Transition type:** CE governance phase → EX execution phase
**Transition authority:** EX.H1
**Transition date:** 2026-04-03

---

## 5. POST-HANDOVER INVARIANTS

### HI-001 — PiOS v0.4 is the execution baseline until a governed successor exists
No EX stream may treat any other PiOS version as the execution baseline.

### HI-002 — All EX outputs are CE-governed
EX outputs carry the authority of the governance contracts they implement. No EX
stream may claim its outputs have governance authority they do not have (e.g., a
debug run cannot be cited as certification evidence).

### HI-003 — The CE → EX transition is one-directional for this cycle
EX.H1 is the handover for the PiOS v0.4 governance cycle. If a MINOR or MAJOR
version event occurs, a new CE series will open. The handover for that series is
a new EX.H stream. EX.H1 governs only the v0.4 execution phase.

### HI-004 — Governance gaps discovered in EX streams do not block EX streams
If an EX stream discovers a gap between governance artifacts and runtime behavior,
it:
1. Records the gap
2. Triggers a CE.11-classified change stream
3. Continues execution using the currently certified engine (which is still valid)
4. Does not halt execution on the basis of a discovered governance gap unless the
   gap causes a compliance failure in the current run

---

## 6. EX.H1 CLOSURE VERDICT

**EX.H1 is CLOSED.**

Execution is formally separated from governance.
PiOS v0.4 is the enforced runtime baseline.
Execution may proceed without governance ambiguity.

The Krayu Program Intelligence Discipline is in EX phase.
