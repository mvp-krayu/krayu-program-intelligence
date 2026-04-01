# CE.5 — Failure Handling Runtime

**Stream:** CE.5 — Enforcement Operationalization
**Program:** Krayu — Program Intelligence Discipline
**Date:** 2026-04-01
**Authority:** CE.4_FAILURE_RESPONSE_MODEL.md, CE.4_GUARDRAIL_RUNTIME.md

---

## 1. Purpose

This document operationalizes the CE.4 failure classification and response model into concrete runtime behavior. It specifies: how each failure type is detected at runtime, what actions scripts must take, and how enforcement records are written and persisted.

---

## 2. Runtime Failure Detection

### F1 — Blocking Failure (HARD STOP)

Detection occurs when any guard hook check returns a non-PASS result for an F1-classified rule.

**Runtime sequence for F1:**

1. The executing script (run_guard_checks.py or validate_interfaces.py) evaluates the check.
2. Check returns FAIL.
3. Script immediately writes enforcement record (§4) to durable output.
4. Script sets exit code to 1.
5. No output artifact is written or passed to the next layer.
6. Execution terminates at the current hook.
7. The 40.11 loop closure assertion (if reachable) is set to FAIL. If the failure occurs before 40.11, the pre-40.11 enforcement log is the durable record.

**No F1 failure may be suppressed, retried, or bypassed.**

---

### F2 — Partial Failure (SOFT FAIL)

Detection occurs when an observation value is null, a TC class is not COVERED, CG-01 is active, or a completeness check returns PARTIAL.

**Runtime sequence for F2:**

1. The executing script detects the partial condition.
2. Affected field(s) are set to null or marked with a PARTIAL/UNDEFINED state flag.
3. Enforcement record is written with outcome=PARTIAL.
4. Script exits with code 0 (execution continues).
5. Output artifact is produced with all PARTIAL flags explicit.
6. Next layer receives the PARTIAL artifact and must not strip the flags.

**F2 does not block execution. It propagates state.**

---

### F3 — Warning

Detection occurs when non-critical metadata is absent, untracked git paths are present, or harness mode (DVT-14 WARN) is active.

**Runtime sequence for F3:**

1. The executing script detects the warning condition.
2. Log entry is written (§5) with rule_id and context.
3. Script continues execution.
4. No artifact is modified.
5. Exit code is 0.

---

## 3. Fail-Closed Behavior

When a guard check cannot be completed (file not found, unexpected format, script error, indeterminate result):

1. Treat as F1.
2. Write enforcement record with detail: "CHECK INDETERMINATE — guard cannot confirm pass".
3. Halt execution.
4. Do not pass any output to the next layer.

**The enforcement system never assumes a check passed if the check could not run.**

---

## 4. Enforcement Record Format

Every F1 and F2 failure must produce a structured enforcement record. Records are appended to the enforcement log at the close of each run.

**F1/F2 Enforcement Record:**

```json
{
  "hook_id": "GH-01",
  "failure_type": "F1",
  "violation_id": "BV-08",
  "layer": "40.5",
  "artifact": "handoff_metadata.json",
  "field": "observations.ESI",
  "outcome": "BLOCKED",
  "detail": "Pre-computed ESI signal found in I1 handoff",
  "timestamp": "2026-04-01T12:37:05Z"
}
```

**Mandatory fields:** hook_id, failure_type, violation_id, layer, artifact, field, outcome, detail, timestamp.

---

## 5. F3 Log Entry Format

F3 failures produce a log entry. Log entries are appended to the validation log.

```json
{
  "hook_id": "GH-01",
  "failure_type": "F3",
  "rule_id": "DVT-14",
  "context": "input_source=harness; harness mode active",
  "timestamp": "2026-04-01T12:37:05Z"
}
```

**Mandatory fields:** hook_id, failure_type, rule_id, context, timestamp.

---

## 6. Record Persistence Rules

| Record Type | Persistence Location | Immutability |
|---|---|---|
| F1 enforcement records | docs/pios/40.11/enforcement_log_<run_id>.json | Append-only; must not be deleted or overwritten |
| F2 enforcement records | docs/pios/40.11/enforcement_log_<run_id>.json | Append-only |
| F3 log entries | docs/pios/40.11/validation_log_<run_id>.json | Append-only |
| Pre-40.11 records (early F1) | docs/pios/CE.5/enforcement_pre_core_<run_id>.json | Written at point of failure |

Records written before 40.11 is reached are stored in a pre-Core enforcement path and must not be deleted when the run terminates.

---

## 7. Failure State Table

Complete mapping of detectable conditions to failure types and runtime actions:

| Condition | Hook | Failure Type | Runtime Action |
|---|---|---|---|
| Input contract SHA-256 mismatch | GH-01 | F1 | HALT; enforcement record; run INVALID |
| run_id missing | GH-01 | F1 | HALT; enforcement record |
| Pre-computed signal in handoff (ESI/RAG/SSZ) | GH-01 | F1 | HALT; BV-08/FF-01 |
| DRIFT-001 in pipeline path | GH-01 | F1 | HALT; DRIFT-001 |
| NF value out of [0.0, 1.0] | GH-02 | F1 | HALT; COMPUTATION VIOLATION |
| ESI value out of [0, 100] | GH-02 | F1 | HALT; COMPUTATION VIOLATION |
| NF value UNDEFINED (TC not COVERED) | GH-02 | F2 | Propagate null; document gap |
| ESI PARTIAL mode (CG-01) | GH-02 | F2 | Produce PARTIAL ESI; document CG-01 |
| RAG INSUFFICIENT_WINDOWS | GH-02 | F2 | Produce INSUFFICIENT_WINDOWS; document |
| PARTIAL flags stripped by downstream | GH-08 or GH-10 | F1 | HALT; BV-13 |
| run_id inconsistency across artifacts | GH-08 | F1 | HALT; run composition error |
| SSZ/SSI computation in L6 (DRIFT-001) | GH-01 | F1 | HALT; BV-09 |
| Reverse flow (42.x writes to Core paths) | GH-10 | F1 | HALT; BV-06/BV-07 |
| UNDEFINED rendered as zero silently | GH-10 | F1 | HALT; BV-14 |
| Loop closure assertion = FAIL | GH-09 | F1 | HALT; downstream blocked |
| I2 structural validation failure | GH-08 | F1 | HALT; run INVALID |
| I3 structural validation failure | GH-10 | F1 | HALT; 42.x blocked |
| CV completeness check PARTIAL | GH-08 | F2 | Propagate PARTIAL; document |
| Lineage violation (NF from uncovered TC) | GH-08 | F1 | HALT; LINEAGE VIOLATION |
| Guard check indeterminate | Any | F1 (fail-closed) | HALT; CHECK INDETERMINATE |
| Untracked git paths present | GH-01 | F3 | Log WARNING; continue |
| Harness mode (DVT-14 WARN) | GH-01 | F3 | Log WARNING; continue with WARN |
| Non-critical metadata missing | Any | F3 | Log WARNING; continue |

---

## 8. No Hidden Recovery

The runtime does not:
- Substitute valid values for BLOCKED outputs
- Retry failed checks with relaxed criteria
- Pass execution forward after F1
- Infer correctness from partial evidence
- Silently discard enforcement records

If F1 occurs, the run is BLOCKED. There is no path from F1 to successful downstream consumption in the same run.
