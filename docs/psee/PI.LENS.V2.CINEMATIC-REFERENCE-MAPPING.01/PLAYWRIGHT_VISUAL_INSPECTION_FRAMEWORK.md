# PLAYWRIGHT VISUAL INSPECTION FRAMEWORK

**Stream:** PI.LENS.V2.CINEMATIC-REFERENCE-MAPPING.01
**Status:** AUTHORITATIVE — operational framework for all future LENS visual contracts
**Doctrine binding:** `VISUAL_DIRECTION_DOCTRINE.md` §12, `VISUAL_EVALUATION_RUBRIC.md` §9, §10

---

## 0. PURPOSE

This document defines the canonical Playwright-driven inspection workflow for LENS visual work.

Playwright is the *visual verification layer* for all future LENS cinematic refinement contracts. Before any LENS visual change is merged, the change MUST pass through this workflow.

Playwright does not replace human review. Playwright *prepares* the surface for human review by extracting mechanical signals and capturing the surface in canonical states.

---

## 1. WORKFLOW OVERVIEW

The canonical workflow is:

```
runtime up → playwright open → screenshot → mechanical signals → human read → rubric → iterate
```

Each step is required. None is skippable.

Specifically:

1. Bring up the local LENS runtime in production-equivalent mode.
2. Open the LENS flagship route via Playwright.
3. Capture screenshots at the canonical viewports.
4. Extract mechanical inspection signals (element weights, color usage, motion timings, grid presence).
5. Conduct the human visual read against `VISUAL_EVALUATION_RUBRIC.md`.
6. Identify failures by axis.
7. Refine.
8. Re-run the workflow until rubric PASS.

---

## 2. CANONICAL VIEWPORTS

Inspection must capture all of:

| Name              | Width × height | Use                                              |
|-------------------|----------------|--------------------------------------------------|
| executive-default | 1440 × 900     | Primary executive read (laptop / boardroom).     |
| executive-wide    | 1920 × 1080    | Executive workstation.                           |
| executive-tall    | 1440 × 1200    | Vertical descent inspection.                     |
| executive-board   | 2560 × 1440    | Board-room projection / large display.           |

A surface that passes only at one viewport is non-compliant. The doctrine targets executive use across all four.

---

## 3. CANONICAL ROUTE TARGETS

Inspection must capture:

| Target                        | Purpose                                                 |
|-------------------------------|---------------------------------------------------------|
| LENS V2 flagship landing      | Primary executive surface, the doctrine target.         |
| Declaration-loading state     | First-paint behavior — declaration must lead.           |
| Pressure / propagation state  | High-consequence read — calm under consequence test.    |
| Empty / partial state         | Honest empty-state behavior.                            |
| Descent overlay               | Descent affordance and continuity test.                 |

The exact route paths are determined per implementation but each state must be inspectable.

---

## 4. MECHANICAL INSPECTION SIGNALS

The Playwright pass extracts the following signals automatically. Each is a *pre-check* that feeds the human rubric pass.

### 4.1 Element-weight signals

For each visible element on the primary surface:

- bounding-box dimensions
- typographic mass (size × character count)
- color saturation
- contrast against ground

Computed: ratio of dominant element weight to second-heaviest element. **Must be ≥ 3.0.** Lower values flag focal-dominance failure.

### 4.2 Grid-presence signals

Detect repeated equal-width or equal-height containers on the primary surface.

Computed:
- number of consecutive equal-dimension elements
- presence of regular grid (3+ identical containers in a row or column)

**Must be 0 regular grids on the primary surface.** Any regular grid flags anti-dashboard violation.

### 4.3 Color signals

Sample N pixels across the primary surface.

Computed:
- distinct saturated hues simultaneously visible
- accent color count
- saturation distribution

**Must be ≤ 2 simultaneously visible saturated accent hues.** Higher counts flag color-doctrine violation.

### 4.4 Motion signals

Drive a hover transition on a focal element. Drive a descent transition.

Computed:
- transition duration
- easing curve approximation
- presence of bounce / overshoot

**Must be:**
- duration in 240–900 ms band
- easing convex / friction-heavy
- no overshoot

Out-of-band durations or overshoot flag motion-doctrine violation.

### 4.5 Layout-shift signals

Capture CLS over the first 3 seconds of paint.

**Must be 0** — no layout shift after first paint.

### 4.6 First-paint signal

Capture time-to-declaration: the moment the dominant declaration is visually present.

**Must be < 1.2 s** on production-equivalent runtime.

---

## 5. SCREENSHOT DISCIPLINE

For each (viewport × route target) pair, capture:

1. A first-paint screenshot.
2. A settled screenshot (post-animation).
3. A hover-state screenshot on the focal anchor.
4. A descent-state screenshot.

Save to a structured path:

```
docs/psee/<stream-id>/inspection_runs/<timestamp>/<viewport>/<target>/<state>.png
```

This produces a reproducible visual archive per inspection run.

---

## 6. FAILURE CLASSIFICATION

Mechanical signals classify failures into named categories. Each category maps to the rubric axis it fails:

| Signal failure                       | Rubric axis triggered |
|--------------------------------------|------------------------|
| Element-weight ratio < 3.0           | A — Focal Strength     |
| First-paint > 1.2s, declaration trails | B — Executive Readability |
| Saturated hue count > 2              | C — Operational Atmosphere |
| Regular grid present                 | E — Anti-Dashboard     |
| Component repetition > 2 in row      | E — Anti-Dashboard     |
| Bouncy / overshoot motion            | D — Cinematic Depth    |
| Out-of-band motion duration          | D — Cinematic Depth    |
| Layout shift > 0                     | F — Executive Immersion|

Mechanical FAIL on any signal blocks the surface from human review until corrected.

---

## 7. HUMAN READ PROCEDURE

After mechanical signals pass:

1. The reviewer opens the surface via Playwright (live, not just screenshots) at executive-default viewport.
2. The reviewer performs the rubric procedure in `VISUAL_EVALUATION_RUBRIC.md` axes A–F.
3. The reviewer logs results in the rubric JSON format.
4. If any axis fails, the reviewer flags the failure category and the contract iterates.

The mechanical pass is necessary but not sufficient. A surface that passes mechanically can still fail the human read on register, narrative, or atmosphere.

---

## 8. INSPECTION RUN OUTPUT

A complete Playwright inspection run produces:

```
docs/psee/<stream-id>/inspection_runs/<timestamp>/
  manifest.json                # run config, viewport list, route list
  signals/
    mechanical_signals.json    # extracted signals per (viewport × target)
    classified_failures.json   # signal failures by rubric axis
  screenshots/
    <viewport>/<target>/<state>.png
  rubric/
    rubric_run.json            # rubric outcome per axis
    iteration_recommendations.md
```

This bundle is the audit record. Future contracts cite specific run timestamps when claiming pass/fail.

---

## 9. RUNTIME PRECONDITIONS

The local LENS runtime must be brought up in a production-equivalent mode before inspection. Specifically:

- production data shape (or governed mock matching production shape)
- production typography loaded (not fallback fonts)
- production color tokens loaded
- production motion config loaded
- no devtools overlay visible
- no debug/staging banner visible

A surface inspected in development mode is not a valid inspection. The runtime configuration is part of the surface.

---

## 10. WHAT PLAYWRIGHT CANNOT VERIFY

Playwright extracts mechanical signals. Playwright **cannot** verify:

- Whether the narrative reads at executive register.
- Whether the surface evokes institutional trust.
- Whether the descent flow makes operational sense.
- Whether the empty / partial state is *honest*.
- Whether the surface survives a board-room projection emotionally.

These remain human-read responsibilities. The Playwright workflow exists to free human attention for these axes by automating the mechanical pre-checks.

---

## 11. INTEGRATION WITH STREAM CONTRACTS

Future LENS visual contracts must:

1. Declare the inspection run as a deliverable.
2. Reference the run timestamp in `validation_log.json`.
3. Include the run's classified failures in `execution_report.md`.
4. Include the rubric outcome in `CLOSURE.md`.

A LENS visual contract that does not produce an inspection run is non-compliant.

---

## 12. WHEN TO RUN

The Playwright workflow runs:

- **Pre-merge** — required for any LENS visual contract.
- **Mid-iteration** — recommended at least once per design pass.
- **Post-regression** — required if any upstream change touches typography, color tokens, motion config, or the LENS routes.
- **Periodic audit** — recommended monthly to catch silent regression.

---

## 13. BOUNDARIES

This workflow:

- operates within the cinematic realization layer of the LENS V2 flagship executive experience
- inspects rendered LENS surfaces only
- does not test functional correctness of underlying data pipelines
- does not validate evidence semantics
- does not interact with the upstream PiOS Core

This workflow is a *visual verification* layer, not a functional test layer. Functional and evidence-correctness validation is governed by other contracts.

---

## 14. SUMMARY

Playwright is the visual verification layer for LENS. The workflow extracts mechanical signals, captures canonical surface states, and prepares the surface for human rubric review. It is mandatory for all future LENS visual contracts.

The framework's purpose is to ensure that LENS visual evolution is grounded in *inspection*, not in *assumption*.

---

**End of inspection framework.**
