# PSEE-OPS.0 — Escalation Interface Specification

**Stream:** PSEE-OPS.0
**Family:** PSEE-OPS
**Date:** 2026-04-05
**Authority:** PSEE.1/escalation_and_fallback_spec.md;
               PSEE.2/exception_runtime_spec.md §Part 2

---

## Escalation Surface

This document defines how the engine's ESCALATE events (ESC-01 through ESC-06) are surfaced to the operator, how operator responses are captured, and how execution resumes deterministically. The escalation interface is a strict question-and-answer channel: the engine asks, the operator answers, the engine validates and resumes.

---

### Escalation Notification Schema

When the engine transitions to S-T2 (ESCALATED), it writes an `EscalationNotification` to the operator's designated channel:

```json
{
  "notification_type":    "ESCALATION",
  "run_id":               "string",
  "escalation_id":        "string",         // unique within this run: "ESC-<seq>"
  "dp_id":                "string",         // e.g., "DP-1-05"
  "escalation_class":     "string",         // e.g., "ESC-02"
  "condition":            "string",         // human-readable condition description
  "suspended_state":      "string",         // e.g., "S-02"
  "resume_state":         "string",         // state engine will transition to on resolution
  "affected":             ["string"],       // paths or entity IDs requiring resolution
  "valid_resolutions":    ["string"],       // complete list of acceptable resolution values
  "resolution_guidance":  "string",         // explanation of what each valid resolution means
  "requires_evidence":    true,             // resolution_basis is always required
  "timestamp":            "ISO-8601"
}
```

---

### Per-Escalation Notification Templates

The `resolution_guidance` and `valid_resolutions` are populated per escalation class:

| ESC class | `valid_resolutions` | `resolution_guidance` |
|---|---|---|
| ESC-01 (ARCHITECTURAL_STRUCTURE) | `["DUAL_PATH_CONFIRMED"]` | Confirm both paths represent distinct architectural layers; provide documentation of why. |
| ESC-02 (UNCLASSIFIABLE) | `["EXTRACTION_ARTIFACT","PACKAGING_BOUNDARY","ARCHITECTURAL_STRUCTURE"]` | Classify the path duplication. Provide inspection note, extraction log reference, or diff result as basis. |
| ESC-03 (GRAY_ZONE) | `["EXCLUSION_LIST_PROVIDED","EXPLICIT_EMPTY_DECLARATION"]` | Add an exclusion list to the boundary document, or explicitly declare nothing is excluded. |
| ESC-04 (UNCLAIMED_PATH) | `["NEW_DOMAIN","REMOVE_FROM_PRIMARY","MERGE_WITH_RATIONALE"]` | Determine if the unclaimed path should become a domain, be removed, or (with rationale) be merged. |
| ESC-05 (AMBIGUOUS_FILE_TYPE) | `["<evidence_class>/<evidence_subclass>"]` | Provide the evidence_class and evidence_subclass for the ambiguous file. Cite the content role basis. |
| ESC-06 (RECONSTRUCTION_DIVERGENT) | N/A (automatic re-entry; no operator resolution required for iter 1) | Engine re-enters from S-02 automatically. Operator should investigate divergent units in the log. |

---

## Operator Response Protocol (Section G Question 3)

The operator responds to an escalation by submitting an `EscalationResolution` object via the escalation channel.

### EscalationResolution Schema

```json
{
  "run_id":               "string",       // must match the active run
  "escalation_id":        "string",       // must match the EscalationNotification.escalation_id
  "dp_id":                "string",       // must match the escalation's dp_id
  "affected":             ["string"],     // must match or be a subset of the notification's affected list
  "resolution":           "string",       // must be one of valid_resolutions
  "resolution_basis":     "string",       // REQUIRED; non-empty; operator-cited evidence or rationale
  "resolved_at":          "ISO-8601"
}
```

### Response Validation

Before the resolution is applied to the engine:

1. `run_id` must match the active run
2. `escalation_id` must match an open escalation entry in `PSEEContext.escalation_log`
3. `dp_id` must match the escalation's dp_id
4. `resolution` must be in `valid_resolutions` for the escalation class
5. `resolution_basis` must be non-empty
6. If `resolution` is a classification value (e.g., ESC-02): the value must be in the DP's canonical outcome set

Validation failure → `EscalationResolution` REJECTED:
```json
{
  "result":       "REJECTED",
  "escalation_id": "string",
  "reason":       "string",
  "valid_resolutions": ["string"]
}
```

Engine remains in S-T2. Operator corrects and resubmits.

---

## Resumption Paths (Section G Question 4)

Execution resumes deterministically from the state defined in `exception_runtime_spec.md §Part 2`:

| ESC class | Resume state | Resume action |
|---|---|---|
| ESC-01 | S-03 (after affected path) | Add both paths to EvidenceDomain list; resume normalization |
| ESC-02 | S-03 (after affected path) | Re-invoke DP-1-02 with operator classification; resume |
| ESC-03 | S-04 | Update boundary document with exclusion declaration; re-evaluate DP-2-01 |
| ESC-04 | S-07 | Apply path assignment/removal decision; re-evaluate DP-3-01 |
| ESC-05 | S-11 (or S-T3) | Apply operator file classification; continue DP-5-02 evaluation |
| ESC-06 | S-02 (automatic) | No operator response needed; engine logs divergent units and re-enters |

**Determinism of resumption:** The engine produces the same execution trace from the resume state given:
- the same unresolved portion of the corpus
- the same `EscalationResolution.resolution` value
- the same `EscalationResolution.affected` list

The `resolved_at` timestamp is recorded in the log but not used in any DP evaluation (timestamps are never decision inputs).

---

## Multi-Escalation Handling

If multiple paths are escalated simultaneously (e.g., two paths both produce ESC-02), the engine creates one `EscalationNotification` per escalated path. Each has a unique `escalation_id`.

The operator may resolve escalations in any order. The engine tracks which escalations are open and which are resolved. Resumption of any individual phase sub-path occurs as soon as its escalation is resolved.

S-02 → S-03 transition fires only when all path-level escalations in Phase 1 are resolved (per `state_transition_table.md`: "all paths in terminal normalization state").

---

## Pre-Supplied Adjudication

Operators may pre-supply `EscalationResolution` objects in `OperatorInput.operator_adjudication` before execution begins. These are processed as follows:

1. Engine fires escalation, creates `EscalationNotification`
2. `InvocationLayer` checks `adjudication_queue` for a matching entry (`dp_id` + `affected` match)
3. If match found: apply as if the operator submitted it at escalation time
4. If no match: emit `EscalationNotification` via operator channel; await live response

Pre-supplied adjudication does NOT skip logging. The escalation is logged, the pre-supplied resolution is logged, and the resumption is logged — exactly as in a live-response flow.

---

## Escalation State Persistence

When the engine enters S-T2, it flushes `PSEEContext` to disk immediately (per `logging_contract.md §Log Persistence`). This ensures:

- The suspended state survives operator wait time (which may be hours or days)
- The persisted context is the input for RESUME mode
- If the operator process terminates and restarts, the escalation state is recoverable

The `resume_context_path` in `OperatorInput` (RESUME mode) must point to this flushed context file.

---

## STOP vs ESCALATE

The operator must not treat a STOP as an escalation. The distinction is:

| | ESCALATE (S-T2) | STOP (S-T1) |
|---|---|---|
| Resumable? | YES (with EscalationResolution) | NO (full restart) |
| Operator action | Submit EscalationResolution | Correct inputs; restart from S-00 |
| Artifacts produced | PSEEContext written (suspended) | PSEEContext written (flags + escalation_log only) |
| Next step | RESUME mode | FULL mode with corrected inputs |

STOP conditions (STOP-01, STOP-02) are surfaced via a `StopNotification`:

```json
{
  "notification_type":    "STOP",
  "run_id":               "string",
  "stop_class":           "STOP-01|STOP-02",
  "condition":            "string",
  "flags":                ["string"],
  "operator_action_required": "string"
}
```

---

#### STATUS

| Check | Result |
|---|---|
| EscalationNotification schema defined | CONFIRMED |
| Per-escalation valid_resolutions and guidance defined (ESC-01..06) | CONFIRMED |
| EscalationResolution schema defined | CONFIRMED |
| Response validation rules defined | CONFIRMED |
| Resumption paths defined (Section G Q3/Q4) | CONFIRMED |
| Multi-escalation handling defined | CONFIRMED |
| Pre-supplied adjudication protocol defined | CONFIRMED |
| Escalation state persistence defined | CONFIRMED |
| STOP vs ESCALATE distinction defined | CONFIRMED |
| No canonical mutation | CONFIRMED |

**ESCALATION INTERFACE SPEC: COMPLETE**
