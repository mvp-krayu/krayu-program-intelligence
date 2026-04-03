# CE.11 — Certification Integrity Rules

**Stream:** CE.11 — Change Governance & Evolution Contract
**Artifact type:** CERTIFICATION INTEGRITY RULES (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.11
**Status:** GOVERNANCE-DEFINED

---

## 1. PURPOSE

This document defines the invariants that must hold for the PiOS certification to
remain valid, the states a PiOS system can occupy with respect to certification, and
the governed transitions between those states. These rules are the enforcement layer
for CE.10C-class certification — any action that violates them renders the
certification void.

---

## 2. SYSTEM CERTIFICATION STATES

PiOS occupies exactly one certification state at any point in time.

### STATE: UNCERTIFIED

**Definition:** The engine exists but has not been evaluated against its governing
contracts. No executability determination has been made.

**Characteristics:**
- No CE.6 verdict has been issued
- Governance contracts may or may not be defined
- Engine may or may not exist

**Valid entry paths:**
- Engine file created for the first time
- Engine branch forked before any CE.6 evaluation

**Exit path:** Execute VS-CE6 → ... → VS-CE10C cycle. Outcome is either
EXECUTABLE-PROVEN or GOVERNANCE-DEFINED ONLY.

---

### STATE: GOVERNANCE-DEFINED ONLY

**Definition:** Governance contracts are authoritative and defined, but the engine has
been evaluated and found NOT to satisfy the executability criteria.

**Characteristics:**
- CE.6 verdict: NOT executable-proven
- At least one EX-criterion fails
- Engine exists but is non-compliant
- Certification artifacts: CE.6 verdict record, gap enumeration

**Valid entry paths:**
- VS-CE6 inspection result: FAIL (one or more EX criteria)
- A previously EXECUTABLE-PROVEN system receives a GC-001 or GC-002 change that
  triggers VS-CE6 and the result is FAIL

**Exit path:** Execute VS-CE7 → implementation streams → VS-CE10C.

---

### STATE: EXECUTABLE-PROVEN

**Definition:** The engine satisfies all 7 CE.6 executability criteria (EX-001..EX-007)
across all 4 compliance domains, and a VS-CE10C certification closeout has been
formally executed and recorded.

**Characteristics:**
- CE.6 criteria: all 7 PASS
- Compliance domains: Emission PASS, Consumption PASS, Propagation PASS,
  Traceability PASS
- Certification artifact exists: PIOS_V*.EXECUTABLE_CERTIFICATION.md
- Status transition record exists

**Valid entry paths:**
- VS-CE10C closeout following full remediation cycle (CE.8/CE.10-class)
- VS-CE10C closeout following a bounded change that did not introduce gaps

**Exit path:** Any GC-001 or GC-002 change that triggers VS-CE6 moves the system
to CERTIFICATION-SUSPENDED until VS-CE6 is re-run.

---

### STATE: CERTIFICATION-SUSPENDED

**Definition:** A classified change has been applied (or is in progress) that requires
VS-CE6 re-evaluation, and VS-CE6 has not yet been executed for this change.

**Characteristics:**
- Prior EXECUTABLE-PROVEN certification may exist but is NOT valid for the current
  engine state
- Change has been classified and impact surface determined
- VS-CE6 is required but not yet run

**Valid entry paths:**
- Any GC-001 or GC-002 change with impact on engine layers, applied to an
  EXECUTABLE-PROVEN system before re-validation begins

**Exit path:**
- VS-CE6 executed: if PASS on all 7 criteria → VS-CE10C → EXECUTABLE-PROVEN
- VS-CE6 executed: if any criterion FAIL → GOVERNANCE-DEFINED ONLY

---

## 3. STATE TRANSITION DIAGRAM

```
UNCERTIFIED
    │
    │ VS-CE6 run
    ├─────────────────────────────────────────────────┐
    │ (any EX criterion fails)                        │ (all 7 EX criteria PASS)
    ▼                                                 ▼
GOVERNANCE-DEFINED ONLY               EXECUTABLE-PROVEN ◄──────────────┐
    │                                         │                         │
    │ VS-CE7 → implementation                 │ GC-001/GC-002 change    │
    │ streams → VS-CE10C                      │ triggers VS-CE6         │
    └─────────────────────────────────────────►CERTIFICATION-SUSPENDED  │
                                                      │                 │
                                                      │ VS-CE6 run      │
                                                      │                 │
                                         ┌────────────┘                 │
                                         │ all PASS                     │
                                         └──────────────────────────────┘
                                                      │
                                                      │ any FAIL
                                                      ▼
                                          GOVERNANCE-DEFINED ONLY
```

---

## 4. CERTIFICATION INTEGRITY INVARIANTS

### CIR-001 — Certification binds to a specific codebase state
A certification is valid only for the exact engine state (file content + commit) at
which VS-CE10C was executed. If any governed engine file is modified after VS-CE10C,
the certification is suspended until re-validation is complete.

### CIR-002 — No silent certification invalidation
No change may be applied to an EXECUTABLE-PROVEN system without explicitly moving the
system to CERTIFICATION-SUSPENDED. The suspension must be recorded before the change
is committed.

### CIR-003 — No partial certification claims
A claim that "emission is still certified but propagation is not" is not a valid
certification state. Certification is all-or-nothing: all 4 domains must be PASS for
EXECUTABLE-PROVEN status. A domain-level partial pass is GOVERNANCE-DEFINED ONLY.

### CIR-004 — Certification artifact must reference exact engine commit
Every VS-CE10C artifact must reference:
- The exact branch and commit hash of the engine at certification time
- The validation run artifacts that substantiate the certification
- The compliance domain verdicts (PASS/FAIL per domain)

A certification artifact missing any of these fields is incomplete and non-authoritative.

### CIR-005 — Certification does not transfer across versions
A certification for PiOS v0.4 does not certify PiOS v0.5 or any other version.
Each PiOS version requires its own independent certification cycle.

### CIR-006 — No deferred certification
"We'll certify it later" is not a valid intermediate state. A system may be in
GOVERNANCE-DEFINED ONLY or CERTIFICATION-SUSPENDED, but it must not be treated as
certified when it is not. Any documentation, deployment, or integration that depends
on an EXECUTABLE-PROVEN guarantee requires the system to be in EXECUTABLE-PROVEN state.

### CIR-007 — Certification scope must be explicit
Every certification artifact must explicitly state what it does NOT certify (per the
CE.10C model in PIOS_V0.4_EXECUTABLE_CERTIFICATION.md §"What this certification does
not mean"). Scope creep in certification claims is a violation of this rule.

---

## 5. CURRENT BASELINE STATE

As of CE.10C:

| Component | State |
|---|---|
| PiOS v0.4 | **EXECUTABLE-PROVEN** |
| Branch | `pios-governance-baseline-v0.4` |
| Commit | `ed95c81` (CE.10 closeout) |
| Valid certification artifact | `docs/pios/CE.10/PIOS_V0.4_EXECUTABLE_CERTIFICATION.md` |

Any change to this baseline initiates a CERTIFICATION-SUSPENDED transition per CIR-002.
