# REPRESENTATION FIELD DESIGN LOG

**Stream:** PI.LENS.V2.REPRESENTATION-FIELD-AND-PERSONA-CONSOLIDATION.01
**Iteration:** First introduction of the persona-weighted Representation Field
**Target:** `app/execlens-demo/pages/lens-v2-flagship.js`

---

## 1. Problem inherited

After `PI.LENS.V2.PLAYWRIGHT-VISUAL-INSPECTION.01`, the LENS V2 flagship surface read as institutional and dashboard-syndrome-clean. But:

> The large field to the right of the Executive Assessment currently reads as empty space.

The previous iteration had collapsed a 5-block status grid into a single calm `intel-anchor`. That move solved dashboard-syndrome (good) but left the right column visually under-occupied, which read as "executive text beside dark space" rather than as a balanced operational intelligence surface.

This iteration replaces that empty right column with a live persona-weighted Representation Field.

---

## 2. Design constraints (binding)

The contract defined a strict design space:

- The Representation Field MUST NOT be a card grid, KPI panel, chart dashboard, widget area, generic graph playground, decorative animation, or reintroduction of a static legacy topology.
- The field SHOULD be atmospheric, contextual, role-weighted, structurally meaningful, evidence-aware, and operationally believable.
- The field MUST use only existing data — no invented evidence, no invented signals, no invented metrics.
- The visible mode labels (BALANCED / DENSE / INVESTIGATION / BOARDROOM) MUST be preserved.
- Persona meaning MUST be added through accessibility / microcopy / tooltips, not by renaming controls.
- The previous iteration's gains (humanist sans typography, declaration dominance, calm anchor, atmospheric ground, anti-dashboard composition) MUST be preserved.

---

## 3. Information architecture

The Representation Field branches by lens:

```
boardroomMode === true
    → BoardroomAtmosphericField
boardroomMode === false
    densityClass === 'INVESTIGATION_DENSE'  → InvestigationTraceField
    densityClass === 'EXECUTIVE_BALANCED'   → BalancedConsequenceField
    densityClass === 'EXECUTIVE_DENSE'      → DenseTopologyField  (default)
```

Each field renders:

1. A mode tag (label + persona sub-line) at the top.
2. The mode-specific composition.
3. A compact evidence-state block at the bottom (readiness + coverage + qualifier chip if active).

The compact evidence-state block preserves the calm anchor's information without rebuilding the 5-block status grid.

---

## 4. Field design — BALANCED (Executive Consequence Field)

**Goal:** A CEO-consequence read in one glance.

**Composition:**

- Calm consequence statement (one short prose line, state-color border-left at low intensity).
- Three vertical anchors connected by a pressure-graded rail:
  - Source pressure (origin domain, HIGH glow)
  - Coordination absorption (pass-through, ELEVATED glow)
  - Secondary impact (receiver, MODERATE glow)
- Each anchor has a small dot at the rail with the tier color glow, an uppercase tracked label, the domain alias in display weight, and the pressure label in tier color.

**Why this works:**

- The eye reads the consequence statement first.
- Then it descends through the three anchors as a story (source → absorption → impact).
- The pressure-graded rail communicates *propagation as gradient*, not as graph.
- No card. No grid. No chart.

**What was rejected:**

- A four-up KPI tile arrangement.
- A horizontal bar showing "absorbed 68%" — that would have been metric-first, anti-doctrine.
- A static circular topology — graph-playground risk.

---

## 5. Field design — DENSE (Structural Topology Field)

**Goal:** A CTO structural read of cause and propagation.

**Composition:**

- Three weighted nodes stacked vertically.
- Each node: pressure-tier glow halo + solid dot + role label (ORIGIN / PASS-THROUGH / RECEIVER) + domain alias + pressure label + advisory flag if Q-01.
- Vertical edges connect adjacent nodes, gradient-coloured by upstream pressure tier.
- A "dense note" line beneath the topology states the structural insight ("coordination conducting, not generating").

**Why this works:**

- The composition is a *small, deliberate* topology — three nodes, two edges. Not a graph explorer.
- Pressure tier is communicated by glow color, not by connector thickness.
- Role labels (ORIGIN / PASS-THROUGH / RECEIVER) make the structural reading explicit.
- The dense note frames the topology *operationally*, not topologically.

**What was rejected:**

- A force-directed network with all 47 cluster nodes (graph clutter, anti-doctrine).
- A horizontal three-card row (regression to dashboard).
- Restoration of any prior static topology panel (explicitly forbidden by contract).

---

## 6. Field design — INVESTIGATION (Evidence Trace Field)

**Goal:** An analyst-grade trace of evidence, propagation, and confidence.

**Composition:**

- Three vertical trace bands:
  - Observed pressure (origin)
  - Propagation absorption (pass-through)
  - Qualified receiver state (receiver)
- Each band has a left border in the pressure tier color, a head row (label + domain), an explanation paragraph drawn from the existing evidence text, and a confidence row with grounding label + advisory flag if Q-01.

**Why this works:**

- The bands read as a vertical narrative trace.
- Confidence is visible at the band level, not buried.
- Q-01 partial-grounding band has a subtle warm gradient that signals advisory state without alarming.
- Evidence text is taken verbatim from the existing fixture — no invention.

**What was rejected:**

- Raw JSON dump (anti-executive register).
- Trace as a table (regression to spreadsheet aesthetic).
- Three identical cards (regression to dashboard).

---

## 7. Field design — BOARDROOM (Atmospheric Field)

**Goal:** Projection-grade atmospheric support of the declaration.

**Composition:**

- Centered persona tag.
- Atmospheric mark: a glow halo with a 96px ring at the state color, ambient gradient behind it.
- A single boardroom-ready statement (16px, max-width 320px).
- A subtle horizontal line accent (gradient-faded at edges).
- A small scope footer ("Partial Coverage" etc) in uppercase tracked.

**Why this works:**

- The mark is large enough to be felt at 2560×1440 board-room projection.
- The single statement reads as the boardroom-ready voice of the declaration.
- No analytical detail competes with the executive read.
- The state color binds the mark to the upstream truth — readers sense state without reading numbers.

**What was rejected:**

- A larger version of the dense topology (boardroom would still read as "topology slide").
- A pure black canvas (boring, not atmospheric).
- A logo or program badge (decoration, not operational).
- An animated ring (motion competing with cognition, anti-doctrine).

---

## 8. Surrounding-surface adaptations

Beyond the Representation Field itself, the IntelligenceField adapts subtly per mode:

- The `intelligence-field` grid template widens the right column to `minmax(380px, 0.62fr)` (from 280px) so the Representation Field has room to breathe.
- In BOARDROOM, the right column narrows to `0.42fr` and the narrative left column gets extra padding (72/80) — the narrative dominates.
- The Structural Context narrative block is hidden in BALANCED and BOARDROOM (consistent with the executive register of those lenses) and shown in DENSE and INVESTIGATION.

---

## 9. Mode-control refinement

Per the contract, the lens buttons were refined to read as executive lens controls rather than weak tab toggles:

- BOARDROOM joined the radio-group strip (no longer a trailing standalone button).
- Border color, inactive label color, hover state, focus-visible state all upgraded.
- Active state weight bumped to 600.
- ARIA: `role="radiogroup"` + `role="radio"` + `aria-checked` + `aria-label` (persona-extended).
- Tooltips: `title` attribute carrying persona pair.
- Persona-line microcopy below the strip with `aria-live="polite"` for screen-reader updates.

The visible labels themselves were preserved per the contract.

---

## 10. What was preserved from the previous iteration

- Humanist sans system stack typography.
- 64px declaration with negative letter-spacing.
- Graphite ground with subtle environmental gradients.
- Authority band semi-transparent + backdrop-blur.
- Anti-dashboard composition rules (zero regular grids on primary surface).
- Evidence layer dominant + supporting composition.
- Governance ribbon.
- Render-state vocabulary, qualifier semantics, propagation logic, evidence semantics.
- The "Overview" link wording and the cleaned-up program identity center label.

Nothing from the previous iteration was discarded.

---

## 11. Open questions (for next iteration)

- Should the Boardroom statement be derived from upstream truth rather than hard-coded prose? (Currently uses readiness state + a constant operational phrase.) Recorded as residual visual risk.
- Should the Investigation trace bands be expandable to show the full `evidence_blocks[].signal_cards[]` set? (Currently shows the first signal_card only.) Recorded as residual visual risk.
- Should the Dense topology numerically expose the "absorbed 68%" figure (which exists in the existing narrative)? (Currently embedded in the dense note prose only.) Recorded as residual visual risk.
- Should the BALANCED consequence statement be derived from `narrative.executive_summary` rather than hard-coded? Recorded as residual visual risk — would require a sentence-extraction adapter.

These are open by design. The contract specifically said: build on the iteration, don't invent data, don't add complexity beyond the persona-weighted field. Future contracts may close these.

---

**End of design log.**
