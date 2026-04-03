# CE.11 — Validation Trigger Model

**Stream:** CE.11 — Change Governance & Evolution Contract
**Artifact type:** VALIDATION TRIGGER MODEL (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.11
**Status:** GOVERNANCE-DEFINED

---

## 1. PURPOSE

This document defines exactly when each validation and certification stream MUST be
re-run as a consequence of a classified change. Triggers are deterministic: given a
change class and impact surface, the required validation steps are fully determined.
No stream may be skipped unless an explicit exemption rule in this document applies.

---

## 2. VALIDATION STREAM REGISTRY

| Stream ID | Name | Scope |
|---|---|---|
| VS-CE6 | Compliance Inspection | 7 executability criteria (EX-001..EX-007) across all 4 compliance domains |
| VS-CE7 | Remediation Planning | Gap enumeration and remediation path definition |
| VS-CE8 | Implementation (Emission/Consumption/Traceability) | Closing GAP-E, GAP-C, GAP-T class gaps |
| VS-CE10 | Implementation (Propagation) | Closing GAP-P class gaps |
| VS-CE10C | Certification Closeout | Producing executable certification artifacts |

---

## 3. TRIGGER RULES

### VT-001 — Emission change triggers full cycle

**Trigger condition:** L-40.5-E is in the impact surface of a GC-002 change.

**Required streams:** VS-CE6 → VS-CE7 → VS-CE8 (emission domain) → VS-CE10 (if propagation affected) → VS-CE10C

**Rationale:** Emission logic feeds consumption and propagation. Any change to signal
computation may alter the set of COMPLETE/PARTIAL/BLOCKED outputs and cascade through
all downstream compliance domains.

**Exemption:** None. L-40.5-E impact always requires full cycle.

---

### VT-002 — Consumption change triggers full cycle

**Trigger condition:** L-40.5-C is in the impact surface of a GC-002 change.

**Required streams:** VS-CE6 → VS-CE7 → VS-CE8 (consumption domain) → VS-CE10C

**Rationale:** Consumption state mapping feeds tier derivation and traceability. Any
change to consumption logic may alter condition availability for propagation.

**Exemption:** None.

---

### VT-003 — Propagation change triggers full cycle

**Trigger condition:** L-40.6-P is in the impact surface of a GC-002 change.

**Required streams:** VS-CE6 → VS-CE7 → VS-CE10 (propagation domain) → VS-CE10C

**Rationale:** Propagation produces `condition_coverage_state` and
`diagnosis_activation_state`. These are the terminal governed outputs of the
40.5 → 40.6 handoff. Any change to tier derivation or diagnosis mapping requires
full re-certification.

**Exemption:** None.

---

### VT-004 — Traceability change triggers compliance inspection and certification

**Trigger condition:** L-40.6-T is in the impact surface of a GC-002 change.

**Required streams:** VS-CE6 (traceability domain only, EX-007) → VS-CE10C

**Rationale:** Traceability is a dependent domain — it does not feed back into
emission, consumption, or propagation. A targeted traceability fix requires
compliance re-inspection and certification closeout but not full remediation planning.

**Exemption:** If the traceability change is co-delivered with emission, consumption,
or propagation changes, VT-001/VT-002/VT-003 applies and subsumes this trigger.

---

### VT-005 — Governance change triggers compliance inspection

**Trigger condition:** A GC-001 change modifies a governance contract, invariant, or
decision record that governs engine behavior (i.e., the change has engine-behavioral
implications, not purely documentation).

**Required streams:** VS-CE6 (against current engine, to determine if new constraints
are violated) → VS-CE7 (if gaps are found) → implementation streams as required → VS-CE10C

**Rationale:** A governance change may introduce new executability criteria that the
current engine does not satisfy. CE.6 determines whether the existing engine is
compliant with the new governance state.

**Exemption:** A GC-001 change that produces only governance clarification (CE.9-class)
— i.e., it resolves ambiguity without altering effective constraint — does not require
VS-CE6 re-run against the engine, but MUST produce a formal governance decision
artifact confirming no effective constraint change.

---

### VT-006 — Baseline data change triggers targeted re-validation

**Trigger condition:** A GC-003 change modifies static baseline telemetry constants
(STATIC_VARIABLES in `compute_signals.py` or equivalent).

**Required streams:** VS-CE6 (all 4 domains, new data context) → VS-CE10C

**Rationale:** Changing the static baseline changes all signal output values and
therefore all tier derivation results. Even if engine logic is unchanged, the
output-level compliance must be re-verified under the new data context.

**Exemption:** A GC-003 change that only adds new validation run archives (without
changing the baseline or the engine) does not trigger VS-CE6. It only requires a
VS-CE10C artifact update to record the new evidence.

---

### VT-007 — Non-functional change requires no validation cycle

**Trigger condition:** A GC-004 change with no engine layer impact.

**Required streams:** NONE

**Rationale:** Non-functional changes do not alter any governed output. No compliance
domain is affected.

**Exemption:** Not applicable. If a purported GC-004 change triggers any ISM rule
(ISM-001..ISM-006), it must be reclassified before proceeding.

---

## 4. TRIGGER MATRIX

| Impact Surface | VS-CE6 | VS-CE7 | VS-CE8 | VS-CE10 | VS-CE10C |
|---|---|---|---|---|---|
| L-40.5-E affected | REQUIRED | REQUIRED | REQUIRED | IF L-40.6-P | REQUIRED |
| L-40.5-C affected | REQUIRED | REQUIRED | REQUIRED | IF L-40.6-P | REQUIRED |
| L-40.6-P affected | REQUIRED | REQUIRED | NOT REQUIRED | REQUIRED | REQUIRED |
| L-40.6-T affected | REQUIRED (EX-007) | NOT REQUIRED | NOT REQUIRED | NOT REQUIRED | REQUIRED |
| GC-001 (behavioral) | REQUIRED | IF GAPS | IF GAPS | IF GAPS | REQUIRED |
| GC-001 (clarification only) | NOT REQUIRED | NOT REQUIRED | NOT REQUIRED | NOT REQUIRED | NOT REQUIRED |
| GC-003 (baseline change) | REQUIRED | NOT REQUIRED | NOT REQUIRED | NOT REQUIRED | REQUIRED |
| GC-003 (run addition only) | NOT REQUIRED | NOT REQUIRED | NOT REQUIRED | NOT REQUIRED | REQUIRED |
| GC-004 | NOT REQUIRED | NOT REQUIRED | NOT REQUIRED | NOT REQUIRED | NOT REQUIRED |

---

## 5. TRIGGER EVALUATION ORDER

Triggers are evaluated in this order:

1. Classify the change (GC-001..GC-004) per CE.11_CHANGE_CLASSIFICATION.md
2. Determine impact surface per CE.11_IMPACT_SURFACE_MODEL.md
3. Apply VT-001..VT-007 in order; any trigger that fires is mandatory
4. Union all required streams — the validation scope is the union, not any single trigger
5. Record the validation scope in the change traceability entry before execution

No trigger may be waived by a subsequent trigger. The union rule applies.

---

## 6. CYCLE INVARIANTS

### CI-001 — No partial cycle completion
If VS-CE6 is required, VS-CE10C MUST follow in the same stream or a formally
authorized successor stream. A system that has completed VS-CE6 but not VS-CE10C
is in UNCERTIFIED state and must be declared as such.

### CI-002 — No skipping VS-CE7
If VS-CE6 identifies gaps, VS-CE7 is mandatory before implementation begins. No gap
may be closed without a bounded remediation plan.

### CI-003 — VS-CE10C always closes a full cycle
VS-CE10C may not be executed unless all required upstream streams (VS-CE6, VS-CE7,
implementation streams) have been completed and recorded. An orphaned VS-CE10C is
invalid.
