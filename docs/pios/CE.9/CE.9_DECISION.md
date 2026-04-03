# CE.9 — Decision

**Stream:** CE.9 — Tier Derivation Authority & Scope Clarification
**Artifact type:** DECISION (NORMATIVE CLOSURE)
**Date:** 2026-04-03
**Authority:** CE.9
**Answers:** Q5 — governance decisions required before CE.10 implementation

---

## Q5: GOVERNANCE DECISIONS REQUIRED BEFORE CE.10 IMPLEMENTATION

### Decision 1 — Binding rule authority established

**CE.9 declares:**
`docs/pios/CE.2/traceability/ce2_decision_ledger.md` is the sole canonical authority for
DEC-012 (binding surface schema) and DEC-013 (binding rule class requirements). No other
existing artifact is authoritative for these decisions.

**CE.10 obligation arising from this decision:**
CE.10 MUST produce governed binding rule definition artifacts before implementing tier derivation.
These artifacts must satisfy DEC-013 minimum specification for each binding rule referenced:
BR-DEP-LOAD-RATIO-001, BR-EDGE-DENSITY-001, BR-STRUCTURAL-RATIO-001, BR-COORD-PRESSURE-001,
BR-THROUGHPUT-RATE-001, BR-HEALTH-DEP-COMP-001, BR-NULL-SIGNAL-BLOCKED.

**CE.10 obligation arising from this decision (continued):**
CE.10 MUST produce the instantiated DEC-012 binding surface table as a standalone governed
artifact — not derived from QA test artifacts, which are non-authoritative.

---

### Decision 2 — Tier derivation evaluation unit defined

**CE.9 declares:**
DEC-009 tier derivation is per-condition-instance. Each condition independently:
(a) collects tier contributions from its DEC-012 binding rows,
(b) evaluates each row's binding rule (DEC-013) against the declared signal field value,
(c) selects max-tier via `max(contributions, key=TIER_ORDER)`.

No cross-condition aggregation. No shared intermediate tier state. Governed by DEC-006
(condition-local), DEC-010 (signal-local binding), DEC-009 (max-tier selection).

**CE.10 obligation:** Implement tier derivation strictly within per-condition scope. No
code path that reads another condition's tier contributions into the current condition's
resolution is permitted.

---

### Decision 3 — Diagnosis input contract defined

**CE.9 declares:**
After DEC-009/DEC-011, `condition["condition_coverage_state"]` carries a string value
∈ {"BLOCKED", "DEGRADED", "AT_RISK", "STABLE"}. This value, unmodified, is the input to
`CONDITION_TO_DIAGNOSIS_STATE` in `activate_diag()`. No intermediate transformation layer
between DEC-009 output and DEC-014 lookup is permitted (DEC-011).

`activate_diag()` code structure is correct. No structural change to `activate_diag()` is
required in CE.10 beyond the upstream tier derivation producing correct `condition_coverage_state`
values.

---

### Decision 4 — CE.8 interim shim supersession rule defined

**CE.9 declares:**
CE.8 interim mappings "AVAILABLE" → "ACTIVE" and "PARTIAL" → "ACTIVE" in
`CONDITION_TO_DIAGNOSIS_STATE` are provisional shims. They violate DEC-011 and DEC-014.

CE.10 MUST remove these entries from `CONDITION_TO_DIAGNOSIS_STATE` as part of the CE.10
implementation stream, after DEC-009 tier derivation is implemented and verified. Premature
removal (before tier derivation is operational) will cause a runtime KeyError and is prohibited.

CE.8 diagnosis outputs for AVAILABLE/PARTIAL conditions are not DEC-014 compliant and must
not be treated as certified CE.2 results. Only CE.8 BLOCKED → BLOCKED diagnosis outputs
are DEC-014 compliant.

---

## STREAM ASSESSMENT

### Is governance clarification complete? YES

All five stream questions are answered by the four CE.9 artifacts:
- Q1: `CE.9_BINDING_RULE_AUTHORITY_DECISION.md` — schema authority identified; governed binding
  rule artifacts found absent (GAP-A-001, GAP-A-002)
- Q2: `CE.9_TIER_DERIVATION_SCOPE_DECISION.md` — per-condition-instance defined and proven
- Q3: `CE.9_DIAGNOSIS_INPUT_CONTRACT.md` — exact input type, value set, and derivation path defined
- Q4: `CE.9_CE8_SUPERSESSION_RULE.md` — shim status confirmed, removal spec and preconditions defined
- Q5: This document — governance decisions consolidated

### Is CE.10 implementation now unblocked? YES

CE.10 has sufficient governance to begin implementation. The blocking ambiguities are resolved:
- Evaluation unit: per-condition-instance (DEC-006, DEC-009, DEC-010; confirmed by QA.2/QA.4)
- Input to CONDITION_TO_DIAGNOSIS_STATE: DEC-009/DEC-011 tier value string
- Shim removal: allowed after tier derivation is operational, subject to preconditions in CE.9_CE8_SUPERSESSION_RULE.md
- Binding rule artifact obligation: CE.10 must produce governed binding rule definitions first

### Are any ambiguities still open? NO

The following were identified as ambiguities in the CE.8 detailed execution report:
1. Which DEC-012/DEC-013 artifacts are authoritative → RESOLVED (CE.9_BINDING_RULE_AUTHORITY_DECISION.md)
2. Whether DEC-009 derivation is per-condition-instance or aggregate → RESOLVED (CE.9_TIER_DERIVATION_SCOPE_DECISION.md)
3. How CE.8 interim shim is superseded → RESOLVED (CE.9_CE8_SUPERSESSION_RULE.md)

No ambiguity remains that would prevent CE.10 from defining its implementation scope.

---

## CE.10 MANDATORY PREREQUISITES (ORDERED)

| # | Prerequisite | Basis |
|---|---|---|
| 1 | Produce governed binding rule definition artifacts for all 7 BR-* rule IDs | DEC-013, CE.9 Decision 1 |
| 2 | Produce instantiated DEC-012 binding surface table as governed artifact | DEC-012, CE.9 Decision 1 |
| 3 | Implement per-condition-instance DEC-009 tier derivation in activate_conditions.py | DEC-009, CE.9 Decision 2 |
| 4 | Verify all 8 condition_coverage_state values ∈ {BLOCKED, DEGRADED, AT_RISK, STABLE} | DEC-011, CE.9 Decision 3 |
| 5 | Remove CE.8 interim shim entries from CONDITION_TO_DIAGNOSIS_STATE | CE.9 Decision 4, CE.9_CE8_SUPERSESSION_RULE.md |
| 6 | Re-validate activate_diag() for all 8 conditions against DEC-014 | DEC-014, CE.9 Decision 3 |
| 7 | Close GAP-P-003 and GAP-P-004 | CE.8 gap registry |

---

## ARTIFACT INVENTORY

| # | Artifact | Status |
|---|---|---|
| 1 | CE.9_BINDING_RULE_AUTHORITY_DECISION.md | COMPLETE |
| 2 | CE.9_TIER_DERIVATION_SCOPE_DECISION.md | COMPLETE |
| 3 | CE.9_DIAGNOSIS_INPUT_CONTRACT.md | COMPLETE |
| 4 | CE.9_CE8_SUPERSESSION_RULE.md | COMPLETE |
| 5 | CE.9_DECISION.md | COMPLETE |

---

## STREAM CLOSURE

CE.9 is closed. All governance questions blocking CE.10 are resolved.
