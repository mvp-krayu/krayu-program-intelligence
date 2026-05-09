# VISUAL FAILURE ANALYSIS

**Stream:** PI.LENS.V2.PLAYWRIGHT-VISUAL-INSPECTION.01
**Phase:** Before-state failure inventory and per-issue analysis

---

## 0. How to read this document

Each detected failure is recorded with: id, screenshot reference, affected file/component, doctrine clause violated, executive cognition impact, dashboard syndrome impact, severity, proposed correction, implementation priority.

Severity scale: **CRITICAL** → **HIGH** → **MEDIUM** → **LOW**.
Implementation priority follows contract Phase 4 ordering: focal hierarchy → declaration gravity → typography readability → spacing rhythm → anti-dashboard compliance → atmospheric depth → operational seriousness → motion restraint → executive immersion.

---

## ISSUE-001 — Monospace typography primary

- **Screenshot:** `screenshots/before_1728x1117_viewport.png` (and all before captures)
- **Affected file/component:** `app/execlens-demo/pages/lens-v2-flagship.js` — `.v2-canvas` font-family
- **Doctrine clause violated:**
  - `VISUAL_DIRECTION_DOCTRINE.md` §5.3 — typography-first hierarchy mandates editorial humanist sans
  - `INSTITUTIONAL_BRIEFING_TYPOGRAPHY_DEEP_DIVE.md` — "lean humanist sans, not monospace primary"
  - `BLOOMBERG_DENSITY_AND_EXPERT_COGNITION_DEEP_DIVE.md` avoid: "Bloomberg's terminal phosphor aesthetic, monospace primary"
- **Executive cognition impact:** Maximum. Monospace immediately reads as a developer terminal or a legacy financial-terminal aesthetic. The doctrine's "five-second confusion test" would name the surface "old Bloomberg" or "monitoring terminal" — not "executive operational intelligence." This single property poisons every other axis of the rubric.
- **Dashboard syndrome impact:** Indirect. Monospace itself is not dashboard syndrome, but it forecloses any premium / institutional reading of the surface.
- **Severity:** CRITICAL
- **Proposed correction:** Replace canvas font-family with a humanist system sans stack: `-apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", "SF Pro Text", system-ui, "Segoe UI", Roboto, sans-serif`. Add font-feature-settings, antialiasing, and slightly larger body size (13 → 14) and slightly tighter line-height (1.6 → 1.55) for executive reading.
- **Implementation priority:** 3 (typography readability) — but functionally the highest-leverage single change, since it cascades through every other axis.

---

## ISSUE-002 — Declaration : summary size ratio below 3.0

- **Screenshot:** `screenshots/before_1728x1117_viewport.png`, `before_1280x800_viewport.png`
- **Affected file/component:** `.declaration-state` (42px) vs `.intel-summary` (16px) — ratio 2.63
- **Doctrine clause violated:**
  - `VISUAL_DIRECTION_DOCTRINE.md` §5.1 — focal dominance
  - `PLAYWRIGHT_VISUAL_INSPECTION_FRAMEWORK.md` §4.1 — element-weight ratio threshold ≥ 3.0
- **Executive cognition impact:** High. The declaration is supposed to be the dominant focal anchor (~60% of attention weight per `EXECUTIVE_COGNITION_MODEL.md` §9). At ratio 2.63 with the summary's larger area mass, the eye actually lands on the executive summary paragraph first, not the declaration.
- **Dashboard syndrome impact:** Indirect — weakens the editorial-anchor reading of the surface, making it look more like "a tile and a paragraph" than "a declaration with supporting narrative."
- **Severity:** HIGH
- **Proposed correction:** Lift `.declaration-state` to 64px with weight 600, line-height 1.04, max-width 1100px, letter-spacing -0.012em (display-style negative tracking).
- **Implementation priority:** 2 (declaration gravity).

---

## ISSUE-003 — Stream code exposed in primary surface chrome

- **Screenshot:** `screenshots/before_1728x1117_viewport.png` (top center band)
- **Affected file/component:** `AuthorityBand` — `<span className="auth-stream">PI.LENS.V2 · REFINEMENT.01</span>`
- **Doctrine clause violated:**
  - `EXECUTIVE_COGNITION_MODEL.md` §10 — "what must never be present" / institutional taxonomy on the primary surface
  - `RAYCAST_COMMAND_SURFACE_DEEP_DIVE.md` — "build the surface around the read, not around the system"
  - `LINEAR_PREMIUM_DENSITY_AND_MOTION_DEEP_DIVE.md` avoid: productivity-tool register / breadcrumb chrome
- **Executive cognition impact:** Medium-high. Stream codes belong to internal stream / governance audit; an executive reader will register them as "this is internal tooling, not an executive surface" — a positioning slip that costs trust.
- **Dashboard syndrome impact:** Low directly; high indirectly — internal-tooling chrome is a dashboard-syndrome adjacency.
- **Severity:** HIGH
- **Proposed correction:** Replace stream label with operational identity: "Program · Delivery Coordination" (or program-driven label from upstream truth when available).
- **Implementation priority:** 7 (operational seriousness).

---

## ISSUE-004 — Status sidebar with 5 identical-width status blocks

- **Screenshot:** `screenshots/before_1728x1117_full.png`, `before_1440x900_full.png` (right column of intelligence field)
- **Affected file/component:** `IntelligenceField` → `intel-status` div with 5 `.status-block` children: READINESS / QUALIFIER / DOMAINS / COVERAGE / CLUSTERS
- **Doctrine clause violated:**
  - `ANTI_DASHBOARD_ENFORCEMENT.md` §3.2 — KPI/status tile patterns forbidden on primary surface
  - `ANTI_DASHBOARD_ENFORCEMENT.md` §9 — component-repetition failure (5 ≥ 3 forbidden)
  - `DASHBOARD_SYNDROME_DETECTION_GUIDE.md` §3.2 — sidebar listing categories
- **Executive cognition impact:** High. The 5-block sidebar reads as a status-card stack, exactly the dashboard signature the doctrine forbids. It also splits the executive's eye between narrative and sidebar at the worst possible moment (during the first read).
- **Dashboard syndrome impact:** Direct, severe. This is the strongest single dashboard-syndrome signal on the surface.
- **Severity:** HIGH (anti-dashboard floor violation)
- **Proposed correction:** Collapse into a single calm "EVIDENCE STATE" anchor: a label, the readiness sentence, a coverage line that inlines domain / cluster counts, and an optional qualifier sub-block when relevant. Demote visually (smaller, reduced contrast, sticky-positioned beside the narrative).
- **Implementation priority:** 5 (anti-dashboard compliance).

---

## ISSUE-005 — Evidence grid as 3 identical-width components

- **Screenshot:** `screenshots/before_1728x1117_full.png` (lower section)
- **Affected file/component:** `.evidence-grid` with `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))` producing 3 evidence-block elements at identical 387px widths
- **Doctrine clause violated:**
  - `ANTI_DASHBOARD_ENFORCEMENT.md` §7 — grid-gravity rule (no regular grid on primary surface)
  - `ANTI_DASHBOARD_ENFORCEMENT.md` §9 — component-repetition (3 ≥ 3 identical)
  - `DASHBOARD_SYNDROME_DETECTION_GUIDE.md` §2.2 — primary detection test "Grid-Gravity"
- **Executive cognition impact:** High. The 3-column equal-width grid is the single most recognizable dashboard signature. Even though the *content* is evidence narrative (good), the *form* reads as analytics tiles (bad).
- **Dashboard syndrome impact:** Direct, severe.
- **Severity:** HIGH
- **Proposed correction:** Change grid template to `2.1fr 1fr 1fr` so the first evidence block is dominant (~50% of the width) and the supporting evidence blocks are ~25% each. Lift the first block's background, padding, and typography. Add a media-query collapse to `1.6fr 1fr` at narrower widths so the maximum consecutive identical-width count stays at 2 — within the doctrine's allowed limit.
- **Implementation priority:** 1 (focal hierarchy) + 5 (anti-dashboard).

---

## ISSUE-006 — Background near-black, no atmospheric depth

- **Screenshot:** all before captures
- **Affected file/component:** `.v2-canvas` `background: #0d0f14`
- **Doctrine clause violated:**
  - `VISUAL_DIRECTION_DOCTRINE.md` §5.4 — operational atmosphere (graphite, never pure black; subtle environmental gradient)
  - `APPLE_VISIONOS_SPATIAL_HIERARCHY_DEEP_DIVE.md` — depth model requires at least 3 tiers; flat near-black collapses to one
- **Executive cognition impact:** Medium. The flat near-black ground reads as "developer dark mode" rather than "institutional atmosphere." The surface lacks the "alive but restrained" quality the doctrine requires.
- **Dashboard syndrome impact:** Indirect — flat dark backgrounds are a dashboard-adjacent signature.
- **Severity:** MEDIUM
- **Proposed correction:** Lift ground to `#14171f` (warmer graphite). Add a subtle dual radial gradient: a state-color tint at ~12-18% top-left, a warm secondary tint at ~88% bottom-right. Both at very low opacity so the gradient is felt, not noticed.
- **Implementation priority:** 6 (atmospheric depth).

---

## ISSUE-007 — Spatial rhythm tight, executive padding under-budget

- **Screenshot:** `screenshots/before_1728x1117_full.png`
- **Affected file/component:** `.declaration-zone` 56px top, `.intel-primary` 44/52, `.topology-zone` and `.evidence-layer` 44/48 paddings
- **Doctrine clause violated:**
  - `VISUAL_DIRECTION_DOCTRINE.md` §5.2 — spatial breathing (composed, not packed)
  - `EXECUTIVE_COGNITION_MODEL.md` §9 — attention economy (declaration must own ~60% weight, which requires *space* around it)
- **Executive cognition impact:** Medium. The current rhythm is tight — readable but feels productivity-tool dense, not editorial-briefing paced.
- **Dashboard syndrome impact:** Indirect.
- **Severity:** MEDIUM
- **Proposed correction:** Lift declaration-zone padding to 80/56, intel-primary to 56/64, topology and evidence sections to 56/56. Increase narrative gap from 36 to 40.
- **Implementation priority:** 4 (spacing rhythm).

---

## ISSUE-008 — Authority band hard border, no atmospheric continuity

- **Screenshot:** all before captures (top band)
- **Affected file/component:** `.auth-band` `background: #080a0f` with hard 1px `#232d42` border
- **Doctrine clause violated:**
  - `VISUAL_DIRECTION_DOCTRINE.md` §5.4 — operational atmosphere
  - `ARC_ATMOSPHERIC_WORKSPACE_DEEP_DIVE.md` — atmospheric continuity (state changes feel environmental)
- **Executive cognition impact:** Low-medium. The hard band edge creates a discrete "this is a separate region" reading rather than letting the band sit as a calm thin band over the canvas.
- **Dashboard syndrome impact:** Low.
- **Severity:** LOW-MEDIUM
- **Proposed correction:** Background to `rgba(11, 13, 18, 0.78)` with `backdrop-filter: blur(10px)`. Border to subtler `#1a2030`. Letter-spacing on wordmark slightly looser; descriptor color lifted (`#6a7593`).
- **Implementation priority:** 6 (atmospheric depth).

---

## ISSUE-009 — Internal terminology "← 42.x demo" link in governance ribbon

- **Screenshot:** `before_*_full.png` (bottom-right of governance ribbon)
- **Affected file/component:** `GovernanceRibbon` — `<a href="/" className="gov-back">← 42.x demo</a>`
- **Doctrine clause violated:**
  - `EXECUTIVE_COGNITION_MODEL.md` §13 — institutional trust contract (no internal-pipeline taxonomy on primary surface)
  - terminology hygiene continuing the spirit of `PI.LENS.V2.TERMINOLOGY-NORMALIZATION.01`
- **Executive cognition impact:** Low. The link is small and at the bottom of the ribbon, but it remains a "this is internal tooling" cue.
- **Dashboard syndrome impact:** Low.
- **Severity:** LOW
- **Proposed correction:** Replace text with "← Overview" and add a `title` attribute for the affordance hint.
- **Implementation priority:** 7 (operational seriousness).

---

## ISSUE-010 — Qualifier mandate body text undertuned for executive register

- **Screenshot:** `before_1728x1117_viewport.png` (yellow band beneath declaration)
- **Affected file/component:** `.qualifier-mandate-text` font-size 13px / line-height 1.65 / letter-spacing 0.02em / color rgba(230,184,0,0.75)
- **Doctrine clause violated:**
  - `INSTITUTIONAL_BRIEFING_TYPOGRAPHY_DEEP_DIVE.md` — body register reading-comfort invariants
- **Executive cognition impact:** Low-medium. The yellow band's body text is readable but tighter than executive-comfortable; letter-spacing positive on body slightly hurts cohesion.
- **Dashboard syndrome impact:** None.
- **Severity:** LOW
- **Proposed correction:** Lift to font-size 13.5px, line-height 1.6, letter-spacing 0, color rgba(230,184,0,0.82), weight 400.
- **Implementation priority:** 3 (typography readability).

---

## 11. Aggregate counts

- CRITICAL severity issues: 1 (ISSUE-001 — monospace typography)
- HIGH severity issues: 4 (ISSUE-002, ISSUE-003, ISSUE-004, ISSUE-005)
- MEDIUM severity issues: 2 (ISSUE-006, ISSUE-007)
- LOW / LOW-MEDIUM severity issues: 3 (ISSUE-008, ISSUE-009, ISSUE-010)

Total addressed in this iteration: 10 / 10. All proposed corrections implemented. See `CINEMATIC_ITERATION_LOG.md` for the per-issue resolution status.

---

**End of failure analysis.**
