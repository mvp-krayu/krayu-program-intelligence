# PSEE-GAUGE.0 — Gauge Rendering Contract

**Stream:** PSEE-GAUGE.0
**Family:** PSEE
**Date:** 2026-04-05
**Authority:** operator_visibility_contract.md; gauge_score_model.md;
               dimension_projection_model.md; review_surface_linkage.md

---

## Purpose

This document defines the layout structure of the PSEE gauge for later UI implementation. It specifies what elements exist, their arrangement, and their data bindings. It does NOT specify styling, colors, themes, fonts, or frontend code.

---

## Layout Structure

The gauge surface is organized into four panels: PRIMARY, DIMENSIONS, REVIEW, and PORTFOLIO.

```
┌────────────────────────────────────────────────────────────┐
│  PANEL-01: PRIMARY SCORE                                   │
├────────────────────────────────────────────────────────────┤
│  PANEL-02: DIMENSIONS                                      │
├────────────────────────────────────────────────────────────┤
│  PANEL-03: REVIEW SURFACE                                  │
├────────────────────────────────────────────────────────────┤
│  PANEL-04: PORTFOLIO / REPOSITORY TABLE                    │
└────────────────────────────────────────────────────────────┘
```

---

## PANEL-01 — Primary Score

**Purpose:** Top-level execution health summary for this PSEE run.

**Elements:**

```
PANEL-01 {
  run_id:             string          // from PSEERunHandle.run_id
  system_name:        string          // from system_identity.system_name
  system_version:     string          // from system_identity.version

  score_display {
    canonical_score:  integer         // 0–100; from gauge_score_model.md
    band_label:       string          // "READY" | "CONDITIONAL" | "BLOCKED"
    projected_score:  integer         // from projection_logic_spec.md
    projection_caveat: string         // mandatory; from projection_logic_spec.md §PRH-06
  }

  confidence_band {
    lower:            integer         // from confidence_and_variance_model.md
    upper:            integer         // from confidence_and_variance_model.md
    variance_factors: [string]        // active CRF IDs (e.g., "CRF-01: 3 US records")
  }

  state_indicator {
    current_state:    string          // PSEEContext.current_state value
    state_label:      string          // human label (e.g., "COMPLETE", "ESCALATED", "STOPPED")
    execution_mode:   string          // "FULL" | "RESUME" | "REPLAY"
  }
}
```

**Data bindings:**
- `canonical_score` ← `gauge_score_model.md §G.3` applied to current PSEEContext
- `band_label` ← `gauge_score_model.md §G.4`
- `projected_score` ← `projection_logic_spec.md §Projection Output Schema`
- `confidence_band` ← `confidence_and_variance_model.md §Total Variance Computation`

**Structural rule:** If `current_state` is in-flight (S-00 through S-12 with engine active), PANEL-01 displays "EXECUTION IN PROGRESS" and suppresses the score display until flush events produce a terminal or suspension state.

---

## PANEL-02 — Dimensions

**Purpose:** Per-dimension breakdown of execution quality indicators.

**Sub-panels:**

```
PANEL-02A: Bar Dimensions (DIM-01, DIM-02, DIM-03)
  Each bar:
    dim_id:           string          // "DIM-01" | "DIM-02" | "DIM-03"
    label:            string          // "Coverage" | "Reconstruction" | "Escalation Clearance"
    value:            integer         // 0–100 projected value
    state_label:      string          // from dimension_projection_model.md state labels
    threshold_line:   integer|null    // e.g., 90 for DIM-01 (DP-5-02 gate); null for DIM-02/03
    source_field:     string          // PSEEContext field name (for traceability display)

PANEL-02B: Counter Dimensions (DIM-04)
  dim_id:             "DIM-04"
  label:              "Unknown-Space"
  total_count:        integer         // len(PSEEContext.us_records)
  breakdown: {
    US-CONDITION-01:  integer
    US-CONDITION-02:  integer
    US-CONDITION-03:  integer
  }
  drill_down_link:    "RL-01"         // from review_surface_linkage.md

PANEL-02C: Binary Dimensions (DIM-05, DIM-06)
  [DIM-05] {
    label:            "Intake Completeness"
    state:            "COMPLETE" | "PENDING" | "INCOMPLETE"
    source_field:     "PSEEContext.filter_table"
  }
  [DIM-06] {
    label:            "Heuristic Compliance"
    state:            "PASS" | "FAIL"
    source_field:     "PSEEContext.flags (STOP: BLOCKED_HEURISTIC pattern)"
    note_if_fail:     "Engine implementation defect — see flags"
  }
```

**Data bindings:** All dimension values from `dimension_projection_model.md §Dimension Summary Table`.

---

## PANEL-03 — Review Surface

**Purpose:** Pending adjudications and non-canonical review links.

**Sub-panels:**

```
PANEL-03A: Pending Adjudications
  title:              "Pending Adjudications"
  count:              integer         // count of open escalation_log entries with resolution = null

  for each open escalation:
    escalation_id:    string
    escalation_class: string          // "ESC-01" ... "ESC-06"
    dp_id:            string
    condition:        string
    affected:         [string]
    valid_resolutions:[string]        // from escalation_interface_spec.md
    resolution_guidance: string
    resume_state:     string
    resolution_input: FORM_FIELD      // EscalationResolution input (only writable field on gauge)

PANEL-03B: Review Items (PSEE.X non-canonical — read-only)
  title:              "Open Review Items"
  non_canonical_label: "NON-CANONICAL — review context only"

  review_counter {
    us_records:         integer       // from DIM-04 total_count
    open_escalations:   integer       // from PANEL-03A count
    future_review_queue: 6            // constant; FRQ-01..06 from PSEE.X
    reference_patterns:  3            // constant; CP-03, CP-05, CP-09
  }

  links: [
    { id: "RL-01", label: "Unknown-Space Inventory", target: "PSEE.X/unknown_space_inventory.md" }
    { id: "RL-02", label: "Escalated Positions",     target: "PSEE.X/unknown_space_inventory.md#section-2" }
    { id: "RL-03", label: "Pattern Containment",     target: "PSEE.X/pattern_containment_matrix.md" }
    { id: "RL-04", label: "Future Review Queue",     target: "PSEE.X/future_review_queue.md" }
  ]
```

**Structural rules:**
- PANEL-03A is the ONLY interactive panel. All other panels are display-only.
- If no open escalations exist, PANEL-03A displays "No pending adjudications."
- PANEL-03B links open in a read-only view. PSEE.X content is always labeled "NON-CANONICAL."

---

## PANEL-04 — Portfolio / Repository Table

**Purpose:** Multi-run summary table for comparing PSEE executions across systems or time.

**Columns:**

```
PANEL-04 {
  table: [
    {
      run_id:          string          // PSEERunHandle.run_id
      system_name:     string          // system_identity.system_name
      system_version:  string          // system_identity.version
      final_state:     string          // PSEEContext.current_state
      canonical_score: integer         // from gauge_score_model.md
      band:            string          // "READY" | "CONDITIONAL" | "BLOCKED"
      coverage_percent: float|null     // PSEEContext.coverage_percent
      us_record_count: integer         // len(PSEEContext.us_records)
      open_escalations:integer         // count of open escalation_log entries
      execution_timestamp: ISO-8601    // informational; not a sort key for decision purposes
    }
  ]

  sort_options:
    - canonical_score (ascending or descending)
    - band (BLOCKED first | READY first)
    - (no default sort — operator chooses; no heuristic priority ordering)
}
```

**Structural rules:**
- Table rows are sourced from persisted PSEEContext records. One row per run.
- No aggregation or summarization of scores across rows (no "portfolio average score" — that would be interpretation)
- No BlueEdge-specific columns; no default column values
- timestamp is displayed informational only; it does not gate any decision

---

## Layout Hierarchy Summary

```
GaugeRoot {
  PANEL-01: PrimaryScore
    ├── score_display (canonical, projected, band, caveat)
    ├── confidence_band (lower, upper, variance_factors)
    └── state_indicator (current_state, execution_mode)

  PANEL-02: Dimensions
    ├── PANEL-02A: bar dimensions (DIM-01, DIM-02, DIM-03)
    ├── PANEL-02B: counter dimensions (DIM-04)
    └── PANEL-02C: binary dimensions (DIM-05, DIM-06)

  PANEL-03: ReviewSurface
    ├── PANEL-03A: pending adjudications (with EscalationResolution form)
    └── PANEL-03B: review items (PSEE.X links, non-canonical label)

  PANEL-04: PortfolioTable
    └── multi-run comparison rows
}
```

---

## Rendering Constraints

| Constraint | Specification |
|---|---|
| No empty panels | PANEL-03A displays "No pending adjudications" when empty; PANEL-04 displays "No runs available" when empty |
| No silent fallback | If a field cannot be sourced (e.g., coverage_percent = null before Phase 5), display "PENDING" — never a default value |
| No synthetic data | No gauge panel may display placeholder scores, synthetic dimensions, or example data in a production render |
| No duplicate evidence | Each PSEEContext record appears exactly once in PANEL-04 |
| Invalid states must be explicit | GAUGE_ANOMALY states (e.g., intake_value < 100 after S-05) must be displayed as alerts, not silently coerced |
| Projected score labeled | projected_score is never displayed without its projection_caveat text |
| PSEE.X content labeled | All content from PSEE.X documents carries the "NON-CANONICAL" label at render time |

**Note:** The "no empty panels" and "no silent fallback" rules derive from PSEE.2 GOV.1 PASS criteria that apply to the runtime layer (CLAUDE.md §13 UI/DEMO RULES). The gauge surface is a specification-only output; the rendering implementation must enforce these rules.

---

#### STATUS

| Check | Result |
|---|---|
| PANEL-01 (Primary Score) structure defined | CONFIRMED |
| PANEL-02 (Dimensions) structure defined | CONFIRMED |
| PANEL-03 (Review Surface) structure defined | CONFIRMED |
| PANEL-04 (Portfolio Table) structure defined | CONFIRMED |
| All data bindings traced to source documents | CONFIRMED |
| No styling or frontend code included | CONFIRMED |
| Rendering constraints defined | CONFIRMED |
| No canonical mutation | CONFIRMED |

**GAUGE RENDERING CONTRACT: COMPLETE**
