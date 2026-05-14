# VISUAL EVALUATION RUBRIC

**Stream:** PI.LENS.V2.VISUAL-DIRECTION-DOCTRINE.01
**Status:** AUTHORITATIVE
**Scope:** Procedure and scoring for evaluating any LENS visual change against the doctrine.

---

## 0. PURPOSE

This rubric is the named, repeatable procedure used to evaluate LENS visual work.

Every future LENS visual contract MUST evaluate its rendered surface against this rubric and record the result in its validation log.

If the rubric is not run, the contract is non-compliant regardless of the visual outcome.

---

## 1. SIX EVALUATION AXES

Six axes, each scored independently, each gated PASS / PARTIAL / FAIL.

| Axis | Question                                                                |
|------|-------------------------------------------------------------------------|
| A    | Focal strength — is there one dominant anchor?                          |
| B    | Executive readability — is the surface read at executive register?      |
| C    | Operational atmosphere — does the surface feel institutional?           |
| D    | Cinematic depth — is there visual layering and atmospheric tension?     |
| E    | Anti-dashboard — does the surface avoid dashboard syndrome?             |
| F    | Executive immersion — does the surface feel premium and consequential?  |

A redesign passes the rubric only when all six axes are PASS. PARTIAL on any axis triggers iteration. FAIL on any axis triggers redesign.

---

## 2. AXIS A — FOCAL STRENGTH

### 2.1 Question

Is the primary declaration dominant? Is the reading path obvious? Is attention controlled?

### 2.2 Inspection procedure

1. Capture the surface at the canonical executive viewport.
2. Without prior briefing, ask a viewer to point to "the first thing your eye landed on."
3. Compare that to the intended dominant anchor.

### 2.3 Scoring

| Score    | Criterion                                                                          |
|----------|------------------------------------------------------------------------------------|
| PASS     | Viewer lands on the dominant anchor within the first 1.5 seconds.                  |
| PARTIAL  | Viewer lands on the anchor within 3 seconds, or names a competing element.         |
| FAIL     | Viewer cannot identify a dominant element, or names a non-anchor element.          |

### 2.4 Common failure causes

- Equal-weight panels distributed across the surface.
- Multiple panels with similar typographic mass.
- An anchor that is conceptually correct but visually under-weighted.
- A bright accent on a non-anchor element pulling the eye away.

### 2.5 Doctrine reference

`VISUAL_DIRECTION_DOCTRINE.md` §5.1 — Focal Dominance.

---

## 3. AXIS B — EXECUTIVE READABILITY

### 3.1 Question

Can content be absorbed rapidly at executive register? Is typography comfortable? Is narrative pacing strong?

### 3.2 Inspection procedure

1. Open the surface at the canonical viewport.
2. Read the top declaration aloud.
3. Read the immediately-following implication aloud.
4. Time the reading. Note the register.

### 3.3 Scoring

| Score    | Criterion                                                                          |
|----------|------------------------------------------------------------------------------------|
| PASS     | Declaration + implication are readable in <8s and read as institutional.           |
| PARTIAL  | Readable in <12s but the register slips toward marketing or topology jargon.       |
| FAIL     | Takes >12s, requires re-reading, or reads as synthetic / SaaS / topology dump.     |

### 3.4 Specific checks

- Line-height ≥ 1.4 on body content.
- Declaration size at least 2.5x body size.
- Body copy contrast ratio ≥ 7:1 against ground.
- Metadata (timestamps, labels) at no more than 0.6x body size and at lower contrast.
- Sentences are operational, not topological.

### 3.5 Doctrine reference

`VISUAL_DIRECTION_DOCTRINE.md` §5.3 — Typography-First Hierarchy.
`EXECUTIVE_COGNITION_MODEL.md` §7 — Narrative Contract.

---

## 4. AXIS C — OPERATIONAL ATMOSPHERE

### 4.1 Question

Does the surface feel institutional? Does it feel operationally credible? Does it avoid SaaS energy?

### 4.2 Inspection procedure

1. Capture the full-viewport screenshot.
2. Show it to a viewer with no LENS context.
3. Ask: "If you had to describe this in one sentence, what would you say?"

### 4.3 Scoring

| Score    | Criterion                                                                          |
|----------|------------------------------------------------------------------------------------|
| PASS     | Viewer describes it in operational / institutional terms.                          |
| PARTIAL  | Viewer is uncertain, or splits between institutional and SaaS framings.            |
| FAIL     | Viewer describes it as a dashboard, SaaS tool, AI assistant, or productivity app.  |

### 4.4 Specific checks

- Dominant ground is graphite / slate, not pure black, not deep navy, not gradient.
- Accent colors used only for state communication.
- No more than three saturated accents simultaneously visible.
- No marketing-style hero block, callout, or banner.
- No floating chat assistant or "ask AI" affordance on the primary surface.

### 4.5 Doctrine reference

`VISUAL_DIRECTION_DOCTRINE.md` §5.4 — Operational Atmosphere.
`VISUAL_DIRECTION_DOCTRINE.md` §7 — Color Doctrine.

---

## 5. AXIS D — CINEMATIC DEPTH

### 5.1 Question

Is there visual layering? Is there atmospheric depth? Is there environmental tension?

### 5.2 Inspection procedure

1. Inspect the surface at full viewport.
2. Identify how many distinct depth tiers are visible (ground, primary surface, focal lift, ambient illumination).
3. Inspect motion behavior on first paint and on hover transitions.

### 5.3 Scoring

| Score    | Criterion                                                                          |
|----------|------------------------------------------------------------------------------------|
| PASS     | At least three depth tiers visible. Motion is restrained, slow, friction-heavy.    |
| PARTIAL  | Two depth tiers, or motion is too fast / too elastic / too repetitive.             |
| FAIL     | Surface is flat, motion bounces or overshoots, or there is no atmospheric drift.   |

### 5.4 Specific checks

- Multi-layer shadow on the focal anchor (not a single solid drop shadow).
- A subtle environmental gradient on the ground that is detectable but not loud.
- Hover transitions in the 240–600 ms band with friction-heavy easing.
- No bounce, no spring overshoot, no rotation tricks.
- Ambient drift, if present, is sub-conscious (≥ 1.6s, low amplitude).

### 5.5 Doctrine reference

`VISUAL_DIRECTION_DOCTRINE.md` §5.4 — Operational Atmosphere.
`VISUAL_DIRECTION_DOCTRINE.md` §6 — Motion Doctrine.

---

## 6. AXIS E — ANTI-DASHBOARD SCORE

### 6.1 Question

Does the surface still look like a dashboard? Are there too many boxes? Is there component repetition?

### 6.2 Inspection procedure

Run the full enforcement workflow from `ANTI_DASHBOARD_ENFORCEMENT.md` §10:

1. Inspect against the prohibitions in §3.
2. Run the five-second confusion test (§6).
3. Run the grid-gravity check (§7).
4. Run the metric-first check (§8).
5. Run the component-repetition check (§9).

### 6.3 Scoring

| Score    | Criterion                                                                          |
|----------|------------------------------------------------------------------------------------|
| PASS     | Zero prohibitions triggered. All four checks pass.                                 |
| PARTIAL  | Zero prohibitions triggered, but one check is borderline.                          |
| FAIL     | Any prohibition triggered, or any check fails.                                     |

### 6.4 Doctrine reference

`ANTI_DASHBOARD_ENFORCEMENT.md` (entire document).

---

## 7. AXIS F — EXECUTIVE IMMERSION

### 7.1 Question

Does the experience feel memorable? Does it feel serious? Does it feel premium? Does it feel operationally intelligent?

### 7.2 Inspection procedure

1. After running axes A–E, sit with the surface for 90 seconds.
2. Note the emotional register.
3. Imagine projecting the surface onto a board-room wall.

### 7.3 Scoring

| Score    | Criterion                                                                          |
|----------|------------------------------------------------------------------------------------|
| PASS     | Surface holds attention. Feels institutional. Survives board-room projection.      |
| PARTIAL  | Holds attention but feels generic premium SaaS, or feels serious but unmemorable.  |
| FAIL     | Boring, anxious, decorative, or embarrassing in a board-room imagining.            |

### 7.4 Specific checks

- The surface produces an emotional register inside the band defined in `EXECUTIVE_COGNITION_MODEL.md` §12.
- The surface communicates institutional trust per `EXECUTIVE_COGNITION_MODEL.md` §13.
- The surface is consistent across all visible zones — no zone reads at a different register than others.

### 7.5 Doctrine reference

`EXECUTIVE_COGNITION_MODEL.md` §12 — Emotional Contract.
`EXECUTIVE_COGNITION_MODEL.md` §13 — Institutional Trust Contract.

---

## 8. SCORING SUMMARY FORMAT

The rubric run is recorded as:

```json
{
  "rubric_version": "1.0",
  "stream": "<stream-id>",
  "evaluated_at": "<ISO timestamp>",
  "evaluator": "<role>",
  "viewport": "<canonical viewport id>",
  "screenshot_refs": ["<path>", "..."],
  "axes": {
    "A_focal_strength":      { "result": "PASS|PARTIAL|FAIL", "notes": "..." },
    "B_executive_readability":{ "result": "PASS|PARTIAL|FAIL", "notes": "..." },
    "C_operational_atmosphere":{ "result": "PASS|PARTIAL|FAIL", "notes": "..." },
    "D_cinematic_depth":     { "result": "PASS|PARTIAL|FAIL", "notes": "..." },
    "E_anti_dashboard":      { "result": "PASS|PARTIAL|FAIL", "notes": "..." },
    "F_executive_immersion": { "result": "PASS|PARTIAL|FAIL", "notes": "..." }
  },
  "overall": "PASS|ITERATE|REDESIGN",
  "iteration_recommendations": ["..."]
}
```

The overall verdict rule:

- **PASS** — all six axes PASS.
- **ITERATE** — at least one PARTIAL, no FAIL.
- **REDESIGN** — any FAIL on any axis.

---

## 9. WHEN TO RUN THE RUBRIC

The rubric MUST be run:

- Before merging any LENS visual contract.
- After any change to the primary executive surface (header, anchor, narrative zone, descent affordance).
- After any change to typography scale, color foundation, or motion timings.
- During regression checks if a downstream consumer changes the rendered output.

The rubric SHOULD be run:

- Mid-implementation, at least once per iteration, to catch drift early.
- Before stakeholder review.
- Whenever the executive register feels off, even if no specific change occurred.

---

## 10. WHO RUNS THE RUBRIC

The rubric is designed to be runnable by:

- The implementing engineer / designer (self-evaluation).
- An independent reviewer (cross-check).
- A Playwright-driven inspection script (mechanical signal extraction — see `PLAYWRIGHT_VISUAL_INSPECTION_FRAMEWORK.md` in the sister stream).

A Playwright run cannot fully replace a human read. But a Playwright run CAN extract structural signals — element weights, color usage, motion durations, grid presence — that feed mechanical pre-checks before the human read.

---

## 11. RELATIONSHIP TO ITERATION

The rubric is not a final gate. It is the iteration engine.

A LENS visual contract typically runs the rubric many times before passing:

1. First iteration: usually PARTIAL on three axes, FAIL on one.
2. Iterate to address the FAIL.
3. Second iteration: usually PARTIAL on two axes.
4. Iterate to address the PARTIALs.
5. Third or fourth iteration: PASS.

A contract that PASSES on first iteration is suspicious — either the contract was minor, or the rubric was not run honestly.

---

## 12. WHEN AN AXIS IS GENUINELY ARGUABLE

Some axes (especially F — Executive Immersion) involve judgment. When a result is contested:

1. Capture the disagreement explicitly in the rubric run notes.
2. Show the surface to one additional independent reviewer.
3. The lower of the two scores wins.

The rubric is intentionally severe. A contested PARTIAL is a PARTIAL.

---

## 13. RELATIONSHIP TO OTHER DOCTRINE DOCUMENTS

This rubric operationalizes:

- `VISUAL_DIRECTION_DOCTRINE.md` — defines the qualities the rubric measures.
- `EXECUTIVE_COGNITION_MODEL.md` — defines the reader the rubric is calibrated against.
- `ANTI_DASHBOARD_ENFORCEMENT.md` — drives axis E.
- `CINEMATIC_REFERENCE_MAPPING.md` — informs the calibration of axes C, D, F.

If a future contract proposes a rubric variation, the variation must be declared explicitly in the contract's delta and may not weaken any axis.

---

**End of rubric.**
