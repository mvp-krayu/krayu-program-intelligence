# PSEE.1 — Escalation and Fallback Specification

**Stream:** PSEE.1
**Family:** PSEE
**Date:** 2026-04-05

---

#### EXECUTIVE LAYER

This document specifies the exact behavior of the PSEE decision engine when inputs are incomplete, ambiguous, or non-classifiable. It defines conditions that force STOP, ESCALATE, UNKNOWN-SPACE, and PROCEED. It also defines priority ordering when multiple conditions apply simultaneously. This is the exception-handling contract for PSEE execution.

**Value:** Undefined exception behavior is the primary failure mode for deterministic engines encountering novel inputs. Every condition not handled by this spec would require an ad hoc decision during execution — which is a governance violation. This spec eliminates that space.

---

#### METHODOLOGY LAYER

1. Enumerate all states in decision_state_model.md where the transition is not PROCEED.
2. For each non-PROCEED transition: define the exact trigger condition, the resulting state, the operator obligation, and the resumption path.
3. Define priority ordering for conflicting conditions.
4. Define logging requirements for each exception type.

---

#### TECHNICAL LAYER

---

### Part 1 — STOP Conditions

STOP is terminal for the current stream execution. No output artifacts are promoted from a STOPPED stream. The stream must be restarted with corrected inputs.

---

#### STOP-01 — Source Resolution Failure (DP-0-01 through DP-0-04)

```
trigger:       Any of:
               - Source corpus root not accessible (DP-0-01)
               - Evidence boundary document absent AND operator has not been given
                 the opportunity to create one (DP-0-02, before fallback window)
               - Phase B target artifacts not declared or not accessible (DP-0-03)
               - System identity cannot be confirmed (DP-0-04)
state:         S-T1 (STOPPED)
output:        PSEEContext.flags += "STOP: SOURCE_RESOLUTION_FAIL [DP-0-xx]"
               No stream artifacts produced.
operator action required:
               Correct the identified condition (provide corpus access, create boundary doc,
               declare Phase B target, confirm version match).
resume condition: Restart PSEE stream from S-00 with corrected inputs. Cannot resume mid-stream.
log entry:     {dp_id, condition_text, state: "S-T1", timestamp}
```

#### STOP-02 — Phase 6 Second Divergence (DP-6-01, iteration 2)

```
trigger:       Phase 6 reconstruction simulation produces DIVERGENT result for the second time
               (first divergence triggered re-entry from S-02; second divergence triggers STOP)
state:         S-T1 (STOPPED)
output:        PSEEContext.flags += "STOP: RECONSTRUCTION_DIVERGENT_UNRESOLVABLE"
               Partial artifacts written to stream namespace are flagged as INCOMPLETE.
operator action required:
               Investigate unmapped Phase B units. Refine rule catalog or operator-supplied
               boundary parameters. May require PSEE.0 rule catalog extension (new rule
               proposal; that is a separate canonical stream, not an in-execution action).
resume condition: Restart PSEE stream from S-00 after rule refinement.
log entry:     {dp_id: "DP-6-01", iteration: 2, divergent_artifacts: [...], state: "S-T1"}
```

---

### Part 2 — ESCALATE Conditions

ESCALATE suspends execution at a specific state. The stream is not terminated; it is paused pending operator input. After operator response, execution resumes from the noted state.

---

#### ESC-01 — ARCHITECTURAL_STRUCTURE Path Duplication (DP-1-04)

```
trigger:       Path duplication classified as ARCHITECTURAL_STRUCTURE (not PACKAGING_BOUNDARY)
state:         S-T2 (ESCALATED)
suspended at:  S-02 (NORMALIZING) for the affected path
operator action required:
               Confirm the architectural layering: provide documentation of why both
               paths represent distinct architectural layers (not extraction artifacts).
               Provide a declaration that both paths should be preserved as separate domains.
resume condition: Operator declaration provided → add both paths as separate EvidenceDomains
                  in Phase 3 → resume S-02 → S-03 for remaining paths
log entry:     {dp_id: "DP-1-04", path: <affected_path>, classification: "ARCHITECTURAL_STRUCTURE",
                state: "S-T2"}
note:          Other paths not affected by this duplication continue processing in parallel.
               Only the affected path is suspended.
```

#### ESC-02 — Unclassifiable Path Duplication (DP-1-05)

```
trigger:       Path duplication cannot be classified (no extraction log, no diff, no inspection result)
state:         S-T2 (ESCALATED)
suspended at:  S-02 (NORMALIZING) for the affected path
operator action required:
               Provide classification: EXTRACTION_ARTIFACT | PACKAGING_BOUNDARY | ARCHITECTURAL_STRUCTURE
               with supporting evidence (extraction log, diff result, or manual inspection note).
resume condition: Classification received → continue from DP-1-02 for the affected path
log entry:     {dp_id: "DP-1-05", path: <affected_path>, classification: "UNCLASSIFIABLE", state: "S-T2"}
```

#### ESC-03 — Exclusion List Absent (DP-2-01)

```
trigger:       Evidence boundary document present but explicitly_excluded_paths field absent
state:         S-T2 (ESCALATED)
suspended at:  S-03 (NORMALIZED), before Phase 2 filtering
operator action required:
               Provide one of:
               (a) A complete explicitly_excluded_paths list (add to boundary document)
               (b) An explicit declaration: "explicitly_excluded_paths: []" (nothing excluded)
resume condition: Operator response received → add to boundary document → continue S-03 → S-04
log entry:     {dp_id: "DP-2-01", finding: "GRAY_ZONE", state: "S-T2"}
```

#### ESC-04 — Unclaimed Path (DP-3-01)

```
trigger:       A path in primary_evidence_origin_paths is not assigned to any EvidenceDomain
state:         S-T2 (ESCALATED)
suspended at:  S-06 (GROUPING), at domain completion gate
operator action required:
               Investigate the unclaimed path. Determine whether:
               (a) It should become a new domain (operator adds to domain list)
               (b) It was incorrectly included in primary_evidence_origin_paths (operator removes)
               (c) It should be merged into an existing domain (operator provides rationale)
               Option (c) is not preferred — R-GRP-01 requires provenance separation.
resume condition: Operator decision received; path assigned or removed → S-06 → S-07
log entry:     {dp_id: "DP-3-01", path: <unclaimed_path>, state: "S-T2"}
```

#### ESC-05 — Ambiguous File Type Classification (DP-5-01)

```
trigger:       File type not in explicit_inclusions; content role assessment ambiguous
               (the file role cannot be determined from extension or filename alone)
state:         S-T2 (ESCALATED)
suspended at:  S-10 (CLASSIFYING)
operator action required:
               Provide evidence_class and evidence_subclass for the specific file(s).
               Operator must cite the content role basis for the classification.
resume condition: Operator classification provided → add to ClassificationRecord → continue S-10 → S-11
log entry:     {dp_id: "DP-5-01", file: <file_path>, finding: "AMBIGUOUS_TYPE", state: "S-T2"}
note:          Only ambiguous cases escalate. Unambiguous unlisted file types (e.g., a .yaml
               file in a monitoring/ directory is clearly "configuration") are classified
               by content role without escalation (CT-06 applies).
```

#### ESC-06 — Phase 6 First Divergence (DP-6-01, iteration 1)

```
trigger:       Phase 6 reconstruction simulation produces DIVERGENT result for the first time
state:         S-T2 (not hard STOP on first occurrence; stream re-enters from S-02)
re-entry:      S-12 → S-02 (re-enter from normalization; investigate unmapped Phase B units)
operator action:
               Identify which Phase B units were DIVERGENT. Determine whether:
               (a) A Phase A contributor was missed in Phase 1-4 (re-run from S-02 corrects)
               (b) A new rule type is needed (STOP-02 follows on iteration 2)
log entry:     {dp_id: "DP-6-01", iteration: 1, divergent_units: [...], action: "RE-ENTER_S02"}
```

---

### Part 3 — UNKNOWN-SPACE Conditions

UNKNOWN-SPACE is not a suspension or termination. It is a mandatory record production. Execution continues; the unknown position is preserved in the PSEEContext.us_records.

---

#### US-CONDITION-01 — Unresolved Overlap Parity (R-NRM-03)

```
trigger:       OVL record created with file_level_parity = UNKNOWN (DP-4-02 false-path)
action:        Create UnknownSpace record:
               us_id = US-NN (sequential)
               description = "File-level parity between <CEU-A> and <CEU-B> is unknown.
                              Structural similarity observed but no content comparison performed."
               downstream_impact = <describe which downstream consumers must treat this as unknown>
execution continues: YES — PROCEED after creating US record
cannot:        Substitute inference for the US record (FB-02)
source:        R-NRM-03; psee_v0_schema.json UnknownSpace entity
```

#### US-CONDITION-02 — Platform Content Unknown (R-NRM-03, SV-04/06 variant)

```
trigger:       Platform/integrated repository is present; overlap with standalones observed;
               whether platform contains files beyond its standalone equivalents is unknown
action:        Create UnknownSpace record:
               description = "Whether <platform_CEU> contains files beyond the standalone
                              equivalents is unknown. No content comparison performed."
execution continues: YES — PROCEED
source:        R-NRM-03; PSEE.0 transformation_mapping.md NEM-U18 (US-03 precedent)
```

#### US-CONDITION-03 — Inferrable Position Without Evidence

```
trigger:       Any position where information is absent but could theoretically be inferred
               (beyond overlap parity — e.g., whether two components share a dependency
               that is not declared in the evidence boundary)
action:        Create UnknownSpace record with the specific unknown position stated
               DO NOT infer; DO NOT synthesize resolution
execution continues: YES — PROCEED; downstream consumers receive US record
source:        R-NRM-03 (broadest interpretation); PSEE.0 psee_v0_execution_spec.md Phase 4 Step 4.3
```

---

### Part 4 — PROCEED Conditions

PROCEED is the default outcome when:
- All prerequisite checks pass (DP-0-01 through DP-0-04)
- All filter checks produce a determinate intake_status
- All domains are assigned to primary paths
- Coverage ≥ 90% (or PARTIAL flag accepted)
- Reconstruction is EQUIVALENT or PARTIAL

PROCEED does not require logging beyond standard PSEEContext state transitions.

---

### Part 5 — Priority Ordering

When multiple conditions apply simultaneously, the following priority order governs:

```
Priority 1 (highest): STOP
  → If any STOP condition is active, STOP takes precedence over all other conditions.
    STOP-01 (source resolution) overrides everything.

Priority 2: ESCALATE
  → If no STOP condition and any ESCALATION condition is active, ESCALATE.
    Multiple simultaneous escalations: log all, suspend at the earliest phase.
    Later-phase escalations are deferred until earlier-phase escalations are resolved.

Priority 3: UNKNOWN-SPACE
  → If no STOP or ESCALATE and an unresolved position exists, create US record and PROCEED.
    UNKNOWN-SPACE does not block execution.

Priority 4: PROCEED
  → Default when no higher-priority condition is active.
```

Simultaneous escalation example:
- ESC-02 (Phase 1) and ESC-05 (Phase 5) both active:
  → ESC-02 is in Phase 1; ESC-05 is in Phase 5. Resolve ESC-02 first.
  → After ESC-02 resolution and Phase 1 completion, ESC-05 becomes the active escalation.

---

### Part 6 — Logging Requirements

Every exception produces a structured log entry in PSEEContext.escalation_log:

```
{
  "dp_id":       string,      // e.g., "DP-1-05"
  "condition":   string,      // human-readable condition description
  "state":       string,      // e.g., "S-T2", "S-T1", "S-T3"
  "iteration":   integer,     // for DP-6-01 only
  "affected":    string[],    // paths or CEU IDs affected
  "action":      string,      // "STOP", "ESCALATE", "UNKNOWN-SPACE", "RE-ENTER"
  "resolution":  string|null, // null until operator provides resolution
  "resolved_at": string|null  // ISO-8601 timestamp of resolution
}
```

For PARTIAL (S-T3), the flags array records the coverage deficit:
```
"flags": ["PARTIAL: coverage=82%, unmapped_units=[IVL-U07, ECM-U09]"]
```

---

### Escalation and Fallback Summary

| Condition ID | Type | State | Resumable | Operator action |
|---|---|---|---|---|
| STOP-01 | STOP | S-T1 | NO (restart) | Correct prerequisites |
| STOP-02 | STOP | S-T1 | NO (restart after rule refinement) | Rule catalog extension |
| ESC-01 | ESCALATE | S-T2 | YES (S-03) | Confirm ARCHITECTURAL_STRUCTURE dual-path |
| ESC-02 | ESCALATE | S-T2 | YES (S-03) | Provide duplication classification |
| ESC-03 | ESCALATE | S-T2 | YES (S-04) | Provide exclusion list or empty declaration |
| ESC-04 | ESCALATE | S-T2 | YES (S-07) | Assign or remove unclaimed path |
| ESC-05 | ESCALATE | S-T2 | YES (S-11) | Provide file type classification |
| ESC-06 | ESCALATE / RE-ENTER | S-02 | YES (re-run) | Investigate divergent units |
| US-01..03 | UNKNOWN-SPACE | (continues) | N/A | None required; US record created |
| PARTIAL | SOFT-STOP | S-T3 | YES (→S-13 with flag) | Operator acknowledges gap |

---

#### EVIDENCE LAYER

| Specification element | Source |
|---|---|
| STOP-01 trigger conditions | psee_v0_execution_spec.md Phase 0 stop conditions |
| STOP-02 trigger | psee_v0_execution_spec.md Phase 6 stop condition |
| ESC-01 through ESC-04 | psee_v0_execution_spec.md Phase 1/2/3 decision points |
| ESC-05 | psee_v0_execution_spec.md Phase 5 Step 5.2; DP-5-01 (hidden decision point) |
| US-CONDITION-01..03 | R-NRM-03; psee_v0_execution_spec.md Phase 4 Step 4.3 |
| Priority ordering | Derived from PSEE.0 fail-closed principle (CLAUDE.md §3.3) |
| Logging schema | psee_v0_schema.json entity conventions; PSEEContext definition |

---

#### LIMITATIONS & BOUNDARIES

- ESC-06 (Phase 6 first divergence) re-enters at S-02, not S-06 or S-08, because the divergence may stem from a missed path (Phase 1), a mis-filtered file (Phase 2), or a mis-grouped domain (Phase 3). Re-entry from the earliest phase ensures the full pipeline is re-run with any corrections.
- The two-iteration limit for Phase 6 (STOP after second divergence) is a PSEE.1 formalization, not a PSEE.0 rule. PSEE.0 spec says "investigate and re-run" without iteration bound. PSEE.1 adds the bound to prevent indefinite loops.
- PARTIAL (S-T3) does not prevent downstream use of PSEE outputs. The operator decides admissibility; PSEE only flags the partial state.

---

#### STATUS

| Check | Result |
|---|---|
| STOP conditions defined | 2 (STOP-01, STOP-02) |
| ESCALATE conditions defined | 6 (ESC-01 through ESC-06) |
| UNKNOWN-SPACE conditions defined | 3 (US-CONDITION-01 through 03) |
| Priority ordering defined | CONFIRMED |
| Logging schema defined | CONFIRMED |
| No canonical mutation | CONFIRMED |

**ESCALATION AND FALLBACK SPEC: COMPLETE**
