# CE.7 — Remediation Planning Decision

**Stream:** CE.7 — Engine Remediation Planning
**Artifact type:** DECISION (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.7
**Inputs:** CE.7_REMEDIATION_ARCHITECTURE.md, CE.7_REMEDIATION_SEQUENCE.md, CE.7_COMPONENT_IMPACT_MAP.md, CE.7_GAP_TO_ACTION_MAP.md, CE.7_VALIDATION_RETURN_PATH.md

---

## 1. PURPOSE

This document records the CE.7 planning decisions and determines whether a CE.8
implementation stream should be opened.

---

## 2. DECISION QUESTIONS

---

### Q1: Is remediation scope bounded?

**Answer: YES**

All 18 CE.6 gaps have been mapped to explicit action classes in CE.7_GAP_TO_ACTION_MAP.md.
No gap is ambiguous in scope. The remediation is bounded to two runtime components:
`compute_signals.py` and `activate_conditions.py`. No governance contract modification
is required. No new signal types are introduced. No structural redesign of the engine
is required — all changes are additive (ADD REQUIRED FIELD, IMPLEMENT STATE MAPPING,
IMPLEMENT TRACE RECORD) or subtractive (REMOVE PROHIBITED FIELD) against existing signal
functions.

**Evidence:**
- 8 emission gaps: localized to specific signal functions in `compute_signals.py`
- 3 consumption gaps: localized to `SIGNAL_TO_CONDITION_STATE` mapping and downstream record production
- 4 propagation gaps: localized to vocabulary mappings in `activate_conditions.py`
- 3 traceability gaps: localized to record production at the CE.5 boundary

---

### Q2: Is the path to executable-candidate clear?

**Answer: YES**

The 4-phase remediation sequence in CE.7_REMEDIATION_SEQUENCE.md defines a deterministic
path with explicit prerequisite constraints and exit gates. Each phase has a defined
objective, a set of gaps it closes, and a verifiable pass condition.

Phase dependencies are unambiguous:
- PHASE 1 (emission) → PHASE 2 (consumption) → PHASE 3 (propagation vocabulary)
- PHASE 1 (emission) + PHASE 2 (consumption) → PHASE 4 (traceability)

No circular dependencies exist. The path does not require governance changes.
The path terminates when all 7 executability criteria (EX-001..EX-007) pass.

---

### Q3: Are any governance ambiguities still blocking remediation?

**Answer: NO**

The following governance surfaces have been reviewed and found to be unambiguous:

| Surface | Status |
|---|---|
| CE.4 INV-004 (blocking_class) | Unambiguous — required for every BLOCKED signal; failure class values are governed (F-1a, F-2) |
| CE.4 INV-005 (partiality_reasons) | Unambiguous — required per null field; failure class schema defined in CE.4 §4.2–4.3 and dependency_propagation_rules.md DP-001/DP-002 |
| CE.4 §3.3 (prohibited note field) | Unambiguous — prohibition is explicit and unconditional |
| CE.5 CSM-1/CSM-2 (consumption vocabulary) | Unambiguous — AVAILABLE/PARTIAL/BLOCKED is a closed set; COMPLETE→AVAILABLE is a fixed mapping |
| CE.5 PBE-2 (consumption record fields) | Unambiguous — `{signal_id, origin, consumption_state, output_ref}` is the complete governed structure |
| CE.2 DEC-009 (tier vocabulary) | Unambiguous — BLOCKED/DEGRADED/AT_RISK/STABLE is the closed set |
| CE.2 DEC-014 (diagnosis mapping) | Unambiguous — mapping table is deterministic |
| CE.5 T-001/T-002 (traceability records) | Unambiguous — Type 1 and Type 2 schemas are defined; T-001/T-002 rules are explicit |

**One structural decision for CE.8:**
Whether to implement the CE.5 boundary layer as a discrete module or as a governed
function within `activate_conditions.py` is an implementation-detail decision for CE.8.
CE.7 designates it as implementation-detail (not contract-critical) — it is not a
governance ambiguity.

---

### Q4: Should CE.8 implementation stream open next?

**Answer: YES**

**Mandate for CE.8:**

CE.8 is the engine remediation implementation stream. It is authorized to:

1. Modify `pios/core/v0.1/engine/compute_signals.py` to close GAP-E-001 through GAP-E-008
   and GAP-T-001, following the CE.4 emission contract as the governing specification.

2. Modify `pios/core/v0.1/engine/activate_conditions.py` to close GAP-C-001 through
   GAP-C-003, GAP-P-001 through GAP-P-004, GAP-T-002 through GAP-T-003, following
   CE.5 consumption_state_model.md, single_signal_consumption_rules.md,
   propagation_semantics.md, propagation_boundary_enforcement.md,
   consumption_traceability_model.md, and CE.2 DEC-009/DEC-014 as governing specifications.

3. Implement the CE.5 boundary layer (as a discrete module or governed function)
   wherever CE.8 engineering judgment determines it best fits the runtime architecture.

4. Execute re-validation per CE.7_VALIDATION_RETURN_PATH.md (V-01 through V-06).

5. Commit remediated engine and re-validation results to `pios-governance-baseline-v0.4`.

**CE.8 must not:**
- Modify any CE.4, CE.5, CE.6, or CE.7 governance artifact
- Introduce new signals, signal types, or computability classes
- Change the Signal Ledger
- Declare PiOS v0.4 executable-proven without passing all 7 EX-criteria

**CE.8 is complete when:**
- All 18 CE.6 gaps are closed
- All 4 phase exit gates pass
- Full re-validation (V-01..V-06) produces zero failures
- The executability verdict can be updated to executable-proven

---

## 3. CE.7 CLOSURE STATEMENT

CE.7 is closed.

CE.7 has produced 6 normative planning artifacts:

1. `CE.7_REMEDIATION_ARCHITECTURE.md` — 4 remediation domains; dependency graph
2. `CE.7_REMEDIATION_SEQUENCE.md` — 4 phases; mandatory predecessor constraints; exit gates
3. `CE.7_COMPONENT_IMPACT_MAP.md` — 4 components mapped; 2 HIGH sensitivity surfaces
4. `CE.7_GAP_TO_ACTION_MAP.md` — 18 gaps mapped; 16 contract-critical, 2 implementation-detail
5. `CE.7_VALIDATION_RETURN_PATH.md` — 6-step re-validation; 8 executable-proven conditions
6. `CE.7_DECISION.md` — this document; CE.8 authorized

CE.7 has not modified any runtime component, governance contract, or historical artifact.
CE.7 does not change the executable status of PiOS v0.4.

**Remediation scope bounded: YES**
**Path to executable-candidate clear: YES**
**Governance ambiguities blocking remediation: NO**
**CE.8 recommended next: YES**
