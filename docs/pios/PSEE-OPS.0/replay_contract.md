# PSEE-OPS.0 — Replay Contract

**Stream:** PSEE-OPS.0
**Family:** PSEE-OPS
**Date:** 2026-04-05
**Authority:** PSEE.2/logging_contract.md §Replay Contract;
               PSEE.2/implementation_architecture.md §G7

---

## Replay Interface

This document defines how replay is triggered, what inputs it requires, and how replayability is validated. Replay re-executes a prior PSEE run from S-00 using identical inputs, producing an identical state transition log.

---

### Replay Preconditions

For a replay to be valid, four conditions must hold:

| Condition | Verification |
|---|---|
| Corpus files unchanged | `corpus_root_hash` in manifest matches current corpus hash |
| Boundary document unchanged | `evidence_boundary_hash` in manifest matches current boundary hash |
| Phase B target unchanged | `phase_b_target_hash` in manifest matches current target hash |
| Operator resolutions unchanged | Resolutions replayed in the same order as recorded in manifest |

If any condition fails, the replay is **rejected before engine invocation** with:
```json
{
  "result":   "REPLAY_REJECTED",
  "reason":   "REPLAY_INPUT_MISMATCH",
  "details":  "string"    // which hash mismatched
}
```

Replay cannot proceed if inputs have changed. A modified corpus is a new run (FULL mode), not a replay.

---

### Replay Input Schema

The operator submits an `OperatorInput` with `execution_mode.mode = "REPLAY"` and `execution_mode.replay_manifest_path` pointing to a prior `execution_manifest.json`.

The `execution_manifest.json` (produced by a prior run's `ExecutionLogger`) contains:

```json
{
  "run_id":                    "string",
  "stream_id":                 "string",
  "execution_timestamp":       "ISO-8601",
  "inputs": {
    "corpus_root":             "string",
    "corpus_root_hash":        "SHA-256",
    "evidence_boundary_path":  "string",
    "evidence_boundary_hash":  "SHA-256",
    "phase_b_target_path":     "string",
    "phase_b_target_hash":     "SHA-256",
    "system_identity":         "object"
  },
  "operator_resolutions": [
    {
      "dp_id":              "string",
      "affected":           ["string"],
      "resolution":         "string",
      "resolution_basis":   "string",
      "resolved_at":        "ISO-8601"
    }
  ],
  "final_state":               "string",
  "phase6_iteration_count":    "integer",
  "coverage_percent":          "number|null",
  "state_transition_count":    "integer",
  "escalation_count":          "integer",
  "us_record_count":           "integer",
  "flags":                     ["string"]
}
```

---

## Replay Execution Protocol (Section G Question 6)

### Step 1 — Load Manifest

The `InvocationLayer` loads the `execution_manifest.json`. Extracts: corpus hashes, operator_resolutions sequence.

### Step 2 — Hash Verification

```
current_corpus_hash   = hash_directory(corpus_root)
current_boundary_hash = hash_file(evidence_boundary_path)
current_target_hash   = hash_file(phase_b_target_path)

if current_corpus_hash   != manifest.inputs.corpus_root_hash:    REJECT
if current_boundary_hash != manifest.inputs.evidence_boundary_hash: REJECT
if current_target_hash   != manifest.inputs.phase_b_target_hash:  REJECT
```

Hash algorithm: SHA-256. Directory hash = SHA-256 of lexicographically sorted list of `(relative_path, file_SHA-256)` pairs.

### Step 3 — Load Operator Resolutions

The `operator_resolutions` array from the manifest is loaded into the `adjudication_queue` for this run — exactly as if the operator had pre-supplied them via `operator_adjudication`.

### Step 4 — Engine Invocation

```
engine.start_full(params_from_manifest)
```

with `adjudication_queue = manifest.operator_resolutions` (in original order).

### Step 5 — Execution

The engine runs from S-00. DP handlers execute deterministically (same inputs → same DPResult). Pre-supplied resolutions are applied when matching escalations fire (same timing as original run). The engine produces a new `state_transition_log`.

### Step 6 — Replay Validation

After completion:

```
compare new_state_transition_log to original_state_transition_log (from O-08 / manifest):
  for each entry at seq N:
    compare: from_state, to_state, dp_id, condition_value, affected_entities, phase6_iteration
    (exclude: timestamp)
  
  if all entries match → REPLAY_VALID
  if any entry differs → REPLAY_DIVERGENT (report first divergence)
```

---

## Replay Validation Procedure

The `ReplayValidator` produces a `ReplayValidationReport`:

```json
{
  "report_type":          "replay_validation",
  "run_id_original":      "string",
  "run_id_replay":        "string",
  "result":               "REPLAY_VALID|REPLAY_DIVERGENT",
  "total_transitions":    "integer",
  "matched_transitions":  "integer",
  "first_divergence": {
    "seq":                "integer|null",
    "from_state":         "string|null",
    "original_condition": "string|null",
    "replay_condition":   "string|null"
  },
  "corpus_hash_match":    true,
  "boundary_hash_match":  true,
  "target_hash_match":    true
}
```

**REPLAY_VALID:** Identical execution traces. Confirms the engine is deterministic for these inputs.

**REPLAY_DIVERGENT:** First diverging entry is reported. This indicates either:
- A DP handler has non-deterministic logic (engine implementation defect), or
- The corpus or boundary files were modified between the hash check and execution (race condition), or
- The operator_resolutions sequence differed (should not happen if loaded from manifest)

All three cases are engine/infrastructure issues, not corpus issues.

---

## Replay Guarantee Statement

PSEE guarantees replay validity for any run where:
1. Corpus files have not changed (verified by hash)
2. Boundary document has not changed (verified by hash)
3. Phase B target has not changed (verified by hash)
4. Operator resolutions are replayed in the same order and with the same values

This guarantee is unconditional for FULL executions that reach S-13 or S-T1. RESUME executions that were replayed from a suspension point are also replayable, provided the `EscalationResolution` objects are included in the manifest.

---

## Creating a Replay-Ready Manifest

Every PSEE execution automatically produces an `execution_manifest.json` on completion (S-13, S-T1, or S-T3). No operator action is required to enable replay.

If an execution is suspended at S-T2 and not resumed, the manifest is written with `final_state = "S-T2"`. Replaying this manifest will replay up to the same suspension point (same escalation fires). The operator must resolve the escalation again (or use `RESUME` mode instead to provide a resolution without full re-execution).

---

#### STATUS

| Check | Result |
|---|---|
| Replay preconditions defined (hash verification) | CONFIRMED |
| Replay input schema (execution_manifest.json) defined | CONFIRMED |
| Replay execution protocol defined step-by-step | CONFIRMED |
| ReplayValidationReport schema defined | CONFIRMED |
| REPLAY_VALID and REPLAY_DIVERGENT cases defined | CONFIRMED |
| Replay guarantee statement defined | CONFIRMED |
| Section G Question 6 (how replay is triggered and validated) answered | CONFIRMED |
| No canonical mutation | CONFIRMED |

**REPLAY CONTRACT: COMPLETE**
