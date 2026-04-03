# CE.9 — CE.8 Supersession Rule

**Stream:** CE.9 — Tier Derivation Authority & Scope Clarification
**Artifact type:** SUPERSESSION RULE (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.9
**Answers:** Q4 — treatment of CE.8 interim AVAILABLE/PARTIAL diagnosis shim

---

## QUESTION ADDRESSED

Are CE.8 interim mappings AVAILABLE → ACTIVE and PARTIAL → ACTIVE to be treated as
provisional shims only? How are they superseded? What must be removed?

---

## STATUS OF CE.8 INTERIM MAPPINGS

**CE.8 interim entries in CONDITION_TO_DIAGNOSIS_STATE (activate_conditions.py lines 93–94):**

```python
"AVAILABLE": "ACTIVE",    # interim: fully present signal → active diagnosis
"PARTIAL":   "ACTIVE",    # interim: partial signal → active (conservative)
```

**Classification: PROVISIONAL SHIM — YES.**

These entries are:
1. **Non-governed**: "AVAILABLE" and "PARTIAL" are CE.5 consumption vocabulary (defined in CE.5
   `consumption_state_model.md`). They are not DEC-009 tier vocabulary. No DEC-* decision
   defines a mapping from CE.5 consumption states to diagnosis activation states.

2. **Contract-violating**: DEC-011 requires `condition_coverage_state` to carry tier values
   directly. DEC-014 defines the only governed tier→diagnosis mapping, which covers exclusively
   {BLOCKED, DEGRADED, AT_RISK, STABLE}. AVAILABLE and PARTIAL are not in DEC-014.

3. **Conservative but incorrect in scope**: The comment in CE.8 code notes "conservative;
   consistent with at-minimum AT_RISK → ACTIVE per DEC-014." While the output value (ACTIVE)
   may coincide with a correct DEC-014 result in specific cases, the derivation path bypasses
   DEC-009 tier selection entirely. For a condition that would derive STABLE tier (→ INACTIVE
   per DEC-014), the shim incorrectly produces ACTIVE.

4. **Self-declared provisional**: CE.8 implementation log, propagation_compliance_report.md,
   CE.8_EXECUTION_RECEIPT.md, and validation_report.md all explicitly label these as interim,
   with scope deferred to CE.9/CE.10.

---

## WHAT MUST BE REMOVED IN CE.10

**Exact removal target:**

File: `pios/core/v0.1/engine/activate_conditions.py`

Remove the following two lines from `CONDITION_TO_DIAGNOSIS_STATE`:
```python
"AVAILABLE": "ACTIVE",    # interim: fully present signal → active diagnosis
"PARTIAL":   "ACTIVE",    # interim: partial signal → active (conservative)
```

And remove the associated comment block (lines 85 in CE.8 code):
```python
# Interim CE.5 consumption state mappings (pending DEC-009 tier derivation)
```

**Precondition for removal:**
These lines MUST NOT be removed until DEC-009 tier derivation is implemented and producing
{BLOCKED, DEGRADED, AT_RISK, STABLE} values as `condition_coverage_state` for all conditions.
Premature removal will cause a KeyError in `activate_diag()` for any non-BLOCKED condition.

**Post-removal state of CONDITION_TO_DIAGNOSIS_STATE:**

```python
CONDITION_TO_DIAGNOSIS_STATE = {
    "BLOCKED":   "BLOCKED",
    "DEGRADED":  "ACTIVE",
    "AT_RISK":   "ACTIVE",
    "STABLE":    "INACTIVE",
}
```

This is the DEC-014 governed mapping — no additional entries are permitted.

---

## SUPERSESSION MECHANISM

The CE.8 interim shim is superseded by the following CE.10 implementation sequence:

1. **Produce governed binding rule definition artifacts** (DEC-013 compliant) for all BR-*
   binding rules in the CE.2 baseline binding surface

2. **Produce the instantiated DEC-012 binding surface table** as a governed artifact

3. **Implement DEC-009 tier derivation** in `activate_conditions.py`:
   - Per-condition: collect tier contributions from DEC-012 binding surface rows for that
     condition; apply binding rule evaluation (DEC-013); select max-tier (DEC-009)
   - Emit result as `condition_coverage_state` in tier vocabulary (DEC-011)

4. **Remove interim shim entries** from `CONDITION_TO_DIAGNOSIS_STATE` (AVAILABLE, PARTIAL)

5. **Validate**: Re-run engine against CE.2-R01-MIX signal set and confirm:
   - All 8 `condition_coverage_state` values are in {BLOCKED, DEGRADED, AT_RISK, STABLE}
   - No KeyError in `CONDITION_TO_DIAGNOSIS_STATE` lookup
   - Diagnosis activation states match DEC-014 expectations

---

## TREATMENT OF CE.8 OUTPUTS PENDING SUPERSESSION

CE.8 interim outputs (AVAILABLE/PARTIAL → ACTIVE diagnosis states) MUST be treated as:
- **Provisional** — valid only within the scope of CE.8 partial closure
- **Not CE.2 compliant** — they do not satisfy DEC-009 or DEC-011
- **Subject to supersession** — any run using CE.8 engine for conditions with AVAILABLE/PARTIAL
  states produces diagnosis outputs that will change after CE.10 implementation

No CE.8 diagnosis output for AVAILABLE or PARTIAL conditions should be treated as a
certified DEC-009/DEC-014 compliant result. Only BLOCKED → BLOCKED diagnosis outputs
from CE.8 are DEC-014 compliant.

---

## SUPERSESSION SUMMARY

| CE.8 interim entry | Status | Governing rule violated | Must be removed | Precondition |
|---|---|---|---|---|
| "AVAILABLE" → "ACTIVE" | PROVISIONAL SHIM | DEC-011, DEC-014 | YES | DEC-009 tier derivation implemented for AVAILABLE conditions |
| "PARTIAL" → "ACTIVE" | PROVISIONAL SHIM | DEC-011, DEC-014 | YES | DEC-009 tier derivation implemented for PARTIAL conditions |
