# CE.5 — Guard Hook Operational Map

**Stream:** CE.5 — Enforcement Operationalization
**Program:** Krayu — Program Intelligence Discipline
**Date:** 2026-04-01
**Authority:** CE.4_GUARDRAIL_RUNTIME.md, CE.4_ENFORCEMENT_MODEL.md

---

## 1. Purpose

This document translates the CE.4 guard hook specification (GH-01..GH-10) into executable operational definitions. Each entry specifies: trigger condition, input artifact(s), checks to execute, scripts invoked, pass/fail/warn thresholds, and output written.

---

## 2. Hook Operational Definitions

### GH-01 — Pre-40.5 Entry Gate

| Field | Value |
|---|---|
| Trigger | Before scripts/pios/40.5/ executes |
| Guard Type | HARD STOP |
| Input Artifacts | docs/pios/40.4/*.md, docs/pios/40.16/baseline/input_contract_lock.json, handoff metadata |
| Script | scripts/pios/CE.5/run_guard_checks.py --hook GH-01 |

**Checks executed:**

| Check ID | Description | Failure Type |
|---|---|---|
| GH-01-C01 | validate_input_contract.py → result must be PASS | F1 |
| GH-01-C02 | run_id present and non-empty in handoff | F1 |
| GH-01-C03 | input_contract_id matches pios_core_40.16_input_contract_0.1 | F1 |
| GH-01-C04 | No ESI, RAG, SSZ, SSI, PES-ESI keys in handoff observations | F1 (BV-08, FF-01) |
| GH-01-C05 | DRIFT-001: computeSSZ not in canonical pipeline execution path | F1 (DRIFT-001) |
| GH-01-C06 | windows array non-empty in observation object | F1 |
| GH-01-C07 | program_constants block present (F_expected, artifacts_expected, gates_defined, feedback_expected) | F1 |
| GH-01-C08 | No 41.x or 42.x path references in 40.5 script inputs | F1 (BV-04, BV-05) |

**Pass condition:** All checks PASS.
**Fail action:** F1 — HALT; write enforcement record; do not invoke 40.5.

---

### GH-02 — 40.5 → 40.6 Handoff Gate

| Field | Value |
|---|---|
| Trigger | After 40.5 produces esi_manifest.json; before 40.6 reads it |
| Guard Type | HARD STOP, SOFT FAIL |
| Input Artifacts | docs/pios/40.16/esi_manifest.json |
| Script | scripts/pios/CE.5/run_guard_checks.py --hook GH-02 |

**Checks executed:**

| Check ID | Description | Failure Type |
|---|---|---|
| GH-02-C01 | run_id present in esi_manifest.json, non-empty | F1 |
| GH-02-C02 | All NF values ∈ [0.0, 1.0] or null | F1 (COMPUTATION VIOLATION) |
| GH-02-C03 | ESI value ∈ [0, 100] or null | F1 (COMPUTATION VIOLATION) |
| GH-02-C04 | ESI mode ∈ {FULL, PARTIAL, null} | F1 |
| GH-02-C05 | All 7 NF keys present (null or float) | F2 if null; F1 if missing entirely |
| GH-02-C06 | All 5 PES keys present (null or float) | F2 if null; F1 if missing entirely |
| GH-02-C07 | PARTIAL flags present if any NF/PES is null | F1 if PARTIAL flags absent |
| GH-02-C08 | input_source declared (40.4 or harness) | F1 |

**Pass condition:** All F1 checks PASS; F2 states produce PARTIAL esi_manifest.json.
**Fail action:** F1 → HALT. F2 → propagate PARTIAL; document gap.

---

### GH-03 — 40.6 → 40.7 Handoff Gate

| Field | Value |
|---|---|
| Trigger | After 40.6 produces condition activation record; before 40.7 reads it |
| Guard Type | HARD STOP, SOFT FAIL |
| Input Artifacts | 40.6 condition activation record |
| Script | scripts/pios/CE.5/run_guard_checks.py --hook GH-03 |

**Checks executed:**

| Check ID | Description | Failure Type |
|---|---|---|
| GH-03-C01 | Condition activation record artifact present | F1 |
| GH-03-C02 | One condition entry per defined PES signal | F1 |
| GH-03-C03 | PARTIAL flags from esi_manifest.json present in condition record | F1 (BV-13) |
| GH-03-C04 | run_id matches esi_manifest.json run_id | F1 |
| GH-03-C05 | No prose fields; all fields typed (enum/bool/float/count/string-id) | F1 (BV-10, BV-11) |

---

### GH-04 — 40.7 → 40.8 Handoff Gate

| Field | Value |
|---|---|
| Trigger | After 40.7 produces diagnosis structure; before 40.8 reads it |
| Guard Type | HARD STOP, SOFT FAIL |
| Input Artifacts | 40.7 diagnosis structure (intelligence packet) |
| Script | scripts/pios/CE.5/run_guard_checks.py --hook GH-04 |

**Checks executed:**

| Check ID | Description | Failure Type |
|---|---|---|
| GH-04-C01 | Diagnosis structure artifact present | F1 |
| GH-04-C02 | Intelligence packet present | F1 |
| GH-04-C03 | Evidence lineage fields populated (tracing to esi_manifest.json signals) | F1 |
| GH-04-C04 | No free-form prose fields | F1 (BV-10, BV-11) |
| GH-04-C05 | Gap declarations present for all PARTIAL/UNDEFINED signals | F2 |
| GH-04-C06 | PARTIAL flags from upstream preserved | F1 (BV-13) |

---

### GH-05 — 40.8 → 40.9 Handoff Gate

| Field | Value |
|---|---|
| Trigger | After 40.8 produces delivery package; before 40.9 reads it |
| Guard Type | HARD STOP, SOFT FAIL |
| Input Artifacts | 40.8 delivery package |
| Script | scripts/pios/CE.5/run_guard_checks.py --hook GH-05 |

**Checks executed:**

| Check ID | Description | Failure Type |
|---|---|---|
| GH-05-C01 | Delivery package artifact present | F1 |
| GH-05-C02 | Manifest complete (all required sections present) | F1 |
| GH-05-C03 | PARTIAL flags intact from 40.7 output | F1 (BV-13) |
| GH-05-C04 | run_id consistent | F1 |
| GH-05-C05 | No 42.x or 41.x references as source of truth | F1 (BV-03, BV-04) |

---

### GH-06 — 40.9 → 40.10 Handoff Gate

| Field | Value |
|---|---|
| Trigger | After 40.9 produces feedback registration record; before 40.10 reads it |
| Guard Type | HARD STOP, SOFT FAIL |
| Input Artifacts | 40.9 feedback registration record |
| Script | scripts/pios/CE.5/run_guard_checks.py --hook GH-06 |

**Checks executed:**

| Check ID | Description | Failure Type |
|---|---|---|
| GH-06-C01 | Feedback registration record present | F1 |
| GH-06-C02 | Gap log complete (one entry per declared PARTIAL/UNDEFINED) | F2 |
| GH-06-C03 | run_id consistent | F1 |
| GH-06-C04 | No external data injected (no new metrics introduced) | F1 |

---

### GH-07 — 40.10 → 40.11 Handoff Gate

| Field | Value |
|---|---|
| Trigger | After 40.10 produces orchestration directives; before 40.11 reads them |
| Guard Type | HARD STOP, SOFT FAIL |
| Input Artifacts | 40.10 orchestration directive record |
| Script | scripts/pios/CE.5/run_guard_checks.py --hook GH-07 |

**Checks executed:**

| Check ID | Description | Failure Type |
|---|---|---|
| GH-07-C01 | Orchestration directives artifact present | F1 |
| GH-07-C02 | Rule references declared (each directive backed by CE.2/CE.3 rule ID) | F1 |
| GH-07-C03 | run_id consistent | F1 |
| GH-07-C04 | No 41.x/42.x write actions authorized by directive | F1 (BV-06, BV-07) |

---

### GH-08 — Post-Core (After 40.11) Gate

| Field | Value |
|---|---|
| Trigger | After 40.11 completes; before 41.x begins |
| Guard Type | HARD STOP |
| Input Artifacts | All Core output artifacts (40.5–40.11), esi_manifest.json, run_id |
| Script | scripts/pios/CE.5/validate_interfaces.py --interface I2 |

**Checks executed:**

| Check ID | Description | Failure Type |
|---|---|---|
| GH-08-C01 | IV2-01..IV2-08: I2 structural validation (all fields) | F1 |
| GH-08-C02 | run_id consistency across all Core artifacts | F1 |
| GH-08-C03 | Traceability chain intact: every signal traceable to esi_manifest.json | F1 |
| GH-08-C04 | PARTIAL flags not stripped at any Core layer handoff | F1 (BV-13) |
| GH-08-C05 | No 41.x or 42.x artifacts modified by Core run | F1 |
| GH-08-C06 | Loop closure assertion field present in 40.11 | F1 |
| GH-08-C07 | All completeness checks CV-01..CV-10 pass or PARTIAL | F2 if PARTIAL; F1 if missing |

---

### GH-09 — Before 41.x Entry Gate

| Field | Value |
|---|---|
| Trigger | Before any 41.x script executes |
| Guard Type | HARD STOP |
| Input Artifacts | 40.11 loop closure assertion, all Core artifacts |
| Script | scripts/pios/CE.5/run_guard_checks.py --hook GH-09 |

**Checks executed:**

| Check ID | Description | Failure Type |
|---|---|---|
| GH-09-C01 | Loop closure assertion status ∈ {COMPLETE, PARTIAL} | F1 if FAIL |
| GH-09-C02 | All Core artifacts present (40.5–40.11 outputs) | F1 if missing |
| GH-09-C03 | esi_manifest.json parseable and run_id present | F1 |
| GH-09-C04 | No 42.x write actions pending from Core execution | F1 |

**Pass condition:** Loop closure = COMPLETE or PARTIAL; all artifacts present.
**Fail action:** If loop closure = FAIL → F1 HALT; 41.x blocked.

---

### GH-10 — Before 42.x Entry Gate

| Field | Value |
|---|---|
| Trigger | Before any 42.x script or rendering layer executes |
| Guard Type | HARD STOP |
| Input Artifacts | L5 payload (41.x/43.x/44.x output), esi_manifest.json (for flag comparison) |
| Script | scripts/pios/CE.5/validate_interfaces.py --interface I3 |

**Checks executed:**

| Check ID | Description | Failure Type |
|---|---|---|
| GH-10-C01 | IV3-01..IV3-08: I3 structural validation (L5 payload schema) | F1 |
| GH-10-C02 | PARTIAL flags from esi_manifest.json present in L5 payload | F1 (BV-13) |
| GH-10-C03 | UNDEFINED values not rendered as 0, empty, or unlabeled | F1 (BV-14) |
| GH-10-C04 | All ESI/RAG values carry source run_id | F1 (VD-02) |
| GH-10-C05 | run_id in payload matches originating Core run | F1 |
| GH-10-C06 | No direct 40.4 access by 42.x | F1 (BV-02, FF-02) |
| GH-10-C07 | No direct esi_manifest.json access by 42.x | F1 (FF-03) |
| GH-10-C08 | No reverse write from 42.x to Core paths | F1 (BV-06, FF-04) |

---

## 3. Hook Execution Sequence

```
[GH-01] → 40.5 → [GH-02] → 40.6 → [GH-03] → 40.7 → [GH-04]
→ 40.8 → [GH-05] → 40.9 → [GH-06] → 40.10 → [GH-07] → 40.11
→ [GH-08] → [GH-09] → 41.x → (L5 assembly) → [GH-10] → 42.x
```

Any hook returning F1 terminates the sequence at that point. No downstream hook executes after an F1 failure.

---

## 4. Enforcement Record Output

Every hook activation produces a structured enforcement record written to the 40.11 governance log (or pre-40.11 equivalent). Format defined in CE.4_FAILURE_RESPONSE_MODEL.md §4.
