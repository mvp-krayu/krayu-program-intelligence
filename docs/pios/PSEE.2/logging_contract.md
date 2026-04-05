# PSEE.2 — Logging Contract

**Stream:** PSEE.2
**Family:** PSEE
**Date:** 2026-04-05
**Authority:** PSEE.1/decision_state_model.md §Context Object; PSEE.1/escalation_and_fallback_spec.md §Part 6

---

## Logging Scope

This document defines the complete runtime log schema and replay contract for PSEE execution. Every log produced by the engine is governed by this contract. Logs are the basis for:
- audit: tracing any output record back to its decision path
- replay: re-executing the engine with identical inputs and verifying identical output
- escalation management: persisting suspension state and resolution records

---

## Log Types

The PSEE engine produces four log types, all stored in `PSEEContext`:

| Log | Field in PSEEContext | Purpose |
|---|---|---|
| State Transition Log | `state_transition_log` | Records every state change with DP and condition |
| Escalation Log | `escalation_log` | Records every STOP, ESCALATE, and PARTIAL event |
| Flag Register | `flags` | Compact status flags for quick state inspection |
| Execution Manifest | External file (not in PSEEContext) | Replayability record for this execution run |

---

## Schema 1 — State Transition Log Entry

```json
{
  "seq":              "integer",        // monotonically increasing sequence number (1, 2, 3...)
  "timestamp":        "ISO-8601",       // wall-clock time of transition (informational only)
  "from_state":       "PSEEState",      // e.g., "S-00", "S-02", "S-T2"
  "to_state":         "PSEEState",      // e.g., "S-01", "S-03", "S-T1"
  "dp_id":            "DP_ID|AUTO",     // "AUTO" for automatic transitions (no DP gate)
  "condition_value":  "string",         // the condition that triggered the transition
  "affected_entities": ["string"],      // paths, CEU IDs, or file paths (may be empty)
  "phase6_iteration": "integer|null"    // present only for DP-6-01 transitions
}
```

Rules:
- Every call to `PSEEStateMachine.transition()` produces exactly one entry.
- Automatic transitions (e.g., S-01 → S-02 on entry) use `dp_id: "AUTO"`.
- Timestamps are informational; they must NOT be used as decision inputs (replayability).
- Sequence numbers are the replay anchor; if two executions produce identical sequences with identical fields (excluding timestamp), the executions are equivalent.

---

## Schema 2 — Escalation Log Entry

```json
{
  "seq":              "integer",        // separate sequence from state_transition_log
  "dp_id":            "DP_ID",          // e.g., "DP-1-05", "DP-6-01"
  "condition":        "string",         // human-readable condition (e.g., "UNCLASSIFIABLE")
  "state":            "PSEEState",      // state at time of exception
  "action":           "STOP|ESCALATE|UNKNOWN-SPACE|RE-ENTER|PARTIAL",
  "iteration":        "integer|null",   // for DP-6-01 only
  "affected":         ["string"],       // entity IDs or paths affected
  "resolution":       "string|null",    // null until resolved
  "resolution_basis": "string|null",    // operator-cited evidence for resolution
  "resolved_at":      "ISO-8601|null"   // null until resolved
}
```

Rules:
- Every STOP, ESCALATE, UNKNOWN-SPACE, and PARTIAL event produces exactly one entry.
- STOP entries: `resolution` and `resolved_at` remain null (STOP is not resolved; stream restarts).
- ESCALATE entries: `resolution` and `resolved_at` are populated when `EscalationResolution` is received and validated.
- UNKNOWN-SPACE entries: `action: "UNKNOWN-SPACE"`, `resolution: null` permanently (US records are never programmatically resolved).
- Multiple ESCALATE entries may be open simultaneously (one per suspended path).

---

## Schema 3 — Flag Register

Flags are string entries appended to `PSEEContext.flags[]`. They are compact status signals for quick inspection.

| Event | Flag format |
|---|---|
| STOP-01 | `"STOP: SOURCE_RESOLUTION_FAIL [DP-0-xx]"` |
| STOP-02 | `"STOP: RECONSTRUCTION_DIVERGENT_UNRESOLVABLE [iter=2]"` |
| STOP-UNDEFINED | `"STOP: UNDEFINED_TRANSITION [state=S, dp=DP, cond=C]"` |
| STOP-HEURISTIC | `"STOP: BLOCKED_HEURISTIC [h_id=H-xx, dp=DP-xx]"` |
| ESC-01..06 | `"ESC: <ESC_ID> [dp=DP-xx, affected=<entity>]"` |
| PARTIAL | `"PARTIAL: coverage=N%, unmapped_units=[U-01, U-02, ...]"` |
| US record | `"US: US-NN created [condition=US-CONDITION-xx, entities=<list>]"` |

Flags are write-once; they are never removed or modified after writing.

---

## Schema 4 — Execution Manifest (External File)

The execution manifest is written to `docs/pios/PSEE.2/execution_manifest.md` (also the 8th governed artifact for this stream). At runtime, a machine-readable version is also written as part of `PSEEContext` for programmatic replay validation.

```json
{
  "run_id":                    "string",        // unique identifier for this execution run
  "stream_id":                 "PSEE.2",
  "execution_timestamp":       "ISO-8601",
  "inputs": {
    "corpus_root":             "string",         // absolute path
    "corpus_root_hash":        "SHA-256",        // hash of root directory manifest
    "evidence_boundary_path":  "string",
    "evidence_boundary_hash":  "SHA-256",
    "phase_b_target_path":     "string",
    "phase_b_target_hash":     "SHA-256",
    "system_identity":         "object"          // system name + version from boundary doc
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
  "final_state":               "PSEEState",
  "phase6_iteration_count":    "integer",
  "coverage_percent":          "float|null",
  "state_transition_count":    "integer",
  "escalation_count":          "integer",
  "us_record_count":           "integer",
  "flags":                     ["string"]
}
```

---

## Replay Contract

**Definition:** An execution is replayable if: given the same `inputs` (corpus_root_hash, boundary_hash, phase_b_target_hash) and the same `operator_resolutions` sequence, the engine produces an identical `state_transition_log` (excluding `timestamp` fields).

**Conditions that guarantee replayability:**

1. **Input immutability**: Corpus files and boundary document are not modified between runs. Hash comparison confirms this.

2. **DP handler purity**: All DP handlers are pure functions. No handler reads system time, environment variables, or external state beyond `(PSEEContext, corpus_input)`. This is a compile-time constraint; any handler that fails purity audit is rejected.

3. **Deterministic ordering**: All multi-file operations (file enumeration, domain iteration) produce a deterministic ordering. The canonical ordering is: lexicographic by canonical path, ascending.

4. **Operator resolution sequence**: Escalation resolutions are applied in the order they were recorded. A different resolution sequence (different `resolution` values or different `resolved_at` ordering) constitutes a different input; different state transition sequences are expected and correct.

5. **No stochastic elements**: No random number generation, no process ID–based branching, no environment-dependent paths. The PSEE.X excluded patterns (CP-xx) must not be imported; they introduce undefined behavior.

**Replayability validation procedure:**
```
1. Record execution_manifest.json for run A
2. Reset engine state to S-00
3. Provide identical inputs (verify hashes match)
4. Provide identical operator_resolutions in same order
5. Execute to completion
6. Compare state_transition_log (field by field, excluding timestamp)
7. Compare escalation_log (resolution fields only)
8. PASS if both logs are identical; FAIL otherwise
```

**Replay failure diagnosis:**
- Different `condition_value` at same `seq`: DP handler has non-deterministic logic (engine defect)
- Different `to_state` at same `seq`: TransitionRegistry has been modified (engine defect)
- Different `escalation_count`: ESCALATE triggers are non-deterministic (engine defect or input changed)
- Different `us_record_count`: US creation conditions are non-deterministic (engine defect)

---

## Log Persistence

All logs are written to `PSEEContext` in memory during execution and flushed to disk on:
- Any STOP transition (immediate flush: partial context is the only recoverable artifact)
- S-T2 entry (flush before suspension: escalation state must survive operator wait)
- S-T3 entry (flush: PARTIAL artifacts written)
- S-13 entry (flush: all output artifacts written)
- End of each phase (incremental flush: partial recovery in case of unexpected termination)

---

## Log Cross-References

Each output artifact (O-01..O-07) carries a `psee_log_ref` field containing:
- The `seq` of the `state_transition_log` entry that produced or finalized the artifact
- The `escalation_log` seq(s) relevant to any US records embedded in the artifact

This cross-reference enables full traceability from any output record back to the decision path that produced it.

---

#### STATUS

| Check | Result |
|---|---|
| State transition log schema defined | CONFIRMED |
| Escalation log schema defined (extends PSEE.1 §Part 6) | CONFIRMED |
| Flag register format defined | CONFIRMED |
| Execution manifest schema defined | CONFIRMED |
| Replay contract defined with validation procedure | CONFIRMED |
| Log persistence strategy defined | CONFIRMED |
| Cross-reference mechanism defined | CONFIRMED |
| No canonical mutation | CONFIRMED |

**LOGGING CONTRACT: COMPLETE**
