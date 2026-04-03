# CE.4 — Boundary Decision

**Stream:** CE.4 — PiOS Signal Emission Contract Definition
**Artifact type:** DECISION
**Date:** 2026-04-03
**Evidence base:**
  - `signal_emission_surface_assessment.md`
  - `signal_failure_classification_model.md`
  - `signal_emission_contract_specification.md`
  - `signal_computability_governance.md`
  - `dependency_propagation_rules.md`
  - `signal_ledger_specification.md`
  - `documentation_alignment_rule.md`
  - CE.2 closed baseline (DEC-001 through DEC-014)
  - CE.3 boundary decision (40.5 as new governance layer)

---

## 1. VERSIONING TEST

The contract requires explicit answers to four questions.

### Q1 — Can the emission contract be represented inside PiOS v0.2 without introducing a new governed layer?

**Answer: NO.**

PiOS v0.2 is the CE.2 certified baseline. CE.2 governs 40.6 → 40.10. It contains no
decisions governing signal emission at 40.5 — no rules defining allowed states, payload
requirements, computability classification, or blockage metadata obligations. The 40.5
emission surface was explicitly ungoverned in v0.2.

Adding the CE.4 emission contract to v0.2 would require authoring decisions that govern
a layer (40.5) outside the certified CE.2 scope. This is not an extension of v0.2 — it
is a new governance layer. It cannot be represented within the existing v0.2 decision
ledger without expanding that ledger's scope.

---

### Q2 — Does 40.5 currently lack semantics essential to downstream deterministic interpretation?

**Answer: YES.**

Evidence from `signal_emission_surface_assessment.md`:

1. Two PARTIAL variants (primitive and derived) are indistinguishable in the current payload.
   A null output field in SIG-001 means "formula exists, input pending" (F-1b). A null
   output field in SIG-008 means "upstream signal is BLOCKED" (F-3). Both serialize to
   `null`. 40.6 applies the same binding rule (`BR-NULL-SIGNAL-BLOCKED`) to both — which
   is correct behavior given CE.2 governance — but the upstream cause is opaque. If
   downstream consumers ever need to distinguish these cases (for audit, repair routing,
   or explainability), the current payload provides no basis.

2. Two BLOCKED variants exist with different metadata completeness. SIG-006 carries
   `blocking_inputs` and `blocking_reason`; SIG-003 in the CE.2-R01-MIX run artifact
   carries neither. A downstream system cannot determine from the payload alone whether
   a BLOCKED signal is data-absent (potentially repairable) or formula-absent (structurally
   non-computable). This is a semantics gap with material consequences for repair planning.

3. No `computability_class` field exists. The distinction between CC-005 (NON_COMPUTABLE)
   and CC-001 through CC-004 (COMPUTABLE in the appropriate context) is not represented
   in any emission payload. This distinction is essential for determining whether a BLOCKED
   signal can be resolved through data supply or requires specification authorship.

These are not cosmetic gaps — they affect the deterministic interpretability of 40.5 output
for any consumer that needs more than the current CE.2 binding (which treats all null fields
identically and correctly, but does not propagate the cause of nullness).

---

### Q3 — Does the Signal Ledger become a new canonical governance object?

**Answer: YES.**

The Signal Ledger defined in `signal_ledger_specification.md` does not exist in PiOS
v0.1 or v0.2. It is a new governance object introduced by CE.4 with 18 required fields
per signal entry, covering identity, computability, inputs, emission contract, blockage
and partiality rules, traceability, downstream consumption constraints, and governance
status.

The Signal Ledger is not a documentation convenience — it is the authoritative registry
that governs which signals are permitted to participate in 40.5 computation and under
what contract. No equivalent structure exists at any prior version.

---

### Q4 — Does BLOCKED transition from incidental runtime artifact to governed contract state?

**Answer: YES.**

In PiOS v0.1 and v0.2, BLOCKED is produced by the engine as a runtime state with
inconsistent payload structure (SIG-003 vs SIG-006 in the same run artifact carry
different metadata). No decision defines what BLOCKED means, what it requires in its
payload, or what `blocking_class` categories are valid.

CE.4 `signal_emission_contract_specification.md` defines BLOCKED as EC-STATE-003 with
mandatory fields: `blocking_class`, `blocking_inputs`, `blocking_reason`. Any signal
emitting BLOCKED without these fields is in contract violation. This is a transition from
"incidental runtime observation" to "governed contract state."

---

## 2. VERSIONING VERDICT

**CE.4 defines PiOS v0.3.**

All four versioning test questions return materially YES. The emission contract cannot be
represented in v0.2; 40.5 currently lacks essential semantics; the Signal Ledger is a
new canonical governance object; BLOCKED transitions from incidental to governed.

PiOS v0.3 is defined by the addition of the 40.5 emission governance layer to the
previously v0.2-governed 40.6–40.10 activation chain.

**Version boundary:**
- PiOS v0.2: CE.2 certified — 40.6 → 40.10 governed
- PiOS v0.3: CE.4 certified — 40.5 emission governed + 40.6 → 40.10 governed (CE.2 unchanged)

CE.2 invariants (DEC-001 through DEC-014) are UNCHANGED. PiOS v0.3 does not modify CE.2.
It extends governance upstream to 40.5.

---

## 3. CE.4 CLOSURE VERDICT

CE.4 is COMPLETE against the contract completion criteria. Evidence per criterion:

| Criterion | Artifact | Status |
|---|---|---|
| Current 40.5 emission surface explicitly documented | `signal_emission_surface_assessment.md` | DONE |
| Failure classes formally classified | `signal_failure_classification_model.md` | DONE |
| Emission states canonically defined | `signal_emission_contract_specification.md` | DONE |
| Computability formally governed | `signal_computability_governance.md` | DONE |
| Dependency propagation governed | `dependency_propagation_rules.md` | DONE |
| Signal Ledger structure defined | `signal_ledger_specification.md` | DONE |
| D-001 resolved through governance rule | `documentation_alignment_rule.md` | DONE |
| Versioning verdict explicit and justified | This document | DONE |

---

## 4. MINIMUM REQUIRED GOVERNANCE CONSEQUENCES

The following are direct governance consequences of CE.4 that MUST be addressed in
subsequent streams:

**GC-001 — Emission contract implementation:**
The PiOS v0.1 engine (`compute_signals.py`) does not comply with the CE.4 emission
contract. Compliant signals must carry `partiality_reasons` instead of `note`,
`blocking_class` in addition to `blocking_inputs` and `blocking_reason`, and consistent
payload structure across all signals of the same state. This requires a governed engine
update stream (not part of CE.4 scope).

**GC-002 — SIG-003 and SIG-006 formula specification:**
Both signals are CC-005 (NON_COMPUTABLE). They require formula specification (for SIG-003:
the Change Concentration formula using time-series inputs; for SIG-006: the Execution
Stability formula using event-based inputs). Formula authorship is outside CE.4 scope but
is a direct dependency of any future stream that targets COMPLETE signal emission.

**GC-003 — Signal Ledger population:**
All 8 Signal Ledger entries currently have `governance_status=PARTIALLY_GOVERNED` and
`documentation_status=ABSENT`. Full governance status requires: formula references
populated, documentation status updated to ALIGNED, open gaps resolved.

**GC-004 — Documentation alignment implementation:**
DA-001 through DA-005 define the rules; implementation (namespacing run_01_blueedge docs,
producing run_02_ce_validation canonical docs) is a subsequent stream responsibility.

**GC-005 — CE.4 decisions formalized:**
CE.4 defines governance through contract-grade artifacts but has not been encoded as
a formal decision ledger (CE4-DEC-001 through CE4-DEC-N). A formal decision encoding
pass is required before CE.4 can be cited as a completed governance stream equivalent
to CE.2.

---

## 5. OPEN ITEMS (NOT BLOCKING CE.4 CLOSURE)

The following items are identified but do not block CE.4 closure — they are deferred
to subsequent streams:

- EC-STATE-004 (COMPUTABLE_PENDING) activation: reserved in the emission contract;
  not introduced into the engine in CE.4
- Formal CE.4 decision ledger (CE4-DEC-*): encoding of CE.4 into numbered decisions
- Run_02_ce_validation canonical documentation production (DA-003 implementation)
- Engine compliance update (GC-001 implementation)
- Formula authorship for SIG-003 and SIG-006 (GC-002 implementation)

---

## 6. STATUS

```
Stream:           CE.4 — PiOS Signal Emission Contract Definition
Boundary:         40.5 (Signal Computation) emission governance
Decision:         CE.4 is COMPLETE
Version verdict:  CE.4 defines PiOS v0.3
Date:             2026-04-03
Artifacts:        7 evidence/contract artifacts + this decision document
CE.2 status:      UNCHANGED — DEC-001 through DEC-014 remain authoritative for 40.6–40.10
Consequences:     GC-001 through GC-005 deferred to subsequent streams
```
