# CE.3 — Interface Validation Rules

**Stream:** CE.3 — PiOS Interface Contracts
**Program:** Krayu — Program Intelligence Discipline
**Date:** 2026-04-01
**Authority:** CE.2, CE.3_INTERFACE_CONTRACTS.md, CE.3_BOUNDARY_VIOLATION_RULES.md

---

## 1. Validation Scope

These rules define what must be validated at each interface boundary before downstream consumption is permitted. Validation is a gate — not a suggestion.

---

## 2. I1 Validation Rules — Ledger → Core

| Rule ID | Check | Pass Condition | Fail Condition |
|---|---|---|---|
| IV1-01 | Input contract ID present | `input_contract_id` field populated in handoff | Missing → REJECT |
| IV1-02 | 40.4 artifact SHA-256 match | All 6 hashes match input_contract_lock.json | Any mismatch → REJECT |
| IV1-03 | run_id present | Non-empty run_id in observation object | Missing → REJECT |
| IV1-04 | Window definition present | At least one window with window_id, start, end, duration | Missing → REJECT |
| IV1-05 | All null values declared | Every null metric observation carries a stated reason (time-series / event-based / not-defined) | Silent null → REJECT |
| IV1-06 | No pre-computed signals in handoff | No ESI, RAG, SSZ, SSI, or derived index values present in the input | Present → REJECT |
| IV1-07 | Metric IDs conform to 40.4 schema | All observation keys are valid AT-NNN or DT-NNN identifiers | Unknown ID → REJECT |
| IV1-08 | Temporal classification declared | Each observation references the 40.4 temporal class for that metric | Missing → WARN; propagate UNDEFINED |

---

## 3. I2 Validation Rules — Core → Semantic

| Rule ID | Check | Pass Condition | Fail Condition |
|---|---|---|---|
| IV2-01 | Loop closure assertion is COMPLETE or PARTIAL | 40.11 closure_status ∈ {COMPLETE, PARTIAL} | FAIL → 41.x must not consume |
| IV2-02 | All required Core artifacts present | esi_manifest.json, condition activation record, diagnosis structure, delivery package, feedback registration record, orchestration directives, loop closure assertion all exist | Any missing → REJECT |
| IV2-03 | Run ID consistent across all artifacts | All Core output artifacts carry identical run_id | Mismatch → REJECT |
| IV2-04 | Input contract ID declared in ESI manifest | `input_source` or `input_contract_id` field present | Missing → WARN |
| IV2-05 | PARTIAL/UNDEFINED flags preserved | All flags from esi_manifest.json present in derivative Core outputs | Stripped flag → REJECT |
| IV2-06 | No signal recomputation in 41.x inputs | 41.x consumes, does not derive, ESI/RAG/PES values | Evidence of recomputation → VIOLATION BV-12 |
| IV2-07 | No Core artifact modified post-production | SHA-256 of Core outputs matches identity lock | Mismatch → VIOLATION BV-05 |
| IV2-08 | Evidence lineage intact | Each 40.7 diagnosis structure carries AT/DT metric references traceable to 40.4 | Missing lineage → REJECT |

---

## 4. I3 Validation Rules — Semantic → Delivery

| Rule ID | Check | Pass Condition | Fail Condition |
|---|---|---|---|
| IV3-01 | Inputs to 42.x are L5-assembled payloads | No direct 40.4 or Core output paths in 42.x input references | Direct reference → VIOLATION BV-03 |
| IV3-02 | PARTIAL/UNDEFINED flags present in L5 payloads | L5 payloads carry all PARTIAL and UNDEFINED flags from Core | Stripped flag → REJECT |
| IV3-03 | run_id present in L5 payload | Non-empty run_id traceable to originating Core run | Missing → REJECT |
| IV3-04 | No signal derivation in 42.x scripts | 42.x scripts contain no NF, PES, ESI, RAG computation logic | Present → VIOLATION BV-12 |
| IV3-05 | UNDEFINED rendered explicitly | 42.x does not substitute UNDEFINED with zero, empty string, or visual placeholder without declaration | Silent substitution → VIOLATION BV-14 |
| IV3-06 | INSUFFICIENT_WINDOWS rendered explicitly | 42.x does not render INSUFFICIENT_WINDOWS as zero or blank | Silent substitution → VIOLATION BV-14 |
| IV3-07 | No feedback from 42.x into Core or Semantic paths | 42.x write paths do not include docs/pios/40.x/ or docs/pios/41.x/ | Write detected → VIOLATION BV-06 |
| IV3-08 | SSZ/SSI not computed in 42.x | No computeSSZ / computeSSI calls in 42.x scripts (DRIFT-001 active) | Present → VIOLATION BV-09 |

---

## 5. Cross-Interface Validation Rules

| Rule ID | Check | Pass Condition | Fail Condition |
|---|---|---|---|
| CIV-01 | run_id chain integrity | Same run_id present from esi_manifest.json through L5 payload | Any gap → REJECT |
| CIV-02 | input_contract_id chain | input_contract_id declared at I1 is traceable through I2 and I3 outputs | Lost reference → WARN |
| CIV-03 | No boundary-crossing data substitution | No layer introduces data not traceable to 40.4 → Core → Semantic → L5 chain | Untraceable data → REJECT |
| CIV-04 | DRIFT-001 contained | SSZ/SSI derivation confirmed absent from L5/L6 paths until L3 specification complete | Active DRIFT-001 in production → VIOLATION BV-09 |

---

## 6. Validation Execution Points

| Interface | When to Validate | Validator Artifact |
|---|---|---|
| I1 (Ledger → Core) | At Core entry (40.5 startup) | validate_input_contract.py |
| I1 integrity | At loop closure (40.11) | 40.11 integrity validation record |
| I2 (Core → Semantic) | Before 41.x consumption begins | IV2 rules applied by 41.x entry check |
| I3 (Semantic → Delivery) | Before 42.x renders | IV3 rules applied by L5 payload validator (to be specified in 43.x/44.x) |
| Identity lock | On demand / regression | validate_identity_lock.py |
| Baseline stability | On demand / regression | validate_baseline.py |

---

## 7. Validation Failure Response

On any validation rule failure:

| Severity | Response |
|---|---|
| REJECT | Do not pass the artifact to the next layer. Declare the failing rule ID. |
| VIOLATION | Halt execution. Declare the violation by BV or FF ID. Do not propagate. |
| WARN | Log the warning with rule ID. Continue only if the affected field is not required for downstream computation. |

All validation outcomes must be recorded in the 40.11 integrity record or the relevant layer's governance log. Silent pass-through is forbidden.
