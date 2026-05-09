# ANTI-DASHBOARD ENFORCEMENT

**Stream:** PI.LENS.V2.VISUAL-DIRECTION-DOCTRINE.01
**Status:** AUTHORITATIVE
**Scope:** Hard enforcement rules preventing LENS from regressing to dashboard syndrome.

---

## 0. WHY THIS DOCUMENT EXISTS

Dashboard syndrome is the gravitational default of all data-rich UI work. Without explicit, enumerated, hard rules, every LENS implementation will drift toward it — silently, iteration by iteration, until the surface is indistinguishable from any analytics SaaS.

This document is the named, enumerated wall against that drift.

A LENS redesign is rejected if it triggers any rule listed here, regardless of how well it satisfies other doctrine clauses.

---

## 1. WHAT DASHBOARD SYNDROME IS

Dashboard syndrome is the visual condition in which an interface is perceived by an executive viewer as "another analytics platform" within five seconds.

It is recognized by:

- Equal-weight tiles arranged on a regular grid.
- A multi-column layout where every column has the same priority signal.
- Metric numbers as the primary visual mass.
- Sparkline / mini-chart cards stacked four-up or six-up.
- KPI badges with delta arrows.
- Filter row across the top.
- Time-range selector dominating the header.
- "Cards everywhere."
- Visual rhythm that repeats every 200–300 px down the page.

If the surface, with no other context, can be screenshotted and dropped onto a Datadog / Grafana / Mixpanel / Amplitude / Looker landing page without the substitution being obvious, the surface has dashboard syndrome.

---

## 2. WHY DASHBOARDS ARE WRONG FOR LENS

Dashboards are wrong for LENS because:

- They optimize for monitoring (continuous shallow scanning), not for executive decision (single deep read).
- They imply parity between elements, but LENS surfaces have a dominant declaration that must visibly outweigh everything else.
- They reward exploration, but executives do not explore — they read.
- They communicate "data" but LENS communicates "structural truth."
- They speak in the voice of a tool. LENS speaks in the voice of an institution.

A dashboard tells you "here are the numbers, you decide." LENS tells you "here is what is happening, here is what it means, here is the evidence." The difference is the entire product.

---

## 3. HARD-FORBIDDEN ELEMENTS

The following are prohibited on the primary LENS executive surface. Any of them present in a redesign is sufficient grounds for rejection.

### 3.1 Layout patterns

- Equal-sized card grids (2x2, 2x3, 3x3, 4x4 of identical cards).
- Tiled metric grids of any kind.
- Analytics rows of the form "label / number / delta / sparkline".
- Filter bars across the top of the primary surface.
- Time-range pickers as a primary header element.
- Sidebar navigation that lists "dashboards", "reports", "metrics".
- Tabs along the top that switch between equally-weighted views.
- "+ Add widget" or any widget-mosaic affordance.

### 3.2 Component patterns

- KPI cards with up/down delta arrows.
- "Big number" tiles in any form on the primary surface.
- Sparkline-as-tile components.
- Donut / pie charts.
- Stacked bar charts as primary surface elements.
- Heatmap calendars.
- Score-card style components with grade letters or 0–100 scores.
- Speed-gauge / dial visualizations.

### 3.3 Interaction patterns

- "Click to drill into chart" as the primary descent path.
- Drag-to-reorder of surface elements.
- "Pin to dashboard" affordances.
- Multi-select filters that reshape the surface.
- Save / share / export buttons in the primary header.

### 3.4 Visual signature patterns

- A header bar containing logo + nav + filter + time picker + user avatar.
- A row of small-multiple cards as the primary information layer.
- Bright accent colors used for category differentiation.
- Same-shape repetition more than three times consecutively.
- Same-color repetition across non-related elements.

---

## 4. WHY EACH PROHIBITION EXISTS

Each prohibition is anchored to a doctrine clause:

| Prohibition                          | Doctrine clause violated                                       |
|--------------------------------------|----------------------------------------------------------------|
| Equal-sized card grids               | Focal Dominance — destroys the dominant anchor.                |
| Big-number / KPI tiles               | Content Hierarchy — metrics must come after declaration.       |
| Filter bar in primary header        | Executive Cognition — implies exploratory tooling.             |
| Time-range picker in header          | Executive Cognition — implies analyst behavior.                |
| Donut / pie / dial charts            | Structural Seriousness — decorative without operational basis. |
| Bright category color               | Color Doctrine — color is semantic, not categorical.           |
| Sparkline tiles                      | Anti-dashboard core — signature dashboard element.             |
| Save / share / export header buttons| Executive Cognition — implies report-builder tooling.          |

There are no exceptions to these clauses through clever execution. The prohibitions are about category, not quality.

---

## 5. WHAT REPLACES DASHBOARD ELEMENTS

For every forbidden element, the doctrine prescribes a replacement pattern.

| If the instinct is...                  | Replace with...                                                                |
|----------------------------------------|--------------------------------------------------------------------------------|
| KPI card with number + delta           | A typographically-led declaration sentence with bounded confidence language.   |
| Multi-column metric grid               | A single dominant anchor with a single supporting cross-section beneath.       |
| Filter bar at the top                  | Surface state is determined by upstream truth; if filtering is needed, it is a descent affordance, not a primary header. |
| Time-range picker                      | Time-of-truth is shown as a single small label in the corner of the anchor.    |
| Tab strip across the top               | Vertical narrative descent. Different views are different anchors over time, not parallel tabs. |
| Donut / pie / gauge                    | Typographic weight, glow discipline, and proportion in a single composed scene. |
| Sparkline tile                         | A single propagation line embedded in the structural cross-section, sized to context. |
| "Add widget"                           | The surface is composed by the system, not by the user. There are no user widgets. |

Each replacement is a different *cognitive* pattern, not a re-skinned version of the same pattern.

---

## 6. THE FIVE-SECOND CONFUSION TEST

After any LENS visual change, run this test:

1. Capture a screenshot of the surface at full executive viewport.
2. Show it to a fresh viewer who has not been briefed on LENS.
3. Ask: "What is this?"

Acceptable answers include any of:

- "An operational intelligence surface."
- "Some kind of executive briefing."
- "A program command surface."
- "Looks like a serious operational tool."
- "Some kind of investigation surface."

Failing answers include any of:

- "A dashboard."
- "Looks like Datadog / Grafana / Mixpanel / Amplitude."
- "An analytics tool."
- "A reporting tool."
- "A monitoring app."
- "Looks like Notion / Linear / a SaaS product."

A single failing answer is sufficient to reject the design.

---

## 7. THE GRID GRAVITY RULE

There is one specific gravity that must be actively resisted on every iteration: the grid.

A regular grid of equal-weight elements is the default visual shape that any UI work converges on. It is comfortable to design, easy to implement, and pleasing to engineers. It is also the single strongest signature of dashboard syndrome.

Required rules to resist grid gravity:

- The primary surface MUST contain at least one element whose visual weight is at least 3x larger than any other element on the surface.
- No more than two elements on the primary surface may share identical dimensions.
- No row may contain three or more elements of identical visual weight.
- A column structure on the primary surface is permitted only if columns differ in visual weight by at least 2x.
- A regular grid (3x3, 4x4, etc.) is forbidden on the primary surface.

If a redesign violates the grid gravity rule, it does not matter how good the typography or color are. It will read as a dashboard.

---

## 8. THE METRIC-FIRST FAILURE

The most common dashboard regression is the metric-first failure: a redesign that leads with numbers because numbers are easy to compute and easy to render.

Required rules to prevent metric-first failure:

- The first piece of typography the eye reads on the surface MUST be a sentence, not a number.
- Any number on the surface must be preceded — left or above, in reading order — by an operational sentence that contextualizes it.
- A number that is not anchored to a sentence within the same focal zone is a violation.
- Bare numbers without sentence anchoring are decoration.

A LENS surface in which the visually heaviest element is a number has failed.

---

## 9. THE COMPONENT-REPETITION FAILURE

Repetition of the same component shape three or more times in a row creates visual rhythm that reads as dashboard regardless of content.

Required rules:

- Maximum two consecutive instances of any visually-identical component on the primary surface.
- Repeating component patterns are permitted only inside a descent zone, not on the primary surface.
- "Lists of cards" are forbidden on the primary surface.
- Tabular structures (visual tables) are forbidden on the primary surface.

If you find yourself implementing a `.map()` over an array of identical card components on the primary surface, you have created dashboard syndrome.

---

## 10. ENFORCEMENT WORKFLOW

Every LENS visual contract must include an explicit anti-dashboard pass:

1. Inspect the rendered surface against the prohibitions in Section 3.
2. Run the five-second confusion test (Section 6).
3. Run the grid-gravity check (Section 7).
4. Run the metric-first check (Section 8).
5. Run the component-repetition check (Section 9).
6. Document the result in the contract's validation log.

The result is binary: PASS or FAIL. There is no partial credit. A redesign with one failing check is a failing redesign.

---

## 11. AUDITING EXISTING SURFACES

For an existing LENS surface, the audit procedure is:

1. Open the surface in production-equivalent state.
2. Screenshot the executive viewport.
3. Annotate any element that triggers a prohibition.
4. Score the surface 0–9 (number of violation categories triggered out of nine in this document).
5. Anything above 0 is non-compliant.

Audit records are written to `validation_log.json` for the consuming stream.

---

## 12. RECOVERY PATTERN

When a surface is found to have dashboard syndrome:

1. Identify the dominant declaration the surface should be making.
2. Strip every element that does not directly support the declaration, the implication, or one descent path.
3. Re-introduce only what is needed to communicate structure.
4. Rebuild visual hierarchy from typography, not from components.
5. Re-test against this document.

Recovery is almost always subtractive, not additive.

---

## 13. RELATIONSHIP TO OTHER DOCTRINE DOCUMENTS

This document is the enforcement counterpart to:

- `VISUAL_DIRECTION_DOCTRINE.md` — defines the visual outcome.
- `EXECUTIVE_COGNITION_MODEL.md` — defines the reader.
- `VISUAL_EVALUATION_RUBRIC.md` — defines the evaluation procedure.

It is also operationalized by:

- `DASHBOARD_SYNDROME_DETECTION_GUIDE.md` (sister stream PI.LENS.V2.CINEMATIC-REFERENCE-MAPPING.01) — practical detection workflow.

If this document and another doctrine document conflict on whether an element is permitted, this document wins. The anti-dashboard rules are floor rules. They are not negotiable.

---

**End of enforcement.**
