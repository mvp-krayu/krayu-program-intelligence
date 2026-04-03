# CE.9 — Diagnosis Input Contract

**Stream:** CE.9 — Tier Derivation Authority & Scope Clarification
**Artifact type:** INPUT CONTRACT (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.9
**Answers:** Q3 — exact input object/value for activate_diag after proper tier derivation

---

## QUESTION ADDRESSED

What exact runtime object should be passed into CONDITION_TO_DIAGNOSIS_STATE after tier
derivation is implemented? What is the relationship to DEC-014?

---

## GOVERNING RULES

**DEC-011:** "The emitted `condition_coverage_state` MUST use tier values directly with no
intermediate mapping layer."
Tier values: BLOCKED, DEGRADED, AT_RISK, STABLE

**DEC-014:** "The CE.2 emitted tier vocabulary SHALL map to diagnosis activation state at 40.7
through the following governed mapping: BLOCKED → BLOCKED, DEGRADED → ACTIVE, AT_RISK → ACTIVE,
STABLE → INACTIVE. This mapping is mandatory for CE.2 execution."

---

## CONTRACT DEFINITION

### Input to CONDITION_TO_DIAGNOSIS_STATE

After proper DEC-009 tier derivation is implemented, the input to `CONDITION_TO_DIAGNOSIS_STATE`
is:

**Type:** string
**Value set:** exactly `{"BLOCKED", "DEGRADED", "AT_RISK", "STABLE"}` — the CE.2 DEC-009 tier vocabulary
**Source:** `condition["condition_coverage_state"]` — the tier value emitted by the condition
activation layer after per-condition-instance DEC-009 resolution (per DEC-011 direct emission)

No intermediate transformation between DEC-009 output and `CONDITION_TO_DIAGNOSIS_STATE` lookup
is permitted (DEC-011: "no intermediate mapping layer").

---

### CE.8 current code path (pre-CE.10)

```python
# activate_conditions.py — activate_diag() line 303
cond_state = condition["condition_coverage_state"]
diag_state = CONDITION_TO_DIAGNOSIS_STATE[cond_state]
```

This code path is correct. The lookup structure is correct. The error is upstream:
`condition["condition_coverage_state"]` currently receives a CE.5 value ("AVAILABLE" or "PARTIAL")
for non-BLOCKED conditions, not a DEC-009 tier value.

After CE.10 implements tier derivation, `condition["condition_coverage_state"]` will carry a
tier value ("AT_RISK", "STABLE", "DEGRADED", or "BLOCKED") and the `activate_diag()` lookup
will resolve correctly through the existing DEC-014 table entries.

---

### Required CONDITION_TO_DIAGNOSIS_STATE state post-CE.10

After CE.10, the mapping table MUST contain exactly these entries — no more:

```python
CONDITION_TO_DIAGNOSIS_STATE = {
    "BLOCKED":   "BLOCKED",   # DEC-014
    "DEGRADED":  "ACTIVE",    # DEC-014
    "AT_RISK":   "ACTIVE",    # DEC-014
    "STABLE":    "INACTIVE",  # DEC-014
}
```

The interim CE.8 entries ("AVAILABLE" → "ACTIVE", "PARTIAL" → "ACTIVE") MUST be removed.
See `CE.9_CE8_SUPERSESSION_RULE.md` for removal specification.

---

### Relationship to DEC-014

DEC-014 is the downstream consumer of DEC-011 output. The relationship is:

```
Signal field values
      ↓
DEC-013 binding rule evaluation (per binding row)
      ↓
Tier contribution ∈ {BLOCKED, DEGRADED, AT_RISK, STABLE}
      ↓
DEC-009 max-tier per condition (per-condition-instance)
      ↓
DEC-011: condition_coverage_state = tier value (direct emission)
      ↓
CONDITION_TO_DIAGNOSIS_STATE[tier_value]  ← THIS IS THE LOOKUP INPUT
      ↓
DEC-014: diagnosis_activation_state ∈ {BLOCKED, ACTIVE, INACTIVE}
```

`CONDITION_TO_DIAGNOSIS_STATE` is the implementation artifact for DEC-014.
The string passed into it is the DEC-011 emitted tier value.
The string returned from it is the DEC-014 governed diagnosis state.

---

## PROOF FROM VALIDATED EVIDENCE

QA.2 full trace (COND-007 — Pattern B):
```
DEC-011 emit:  COND-007.condition_coverage_state = 'BLOCKED'
DEC-014 mapping: BLOCKED → BLOCKED
               DIAG-007.diagnosis_activation_state = 'BLOCKED'
```

QA.4 full trace (COND-001):
```
DEC-011 emit: COND-001.condition_coverage_state = 'STABLE'
DEC-014: STABLE → INACTIVE
         DIAG-001.diagnosis_activation_state = 'INACTIVE'
```

In both cases, the lookup input is the DEC-011 emitted tier string, not the CE.5 consumption
vocabulary. "BLOCKED", "STABLE", "AT_RISK" — these are the exact strings passed to
CONDITION_TO_DIAGNOSIS_STATE.

---

## CONTRACT SUMMARY

| Property | Value |
|---|---|
| Input type | string |
| Valid input values | "BLOCKED", "DEGRADED", "AT_RISK", "STABLE" |
| Input source | condition["condition_coverage_state"] after DEC-009/DEC-011 |
| Invalid inputs (post-CE.10) | "AVAILABLE", "PARTIAL" — CE.5 vocabulary, not DEC-009 tier vocabulary |
| Lookup function | CONDITION_TO_DIAGNOSIS_STATE[input] |
| Output values | "BLOCKED", "ACTIVE", "INACTIVE" |
| Governing rule for lookup table | DEC-014 |
| Code change required | DEC-009 tier derivation upstream; removal of interim CE.8 shim entries |
