# CE.8 — Propagation Compliance Report

**Stream:** CE.8 — Engine Implementation & Compliance Execution
**Artifact type:** COMPLIANCE REPORT (POST-REMEDIATION)
**Date:** 2026-04-03
**Authority:** CE.8
**Engine evaluated:** `pios/core/v0.1/engine/activate_conditions.py` (post-remediation)

---

## ASSESSMENT

### CE.5 P-001: Propagation record structure

CE.5 consumption records produced by `produce_ce5_consumption_record()` carry:
`{signal_id, origin: "CE.4", consumption_state, output_ref}` per signal.

All 8 governed signals produce a consumption record. Record structure matches P-001. ✓

**Status: PASS**

---

### CE.5 P-002: consumption_state derived from CE.4 mapping only

`consumption_state` in each consumption record is derived exclusively from the CE.4 `state`
field via `CE4_TO_CE5_CONSUMPTION_STATE`. No other derivation path exists. ✓

**Status: PASS**

---

### CE.5 P-003: output_ref pass-through

`output_ref` in each consumption record references the CE.4 `output` object directly.
No copy, modification, or derived field injection occurs. ✓

**Status: PASS**

---

### CE.5 P-004: No new field derivation during propagation

`produce_ce5_consumption_record()` does not create any new fields beyond
`{signal_id, origin, consumption_state, output_ref}`. No aggregation or derivation occurs. ✓

**Status: PASS**

---

### CE.5 P-005: No fabricated propagation records

No consumption records are produced for signals absent from the CE.4 packet.
Only records for signals in `signals` dict (loaded from CE.4 output) are produced.
Absent signals produce Type 2 traceability records only (not propagation records). ✓

**Status: PASS**

---

### CE.2 DEC-009: Governed tier vocabulary

**Scope-bounded status:**

Legacy lowercase vocabulary ("complete", "partial", "blocked") eliminated from all
`condition_coverage_state` fields and mappings. CE.5 consumption vocabulary (AVAILABLE/PARTIAL/BLOCKED)
now in use.

DEC-009 tier entries (BLOCKED/DEGRADED/AT_RISK/STABLE) added to `CONDITION_TO_DIAGNOSIS_STATE`.
BLOCKED tier: correctly emitted for BLOCKED conditions. ✓

DEC-009 value-reactive tier derivation for AVAILABLE and PARTIAL states requires CE.2 binding
rules (DEC-012/DEC-013) — deferred to CE.9. This is a bounded scope limitation, not a regression.

**Status: PARTIAL — BLOCKED tier aligned; AT_RISK/STABLE/DEGRADED derivation deferred to CE.9**

---

### CE.2 DEC-014: Diagnosis state mapping

DEC-014 entries in `CONDITION_TO_DIAGNOSIS_STATE`:
- BLOCKED → BLOCKED ✓ (active)
- DEGRADED → ACTIVE ✓ (ready; not yet triggered pending DEC-009)
- AT_RISK → ACTIVE ✓ (ready; not yet triggered)
- STABLE → INACTIVE ✓ (ready; not yet triggered)

Interim CE.5 state entries:
- AVAILABLE → ACTIVE (conservative; consistent with CE.2 intent for fully present signals)
- PARTIAL → ACTIVE (conservative; consistent with at-minimum AT_RISK → ACTIVE per DEC-014)

Legacy "partial" → "partial" (invalid DEC-014 value) eliminated. ✓

**Status: PARTIAL — DEC-014 mapping table correct; full activation requires DEC-009 tier derivation**

---

## PROPAGATION COMPLIANCE SUMMARY

| Requirement | Status |
|---|---|
| CE.5 P-001: Propagation record structure | PASS |
| CE.5 P-002: consumption_state from CE.5 mapping | PASS |
| CE.5 P-003: output_ref pass-through | PASS |
| CE.5 P-004: No new field derivation | PASS |
| CE.5 P-005: No fabricated records | PASS |
| CE.2 DEC-009: Tier vocabulary | PARTIAL |
| CE.2 DEC-014: Diagnosis mapping | PARTIAL |

**Propagation compliance status: PARTIAL**
**Blocking remainder: DEC-009 value-reactive tier derivation (CE.9 scope)**
