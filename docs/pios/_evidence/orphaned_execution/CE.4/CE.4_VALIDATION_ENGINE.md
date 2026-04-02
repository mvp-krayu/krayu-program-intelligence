# CE.4 — Validation Engine Specification

**Stream:** CE.4 — Enforcement & Runtime Guard System
**Program:** Krayu — Program Intelligence Discipline
**Date:** 2026-04-01
**Authority:** CE.3_INTERFACE_VALIDATION_RULES.md, CE.4_ENFORCEMENT_MODEL.md

---

## 1. Validation Engine Purpose

The Validation Engine is the deterministic subsystem that evaluates interface contracts (I1, I2, I3) against actual artifact state. It does not infer. It does not correct. It evaluates and returns a structured result.

---

## 2. Structural Validation

Structural validation confirms that required fields and artifacts are present and well-formed.

### 2.1 I1 Structural Validation

| Check | Target | Pass Condition |
|---|---|---|
| input_contract_id present | Handoff metadata | Non-empty string |
| run_id present | Handoff metadata | Non-empty string, no whitespace |
| windows array non-empty | Observation object | At least one window entry |
| window fields complete | Each window | window_id, window_start, window_end, window_duration_days all present |
| observations object present | Each window | Key-value map of metric_id → value (null allowed) |
| program_constants present | Handoff constants | F_expected, artifacts_expected, gates_defined, feedback_expected present |
| No pre-computed signals | Observations | No ESI, RAG, SSZ, SSI, PES-ESI keys present |

### 2.2 I2 Structural Validation

| Check | Target | Pass Condition |
|---|---|---|
| esi_manifest.json present | docs/pios/40.16/ or run output dir | File exists, parses as valid JSON |
| Required top-level fields | esi_manifest.json | run_id, input_source, window_count, windows, program_constants |
| Per-window fields complete | Each window in windows[] | window_id, nf (7 keys), pes (5 keys), esi (value/mode/warnings), tc_observations (9 keys) |
| Loop closure assertion present | 40.11 output | Closure status field ∈ {COMPLETE, PARTIAL, FAIL} |
| Condition activation record present | 40.6 output | Required for downstream I2 release |
| Diagnosis structure present | 40.7 output | Required for downstream I2 release |
| Delivery package present | 40.8 output | Required for downstream I2 release |

### 2.3 I3 Structural Validation

| Check | Target | Pass Condition |
|---|---|---|
| L5 payload present | 43.x/44.x output | Payload file exists and parses |
| run_id in payload | L5 payload | Non-empty, matches originating Core run |
| Signal values declared | L5 payload | Any ESI/RAG value carries source run_id and input_source |
| PARTIAL flags in payload | L5 payload | All PARTIAL/UNDEFINED flags from esi_manifest.json present |

---

## 3. Lineage Validation

Lineage validation confirms that every output can be traced to an authorized input chain.

### 3.1 TC → NF Lineage

For each NF value in esi_manifest.json:

| NF | Expected source TC | Lineage valid if |
|---|---|---|
| NF-01 | TC-01 (AT-001) | TC-01 status = COVERED and NF-01 is a float; OR TC-01 status ≠ COVERED and NF-01 is null |
| NF-02 | TC-07 (variance) | window_count < 3 → NF-02 = 0.5; window_count ≥ 3 → NF-02 derived from variance |
| NF-03 | TC-02 (DT-007) | TC-02 COVERED → NF-03 = float; TC-02 not COVERED → NF-03 = null |
| NF-04 | TC-03 (DT-001+DT-003) | TC-03 COVERED → NF-04 = float; TC-03 not COVERED → NF-04 = null |
| NF-05 | TC-04 (DT-006) | TC-04 COVERED → NF-05 = float; TC-04 not COVERED → NF-05 = null |
| NF-06 | TC-05 (AT-007) | TC-05 COVERED → NF-06 = float; TC-05 not COVERED → NF-06 = null |
| NF-07 | TC-08 (AT-009+DT-008) | TC-08 COVERED → NF-07 = float; TC-08 not COVERED → NF-07 = null |

Violation: NF has a non-null value when its TC class is not COVERED → LINEAGE VIOLATION.

### 3.2 NF → PES Lineage

| PES | Required NF inputs | Lineage valid if |
|---|---|---|
| PES-ESI-01 | NF-01, NF-02 | Both non-null → PES-ESI-01 = float; any null → PES-ESI-01 = null |
| PES-ESI-02 | TC-09 | TC-09 NOT_DEFINED (CG-01) → PES-ESI-02 = null always |
| PES-ESI-03 | NF-03, NF-04 | Both non-null → PES-ESI-03 = float; any null → PES-ESI-03 = null |
| PES-ESI-04 | NF-05 | Non-null → PES-ESI-04 = float; null → PES-ESI-04 = null |
| PES-ESI-05 | NF-06, NF-07 | Both non-null → PES-ESI-05 = float; any null → PES-ESI-05 = null |

### 3.3 PES → ESI Lineage

| Mode | Condition | Valid ESI |
|---|---|---|
| PARTIAL | CG-01 active (PES-ESI-02 = null) | ESI = float if P01, P03, P04, P05 all non-null; else null |
| FULL | All 5 PES signals non-null | ESI = float |
| Either | Any required PARTIAL signal is null | ESI = null |

### 3.4 Input Contract Lineage

At 40.11, the engine re-computes SHA-256 for each of the 6 frozen 40.4 artifacts and compares against input_contract_lock.json. All 6 must match. Any mismatch breaks the lineage chain and invalidates the run.

---

## 4. Completeness Validation

Completeness validation confirms that the full artifact chain from 40.5 to 40.11 is present.

| Completeness Check | Required Artifact | Status Field |
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
| CV-10 | All artifacts | run_id field consistent across all |

Missing or incomplete field → PARTIAL completeness. Engine reports which checks failed.

---

## 5. Validation Engine Output Schema

The engine produces a structured validation record for each run:

```
{
  "validation_run_id": "<run_id>_validation",
  "target_run_id": "<run_id>",
  "timestamp": "<UTC>",
  "phase": "I1 | I2 | I3 | FULL",
  "structural": {
    "checks": [...],
    "result": "PASS | FAIL | PARTIAL"
  },
  "lineage": {
    "checks": [...],
    "result": "PASS | FAIL | PARTIAL"
  },
  "completeness": {
    "checks": [...],
    "result": "PASS | FAIL | PARTIAL"
  },
  "overall": "PASS | FAIL | PARTIAL",
  "violations": [
    { "rule_id": "...", "field": "...", "detail": "..." }
  ]
}
```

Overall result rules:
- PASS: all three sub-results are PASS
- PARTIAL: any sub-result is PARTIAL and none is FAIL
- FAIL: any sub-result is FAIL

A FAIL result blocks downstream execution. A PARTIAL result allows execution with explicit state propagation.
