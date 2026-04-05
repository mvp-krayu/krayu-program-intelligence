# PSEE-GAUGE.0 — Review Surface Linkage

**Stream:** PSEE-GAUGE.0
**Family:** PSEE
**Date:** 2026-04-05
**Authority:** PSEE.X/non_canonical_boundary.md; PSEE.X/unknown_space_inventory.md;
               PSEE.X/pattern_containment_matrix.md; PSEE.X/future_review_queue.md

---

## Purpose

This document defines the linkage between the PSEE gauge surface and the PSEE.X review layer. The gauge exposes drill-down links to PSEE.X documents for operator reference and context. These links are review-only: PSEE.X documents are NON-CANONICAL and their content does not alter the gauge score, dimensions, or confidence band.

**Authority boundary:** PSEE.X/non_canonical_boundary.md §Summary: "0 rules introduced, 0 existing rules modified, 0 new decision points introduced." PSEE.X content remains non-canonical.

---

## Review Surface Architecture

```
Gauge Surface (canonical)
  │
  ├── DIM-04 (Unknown-Space counter)  ──► Review Link: unknown_space_inventory.md
  │
  ├── DIM-03 (Escalation Clearance)   ──► Review Link: unknown_space_inventory.md §Section 2 (ESP entries)
  │
  ├── Gauge "Open Review Items" panel ──► Review Link: future_review_queue.md
  │
  └── Pattern Review panel (READ-ONLY)──► Review Link: pattern_containment_matrix.md
```

Each review link is one-directional: gauge → PSEE.X. No information flows from PSEE.X back to the gauge score or canonical state.

---

## Review Link Definitions

---

### RL-01 — Unknown-Space Inventory Link

**Trigger:** DIM-04 (Unknown-Space) displays any US record (us_total_count > 0)

**Target document:** `docs/pios/PSEE.X/unknown_space_inventory.md`

**Sections exposed:**
- §Section 1 (USP-01..03): the canonical US-CONDITION types that match the engine's us_records
- §Section 3 (BHP-01..04): blocked heuristics (for operator context on what PSEE cannot resolve automatically)
- §Section 4 (FB-01..07): forbidden patterns (operator reference)

**Purpose:** Allows the operator to understand the structural significance of each US record type — specifically the `open_question` and `resolution_path` fields in each USP entry.

**Non-authority enforcement:**
- The operator may read USP resolution paths as guidance for gathering evidence
- No USP entry constitutes a rule or a resolution action
- The gauge does not apply any USP content to modify US record counts or the confidence band
- The `open_question` fields in USP entries are exploration notes, NOT operator obligations

---

### RL-02 — Escalated Position Link

**Trigger:** DIM-03 (Escalation Clearance) shows any open escalation (escalation_clearance_value < 100)

**Target document:** `docs/pios/PSEE.X/unknown_space_inventory.md` §Section 2 (ESP-01..04)

**Sections exposed:**
- ESP-01 (ARCHITECTURAL_STRUCTURE duplication) — background for ESC-01 escalations
- ESP-02 (Exclusion list absent) — background for ESC-03 escalations
- ESP-03 (Ambiguous file type) — background for ESC-05 escalations
- ESP-04 (Reconstruction divergence) — background for ESC-06/STOP-02 conditions

**Purpose:** Allows the operator to understand the exploration context for difficult escalation classes. The `open_question` fields in ESP entries describe what makes certain escalations hard to resolve and what signals might help.

**Non-authority enforcement:**
- ESP entries do not modify the escalation resolution requirements from PSEE-OPS.0/escalation_interface_spec.md
- Valid resolutions for each escalation are defined in PSEE-OPS.0/escalation_interface_spec.md §Per-Escalation Notification Templates — those are the governing definitions
- ESP `open_question` fields do not add resolution options or bypass operator obligations

---

### RL-03 — Pattern Containment Matrix Link

**Trigger:** Gauge "Open Review Items" panel (always visible when PSEE.X is non-empty)

**Target document:** `docs/pios/PSEE.X/pattern_containment_matrix.md`

**Sections exposed:** All 9 CP entries (CP-01..CP-09) with their containment class and enforcement constraints

**Purpose:** Provides the operator with context on candidate patterns that are under consideration for future governed admission. This is background reading — it does not affect any gauge state.

**Non-authority enforcement:**
- No CP entry is applied to the gauge score, dimensions, or confidence band
- FUTURE_REVIEW entries (CP-01, CP-02, CP-04, CP-06, CP-07, CP-08) are not active rules
- REFERENCE_ONLY entries (CP-03, CP-05, CP-09) are operator guidance only
- The gauge explicitly labels this panel: "REVIEW ONLY — NOT CANONICAL"
- Per PSEE.2/implementation_architecture.md §G8: CP-xx IDs are excluded from all engine decision paths

---

### RL-04 — Future Review Queue Link

**Trigger:** Gauge "Open Review Items" panel

**Target document:** `docs/pios/PSEE.X/future_review_queue.md`

**Sections exposed:** FRQ-01..FRQ-06 with admission questions and risk factors

**Purpose:** Provides operators and program owners with visibility into what governance streams are recommended for improving PSEE's automated resolution capabilities.

**Non-authority enforcement:**
- FRQ entries describe future streams, not current rules
- Priority levels (HIGH/MEDIUM/LOW in FRQ) are queue metadata, not score weights
- The gauge does not act on FRQ entries in any computation
- The label: "FUTURE REVIEW QUEUE — NO CURRENT AUTHORITY"

---

## Non-Canonical Boundary Enforcement (Gauge Rule F.3)

The following rules apply to all PSEE.X review links:

| Rule | Specification |
|---|---|
| **NCB-01** No CP authority | No CP-xx pattern ID may appear in gauge score computation, dimension formula, or confidence band formula |
| **NCB-02** No FUTURE_REVIEW application | FUTURE_REVIEW patterns are not applied anywhere in the gauge; they are display-only |
| **NCB-03** No REFERENCE_ONLY authority | REFERENCE_ONLY patterns may appear in operator guidance text; they do not affect any gauge computation |
| **NCB-04** Non-canonical label mandatory | Every PSEE.X content block displayed to the operator carries: "NON-CANONICAL — review context only" |
| **NCB-05** No drill-up authority | Information from PSEE.X documents does not flow back to modify canonical gauge state |

**Source:** PSEE.X/non_canonical_boundary.md §Section 4 (Pattern Language Integrity Check) and §Section 5 (Non-Canonical Markers Audit).

---

## Review Counter Definition

The gauge surface displays a "Review Items" counter composed of:

```
review_counter = {
  us_records:            len(PSEEContext.us_records),           // from DIM-04
  open_escalations:      count of open escalation_log entries,  // from DIM-03
  future_review_queue:   6,                                      // constant: FRQ-01..06 from PSEE.X
  reference_patterns:    3                                       // constant: CP-03, CP-05, CP-09
}
```

The `future_review_queue` and `reference_patterns` counts are static — they reflect the current PSEE.X state (6 FRQ entries, 3 REFERENCE_ONLY patterns) and are updated only when a new PSEE.X stream produces a new canonical boundary document.

---

## PSEE.X Non-Canonical Boundary — Summary Reference

The gauge imports the following confirmed facts from PSEE.X/non_canonical_boundary.md:

| Fact | Value |
|---|---|
| New canonical rules introduced by PSEE.X | 0 |
| Existing rules modified by PSEE.X | 0 |
| New decision points introduced | 0 |
| New state transitions introduced | 0 |
| New schema fields added to psee_v0_schema.json | 0 |
| Writes to PSEE.0/F1/1 scope | 0 |

These facts confirm the gauge can safely link to PSEE.X documents without inadvertently importing canonical authority.

---

#### STATUS

| Check | Result |
|---|---|
| RL-01 (Unknown-Space Inventory Link) defined | CONFIRMED |
| RL-02 (Escalated Position Link) defined | CONFIRMED |
| RL-03 (Pattern Containment Matrix Link) defined | CONFIRMED |
| RL-04 (Future Review Queue Link) defined | CONFIRMED |
| Non-canonical boundary enforcement rules defined | CONFIRMED |
| Review counter defined | CONFIRMED |
| PSEE.X non-authority boundary held | CONFIRMED |
| No canonical mutation | CONFIRMED |

**REVIEW SURFACE LINKAGE: COMPLETE**
