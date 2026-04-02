# CE.5 — Executable Validation Surface

**Stream:** CE.5 — Enforcement Operationalization
**Program:** Krayu — Program Intelligence Discipline
**Date:** 2026-04-01
**Authority:** CE.4_VALIDATION_ENGINE.md, CE.3_INTERFACE_VALIDATION_RULES.md

---

## 1. Purpose

This document defines the executable surface of the CE.4 Validation Engine. It maps every validation check to a concrete implementation: script entry point, input artifact, evaluation logic, and output record. It does not define new rules — it operationalizes the rules defined in CE.4.

---

## 2. Validation Script Inventory

| Script | Purpose | Entry Point |
|---|---|---|
| scripts/pios/CE.5/validate_interfaces.py | I1, I2, I3 structural + lineage + completeness | --interface {I1,I2,I3,FULL} |
| scripts/pios/CE.5/validate_traceability.py | run_id consistency, signal provenance, flag propagation | --run-id <id> --artifacts <paths> |
| scripts/pios/CE.5/run_guard_checks.py | Per-hook guard execution | --hook {GH-01..GH-10} |
| scripts/pios/40.16/validate_input_contract.py | Input contract SHA-256 verification | (existing) |
| scripts/pios/40.16/validate_manifest.py | DVT-01..13 + DA-01..03 + DVT-14 | (existing) |
| scripts/pios/40.16/validate_identity_lock.py | Baseline artifact SHA-256 verification | (existing) |

---

## 3. I1 Validation Surface

**Script:** `validate_interfaces.py --interface I1`
**Trigger:** GH-01 (pre-40.5)
**Input:** 40.4 artifacts + handoff metadata

| Check ID | Implementation | Pass Condition |
|---|---|---|
| IV1-01 | Read handoff metadata; assert input_contract_id non-empty | Non-empty string present |
| IV1-02 | Read handoff metadata; assert run_id non-empty, no whitespace | Regex: `^\S+$` |
| IV1-03 | Read observations object; assert windows array len > 0 | len(windows) ≥ 1 |
| IV1-04 | For each window: assert window_id, window_start, window_end, window_duration_days present | All 4 keys non-null |
| IV1-05 | For each window: assert observations is dict with at least one key | dict len ≥ 1 |
| IV1-06 | Read program_constants; assert F_expected, artifacts_expected, gates_defined, feedback_expected present | All 4 keys present |
| IV1-07 | Scan all observation keys in handoff; assert none in forbidden set {ESI, RAG, SSZ, SSI, PES-ESI-01..05} | Zero forbidden keys found |
| IV1-08 | Run validate_input_contract.py; assert result = PASS | Exit code 0 and result=PASS |

All checks must PASS. Any failure → F1.

---

## 4. I2 Validation Surface

**Script:** `validate_interfaces.py --interface I2`
**Trigger:** GH-08 (post-40.11)
**Input:** docs/pios/40.16/esi_manifest.json + all 40.5–40.11 output artifacts

| Check ID | Implementation | Pass Condition |
|---|---|---|
| IV2-01 | Load esi_manifest.json; assert file exists and parses as JSON | File present, json.loads() succeeds |
| IV2-02 | Assert top-level keys: run_id, input_source, window_count, windows, program_constants | All 5 keys present |
| IV2-03 | For each window in windows[]: assert window_id, nf (7 keys), pes (5 keys), esi (value/mode/warnings), tc_observations (9 keys) | All sub-keys present per window |
| IV2-04 | Assert loop closure assertion present in 40.11 output | closure_status field ∈ {COMPLETE, PARTIAL, FAIL} |
| IV2-05 | Assert 40.6 condition activation record exists | File present and parseable |
| IV2-06 | Assert 40.7 diagnosis structure exists | File present and parseable |
| IV2-07 | Assert 40.8 delivery package exists | File present and parseable |
| IV2-08 | run_id consistency: extract run_id from all Core artifacts; assert all equal | All values identical |

F1 on any check failure. F2 if CV checks return PARTIAL (see §6).

---

## 5. I3 Validation Surface

**Script:** `validate_interfaces.py --interface I3`
**Trigger:** GH-10 (pre-42.x)
**Input:** L5 payload from 41.x/43.x/44.x assembly

| Check ID | Implementation | Pass Condition |
|---|---|---|
| IV3-01 | Assert L5 payload file exists and parses | File present, parses without error |
| IV3-02 | Assert run_id present in L5 payload, non-empty | Non-empty string |
| IV3-03 | Assert run_id in L5 payload matches run_id in esi_manifest.json | Exact string equality |
| IV3-04 | For every ESI/RAG value in payload: assert source run_id present and traceable | source_run_id field present per signal |
| IV3-05 | Assert all PARTIAL/UNDEFINED flags from esi_manifest.json present in payload | Set(payload_flags) ⊇ Set(manifest_flags) |
| IV3-06 | Assert no UNDEFINED value rendered as 0, empty string, or unlabeled placeholder | UNDEFINED → state: "UNDEFINED" in payload, not substituted |
| IV3-07 | Assert no direct reference to docs/pios/40.4/ in L5 payload source declarations | Zero 40.4 path references in payload metadata |
| IV3-08 | Assert no direct reference to esi_manifest.json as payload source (must go through L5 assembly) | Source declared as L5 assembly artifact, not esi_manifest.json directly |

F1 on any check failure.

---

## 6. Completeness Validation Surface

**Script:** `validate_traceability.py --check completeness`
**Trigger:** GH-08 (post-40.11), embedded in I2 validation

| Check ID | Required Artifact | Evaluation |
|---|---|---|
| CV-01 | esi_manifest.json | All 7 NF keys present (null or float) |
| CV-02 | esi_manifest.json | All 5 PES keys present (null or float) |
| CV-03 | esi_manifest.json | ESI value + mode + warnings present |
| CV-04 | esi_manifest.json | All 9 TC observation keys present |
| CV-05 | rag_output_set.md | RAG_rate, RAG_accel, RAG_cross, RAG composite declared |
| CV-06 | derivation_execution_manifest.md | All 9 sections present |
| CV-07 | 40.6 condition activation record | One condition entry per defined PES signal |
| CV-08 | 40.7 diagnosis structure | Intelligence packet + gap declarations present |
| CV-09 | 40.11 loop closure assertion | closure_status field present |
| CV-10 | All artifacts | run_id field consistent across all (covered by IV2-08) |

Any CV check returning PARTIAL → validation overall = PARTIAL (F2). Missing entirely → F1.

---

## 7. Lineage Validation Surface

**Script:** `validate_traceability.py --check lineage`
**Trigger:** GH-08 (post-40.11), embedded in I2 validation

| Check ID | Lineage Chain | Violation Condition |
|---|---|---|
| LV-01 | TC-01 → NF-01 | NF-01 non-null when TC-01 not COVERED |
| LV-02 | TC-07 → NF-02 | NF-02 not 0.5 when window_count < 3; or NF-02 null when TC-07 COVERED |
| LV-03 | TC-02 → NF-03 | NF-03 non-null when TC-02 not COVERED |
| LV-04 | TC-03 → NF-04 | NF-04 non-null when TC-03 not COVERED |
| LV-05 | TC-04 → NF-05 | NF-05 non-null when TC-04 not COVERED |
| LV-06 | TC-05 → NF-06 | NF-06 non-null when TC-05 not COVERED |
| LV-07 | TC-08 → NF-07 | NF-07 non-null when TC-08 not COVERED |
| LV-08 | NF-01, NF-02 → PES-ESI-01 | PES-ESI-01 non-null when any required NF is null |
| LV-09 | TC-09 (CG-01) → PES-ESI-02 | PES-ESI-02 non-null ever (CG-01 always active) |
| LV-10 | NF-03, NF-04 → PES-ESI-03 | PES-ESI-03 non-null when any required NF is null |
| LV-11 | NF-05 → PES-ESI-04 | PES-ESI-04 non-null when NF-05 is null |
| LV-12 | NF-06, NF-07 → PES-ESI-05 | PES-ESI-05 non-null when any required NF is null |
| LV-13 | PES → ESI | ESI mode not consistent with available PES signals |
| LV-14 | Input contract → 40.5 | SHA-256 of any 40.4 artifact does not match input_contract_lock.json |

Any lineage violation → F1.

---

## 8. Validation Engine Output Schema

Produced by `validate_interfaces.py` for each run. Written to docs/pios/40.11/validation_record_<run_id>.json (or pre-40.11 equivalent).

```json
{
  "validation_run_id": "<run_id>_validation",
  "target_run_id": "<run_id>",
  "timestamp": "<UTC>",
  "phase": "I1 | I2 | I3 | FULL",
  "structural": {
    "checks": [
      { "check_id": "IV1-01", "result": "PASS | FAIL | PARTIAL", "detail": "..." }
    ],
    "result": "PASS | FAIL | PARTIAL"
  },
  "lineage": {
    "checks": [
      { "check_id": "LV-01", "result": "PASS | FAIL", "detail": "..." }
    ],
    "result": "PASS | FAIL | PARTIAL"
  },
  "completeness": {
    "checks": [
      { "check_id": "CV-01", "result": "PASS | FAIL | PARTIAL", "detail": "..." }
    ],
    "result": "PASS | FAIL | PARTIAL"
  },
  "overall": "PASS | FAIL | PARTIAL",
  "violations": [
    { "rule_id": "...", "field": "...", "detail": "..." }
  ]
}
```

**Overall result rules:**
- PASS: all three sub-results are PASS
- PARTIAL: any sub-result is PARTIAL and none is FAIL
- FAIL: any sub-result is FAIL

A FAIL result → F1 (downstream blocked). A PARTIAL result → F2 (execution continues with PARTIAL state).
