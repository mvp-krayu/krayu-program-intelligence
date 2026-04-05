# PSEE-OPS.0 — Logging Exposure Model

**Stream:** PSEE-OPS.0
**Family:** PSEE-OPS
**Date:** 2026-04-05
**Authority:** PSEE.2/logging_contract.md;
               PSEE.1/psee_decision_contract_v1.md G-10, INV-07

---

## Log Exposure Surface

This document defines how the four log types produced by the PSEE.2 engine (state transition log, escalation log, flag register, execution manifest) are exposed to operators. Logs are presented verbatim — no filtering, no interpretation, no summarization.

---

### Exposure Architecture

```
PSEEContext (engine-internal)
  ├── state_transition_log    ─── exposed via PSEERunHandle.logs.transitions
  ├── escalation_log          ─── exposed via PSEERunHandle.logs.escalations
  ├── flags[]                 ─── exposed via PSEERunHandle.logs.flags
  └── (written to disk on flush events)

ExecutionManifest (file)      ─── exposed via PSEERunHandle.logs.manifest_path
```

The operator cannot write to any log. The `PSEERunHandle.logs` surface is read-only. No log entry is hidden, filtered, or suppressed by the exposure layer.

---

## State Transition Visibility

### Live State

The `PSEERunHandle.current_state` field reflects the engine's current state in real time. Operators can poll this at any time.

### State Transition Log (Read-Only Stream)

Exposed as a read-only ordered list of `StateTransitionLogEntry` objects:

```json
[
  {
    "seq":              1,
    "timestamp":        "ISO-8601",
    "from_state":       "S-00",
    "to_state":         "S-01",
    "dp_id":            "DP-0-04",
    "condition_value":  "PASS",
    "affected_entities": [],
    "phase6_iteration": null
  },
  ...
]
```

**Exposure rules:**
- All entries are exposed; none are filtered.
- Entries are presented in `seq` order (monotonically increasing).
- `timestamp` is informational; the exposure layer does not filter by time.
- AUTO transitions (e.g., S-01 → S-02) are included.

### Decision Point Visibility

Every DP evaluation produces a state transition entry with `dp_id` and `condition_value`. This means:

- An operator can trace any state change to the specific DP and condition that caused it.
- Hidden DP evaluations (DP-2-03, DP-3-02, DP-3-03, DP-3-05, DP-S-01) are fully logged even though they were "hidden" in the PSEE.0 spec. They are visible in the log.

---

## Escalation Log Access

Exposed as a read-only ordered list of `EscalationLogEntry` objects:

```json
[
  {
    "seq":              1,
    "dp_id":            "DP-1-05",
    "condition":        "UNCLASSIFIABLE",
    "state":            "S-T2",
    "action":           "ESCALATE",
    "iteration":        null,
    "affected":         ["/corpus/backend/src/../src"],
    "resolution":       null,
    "resolution_basis": null,
    "resolved_at":      null
  },
  ...
]
```

**Active vs resolved escalations:**
- `resolution = null` and `resolved_at = null`: open escalation (engine suspended at this point)
- `resolution` and `resolved_at` populated: resolved escalation (engine has resumed)

The operator can inspect all escalation entries to understand the full history of suspensions and resolutions in the run.

---

## Flag Register Access

Exposed as a read-only string array. Flags are compact status tokens set by the engine:

```json
[
  "ESC: ESC-02 [dp=DP-1-05, affected=/corpus/backend/src/../src]",
  "US: US-01 created [condition=US-CONDITION-01, entities=CEU-03,CEU-07]"
]
```

Flags are exposed verbatim. The exposure layer does not parse, aggregate, or interpret flag content.

---

## Manifest Path Access

The `PSEERunHandle.logs.manifest_path` field returns the filesystem path to the `execution_manifest.json` file for the current run. This file is the complete replayability record (see `replay_contract.md`).

---

## Exposure Format — Full LogSurface

```
LogSurface {
  transitions:    ReadOnlyList<StateTransitionLogEntry>   // all state transitions
  escalations:    ReadOnlyList<EscalationLogEntry>        // all STOP/ESCALATE/US/PARTIAL events
  flags:          ReadOnlyList<string>                    // compact status tokens
  manifest_path:  string                                  // path to execution_manifest.json
  us_records:     ReadOnlyList<UnknownSpaceRecord>        // all US records (duplicate of PSEERunHandle.us_records)
}
```

---

## No Filtering, No Interpretation

The exposure model enforces strict transparency:

| Prohibited operator-surface behavior | Why prohibited |
|---|---|
| Filtering out AUTO transitions | Every transition is audit material; no filtering |
| Hiding "resolved" escalation entries | Resolved entries are history; history is immutable |
| Suppressing US records | US records are mandatory output (INV-02) |
| Aggregating DP evaluations into summaries | Summarization = interpretation (FB-05) |
| Masking STOP conditions | G-10 requires all STOP/ESCALATE to be logged; INV-07 requires no silent failures |
| Reformatting log entries | Verbatim presentation preserves audit integrity |

---

## Log Consumption by Downstream Streams

PSEE outputs (O-01..O-07) carry cross-references to log entries (per `logging_contract.md §Log Cross-References`). Downstream stream operators (PSEE.3 or later) should:

1. Locate the `psee_log_ref` field in each output artifact
2. Use it to trace any record back to its `state_transition_log` entry
3. Review escalation log entries for context on any operator-resolved classifications
4. Review US records before relying on OVL or CEU completeness assertions

---

#### STATUS

| Check | Result |
|---|---|
| Exposure architecture defined (PSEERunHandle.logs surface) | CONFIRMED |
| State transition log exposure defined (verbatim, all entries) | CONFIRMED |
| Decision point visibility confirmed (all DPs, including hidden) | CONFIRMED |
| Escalation log exposure defined | CONFIRMED |
| Flag register exposure defined | CONFIRMED |
| Manifest path access defined | CONFIRMED |
| No-filtering, no-interpretation rules defined | CONFIRMED |
| No canonical mutation | CONFIRMED |

**LOGGING EXPOSURE MODEL: COMPLETE**
