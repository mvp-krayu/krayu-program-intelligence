# CE.10 — Gap-to-Fix Mapping

**Stream:** CE.10 — Tier Derivation Implementation & Propagation Closure
**Artifact type:** GAP-TO-FIX MAPPING (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.10

---

## CE.10 GAPS IN SCOPE

| CE.6 Gap ID | Contract | Engine file | Function / location | Fix applied | Status |
|---|---|---|---|---|---|
| GAP-P-003 | CE.2 DEC-009 | activate_conditions.py | CONDITION_TO_DIAGNOSIS_STATE, new BINDING_RULES/BINDING_SURFACE/TIER_ORDER constants, new _get_field_value()/_evaluate_rule()/derive_condition_tier() functions, activate() tier derivation step | Governed binding rules (DEC-013) and binding surface (DEC-012) implemented; DEC-009 per-condition-instance tier derivation implemented; CE.8 interim shim removed | CLOSED |
| GAP-P-004 | CE.2 DEC-014 | activate_conditions.py | CONDITION_TO_DIAGNOSIS_STATE (shim removed), activate() (tier derivation provides correct input) | DEC-014 mapping table was already correct; shim removal + tier derivation closes the activation path to all 4 DEC-014 entries | CLOSED |

---

## CE.8 INHERITED GAPS (CONFIRMED CLOSED — NO REGRESSION)

| CE.6 Gap ID | Status at CE.8 | Status at CE.10 |
|---|---|---|
| GAP-E-001 | CLOSED | CLOSED (no change) |
| GAP-E-002 | CLOSED | CLOSED (no change) |
| GAP-E-003 | CLOSED | CLOSED (no change) |
| GAP-E-004 | CLOSED | CLOSED (no change) |
| GAP-E-005 | CLOSED | CLOSED (no change) |
| GAP-E-006 | CLOSED | CLOSED (no change) |
| GAP-E-007 | CLOSED | CLOSED (no change) |
| GAP-E-008 | CLOSED | CLOSED (no change) |
| GAP-C-001 | CLOSED | CLOSED (no change) |
| GAP-C-002 | CLOSED | CLOSED (no change) |
| GAP-C-003 | CLOSED | CLOSED (no change) |
| GAP-P-001 | CLOSED | CLOSED (no change) |
| GAP-P-002 | CLOSED | CLOSED (no change) |
| GAP-T-001 | CLOSED | CLOSED (no change) |
| GAP-T-002 | CLOSED | CLOSED (no change) |
| GAP-T-003 | CLOSED | CLOSED (no change) |

---

## COMPLETE GAP REGISTRY (ALL 18)

| Gap ID | Domain | Status |
|---|---|---|
| GAP-E-001 | Emission | CLOSED |
| GAP-E-002 | Emission | CLOSED |
| GAP-E-003 | Emission | CLOSED |
| GAP-E-004 | Emission | CLOSED |
| GAP-E-005 | Emission | CLOSED |
| GAP-E-006 | Emission | CLOSED |
| GAP-E-007 | Emission | CLOSED |
| GAP-E-008 | Emission | CLOSED |
| GAP-C-001 | Consumption | CLOSED |
| GAP-C-002 | Consumption | CLOSED |
| GAP-C-003 | Consumption | CLOSED |
| GAP-P-001 | Propagation | CLOSED |
| GAP-P-002 | Propagation | CLOSED |
| GAP-P-003 | Propagation | **CLOSED — CE.10** |
| GAP-P-004 | Propagation | **CLOSED — CE.10** |
| GAP-T-001 | Traceability | CLOSED |
| GAP-T-002 | Traceability | CLOSED |
| GAP-T-003 | Traceability | CLOSED |

**Total gaps: 18 / CLOSED: 18 / PARTIAL: 0 / OPEN: 0**
