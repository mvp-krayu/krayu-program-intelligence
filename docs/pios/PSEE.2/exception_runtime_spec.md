# PSEE.2 — Exception Runtime Specification

**Stream:** PSEE.2
**Family:** PSEE
**Date:** 2026-04-05
**Authority:** PSEE.1/escalation_and_fallback_spec.md (read-only input)

---

## Exception System Scope

This document specifies the exact runtime behavior of the PSEE exception system. It maps every non-PROCEED outcome (STOP, ESCALATE, UNKNOWN-SPACE, PARTIAL) to its runtime handler, data structures produced, and engine state changes. This is the implementation specification for `ExceptionSystem` (see `implementation_architecture.md` §1).

---

## Priority Ordering (Runtime Enforcement)

When multiple conditions are detected simultaneously:

```
Priority 1: STOP          — halts all execution; no output artifacts
Priority 2: ESCALATE      — suspends affected path; other paths may continue
Priority 3: UNKNOWN-SPACE — creates US record; execution continues
Priority 4: PROCEED       — default; no exception handling required
```

If a STOP condition and an ESCALATE condition are both triggered in the same DP evaluation:
→ STOP takes precedence; no escalation record is written; stream terminates.

If multiple ESCALATE conditions are active simultaneously:
→ All are logged; execution suspends at the earliest-phase escalation.
→ Later-phase escalations are deferred until earlier-phase escalations are resolved.

---

## Part 1 — STOP Conditions

STOP transitions the engine to S-T1. No output artifacts (O-01..O-07) are produced. Only `PSEEContext.escalation_log` and `PSEEContext.flags` are written.

---

### STOP-01 — Source Resolution Failure

```
trigger_conditions (any one):
  - DP-0-01: corpus root not accessible
  - DP-0-02: boundary document absent (and no fallback window granted)
  - DP-0-03: Phase B target not declared or not accessible
  - DP-0-04: system identity cannot be confirmed

runtime_handler:
  1. Identify triggering DP (DP-0-01..04)
  2. Write escalation_log entry:
       { dp_id, condition: "SOURCE_RESOLUTION_FAIL",
         state: "S-T1", action: "STOP",
         affected: [specific missing input],
         resolution: null, resolved_at: null }
  3. Write PSEEContext.flags += "STOP: SOURCE_RESOLUTION_FAIL [<dp_id>]"
  4. Set current_state = S-T1
  5. Write PSEEContext to disk (escalation_log + flags only)
  6. Halt all phase handlers
  7. Return exit code STOP_SOURCE_RESOLUTION_FAIL

resume_condition: NONE — full restart from S-00 with corrected inputs required
operator_message: "PSEE STOPPED: Source resolution failed at <dp_id>. Correct condition and restart."
```

---

### STOP-02 — Reconstruction Divergence (Second Iteration)

```
trigger_condition:
  - DP-6-01 produces DIVERGENT result on second evaluation
    (PSEEContext.phase6_iteration_count == 2)

runtime_handler:
  1. Write escalation_log entry:
       { dp_id: "DP-6-01", iteration: 2,
         condition: "RECONSTRUCTION_DIVERGENT_UNRESOLVABLE",
         state: "S-T1", action: "STOP",
         affected: [divergent_artifact_ids],
         resolution: null, resolved_at: null }
  2. Write PSEEContext.flags += "STOP: RECONSTRUCTION_DIVERGENT_UNRESOLVABLE [iter=2]"
  3. Mark all partial artifacts produced up to this point as "INCOMPLETE: STOP-02"
  4. Set current_state = S-T1
  5. Write PSEEContext to disk
  6. Halt all phase handlers
  7. Return exit code STOP_RECONSTRUCTION_DIVERGENT

resume_condition: NONE — operator must extend rule catalog (new PSEE.0R or PSEE base stream)
                  then restart from S-00
operator_message: "PSEE STOPPED: Reconstruction divergent after 2 iterations.
                   Rule catalog extension required before restart."
```

---

### STOP-UNDEFINED — Undefined Transition Guard

```
trigger_condition:
  - PSEEStateMachine.transition() called with (state, dp_id, condition) not in TransitionRegistry

runtime_handler:
  1. Write PSEEContext.flags += "STOP: UNDEFINED_TRANSITION [state=<S>, dp=<DP>, cond=<C>]"
  2. Set current_state = S-T1
  3. Halt immediately
  4. Return exit code STOP_UNDEFINED_TRANSITION

This condition indicates an engine implementation defect, not a corpus problem.
```

---

### STOP-HEURISTIC — Blocked Heuristic in Decision Path

```
trigger_condition:
  - HeuristicGuard detects BLOCKED heuristic ID in DPResult

runtime_handler:
  1. Write PSEEContext.flags += "STOP: BLOCKED_HEURISTIC [h_id=<H-xx>, dp=<DP-xx>]"
  2. Set current_state = S-T1
  3. Halt
  4. Return exit code STOP_BLOCKED_HEURISTIC

operator_message: "PSEE engine violation: blocked heuristic <H-xx> entered decision path at <DP-xx>.
                   Engine implementation must be corrected."
```

---

## Part 2 — ESCALATE Conditions

ESCALATE transitions the engine to S-T2 for the affected path/entity. Other paths (if applicable) continue. The engine awaits an `EscalationResolution` object before resuming.

---

### EscalationResolution Schema

```json
{
  "dp_id":             "string",       // e.g., "DP-1-05"
  "affected":          ["string"],     // paths or entity IDs
  "resolution":        "string",       // valid condition_value for the DP
  "resolution_basis":  "string",       // operator-cited evidence
  "resolved_at":       "ISO-8601"
}
```

Validation on receipt:
- `resolution` value must be in the DP's valid outcome set (engine has a static map per DP)
- `resolution_basis` must be non-empty
- `dp_id` must match the suspended escalation log entry

If validation fails: engine writes error and remains in S-T2. Does not accept invalid resolutions.

---

### ESC-01 — Architectural Structure Path Duplication

```
trigger:         DP-1-02 classification = ARCHITECTURAL_STRUCTURE
suspended_at:    S-02 (affected path only)

runtime_handler:
  1. Suspend Phase1Handler for affected_path
  2. Write escalation_log entry:
       { dp_id: "DP-1-04", condition: "ARCHITECTURAL_STRUCTURE",
         state: "S-T2", action: "ESCALATE",
         affected: [affected_path], resolution: null }
  3. Set per-path state = SUSPENDED
  4. Continue Phase1Handler for all other paths
  5. Await EscalationResolution { dp_id: "DP-1-04", resolution: "DUAL_PATH_CONFIRMED" }

resume_handler:
  1. Validate resolution
  2. Write resolved_at to log entry
  3. Add both paths as separate EvidenceDomains (pre-register in Phase 3 domain list)
  4. Resume Phase1Handler for affected_path from DP-1-03 (architectural path → no collapse)
  5. If all paths processed → transition S-02 → S-03

resume_state: S-03 (after affected path normalization complete)
```

---

### ESC-02 — Unclassifiable Path Duplication

```
trigger:         DP-1-02 classification = UNCLASSIFIABLE
suspended_at:    S-02 (affected path only)

runtime_handler:
  1. Suspend Phase1Handler for affected_path
  2. Write escalation_log entry:
       { dp_id: "DP-1-05", condition: "UNCLASSIFIABLE",
         state: "S-T2", action: "ESCALATE",
         affected: [affected_path], resolution: null }
  3. Await EscalationResolution { dp_id: "DP-1-05",
       resolution: one of ["EXTRACTION_ARTIFACT","PACKAGING_BOUNDARY","ARCHITECTURAL_STRUCTURE"],
       resolution_basis: <inspection note or log reference> }

resume_handler:
  1. Re-invoke DP-1-02 handler with operator-supplied classification as forced condition_value
  2. State machine transitions per the resolved classification
  3. Resume path processing

resume_state: S-03 (after affected path completes)
```

---

### ESC-03 — Exclusion List Absent

```
trigger:         DP-2-01 condition = EXCLUSION_LIST_ABSENT
suspended_at:    S-03 (entire stream, not path-specific)

runtime_handler:
  1. Halt all of Phase2Handler
  2. Write escalation_log entry:
       { dp_id: "DP-2-01", condition: "GRAY_ZONE",
         state: "S-T2", action: "ESCALATE",
         affected: ["evidence_boundary.explicitly_excluded_paths"], resolution: null }
  3. Await EscalationResolution { dp_id: "DP-2-01",
       resolution: one of ["EXCLUSION_LIST_PROVIDED", "EXPLICIT_EMPTY_DECLARATION"],
       resolution_basis: <updated boundary document reference> }

resume_handler:
  1. Reload boundary document (operator has updated it)
  2. Verify explicitly_excluded_paths field is now present
  3. Resume Phase2Handler from DP-2-01 (now PASS)
  4. Transition S-03 → S-04

resume_state: S-04
```

---

### ESC-04 — Unclaimed Path

```
trigger:         DP-3-01 condition = UNCLAIMED_PATH_EXISTS
suspended_at:    S-06 (at domain completion gate)

runtime_handler:
  1. Halt Phase3Handler at domain completion gate
  2. Write escalation_log entry:
       { dp_id: "DP-3-01", condition: "UNCLAIMED_PATH",
         state: "S-T2", action: "ESCALATE",
         affected: [unclaimed_path], resolution: null }
  3. Await EscalationResolution { dp_id: "DP-3-01",
       resolution: one of ["NEW_DOMAIN", "REMOVE_FROM_PRIMARY", "MERGE_WITH_RATIONALE"],
       resolution_basis: <operator explanation> }

resume_handler:
  1. Apply resolution:
     - NEW_DOMAIN: add domain entry; path is now assigned
     - REMOVE_FROM_PRIMARY: remove path from primary_evidence_origin_paths; no domain created
     - MERGE_WITH_RATIONALE: merge into specified existing domain (log R-GRP-01 anti-merge warning)
  2. Re-evaluate DP-3-01; if all paths now assigned → proceed
  3. Transition S-06 → S-07

resume_state: S-07
```

---

### ESC-05 — Ambiguous File Type Classification

```
trigger:         DP-5-01 condition = TYPE_NOT_IN_LIST_AMBIGUOUS
suspended_at:    S-10 (for affected file(s))

runtime_handler:
  1. Suspend classification for affected file(s)
  2. Write escalation_log entry:
       { dp_id: "DP-5-01", condition: "AMBIGUOUS_TYPE",
         state: "S-T2", action: "ESCALATE",
         affected: [file_path], resolution: null }
  3. Continue classification for all non-ambiguous files
  4. Await EscalationResolution { dp_id: "DP-5-01",
       resolution: <evidence_class>/<evidence_subclass>,
       resolution_basis: <content role description> }

resume_handler:
  1. Apply operator classification to file's ClassificationRecord
  2. Validate priority value (DP-S-02 check)
  3. Resume Phase5Handler
  4. Re-evaluate DP-5-02 (coverage gate) after all classifications are complete
  5. Transition S-10 → S-11 (or S-T3 if coverage < 90%)

resume_state: S-11 (or S-T3)
```

---

### ESC-06 — Phase 6 First Divergence (Re-entry)

```
trigger:         DP-6-01 condition = DIVERGENT (phase6_iteration_count == 1)
action_type:     RE-ENTRY (not a full suspension; re-enters from S-02)

runtime_handler:
  1. Write escalation_log entry:
       { dp_id: "DP-6-01", iteration: 1,
         condition: "RECONSTRUCTION_DIVERGENT",
         state: "S-02", action: "RE-ENTER",
         affected: [divergent_artifact_ids], resolution: null }
  2. Increment PSEEContext.phase6_iteration_count to 2 (next DP-6-01 evaluation = iter 2)
  3. Set current_state = S-02
  4. Preserve PSEEContext (normalization records, canonical paths, filter table,
     evidence domains, ceu_index, ovl_records, us_records — all retained)
  5. Restart Phase1Handler with investigation focus:
     - re-examine paths that contributed to divergent artifacts
     - HeuristicGuard remains active; no relaxation on re-run

note: The re-run path (Phase 1 → 2 → 3 → 4 → 5 → 6) repeats fully.
      ESC-06 is not an ESCALATE suspension; it is an automatic re-entry.
      No operator input is required for re-entry; only the final STOP-02 requires operator action.
```

---

## Part 3 — UNKNOWN-SPACE Conditions

UNKNOWN-SPACE does not suspend execution. It creates a `UnknownSpace` record and proceeds.

---

### US-CONDITION-01 — Unresolved Overlap Parity

```
trigger:    OVL record created with file_level_parity = UNKNOWN (DP-4-02 false-path)

runtime_handler (within Phase4Handler, within S-08):
  1. Identify OVL pair: (CEU-A, CEU-B)
  2. Call UnknownSpaceRecorder.record():
       us_id = "US-" + seq
       condition_type = "US-CONDITION-01"
       description = "File-level parity between <CEU-A> and <CEU-B> is unknown.
                       Structural similarity observed; no content comparison performed."
       affected_entities = [CEU-A.canonical_id, CEU-B.canonical_id]
       downstream_impact = "OVL record consumers must treat file_level_parity as UNKNOWN.
                            Resolution requires explicit diff or content comparison."
       resolution = null
  3. Append to PSEEContext.us_records
  4. Continue Phase4Handler (no suspension)

forbidden: Setting resolution to any value derived from structural similarity alone (FB-01/FB-02)
```

---

### US-CONDITION-02 — Platform Content Unknown

```
trigger:    Platform/integrated domain present; overlap with standalones observed;
            whether platform contains files beyond its standalone equivalents is unknown

runtime_handler (within Phase4Handler, within S-08):
  1. Identify platform CEU and corresponding standalone CEU(s)
  2. Call UnknownSpaceRecorder.record():
       condition_type = "US-CONDITION-02"
       description = "Whether <platform_CEU> contains files beyond the standalone
                       equivalents is unknown. No content comparison performed."
       affected_entities = [platform_ceu_id, standalone_ceu_ids...]
       downstream_impact = "Platform CEU file count may differ from standalone equivalent.
                            Do not treat platform as full equivalent without content comparison."
  3. Append to PSEEContext.us_records
  4. Continue (no suspension)
```

---

### US-CONDITION-03 — Inferrable Position Without Evidence

```
trigger:    Any position where information is absent but could theoretically be inferred
            (beyond overlap parity: shared dependencies, undeclared relationships, etc.)

runtime_handler (any phase):
  1. Identify the specific unknown position
  2. Call UnknownSpaceRecorder.record():
       condition_type = "US-CONDITION-03"
       description = <specific unknown position statement — must name the unknown concretely>
       affected_entities = <relevant paths, CEU IDs, or file paths>
       downstream_impact = <which downstream consumers are affected>
  3. Append to PSEEContext.us_records
  4. Continue

forbidden: Any code path that resolves a US-CONDITION-03 by applying system knowledge (FB-02)
```

---

## Part 4 — PARTIAL State (S-T3)

S-T3 is a soft advisory state, not a terminal. Outputs are produced and flagged.

```
trigger:         DP-5-02 condition = COVERAGE_LT_90
                 (computed coverage = mapped_units / total_phase_b_units × 100 < 90)

runtime_handler:
  1. Write PSEEContext.flags +=
       "PARTIAL: coverage=<N>%, unmapped_units=[<list of unmapped Phase B unit IDs>]"
  2. Set current_state = S-T3
  3. Produce all output artifacts O-01..O-07 (same as COMPLETE set)
  4. Stamp each artifact header: "PSEE_STATUS: PARTIAL — coverage=<N>%; advisory only"
  5. Identify unmapped Phase B units; include in O-04 (intake_validation_log) as flagged gaps
  6. Await operator acknowledgement

operator_acknowledgement:
  - ACKNOWLEDGED: operator accepts PARTIAL outputs → transition S-T3 → S-12
  - REJECTED: operator abandons stream → transition S-T3 → S-T1

downstream_note: PARTIAL outputs must be checked for PSEE_STATUS flag by consumers.
                 G-08 (coverage reporting) is satisfied; the partial coverage is the report.
```

---

## Part 5 — Exception Priority Example

Simultaneous condition scenario:

```
At Phase 4 (S-08):
  - DP-4-02 fires UNKNOWN parity for (CEU-01, CEU-03) → US-CONDITION-01 (Priority 3)
  - DP-4-02 fires UNKNOWN parity for (CEU-02, CEU-04) → US-CONDITION-01 (Priority 3)
  - Phase 4 handler also detects: evidence boundary was accessed without authorization
    → CANONICAL_MUTATION_ATTEMPT (Priority 1: STOP)

Resolution:
  STOP takes precedence. Both US conditions are NOT written.
  Engine halts with STOP: CANONICAL_MUTATION_ATTEMPT.
  This is a STOP-GUARD condition (engine defect; operator investigates engine, not corpus).
```

---

#### STATUS

| Check | Result |
|---|---|
| STOP-01 and STOP-02 specified | CONFIRMED |
| STOP-UNDEFINED and STOP-HEURISTIC guard conditions specified | CONFIRMED |
| ESC-01 through ESC-06 specified with runtime handlers | CONFIRMED |
| US-CONDITION-01 through US-CONDITION-03 specified | CONFIRMED |
| S-T3 (PARTIAL) runtime behavior specified | CONFIRMED |
| Priority ordering enforced | CONFIRMED |
| EscalationResolution schema defined | CONFIRMED |
| No canonical mutation | CONFIRMED |

**EXCEPTION RUNTIME SPEC: COMPLETE**
