# DASHBOARD SYNDROME DETECTION GUIDE

**Stream:** PI.LENS.V2.CINEMATIC-REFERENCE-MAPPING.01
**Status:** AUTHORITATIVE — operational detection workflow
**Doctrine binding:** `ANTI_DASHBOARD_ENFORCEMENT.md` (parent stream)

---

## 0. PURPOSE

`ANTI_DASHBOARD_ENFORCEMENT.md` defines the rules. This document defines the *detection workflow* — how a reviewer or Playwright run actually identifies dashboard syndrome on a LENS surface.

If the rules are the law, this document is the field test.

---

## 1. DETECTION SCOPE

Dashboard syndrome is detected on the *primary executive surface* — the surface the executive sees on landing or on returning from descent. Descent zones may legitimately exhibit higher density and more component repetition; the primary surface may not.

Detection scope:

- The first-paint executive viewport at executive-default (1440 × 900).
- The settled state after first-paint (post-animation).
- The post-hover state on the focal anchor.

A surface passes detection only if all three states are clean.

---

## 2. THE FOUR PRIMARY DETECTION TESTS

### 2.1 Five-Second Confusion Test

**Procedure:**
1. Capture the executive-default screenshot.
2. Show it to a viewer with no LENS context.
3. Ask: "What is this?"

**Pass:** Viewer describes it in operational / institutional terms ("operational intelligence surface", "executive briefing", "command surface", "investigation surface", or similar).

**Fail:** Viewer names any of: dashboard, Datadog, Grafana, Mixpanel, Amplitude, Looker, monitoring tool, analytics tool, reporting tool, productivity SaaS, Notion, Linear (as a Linear competitor).

**Operational note:** Use a fresh viewer per iteration. A viewer who has seen prior iterations cannot be used; familiarity poisons the test.

### 2.2 Grid-Gravity Test

**Procedure:**
1. Visually inspect the primary surface.
2. Identify any region containing 3+ identical-dimension containers.
3. Identify any region containing 2+ rows of 2+ identical-dimension containers.

**Pass:** Zero regular grids found.

**Fail:** Any regular grid found.

**Mechanical assist (Playwright):** the element-weight signal extractor reports any container repeated dimensions. See `PLAYWRIGHT_VISUAL_INSPECTION_FRAMEWORK.md` §4.2.

### 2.3 Metric-First Test

**Procedure:**
1. Identify the visually heaviest element on the primary surface.
2. Determine if it is typographic prose (a sentence) or a number / chart.

**Pass:** The heaviest element is a sentence (the dominant declaration).

**Fail:** The heaviest element is a number, chart, KPI tile, or sparkline.

**Mechanical assist:** the element-weight signal computes the dominant element and classifies it as `prose` / `number` / `chart`.

### 2.4 Component-Repetition Test

**Procedure:**
1. Walk the primary surface element tree.
2. Identify any sequence of 3+ visually-identical components.
3. Identify any "list of cards" structure on the primary surface.

**Pass:** Zero component repetitions of 3+ identical components.

**Fail:** Any sequence of 3+ identical components on the primary surface.

**Mechanical assist:** the grid-presence signal classifies repeated components.

---

## 3. SECONDARY DETECTION TESTS

These tests are supplementary. Failing any one is a strong signal even if the four primary tests pass.

### 3.1 Header Inspection

Inspect the top band of the primary surface. The band should contain only:

- system / program identity
- current state-of-truth
- time-of-truth
- (optional) thin descent affordance

The band MUST NOT contain:

- a search input
- a filter row
- a time-range picker
- a tab strip
- a "+ Add widget" affordance
- a "Save / Share / Export" group

### 3.2 Sidebar Inspection

The primary surface MUST NOT have a sidebar listing:

- "Dashboards"
- "Reports"
- "Metrics"
- "Workspaces"
- arbitrary navigation categories

If a left-rail is present, it must contain operational descent affordances tied to the current declaration, not a navigation taxonomy.

### 3.3 Color-Category Inspection

Inspect the simultaneously-visible saturated accent colors.

**Pass:** ≤ 2 distinct saturated hues simultaneously visible.

**Fail:** 3+ distinct saturated hues simultaneously visible (rainbow dashboard signature).

### 3.4 Footer / Action-Bar Inspection

The primary surface MUST NOT have a footer action bar containing:

- bulk-action buttons
- "Apply / Reset" filter buttons
- "Add", "New", "Create" affordances

### 3.5 Empty-State Inspection

Inspect any empty / partial / loading states.

**Pass:** Empty states are honest, calm, typographically led.

**Fail:** Empty states use generic illustrations, "no data" graphics, or skeleton placeholders that persist past first paint.

---

## 4. PLAYWRIGHT-AUTOMATED DETECTION

The mechanical pre-check stage of `PLAYWRIGHT_VISUAL_INSPECTION_FRAMEWORK.md` §4 provides automated detection for:

- element-weight ratio (focal dominance)
- regular grid presence (grid gravity)
- component repetition
- color saturation count
- motion timing band
- layout shift

These automated checks correspond directly to the detection tests in §2 and §3 above. Mechanical FAIL on any of them blocks the surface from human review.

The complete Playwright dashboard-syndrome routine:

```
1. Open executive-default viewport on primary route.
2. Wait for settled paint.
3. Run element-weight extraction.
4. Compute dominant-element ratio. Fail if < 3.0.
5. Detect regular grids. Fail if any present.
6. Classify dominant element type. Fail if not prose.
7. Detect component repetition. Fail if any sequence ≥ 3.
8. Sample saturated hue count. Fail if > 2.
9. Inspect top band element types. Flag forbidden elements.
10. Inspect sidebar element types. Flag forbidden elements.
11. Capture screenshot for human five-second test.
12. Emit detection report.
```

---

## 5. DETECTION REPORT FORMAT

```json
{
  "detection_run_id": "<timestamp>",
  "stream": "<stream-id>",
  "viewport": "executive-default",
  "route": "<lens v2 flagship>",
  "primary_tests": {
    "five_second_confusion": { "result": "PASS|FAIL", "viewer_response": "..." },
    "grid_gravity":          { "result": "PASS|FAIL", "regular_grids_found": 0 },
    "metric_first":          { "result": "PASS|FAIL", "dominant_type": "prose|number|chart" },
    "component_repetition":  { "result": "PASS|FAIL", "max_sequence": 0 }
  },
  "secondary_tests": {
    "header_inspection":     { "result": "PASS|FAIL", "forbidden_elements": [] },
    "sidebar_inspection":    { "result": "PASS|FAIL", "forbidden_elements": [] },
    "color_category":        { "result": "PASS|FAIL", "hue_count": 0 },
    "footer_action_bar":     { "result": "PASS|FAIL", "forbidden_elements": [] },
    "empty_state":           { "result": "PASS|FAIL", "issues": [] }
  },
  "verdict": "PASS|FAIL",
  "iteration_recommendations": ["..."]
}
```

A single FAIL on any primary test produces verdict FAIL. A single FAIL on any secondary test produces verdict FAIL.

---

## 6. RECOVERY GUIDANCE BY FAILURE

| Failure                          | Recovery direction                                                                |
|----------------------------------|-----------------------------------------------------------------------------------|
| Five-second confusion → SaaS     | Reduce chrome; strengthen declaration weight; remove KPI tiles.                  |
| Grid gravity                     | Break the grid: enlarge one element to 3x+ adjacent; remove or restructure rows. |
| Metric first                     | Lead with a sentence. Demote the number to supporting role under the sentence.   |
| Component repetition             | Replace the repeated set with a single composed scene; move repetition to descent.|
| Header forbidden elements        | Strip search, filter, time picker; reduce header to identity / state / time.     |
| Sidebar forbidden                | Remove sidebar from primary surface; move navigation off-surface or to descent.  |
| Color category                   | Reduce simultaneous saturated hues; restrict accent to state communication.       |
| Footer action bar                | Remove from primary surface; expose actions only inside descent.                  |
| Empty state regression           | Replace illustrations / skeletons with honest typographic empty-state language.   |

Each recovery is subtractive in the dominant case. Adding to fix a dashboard problem usually deepens it.

---

## 7. CADENCE

Detection should run:

- **Pre-merge** for any LENS visual contract (mandatory).
- **Mid-iteration** at least once per design pass.
- **Post-regression** if any upstream change touches LENS routes, typography, color tokens, motion config.
- **Periodic audit** monthly for live LENS surfaces.

A surface that has not been detection-checked in 30 days is presumed degraded until re-checked.

---

## 8. CALIBRATION DRIFT

Detection thresholds (3.0x dominant ratio, 2 simultaneous accents, etc.) are calibrated for current LENS doctrine. They MUST NOT be loosened without explicit governance amendment to the doctrine.

If a redesign cannot meet the thresholds, the response is to redesign — not to relax the threshold.

---

## 9. RELATIONSHIP TO REVIEW

Dashboard syndrome detection is a *floor*. It says: "this surface is not a dashboard." It does not say: "this surface is a great LENS."

To say "this surface is a great LENS," the full rubric in `VISUAL_EVALUATION_RUBRIC.md` must run. Detection is necessary; it is not sufficient.

---

**End of detection guide.**
