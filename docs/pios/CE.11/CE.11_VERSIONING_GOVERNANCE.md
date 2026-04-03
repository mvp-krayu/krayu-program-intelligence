# CE.11 — Versioning Governance Model

**Stream:** CE.11 — Change Governance & Evolution Contract
**Artifact type:** VERSIONING GOVERNANCE MODEL (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.11
**Status:** GOVERNANCE-DEFINED

---

## 1. PURPOSE

This document defines when a PiOS change becomes a new version and what class of
version it is. Version events are governance events — they formalize that a new
governed layer, boundary, or constraint has been introduced. The versioning model
is deterministic: given a set of change criteria, the version class is fully determined.

---

## 2. CURRENT VERSION BASELINE

| PiOS Version | Governing Stream | Layer Coverage | Status |
|---|---|---|---|
| PiOS v0.2 | CE.2 | 40.6 → 40.11 | EXECUTABLE-PROVEN |
| PiOS v0.3 | CE.4 | 40.5 signal emission | EXECUTABLE-PROVEN |
| PiOS v0.4 | CE.5 | 40.5 → 40.6 consumption handoff | EXECUTABLE-PROVEN |

---

## 3. VERSION CLASSES

### PATCH — No governance impact

**Definition:** A change that preserves all existing governed contracts, invariants,
object classes, and layer boundaries. The governed behavior is identical before and
after the change.

**Criteria (all must be true):**
- No new governed object classes introduced
- No new invariants introduced
- No existing invariants modified or removed
- No new governed layer boundaries introduced
- No change to any governance contract vocabulary
- Engine behavior change (if any) is a gap closure against existing governance
  (i.e., brings engine into compliance with already-defined governance)

**Version event:** No version increment. Certified baseline is updated in place
after VS-CE10C closeout.

**Examples:**
- CE.8 (gap closure: emission, consumption, traceability remediations)
- CE.10 (gap closure: propagation tier derivation)

---

### MINOR — Bounded governance extension

**Definition:** A change that extends the governed model within an existing layer
boundary, adding new governed objects or constraints that do not alter the semantics
of previously defined governance.

**Criteria (any one triggers MINOR):**
- New governed object classes added within an existing layer (e.g., new signal
  SIG-009 within 40.5, new condition COND-009 within 40.6)
- New invariants added that constrain behavior not previously governed (i.e., new
  coverage, not modification of existing coverage)
- New binding rules added to the binding surface for existing conditions
- New validation criteria added (e.g., EX-008) that did not previously exist
- Extension of the governed signal set without introducing a new consumption contract

**Criteria (must NOT be true for MINOR — if any is true, escalate to MAJOR):**
- Existing governance semantics are altered
- A new governed layer boundary is introduced
- A new consumption or propagation contract is required that adds a new governance
  relationship between layers
- Existing certified behavior changes (i.e., engine output changes for previously
  valid inputs)

**Version event:** New PiOS minor version (e.g., PiOS v0.4 → PiOS v0.5).
New governing stream (CE.N) must be opened. New certification required.

---

### MAJOR — New governed boundary

**Definition:** A change that introduces a new layer boundary, a new inter-layer
contract, or modifies the semantics of an existing governed contract.

**Criteria (any one triggers MAJOR):**
- A new inter-layer handoff contract is introduced (e.g., analogous to CE.5
  introducing the 40.5 → 40.6 consumption handoff)
- A new layer (40.11+, or new sub-layer) is brought under governance
- Existing governance semantics are modified (e.g., changing the CE.5 consumption
  state vocabulary from {AVAILABLE, PARTIAL, BLOCKED} to a different set)
- Existing invariants are removed or narrowed (even if behavior is "equivalent"
  under current data — the governance guarantee is weakened)
- The governed scope of an existing contract changes (e.g., CE.4 expanded to cover
  layers other than 40.5)
- A new object class is introduced that crosses a layer boundary

**Version event:** New PiOS major version (e.g., PiOS v0.4 → PiOS v1.0 or next
governed baseline). New CE stream series must be initiated. Full CE.5-class versioning
decision required. Prior certification not transferred.

---

## 4. VERSION CRITERIA TABLE

| Criterion | PATCH | MINOR | MAJOR |
|---|---|---|---|
| New governed object classes | NO | YES (within layer) | YES (cross-layer) |
| New invariants | NO | YES (new coverage) | YES (alter semantics) |
| Existing invariants modified | NO | NO | YES |
| New layer boundary | NO | NO | YES |
| New inter-layer contract | NO | NO | YES |
| Engine gap closure (no governance change) | YES | — | — |
| New governed signals within existing layer | NO | YES | — |
| Change to consumption/propagation vocabulary | NO | NO | YES |
| Change to DEC-009/DEC-014 definitions | NO | NO | YES |
| Extension of binding surface within current contracts | NO | YES | — |

---

## 5. VERSION EVENT REQUIREMENTS

### On MINOR version event:

1. A versioning decision document MUST be produced, confirming all MINOR criteria
   are met and MAJOR criteria are absent (modeled on CE.5_VERSIONING_DECISION.md)
2. A new governing CE stream MUST be opened
3. The existing certified baseline MUST be declared unchanged
4. The new governed layer MUST pass VS-CE6 before the new version is declared
   executable-proven
5. The new version MUST NOT be treated as executable-proven until VS-CE10C closes

### On MAJOR version event:

1. A versioning decision document MUST be produced identifying the new boundary and
   its implications for existing layers
2. The prior version remains certified for its defined scope (its certification
   is not invalidated, merely bounded)
3. The new version MUST be certified independently — the prior certification does
   not transfer
4. A new CE stream series MUST be initiated

---

## 6. VERSION PROMOTION PROHIBITION

Certification closeout (VS-CE10C) does NOT constitute version promotion. Version
promotion requires:
- An explicit versioning decision artifact
- A new governing stream
- A CE.6-class executability evaluation
- A CE.10C-class certification closeout for the new version

The CE.10C model (as stated in PIOS_V0.4_EXECUTABLE_CERTIFICATION.md) explicitly
records: "This certification does not merge to any canonical branch, does not increment
any version number, and does not supersede CE.2 as the certified baseline for layers
40.6–40.11." This constraint applies to all VS-CE10C closeouts.

---

## 7. VERSIONING DECISION CRITERIA CHECKLIST

When evaluating whether a version event is required, apply this checklist:

```
□ New governed object class introduced?          → MINOR or MAJOR
□ New invariant introduced (new coverage)?       → MINOR
□ Existing invariant modified?                   → MAJOR
□ New layer boundary introduced?                 → MAJOR
□ New inter-layer contract required?             → MAJOR
□ Consumption/propagation vocabulary changed?    → MAJOR
□ All changes are gap closures against existing  → PATCH (no version event)
  governance?
```

A YES to any checkbox triggers the indicated version class (highest class wins).
