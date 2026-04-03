# CE.8 — Implementation Log

**Stream:** CE.8 — Engine Implementation & Compliance Execution
**Artifact type:** IMPLEMENTATION LOG (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.8
**Anchored basis:** CE.6 static code inspection + `runs/pios/40.5/run_03_executable/signal_validation_report.json`

---

## ANCHORING CONFIRMATION

- Canonical branch: `pios-governance-baseline-v0.4`
- CE.6 authoritative evidence: static inspection of engine files + run_03_executable validation report
- Out-of-scope run paths: NOT consulted
- CE.7 remediation artifacts: loaded

---

## CHANGES — `pios/core/v0.1/engine/compute_signals.py`

### IMPL-001 — SIG-001: Add partiality_reasons for null runtime_component
- CE.6 gap: GAP-E-001
- CE.7 item: R-002
- Contract: CE.4 INV-005
- Change: Added `partiality_reasons.runtime_component` with `failure_class: "F-1b"`.
  Removed null field `runtime_component` from `traceability` dict (null fields not formula-resolved).

### IMPL-002 — SIG-003: Add blocking_class to BLOCKED payload (both branches)
- CE.6 gap: GAP-E-002
- CE.7 item: R-001
- Contract: CE.4 INV-004
- Change: Added `"blocking_class": "F-1a"` to primary branch (VAR_AT_001/VAR_AT_002 absent —
  temporal class mismatch). Also added complete payload to unreachable fallback branch.

### IMPL-003 — SIG-005: Add partiality_reasons for null completion_factor
- CE.6 gap: GAP-E-003
- CE.7 item: R-002
- Contract: CE.4 INV-005
- Change: Added `partiality_reasons.completion_factor` with `failure_class: "F-1b"`.
  Removed null field `completion_factor` from `traceability` dict.

### IMPL-004 — SIG-006: Add blocking_class to BLOCKED payload
- CE.6 gap: GAP-E-004
- CE.7 item: R-001
- Contract: CE.4 INV-004
- Change: Added `"blocking_class": "F-1a"` (all inputs event-based; structural input absence).

### IMPL-005 — SIG-007: Add partiality_reasons for 2 null fields; remove note
- CE.6 gaps: GAP-E-005 (partiality_reasons), GAP-E-006 (note removal)
- CE.7 items: R-002, R-003
- Contract: CE.4 INV-005, CE.4 §3.3
- Change: Removed `note` field. Added `partiality_reasons` with:
  - `sig_005_completion_factor_component`: `failure_class: "F-4"`, upstream_signal: SIG-005, upstream_field: completion_factor
  - `sig_006_stability_component`: `failure_class: "F-3"`, upstream_signal: SIG-006

### IMPL-006 — SIG-008: Add partiality_reasons for 1 null field; remove note
- CE.6 gaps: GAP-E-007 (partiality_reasons), GAP-E-008 (note removal)
- CE.7 items: R-002, R-003
- Contract: CE.4 INV-005, CE.4 §3.3
- Change: Removed `note` field. Added `partiality_reasons` with:
  - `sig_003_change_concentration_component`: `failure_class: "F-3"`, upstream_signal: SIG-003

---

## CHANGES — `pios/core/v0.1/engine/activate_conditions.py`

### IMPL-007 — Add CE.5 consumption state mapping constant
- CE.6 gaps: GAP-C-001, GAP-C-002
- CE.7 item: R-004
- Contract: CE.5 consumption_state_model.md §3
- Change: Added `CE4_TO_CE5_CONSUMPTION_STATE` dict mapping CE.4 states → CE.5 consumption states
  (COMPLETE→AVAILABLE, PARTIAL→PARTIAL, BLOCKED→BLOCKED, COMPUTABLE_PENDING→PARTIAL).

### IMPL-008 — Replace SIGNAL_TO_CONDITION_STATE vocabulary with CE.5
- CE.6 gaps: GAP-C-001, GAP-C-002
- CE.7 item: R-004
- Contract: CE.5 consumption_state_model.md §2
- Change: Replaced "complete"/"partial"/"blocked" with "AVAILABLE"/"PARTIAL"/"BLOCKED".

### IMPL-009 — Replace CONDITION_TO_DIAGNOSIS_STATE with DEC-014 vocabulary
- CE.6 gaps: GAP-P-003, GAP-P-004
- CE.7 item: R-005
- Contract: CE.2 DEC-014
- Change: Replaced old lowercase mapping with DEC-014 tier entries (BLOCKED→BLOCKED,
  DEGRADED→ACTIVE, AT_RISK→ACTIVE, STABLE→INACTIVE) plus interim CE.5 state entries
  (AVAILABLE→ACTIVE, PARTIAL→ACTIVE) pending DEC-009 tier derivation (CE.9).

### IMPL-010 — Update hardcoded condition_coverage_state in all activate_cond_* functions
- CE.6 gap: GAP-C-001
- CE.7 item: R-004
- Contract: CE.5 CSM-1
- Change: Replaced "complete"→"AVAILABLE", "partial"→"PARTIAL", "blocked"→"BLOCKED"
  in all 8 condition functions.

### IMPL-011 — Fix activate_diag blocked check for CE.5 vocabulary
- CE.6 gap: GAP-C-001 (consequence)
- CE.7 item: R-004
- Contract: CE.5 CSM-1
- Change: Changed `if cond_state == "blocked":` to `if cond_state == "BLOCKED":`.

### IMPL-012 — Add produce_ce5_consumption_record() function
- CE.6 gaps: GAP-C-003, GAP-P-001, GAP-P-002
- CE.7 item: R-004
- Contract: CE.5 propagation_boundary_enforcement.md §3 (PBE-2), propagation_semantics.md P-001/P-002
- Change: New function producing `{signal_id, origin, consumption_state, output_ref}` per signal.

### IMPL-013 — Add produce_ce5_traceability_records() function
- CE.6 gaps: GAP-T-002, GAP-T-003
- CE.7 item: R-006
- Contract: CE.5 consumption_traceability_model.md T-001/T-002
- Change: New function producing Type 1 records for present signals, Type 2 for absent signals.
  Uses GOVERNED_SIGNAL_IDS constant for Signal Ledger scope.

### IMPL-014 — Integrate CE.5 records into activate() output
- CE.6 gaps: GAP-C-003, GAP-T-002, GAP-T-003
- CE.7 item: R-004, R-006
- Change: CE.5 consumption and traceability records produced in activate(); included in output JSON.
  Summary vocabulary updated to AVAILABLE/PARTIAL/BLOCKED and ACTIVE/INACTIVE/BLOCKED.

---

## SCOPE BOUNDARY NOTE — GAP-P-003 / GAP-P-004 (PARTIAL CLOSURE)

GAP-P-003 (DEC-009 tier vocabulary) and GAP-P-004 (DEC-014 mapping) are partially closed:

**Closed within CE.8 scope:**
- BLOCKED tier: BLOCKED condition_coverage_state → BLOCKED diagnosis_activation_state ✓
- DEC-014 tier entries added to CONDITION_TO_DIAGNOSIS_STATE ✓
- Legacy lowercase vocabulary ("complete"/"partial"/"blocked") eliminated ✓
- CE.5 consumption state vocabulary (AVAILABLE/PARTIAL/BLOCKED) in use ✓

**Deferred to CE.9 (out of CE.8 scope):**
- DEC-009 value-reactive tier derivation (binding rules DEC-012/DEC-013) for AVAILABLE and PARTIAL states
- AT_RISK/STABLE/DEGRADED production for non-BLOCKED conditions requires CE.2 binding table implementation
- Interim mapping: AVAILABLE→ACTIVE, PARTIAL→ACTIVE (conservative; consistent with CE.2 intent)

This is documented explicitly per CE.8 Section E (scope boundary, not governance breach).
The binding table implementation is a CE.9 scope item.

---

## GAP CLOSURE SUMMARY

| Gap ID | Status | IMPL ref |
|---|---|---|
| GAP-E-001 | CLOSED | IMPL-001 |
| GAP-E-002 | CLOSED | IMPL-002 |
| GAP-E-003 | CLOSED | IMPL-003 |
| GAP-E-004 | CLOSED | IMPL-004 |
| GAP-E-005 | CLOSED | IMPL-005 |
| GAP-E-006 | CLOSED | IMPL-005 |
| GAP-E-007 | CLOSED | IMPL-006 |
| GAP-E-008 | CLOSED | IMPL-006 |
| GAP-C-001 | CLOSED | IMPL-008, IMPL-010 |
| GAP-C-002 | CLOSED | IMPL-007, IMPL-008 |
| GAP-C-003 | CLOSED | IMPL-012, IMPL-014 |
| GAP-P-001 | CLOSED | IMPL-012 |
| GAP-P-002 | CLOSED | IMPL-007, IMPL-008 |
| GAP-P-003 | PARTIAL | IMPL-009, IMPL-010 — DEC-009 tier derivation deferred to CE.9 |
| GAP-P-004 | PARTIAL | IMPL-009 — interim CE.5 state mapping; full DEC-014 requires DEC-009 tier |
| GAP-T-001 | CLOSED | IMPL-001, IMPL-003, IMPL-005, IMPL-006 — partiality_reasons added; traceability_coverage expected PASS |
| GAP-T-002 | CLOSED | IMPL-013 |
| GAP-T-003 | CLOSED | IMPL-013 |
