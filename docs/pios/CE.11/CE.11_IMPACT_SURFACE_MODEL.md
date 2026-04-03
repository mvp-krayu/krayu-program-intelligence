# CE.11 — Impact Surface Model

**Stream:** CE.11 — Change Governance & Evolution Contract
**Artifact type:** IMPACT SURFACE MODEL (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.11
**Status:** GOVERNANCE-DEFINED

---

## 1. PURPOSE

This document defines how a classified change maps to the PiOS layers it affects.
Impact surface determination is mandatory for all GC-001, GC-002, and GC-003 changes.
Impact surface drives validation scope (see CE.11_VALIDATION_TRIGGER_MODEL.md).

---

## 2. LAYER REGISTRY

| Layer ID | Name | Engine Component | Governed By |
|---|---|---|---|
| L-40.5-E | Emission | `compute_signals.py` | CE.4 (PiOS v0.3) |
| L-40.5-C | Consumption | `activate_conditions.py` (consumption section) | CE.5 (PiOS v0.4) |
| L-40.6-P | Propagation | `activate_conditions.py` (tier derivation + diagnosis) | CE.2 DEC-009/DEC-014 |
| L-40.6-T | Traceability | `activate_conditions.py` (record production) | CE.4 INV-006, CE.5 T-001/T-002 |
| L-40.7+ | Downstream | Layers 40.7–40.10 (intelligence synthesis → control) | CE.2 (PiOS v0.2) |
| L-GOV | Governance | `docs/pios/CE.*/ ` | CE.11 |
| L-RUN | Run Artifacts | `runs/pios/` | CE.11 |

---

## 3. IMPACT DETECTION RULES

### Rule ISM-001 — Emission layer impact
A change touches L-40.5-E if:
- `compute_signals.py` is modified
- Any signal constant (SIG-001..SIG-008 definitions) is added, removed, or changed
- Any emission invariant (INV-001..INV-007) is modified at the governance level
- The static telemetry baseline (STATIC_VARIABLES) is modified

**Impact declared:** L-40.5-E AFFECTED

### Rule ISM-002 — Consumption layer impact
A change touches L-40.5-C if:
- The consumption state vocabulary (AVAILABLE/PARTIAL/BLOCKED) is modified
- CE.5 consumption rules (C-001..C-003, PBE-1/PBE-2) are modified
- The consumption record structure is modified
- The `produce_ce5_consumption_record()` function is modified

**Impact declared:** L-40.5-C AFFECTED

### Rule ISM-003 — Propagation layer impact
A change touches L-40.6-P if:
- `BINDING_RULES` or `BINDING_SURFACE` constants are modified
- `derive_condition_tier()` or `_evaluate_rule()` are modified
- `CONDITION_TO_DIAGNOSIS_STATE` is modified
- DEC-009 or DEC-014 governance definitions are modified
- TIER_ORDER is modified
- Any binding rule threshold value is changed

**Impact declared:** L-40.6-P AFFECTED

### Rule ISM-004 — Traceability layer impact
A change touches L-40.6-T if:
- `produce_ce5_traceability_records()` is modified
- CE.5 T-001 or T-002 rules are modified
- CE.4 INV-006 definition is modified
- Record count invariants (record count = governed signal count) are altered

**Impact declared:** L-40.6-T AFFECTED

### Rule ISM-005 — Downstream layer impact
A change touches L-40.7+ if:
- The output schema of `activate_conditions.py` is modified
  (field names, field types, field presence guarantees)
- The `condition_coverage_state` or `diagnosis_activation_state` vocabulary changes
- Any CE.2 invariant governing 40.7–40.10 behavior is modified

**Impact declared:** L-40.7+ AFFECTED

### Rule ISM-006 — Cascade from upstream impact
If L-40.5-E is affected, L-40.5-C MUST also be assessed (consumption depends on
emission output schema). If L-40.5-C is affected, L-40.6-P and L-40.6-T MUST also
be assessed. If L-40.6-P is affected, L-40.7+ MUST be assessed.

**Cascade rule:** upstream impact mandates downstream assessment.

### Rule ISM-007 — Governance-only impact
A GC-001 change that modifies only governance documents without altering engine
behavior touches L-GOV only. No engine layer is impacted. However, if the governance
change is intended to take effect (i.e., it defines new constraints the engine must
satisfy), L-GOV impact MUST be paired with a future GC-002 change before the
governance constraint is considered enforced.

**Impact declared:** L-GOV AFFECTED; engine layers NOT YET AFFECTED until co-change.

---

## 4. IMPACT SURFACE MATRIX

For each change class, minimum expected impact surface:

| Change Class | L-40.5-E | L-40.5-C | L-40.6-P | L-40.6-T | L-40.7+ | L-GOV | L-RUN |
|---|---|---|---|---|---|---|---|
| GC-001 (Governance) | ASSESS | ASSESS | ASSESS | ASSESS | ASSESS | YES | NO |
| GC-002 (Engine) | ASSESS | ASSESS | ASSESS | ASSESS | ASSESS | NO | YES |
| GC-003 (Data/Run) | NO | NO | NO | NO | NO | NO | YES |
| GC-004 (Non-functional) | NO | NO | NO | NO | NO | ASSESS | NO |

ASSESS = apply ISM-001..ISM-007 to determine if this layer is affected.
YES = always affected for this class.
NO = not affected unless ISM rules trigger.

---

## 5. IMPACT SURFACE RECORD REQUIREMENT

Every GC-001 and GC-002 change MUST produce an impact surface record before execution
containing:

- `change_id`: identifier of the governing stream (e.g., CE.12)
- `change_class`: GC-001..GC-004
- `layers_affected`: list of Layer IDs from the Layer Registry
- `cascade_applied`: YES/NO — whether ISM-006 cascade was evaluated
- `validation_scope`: derived from CE.11_VALIDATION_TRIGGER_MODEL.md

This record is an input to the change traceability entry (CE.11_TRACEABILITY_MODEL.md).

---

## 6. LAYER ISOLATION GUARANTEE

The impact surface model guarantees that:

1. A change touching only L-40.5-E cannot silently invalidate L-40.6-P certification
   without explicit cascade assessment.

2. A GC-002 change touching L-40.6-P always triggers propagation compliance re-validation,
   regardless of scope claim.

3. A GC-004 change cannot be declared to affect any engine layer. If it does, it must
   be reclassified.

4. No change may claim a narrower impact surface than ISM rules produce.
