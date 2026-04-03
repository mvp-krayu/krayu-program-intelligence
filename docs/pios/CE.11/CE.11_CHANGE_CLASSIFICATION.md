# CE.11 — Change Classification Model

**Stream:** CE.11 — Change Governance & Evolution Contract
**Artifact type:** CHANGE CLASSIFICATION MODEL (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.11
**Status:** GOVERNANCE-DEFINED

---

## 1. PURPOSE

This document defines the exhaustive classification of all change types that may be
applied to the PiOS system. Every change to any PiOS component MUST be assigned exactly
one change class before execution. Classification is mandatory, non-negotiable, and
precedes all validation and certification determinations.

---

## 2. CHANGE CLASSES

### GC-001 — GOVERNANCE CHANGE

**Definition:** Any change that modifies, extends, or supersedes a PiOS governance
contract, decision record, invariant, rule, or constraint definition.

**Scope:**
- CE.4 emission contract (INV-001..INV-007, §3.3)
- CE.5 consumption state model and rules (C-001..C-005, PBE-1/PBE-2, T-001/T-002)
- CE.2 decision ledger entries (DEC-001..DEC-014)
- Any binding rule definition (DEC-013)
- Any binding surface table entry (DEC-012)
- Any versioning criteria document
- Any governance decision artifact in `docs/pios/CE.*/`

**Risk level:** CRITICAL

**Allowed operations:**
- Adding new governed object classes (triggers new PiOS version — see CE.11_VERSIONING_GOVERNANCE.md)
- Adding new invariants to a new governance boundary
- Issuing governance clarification decisions that do not alter existing semantics
  (e.g., CE.9-class disambiguation artifacts)
- Documenting previously implicit constraints explicitly, provided the behavior is
  unchanged

**Forbidden operations:**
- Modifying CE.4 or CE.5 semantics without a version event
- Removing or narrowing an existing invariant without explicit deprecation stream
- Adding new constraints to an existing certified layer without re-certification
- Retroactive modification of closed CE streams
- Any change to `ce2_decision_ledger.md` DEC-001..DEC-014 without governing stream

---

### GC-002 — ENGINE CHANGE

**Definition:** Any change that modifies the runtime behavior of a PiOS engine file.

**Scope:**
- `pios/core/v0.1/engine/compute_signals.py` (emission layer)
- `pios/core/v0.1/engine/activate_conditions.py` (consumption + propagation layer)
- Any engine file added to `pios/core/v0.1/engine/` or successor engine paths
- Any runtime constant embedded in an engine file that governs output behavior
  (e.g., BINDING_RULES, BINDING_SURFACE, TIER_ORDER, CONDITION_TO_DIAGNOSIS_STATE)

**Risk level:** HIGH

**Allowed operations:**
- Closing identified governance gaps (CE.8/CE.10-class remediation)
- Updating runtime constants to match a modified binding surface (requires GC-001 co-change)
- Refactoring that preserves all governed outputs identically (requires full validation)
- Adding new engine functions to support a new governed layer (requires version event)

**Forbidden operations:**
- Introducing heuristic logic not traceable to a governed decision
- Modifying governed constants without a corresponding GC-001 governance event
- Changing emission behavior without re-running emission compliance
- Changing consumption or propagation behavior without re-running full CE.6 cycle
- Removing governed trace or record production (traceability regression)
- Bypassing `derive_condition_tier()` or equivalent governed tier derivation

---

### GC-003 — DATA / RUN CHANGE

**Definition:** Any change that modifies input telemetry, scenario definitions, run
configurations, or validation run outputs, without altering engine logic or governance
contracts.

**Scope:**
- `runs/pios/` — any run output directory or run input file
- Static telemetry baseline constants (STATIC_VARIABLES in `compute_signals.py`)
  when changed in isolation without logic changes
- QA validation artifacts (`docs/pios/CE.*/validation/`)
- Test scenario input files

**Risk level:** MEDIUM

**Allowed operations:**
- Adding new validation runs against the certified engine
- Updating run output archives after an authorized GC-002 change
- Adding new telemetry scenarios for coverage extension

**Forbidden operations:**
- Modifying existing validated run outputs retroactively
- Using run change to assert certification without a CE.10C-class closeout
- Changing the certified static baseline without a GC-002 + GC-001 co-change event
- Treating new run results as certification without formal CE.10C closeout

---

### GC-004 — NON-FUNCTIONAL CHANGE

**Definition:** Any change that does not affect runtime behavior, governance contracts,
or validation run results. Includes documentation, formatting, structural reorganization,
and comment changes.

**Scope:**
- `docs/` — documentation files only (no contract or decision artifact modification)
- Code comments, docstrings, whitespace that do not alter runtime behavior
- File renames or moves that do not alter import paths or execution paths
- README and index files

**Risk level:** LOW

**Allowed operations:**
- Adding explanatory documentation
- Correcting typographical errors in non-normative text
- Restructuring documentation directories (with path update if referenced)

**Forbidden operations:**
- Reclassifying a normative artifact as non-normative without governing stream
- Modifying normative decision text under the guise of documentation update
- Adding or removing governance constraints embedded in documentation artifacts
- Treating a GC-004 change as exempt from traceability recording

---

## 3. CLASSIFICATION RULES

### R-CLASS-001 — Exhaustive classification required
Every change MUST be assigned exactly one change class (GC-001..GC-004) before
execution. Unclassified changes are forbidden.

### R-CLASS-002 — Escalation on overlap
If a single change spans multiple classes, it MUST be classified at the highest
risk class present. A documentation update co-delivered with an engine change is
classified GC-002, not GC-004.

### R-CLASS-003 — Co-change binding
When a GC-002 engine change is required by a GC-001 governance change, both changes
MUST be executed within the same governing stream and committed together or in explicit
dependency order. Neither may be declared complete without the other.

### R-CLASS-004 — No retroactive reclassification
A change that has been executed under a given class may not be retroactively
reclassified. If misclassification is discovered, a corrective stream must be opened.

---

## 4. CHANGE CLASS SUMMARY

| Class | Name | Risk | Triggers Full Cycle |
|---|---|---|---|
| GC-001 | GOVERNANCE CHANGE | CRITICAL | YES (always) |
| GC-002 | ENGINE CHANGE | HIGH | YES |
| GC-003 | DATA / RUN CHANGE | MEDIUM | CONDITIONAL |
| GC-004 | NON-FUNCTIONAL CHANGE | LOW | NO |

Full cycle = CE.6 compliance inspection → CE.10C certification closeout.
Conditional = depends on whether static baseline constants are modified (see
CE.11_VALIDATION_TRIGGER_MODEL.md).
