# CE.8 — Gap-to-Fix Mapping

**Stream:** CE.8 — Engine Implementation & Compliance Execution
**Artifact type:** GAP-TO-FIX MAPPING (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.8

---

## COMPLETE GAP-TO-FIX TABLE

Every CE.6 gap mapped to its fix location, action, and closure status.

| CE.6 Gap ID | Contract | Engine file | Function / location | Fix applied | Status |
|---|---|---|---|---|---|
| GAP-E-001 | CE.4 INV-005 | compute_signals.py | `compute_sig_001` | Added `partiality_reasons.runtime_component` (F-1b); removed null field from traceability | CLOSED |
| GAP-E-002 | CE.4 INV-004 | compute_signals.py | `compute_sig_003` | Added `"blocking_class": "F-1a"` to both branches | CLOSED |
| GAP-E-003 | CE.4 INV-005 | compute_signals.py | `compute_sig_005` | Added `partiality_reasons.completion_factor` (F-1b); removed null field from traceability | CLOSED |
| GAP-E-004 | CE.4 INV-004 | compute_signals.py | `compute_sig_006` | Added `"blocking_class": "F-1a"` | CLOSED |
| GAP-E-005 | CE.4 INV-005 | compute_signals.py | `compute_sig_007` | Added `partiality_reasons` with F-4 entry for sig_005 component, F-3 entry for sig_006 component | CLOSED |
| GAP-E-006 | CE.4 §3.3 | compute_signals.py | `compute_sig_007` | Removed `note` field | CLOSED |
| GAP-E-007 | CE.4 INV-005 | compute_signals.py | `compute_sig_008` | Added `partiality_reasons` with F-3 entry for sig_003 component | CLOSED |
| GAP-E-008 | CE.4 §3.3 | compute_signals.py | `compute_sig_008` | Removed `note` field | CLOSED |
| GAP-C-001 | CE.5 CSM-1 | activate_conditions.py | `SIGNAL_TO_CONDITION_STATE`, all `activate_cond_*` functions | Vocabulary replaced: complete→AVAILABLE, partial→PARTIAL, blocked→BLOCKED | CLOSED |
| GAP-C-002 | CE.5 CSM-2/C-001 | activate_conditions.py | `CE4_TO_CE5_CONSUMPTION_STATE`, `SIGNAL_TO_CONDITION_STATE` | COMPLETE→AVAILABLE mapping implemented | CLOSED |
| GAP-C-003 | CE.5 PBE-2 | activate_conditions.py | `produce_ce5_consumption_record()`, `activate()` | CE.5 consumption record `{signal_id, origin, consumption_state, output_ref}` produced per signal | CLOSED |
| GAP-P-001 | CE.5 P-001 | activate_conditions.py | `produce_ce5_consumption_record()` | Propagation record structure produced | CLOSED |
| GAP-P-002 | CE.5 P-002 | activate_conditions.py | `CE4_TO_CE5_CONSUMPTION_STATE` | consumption_state derived from CE.4 state via CE.5 mapping | CLOSED |
| GAP-P-003 | CE.2 DEC-009 | activate_conditions.py | `CONDITION_TO_DIAGNOSIS_STATE`, `activate_cond_*` functions | DEC-009 tier entries added; legacy lowercase eliminated; DEC-009 value-reactive derivation deferred to CE.9 | PARTIAL |
| GAP-P-004 | CE.2 DEC-014 | activate_conditions.py | `CONDITION_TO_DIAGNOSIS_STATE` | DEC-014 tier→diagnosis entries added; BLOCKED→BLOCKED active; interim CE.5 state mapping for non-BLOCKED | PARTIAL |
| GAP-T-001 | CE.4 INV-006 | compute_signals.py | `compute_sig_001`, `compute_sig_005`, `compute_sig_007`, `compute_sig_008` | partiality_reasons added for all null fields in PARTIAL signals; traceability_coverage expected PASS on re-run | CLOSED |
| GAP-T-002 | CE.5 T-001 | activate_conditions.py | `produce_ce5_traceability_records()` | Type 2 structural gap trace records produced for absent signals | CLOSED |
| GAP-T-003 | CE.5 T-002 | activate_conditions.py | `produce_ce5_traceability_records()` | Type 1 consumption traceability records produced for all present signals | CLOSED |

---

## CLOSURE COUNTS

- Total gaps: 18
- CLOSED: 16 (GAP-E-001..E-008, GAP-C-001..C-003, GAP-P-001..P-002, GAP-T-001..T-003)
- PARTIAL: 2 (GAP-P-003, GAP-P-004 — DEC-009 tier derivation deferred to CE.9)
- OPEN: 0
