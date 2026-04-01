# CE.4 — Failure & Response Model

**Stream:** CE.4 — Enforcement & Runtime Guard System
**Program:** Krayu — Program Intelligence Discipline
**Date:** 2026-04-01
**Authority:** CE.4_ENFORCEMENT_MODEL.md, CE.4_GUARDRAIL_RUNTIME.md, CE.3_BOUNDARY_VIOLATION_RULES.md

---

## 1. Failure Classification

Every failure in the enforcement system falls into exactly one of three types.

| Type | Name | Definition | Example |
|---|---|---|---|
| F1 | BLOCKING FAILURE | Execution cannot proceed. Output must not be produced or passed. | Input hash mismatch, run_id missing, pre-computed signal in handoff, loop closure FAIL |
| F2 | PARTIAL FAILURE | Execution proceeds with explicitly degraded state. Downstream receives PARTIAL output with gap declared. | NF UNDEFINED due to missing TC observation, ESI PARTIAL mode (CG-01), RAG INSUFFICIENT_WINDOWS |
| F3 | WARNING | Execution proceeds. Flag is logged. No downstream state affected. | Untracked git paths present, harness mode DVT-14 WARN, non-critical metadata absent |

No failure may be reclassified at runtime. The classification is fixed by the rule that triggered it.

---

## 2. Response Actions

| Failure Type | Required Response Actions |
|---|---|
| F1 — BLOCKING | 1. Halt execution immediately at the current hook (GH-xx). 2. Write enforcement record with hook_id, violation_id, layer, field, outcome=BLOCKED. 3. Do not pass any output to the next layer. 4. Declare FAIL in the 40.11 integrity record (or equivalent log if 40.11 not yet reached). |
| F2 — PARTIAL | 1. Continue execution with PARTIAL state. 2. Mark affected field(s) as UNDEFINED or PARTIAL with gap reference. 3. Write enforcement record with outcome=PARTIAL. 4. Pass output to next layer with all PARTIAL flags explicit. |
| F3 — WARNING | 1. Log warning with rule_id and context. 2. Continue execution. 3. Do not modify any artifact. |

---

## 3. Failure-to-Response Mapping

| Trigger Condition | Failure Type | Response Action |
|---|---|---|
| Input contract SHA-256 mismatch | F1 | HALT at GH-01; run INVALID |
| run_id missing | F1 | HALT at GH-01; run INVALID |
| Pre-computed signal in handoff (ESI/RAG/SSZ) | F1 | HALT at GH-01; I1 VIOLATION BV-xx |
| NF value UNDEFINED (TC not COVERED) | F2 | Propagate UNDEFINED; document gap |
| ESI PARTIAL mode (CG-01) | F2 | Produce PARTIAL ESI; document CG-01 |
| RAG INSUFFICIENT_WINDOWS | F2 | Produce INSUFFICIENT_WINDOWS; document window count |
| NF value out of [0.0, 1.0] | F1 | HALT at GH-02; COMPUTATION VIOLATION |
| ESI value out of [0, 100] | F1 | HALT at GH-02; COMPUTATION VIOLATION |
| Loop closure assertion = FAIL | F1 | HALT at GH-09; downstream blocked |
| PARTIAL flag stripped by downstream | F1 | HALT at GH-08 or GH-10; BV-13 |
| run_id inconsistency across artifacts | F1 | HALT at GH-08; run composition error |
| SSZ/SSI computation in L6 (DRIFT-001) | F1 | HALT at GH-01 or GH-10; BV-09 |
| Reverse flow (42.x writes to Core paths) | F1 | HALT; BV-06 or BV-07 |
| UNDEFINED rendered as zero silently | F1 | HALT at GH-10; BV-14 |
| Untracked git paths | F3 | Log WARNING; continue |
| Harness mode (DVT-14 WARN) | F3 | Log WARNING; continue with WARN |
| Non-critical metadata missing | F3 | Log WARNING; continue |

---

## 4. Failure Reporting Requirements

Every F1 and F2 failure must produce a structured enforcement record. F3 failures must produce a log entry.

### F1/F2 Enforcement Record (mandatory fields)

| Field | Value |
|---|---|
| hook_id | GH-01..GH-10 |
| failure_type | F1 / F2 |
| violation_id | CE.3 BV/FF/VD or CE.4 GH check ID |
| layer | Failing layer (40.5 / 40.6 / etc.) |
| artifact | Artifact involved |
| field | Specific field that failed |
| outcome | BLOCKED / PARTIAL |
| detail | One-line factual description |
| timestamp | UTC |

### F3 Log Entry (mandatory fields)

| Field | Value |
|---|---|
| hook_id | GH-xx or context |
| failure_type | F3 |
| rule_id | Triggering rule |
| context | One-line factual description |
| timestamp | UTC |

---

## 5. No Hidden Recovery

The enforcement system does not:
- Attempt to fix a failed input
- Substitute a valid value for a BLOCKED output
- Retry a failed check with relaxed criteria
- Pass execution forward after an F1 failure

If an F1 failure occurs, the only valid states are:
- BLOCKED (execution stopped)
- FAIL declared in loop closure (40.11)

There is no path from F1 to successful downstream consumption in the same run.

---

## 6. Failure State Persistence

All enforcement records must be written to durable artifacts. They must not exist only in transient runtime state.

| Record Type | Storage Location |
|---|---|
| F1/F2 enforcement records | 40.11 integrity validation record (or pre-40.11 equivalent if failure occurs before 40.11) |
| F3 log entries | Validation log appended to 40.11 governance log |
| Validation engine output | Structured JSON record per run |

Enforcement records are governance artifacts (L8). They must not be deleted or overwritten between runs.
