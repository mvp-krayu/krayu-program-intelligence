# CE.11 — Governance Decision

**Stream:** CE.11 — Change Governance & Evolution Contract
**Artifact type:** GOVERNANCE DECISION (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.11
**Status:** CLOSED

---

## 1. STREAM PURPOSE

CE.11 was initiated post-CE.10C to define the canonical governance model for all
future changes to PiOS. The target baseline is PiOS v0.4 EXECUTABLE-PROVEN
(`pios-governance-baseline-v0.4`).

---

## 2. MODELS DEFINED

| Model | Artifact | Status |
|---|---|---|
| Change Classification Model | `CE.11_CHANGE_CLASSIFICATION.md` | COMPLETE |
| Impact Surface Model | `CE.11_IMPACT_SURFACE_MODEL.md` | COMPLETE |
| Validation Trigger Model | `CE.11_VALIDATION_TRIGGER_MODEL.md` | COMPLETE |
| Certification Integrity Rules | `CE.11_CERTIFICATION_INTEGRITY_RULES.md` | COMPLETE |
| Versioning Governance Model | `CE.11_VERSIONING_GOVERNANCE.md` | COMPLETE |
| Prohibited Evolution Patterns | `CE.11_PROHIBITED_PATTERNS.md` | COMPLETE |
| Change Traceability Model | `CE.11_TRACEABILITY_MODEL.md` | COMPLETE |

---

## 3. DECISION QUESTIONS

### Q1: Is change governance now fully defined?

**YES.**

CE.11 defines:
- An exhaustive change classification with 4 classes (GC-001..GC-004)
- Impact surface detection rules covering all 7 PiOS layers
- Deterministic validation triggers for all 5 validation streams
- Certification integrity invariants with 4 system states and governed transitions
- Versioning criteria distinguishing PATCH, MINOR, and MAJOR events
- 9 explicitly prohibited patterns with corrective paths
- A mandatory traceability entry schema covering all GC-001..GC-003 changes

No change to PiOS can occur without triggering at least one of these models.

---

### Q2: Can any future change be deterministically classified?

**YES.**

The change classification model (GC-001..GC-004) is exhaustive. Every possible
PiOS change falls into exactly one class:

- Changes to governance contracts: GC-001
- Changes to engine behavior: GC-002
- Changes to run inputs/outputs/baselines: GC-003
- Changes to non-functional content: GC-004

Classification rule R-CLASS-002 handles overlapping changes by escalating to the
highest-risk class. Classification rule R-CLASS-001 mandates that unclassified
changes are forbidden. No change is outside the classification model.

---

### Q3: Can certification requirements be derived automatically?

**YES.**

Given a change class and impact surface, the validation trigger model (VT-001..VT-007)
deterministically produces the required validation scope. The trigger matrix provides
a lookup table. The trigger evaluation order (classify → determine impact surface →
apply triggers → union) is procedural and mechanical.

The output is a set of required validation streams from {VS-CE6, VS-CE7, VS-CE8,
VS-CE10, VS-CE10C}. This set fully determines the certification work required.

---

### Q4: Are any ambiguities remaining?

**NO.**

CE.11 resolves the following potential ambiguities:

- **What counts as a governance change vs. a clarification?** Defined in GC-001:
  a clarification that does not alter effective constraint does not trigger VS-CE6.
  A change that introduces new effective constraints does. The CE.9 clarification model
  is the reference.

- **When does a MINOR version require a new CE stream?** Versioning governance
  defines: any MINOR or MAJOR version event requires a new governing CE stream and
  a versioning decision artifact before any implementation.

- **Can a certified system run alongside an uncertified change in progress?**
  Certification integrity rules define CERTIFICATION-SUSPENDED as the mandatory
  intermediate state. There is no ambiguity about what state the system is in.

- **Who authorizes remediation?** VS-CE7 authorization is required before
  implementation. PP-007 prohibits gap closure without a remediation plan.

- **When is certification evidence sufficient?** The traceability model defines
  AR-004 (audit chain completeness check) as a mandatory pre-condition for VS-CE10C.

---

## 4. INVARIANTS ESTABLISHED BY CE.11

The following are CE.11-level invariants, binding on all future PiOS evolution:

### EV-001 — Governance precedence
No engine change may precede its governing contract. A GC-002 change that implements
behavior not yet defined in governance is a PP-009 violation.

### EV-002 — Certification is state, not claim
EXECUTABLE-PROVEN is a system state with defined entry and exit conditions, not a
label that can be applied by assertion. Any system not in EXECUTABLE-PROVEN state
(per CE.11_CERTIFICATION_INTEGRITY_RULES.md) may not be represented as certified.

### EV-003 — Traceability is not optional
Every GC-001/GC-002 change must produce a change traceability entry before
execution. This is a hard pre-condition, not a documentation afterthought.

### EV-004 — Version events require independent certification
A new PiOS version (MINOR or MAJOR) requires an independent VS-CE6 → VS-CE10C
cycle. The prior version's certification does not transfer.

### EV-005 — Prohibition is unconditional
The 9 prohibited patterns (PP-001..PP-009) apply without exception. No stream
authority may waive a prohibited pattern. If a prohibited pattern is triggered,
the corrective path is mandatory.

---

## 5. CE.11 CLOSURE VERDICT

**CE.11 is CLOSED.**

Change governance is fully defined for PiOS. All future changes to any PiOS
component — governance, engine, data, or documentation — are subject to the
CE.11 governance model.

The PiOS v0.4 EXECUTABLE-PROVEN certification (CE.10C) remains valid. CE.11
is a governance-only stream: it does not modify any engine file, does not change
any existing governance contract, and does not alter the executable status of
PiOS v0.4.

**Post-CE.11 baseline:**
- PiOS v0.4: EXECUTABLE-PROVEN (unchanged)
- Change governance: FULLY DEFINED (CE.11)
- Any future PiOS change: governed by CE.11 models
