# EX.H1 — Execution Baseline

**Stream:** EX.H1 — Execution Handover (CE → EX Transition)
**Artifact type:** EXECUTION BASELINE (NORMATIVE)
**Date:** 2026-04-03
**Authority:** EX.H1
**Status:** LOCKED

---

## 1. PURPOSE

This document records the locked governance baseline from which all EX streams
execute. It is the single authoritative reference for what is fixed, what is
certified, and what may not be modified by any execution stream.

---

## 2. LOCKED GOVERNANCE ARTIFACTS

The following governance streams and their artifacts are FINAL. No EX stream
may modify, extend, reinterpret, or supersede any artifact in this set.

| Stream | Artifact Scope | Lock Status |
|---|---|---|
| CE.4 | Signal Emission Contract — INV-001..INV-007, §3.3, signal states {COMPLETE, PARTIAL, BLOCKED, COMPUTABLE_PENDING} | LOCKED |
| CE.5 | Consumption & Propagation Contract — consumption states {AVAILABLE, PARTIAL, BLOCKED}, C-001..C-005, PBE-1/PBE-2, T-001/T-002 | LOCKED |
| CE.2 | Decision Ledger DEC-001..DEC-014 — tier hierarchy, binding surface schema, binding rule class, diagnosis mapping | LOCKED |
| CE.9 | Tier Derivation Authority — per-condition-instance evaluation, DEC-012/DEC-013 authority, CE.8 shim supersession | LOCKED |
| CE.11 | Change Governance Model — GC-001..GC-004, impact surface model, validation trigger model, certification integrity rules, versioning governance, prohibited patterns, traceability model | LOCKED |
| CE.10C | PiOS v0.4 Executable Certification — EXECUTABLE-PROVEN status, certification basis, scope, non-assertions | LOCKED |

---

## 3. CERTIFIED ENGINE STATE

| Property | Value |
|---|---|
| PiOS Version | **v0.4** |
| Certification status | **EXECUTABLE-PROVEN** |
| Certifying stream | CE.10 / CE.10C |
| Branch | `pios-governance-baseline-v0.4` |
| Certification commit | `ed95c81` |
| Certification artifact | `docs/pios/CE.10/PIOS_V0.4_EXECUTABLE_CERTIFICATION.md` |
| Engine: emission layer | `pios/core/v0.1/engine/compute_signals.py` (post-CE.8) |
| Engine: consumption + propagation layer | `pios/core/v0.1/engine/activate_conditions.py` (post-CE.10) |
| Signal set | SIG-001..SIG-008 |
| Condition set | COND-001..COND-008 |
| Diagnosis set | DIAG-001..DIAG-008 |

---

## 4. COMPLIANCE DOMAIN STATUS (POST-CE.10)

| Domain | Governing Contracts | Status |
|---|---|---|
| Emission | CE.4 INV-001..INV-007, §3.3 | PASS |
| Consumption | CE.5 C-001..C-003, PBE-1/PBE-2 | PASS |
| Propagation | CE.2 DEC-009, DEC-011, DEC-014 | PASS |
| Traceability | CE.4 INV-006, CE.5 T-001/T-002 | PASS |

---

## 5. WHAT IS FIXED

The following are invariant for all EX streams:

### EB-001 — Signal state vocabulary is fixed
CE.4 emission states {COMPLETE, PARTIAL, BLOCKED, COMPUTABLE_PENDING} are the
only valid states any engine may emit. No EX stream may introduce additional
emission states.

### EB-002 — Consumption state vocabulary is fixed
CE.5 consumption states {AVAILABLE, PARTIAL, BLOCKED} are the only valid states
for any consumption record. The mapping COMPLETE → AVAILABLE is fixed (CSM-1).

### EB-003 — Tier vocabulary is fixed
CE.2 DEC-009 tier values {BLOCKED, DEGRADED, AT_RISK, STABLE} are the only valid
`condition_coverage_state` values. The tier order BLOCKED(3) > DEGRADED(2) >
AT_RISK(1) > STABLE(0) is fixed.

### EB-004 — Diagnosis mapping is fixed
CE.2 DEC-014 mapping {BLOCKED→BLOCKED, DEGRADED→ACTIVE, AT_RISK→ACTIVE,
STABLE→INACTIVE} is the only valid `diagnosis_activation_state` derivation.

### EB-005 — Binding surface baseline is fixed
The 8-row baseline BINDING_SURFACE defined in CE.10 is the certified binding
configuration. Extension requires a GC-001 governance event per CE.11.

### EB-006 — Engine files are the certified reference
`compute_signals.py` and `activate_conditions.py` at commit `ed95c81` are the
certified reference implementation. Any deviation from these files places the
system in CERTIFICATION-SUSPENDED state per CE.11_CERTIFICATION_INTEGRITY_RULES.md.

---

## 6. WHAT IS NOT FIXED (EX STREAM SCOPE)

The following are within scope for EX streams, subject to execution principles:

- Runtime invocation patterns and interfaces (EX.1)
- Debug and inspection tooling that reads (does not modify) engine outputs (EX.2)
- System bridge integrations that consume CE.5-compliant outputs (EX.3)
- Ingestor modules that supply inputs to the emission layer (EX.4, future)
- Validation run archives and regression baselines (GC-003 class)
- Non-functional documentation (GC-004 class)

---

## 7. BASELINE LOCK DECLARATION

This execution baseline is LOCKED as of EX.H1.

> PiOS v0.4 is the ONLY valid execution baseline.
> All EX streams execute against this baseline.
> No EX stream may modify, weaken, or supersede any locked governance artifact.
