# PSEE-GAUGE.0 — Operator Visibility Contract

**Stream:** PSEE-GAUGE.0
**Family:** PSEE
**Date:** 2026-04-05
**Authority:** PSEE-OPS.0/operator_input_contract.md; PSEE-OPS.0/escalation_interface_spec.md;
               PSEE-OPS.0/unknown_space_interface.md; PSEE-OPS.0/logging_exposure_model.md;
               PSEE-OPS.0/replay_contract.md

---

## Purpose

This document defines exactly what the operator sees and does not see on the PSEE gauge surface. It aligns directly with the PSEE-OPS.0 operator authority boundary and the PSEE.2 engine black-box enforcement. Operators interact with the gauge as a read-only surface with one writable channel: the escalation resolution input.

---

## Operator Visibility Map

### V-01 — VISIBLE: Primary Score

**What:** The canonical gauge score (0–100 integer)

**Source:** `gauge_score_model.md §G.3` applied to `PSEEContext` fields

**Operator can:** View score; understand band (READY/CONDITIONAL/BLOCKED)

**Operator cannot:** Modify the score; inject score overrides; claim a higher score without execution evidence

**Authority alignment:** PSEE-OPS.0/operator_input_contract.md §Operator Authority Boundary ("Operators CANNOT: specify condition_value for a DP, override intake_status, set file_level_parity")

---

### V-02 — VISIBLE: Score Band

**What:** READY / CONDITIONAL / BLOCKED label (from `gauge_score_model.md §G.4`)

**Source:** Derived from canonical_score via band thresholds (80–100/40–79/0–39)

**Operator can:** View band; understand the execution health category

**Operator cannot:** Override band; reclassify band without changing execution state

---

### V-03 — VISIBLE: Projected Score

**What:** The projected score (from `projection_logic_spec.md`) with mandatory caveat label

**Source:** Computed from current execution state; projection rule (PR-01..PR-04) is labeled

**Operator can:** View projected score; read caveat label; understand what actions would improve the score

**Operator cannot:** Accept the projected score as current truth; use projected score to override canonical score

---

### V-04 — VISIBLE: Dimension Bars

**What:** DIM-01 (Coverage), DIM-02 (Reconstruction), DIM-03 (Escalation Clearance) — each as a 0–100 bar

**Source:** `dimension_projection_model.md §DIM-01, DIM-02, DIM-03`

**Operator can:** View dimension values; compare to thresholds (90% coverage line on DIM-01)

**Operator cannot:** Set dimension values directly; bypass dimension computation

---

### V-05 — VISIBLE: Unknown-Space Counter (DIM-04)

**What:** Total US record count plus breakdown by type (US-CONDITION-01/02/03)

**Source:** `dimension_projection_model.md §DIM-04`

**Operator can:** View US counter; drill down to `unknown_space_inventory.md` (RL-01) for context

**Operator cannot:** Resolve US records via the gauge; dismiss US records; mark any record as known

**Authority alignment:** PSEE-OPS.0/unknown_space_interface.md §Non-Resolution Guarantee ("Submit a resolution value for a US record → REJECTED")

---

### V-06 — VISIBLE: Intake Completeness and Heuristic Compliance (DIM-05, DIM-06)

**What:** Binary indicators — COMPLETE/PENDING for intake; PASS/FAIL for heuristic compliance

**Source:** `dimension_projection_model.md §DIM-05, DIM-06`

**Operator can:** View status; investigate FAIL states in execution log

**Operator cannot:** Override compliance state; clear a FAIL indicator without correcting the underlying engine condition

---

### V-07 — VISIBLE: Pending Adjudications

**What:** List of open escalation entries requiring operator response

**Source:** `PSEEContext.escalation_log` entries with `resolution = null`; formatted as `EscalationNotification` objects (PSEE-OPS.0/escalation_interface_spec.md §Escalation Notification Schema)

**Displayed fields per pending adjudication:**
```
- escalation_id
- dp_id
- escalation_class (ESC-01..06)
- condition (human-readable description)
- suspended_state
- resume_state
- affected entities
- valid_resolutions
- resolution_guidance
```

**Operator can:** View all pending adjudications; submit an `EscalationResolution` via the escalation channel

**Operator cannot:** Skip escalation validation; provide a resolution not in `valid_resolutions`; resolve an escalation by declaring it irrelevant without a valid resolution value

---

### V-08 — VISIBLE: Read-Only Logs

**What:** State transition log, escalation log, flag register, execution manifest path

**Source:** `PSEERunHandle.logs` surface (PSEE-OPS.0/logging_exposure_model.md §Exposure Format)

**Displayed via:** LogSurface fields:
- `transitions`: full state transition log (verbatim, all entries including AUTO)
- `escalations`: full escalation log including resolved entries
- `flags`: compact status token list
- `manifest_path`: path to execution_manifest.json

**Operator can:** Read all log entries; trace any output record back to its decision path via `psee_log_ref` fields

**Operator cannot:** Filter, modify, delete, or suppress any log entry; the exposure layer is read-only (PSEE-OPS.0/logging_exposure_model.md §No Filtering, No Interpretation)

---

### V-09 — VISIBLE: Review Links (PSEE.X non-canonical surface)

**What:** Links to PSEE.X review documents with non-canonical labels

**Source:** `review_surface_linkage.md §Review Link Definitions`

**Displayed:** RL-01 (unknown_space_inventory.md), RL-02 (ESP entries), RL-03 (pattern_containment_matrix.md), RL-04 (future_review_queue.md)

**Label on all PSEE.X content:** "NON-CANONICAL — review context only"

**Operator can:** Read PSEE.X documents for context; use USP/ESP entries as background when formulating escalation resolutions

**Operator cannot:** Apply PSEE.X candidate patterns as resolutions; request the gauge to score PSEE.X patterns as active logic

---

### V-10 — VISIBLE: Portfolio / Repository Table

**What:** Per-corpus/per-repo execution summary table (when multiple PSEE runs are available)

**Source:** Multiple `PSEEContext` records (one per run); gauge renders them as a table

**Columns:**
```
- run_id
- system_name (from system_identity)
- final_state
- canonical_score
- band
- coverage_percent
- us_record_count
- open_escalations
- timestamp (informational; not a decision input)
```

**Operator can:** Compare runs; identify which corpora have BLOCKED or CONDITIONAL scores; prioritize operator actions

**Operator cannot:** Aggregate scores heuristically; rank corpora by anything other than the displayed canonical score

**No BlueEdge lock-in (Gauge Rule F.7):** The portfolio table does not contain any BlueEdge-specific column or default value. System names, run IDs, and coverage percentages are sourced from operator-supplied inputs (PSEE-OPS.0/operator_input_contract.md §system_identity).

---

## What the Operator Does NOT See

| Hidden element | Why hidden |
|---|---|
| TransitionRegistry entries | Engine internals; not exposed to InvocationLayer (PSEE-OPS.0/execution_invocation_spec.md §Engine Black-Box) |
| DPHandlerRegistry implementations | Engine internals; not operator-visible |
| HeuristicGuard internal state | Engine guard; not an operator surface |
| PSEEStateMachine.current_state mutation history | Engine internal; state_transition_log is the external record |
| CP-xx candidate pattern IDs in active decision paths | Excluded at engine level (PSEE.2/heuristic_guard_spec.md §PSEE.X Candidate Pattern Exclusion) |
| US record resolution field | Permanently null; no resolution mechanism exposed (PSEE-OPS.0/unknown_space_interface.md) |
| Internal phase handler logic | Not an operator surface |

---

## Operator Write Access Summary

The operator's only write channel to the PSEE system through the gauge surface is:

```
EscalationResolution {
  run_id:            string     // must match active run
  escalation_id:     string     // must match open escalation
  dp_id:             string     // must match escalation's dp_id
  affected:          [string]   // must match escalation's affected list
  resolution:        string     // must be in valid_resolutions
  resolution_basis:  string     // REQUIRED; non-empty
  resolved_at:       ISO-8601
}
```

This is defined in PSEE-OPS.0/escalation_interface_spec.md §EscalationResolution Schema and enforced per §Response Validation rules. The gauge surface enforces this schema exactly — no additional fields are accepted, no fields are optional.

---

## Alignment with PSEE-OPS.0 Operator Authority Boundary

| PSEE-OPS.0 restriction | Gauge enforcement |
|---|---|
| Cannot specify condition_value for a DP | Gauge provides no DP condition input field |
| Cannot override intake_status | Gauge displays filter_table read-only; no edit field |
| Cannot set file_level_parity on OVL | US records displayed read-only; no parity edit field |
| Cannot resolve US records | US counter is read-only; resolution field permanently null |
| Cannot modify TransitionRegistry | Engine internals not exposed on gauge surface |

---

#### STATUS

| Check | Result |
|---|---|
| V-01..V-10 operator visibility items defined | CONFIRMED |
| Operator write access limited to EscalationResolution only | CONFIRMED |
| Hidden elements enumerated | CONFIRMED |
| PSEE-OPS.0 authority boundary alignment confirmed | CONFIRMED |
| No PSEE.X canonical authority leak | CONFIRMED |
| No BlueEdge-specific defaults | CONFIRMED |
| No canonical mutation | CONFIRMED |

**OPERATOR VISIBILITY CONTRACT: COMPLETE**
