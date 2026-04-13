# GAUGE.EXECUTIVE.VISUAL.LAYER.01 — Contract

## Contract Identity

- ID: GAUGE.EXECUTIVE.VISUAL.LAYER.01
- Type: EXECUTIVE SURFACE VISUAL UPGRADE
- Mode: PRESENTATION ONLY — NO DATA, SEMANTIC, OR ONTOLOGY CHANGE
- Branch: work/psee-runtime
- Date: 2026-04-13

---

## Purpose

Upgrade the /overview executive page from a styled report into a product-grade decision surface.
All changes are visual, typographic, and layout only. No meaning, data, or logic changes.

---

## Changes Applied

### Change 1 — Remove multicolor horizontal band (EVL-01 prevention)

Removed `ei-bar` from `StatusBand` component.
- Removed: `<div className="ei-bar">` with 3 colored flexGrow segments
- Removed: `barDom`, `barOvl`, `barUnk` flex weight variables (now unused)
- Source: `app/gauge-product/pages/overview.js`, StatusBand function
- Reason: visually noisy, non-product-coherent, superseded by executive gauge

### Change 2 — Primary executive gauge: ScoreGauge component (EVL-02 prevention)

Added `ScoreGauge` component using existing `gaugeData.score.canonical` and `gaugeData.projection.value`.

Visual structure:
- Horizontal track (0–100 scale)
- Proven fill (blue, `#1c4a7a`) from 0 to proven score
- Execution gap fill (amber hatch) from proven to achievable
- Proven tick (blue vertical rule at proven position)
- Achievable tick (amber vertical rule at achievable position)
- Score chips above track: proven (blue) + achievable (amber)
- Range endpoints: 0 / 100 in muted monospace

No new data. No new computation beyond `Math.min/max` for % calculation.

### Change 3 — Signal strip replaces badge pills (EVL-04 prevention)

`ExecutiveDecisionBlock` redesigned:
- Old: `ed-status-row` with 3 `ed-pill` badge columns
- New: `ed-signal-row` with 3 `ed-signal` inline chips

Signal format: `[KEY] · [VALUE]` — single horizontal row
- Tighter: 9px monospace key, 11px bold value
- Separated by thin vertical rule (border-right) with 18px spacing
- No bounding box/card feel — pure signal strip
- State modifiers: `ed-signal--strong` (green), `ed-signal--warn` (amber), `ed-signal--neutral` (slate), `ed-signal--risk` (red)
- Decision logic unchanged: same CONCEPT-01/03/14 and CONCEPT-08/09/16 and CONCEPT-06 checks

### Change 4 — Compact structural graph: StructuralGraph component (V5 compliance)

Added `StructuralGraph` component as the one permitted secondary visual.

Visual structure:
- 3 labeled horizontal bar rows: Domains / Cross-Domain / Runtime Unknown
- Bar width = proportional share of total count
- Color: green (domains) / amber (cross-domain) / red (runtime unknown)
- Compact: 5px track height, 9px labels, value on right

Data sources:
- `domCount`: `topoData.nodes.filter(type === 'binding_context').length` — identical to StatusBand
- `ovlCount`: `topoData.overlap_edges.length` — identical to StatusBand
- `unkCount`: `gaugeData.dimensions['DIM-04'].total_count` — identical to StatusBand

No new data. No new API calls. No new logic.

### Change 5 — Typography normalization

| Level | Element | Before | After |
|-------|---------|--------|-------|
| L1 | `ei-header-primary` | 19px | 20px, weight 600 |
| L1 exec | `ei-header-exec` | 14px | 14px, color #6e7681 (de-emphasized) |
| L2 | section `ml-section-title` | 11px | 10px, .12em letter-spacing |
| L3 | `ei-band-lbl` | 10px | 9px, .08em letter-spacing |
| L3 | `ed-sig-key` | 9px | 9px (consistent) |
| L4 | `ml-text--summary` | 15px | 14px |
| L4 | `ml-text--factual` | 13px | 13px (unchanged) |

Also: `ei-band-val` 22px → 20px, `ei-band-item--hi .ei-band-val` 28px → 26px.

### Change 6 — Section visual discipline

- `ei-section .ml-block`: `border-left-color` set per section type (good/warn/risk)
  - good: `#1c4a1e` (dark green), warn: `#4a3c00` (dark amber), risk: `#4a0f0a` (dark red)
- `ei-section .ml-blocks`: `padding: 16px 20px`, `gap: 12px`
- `ei-section .ml-block`: `max-width: 520px` for readable line length
- Section title: moved padding to title row itself for cleaner separation

---

## Visual Layout (after changes)

```
┌─────────────────────────────────────────────────────────┐
│  HEADER BAR                                             │
├─────────────────────────────────────────────────────────┤
│  STRUCTURE · STRONG  COMPLEXITY · LOW  EXECUTION · UNKN  │  ← signal strip
│  System structure is solid, while complexity remains...  │
├─────────────────────────────────────────────────────────┤
│  Executive header text (L1, 20px)                       │
├──────────────────────────────────┬──────────────────────┤
│  Score Range                     │  Structural Dist.    │  ← visual zone
│  [60 proven] [100 achievable]    │  Domains    ████ 4   │
│  ██████████░░░░░░░░░░░░░░░░░░    │  Cross-Dom  ██   2   │
│  0                         100   │  Runtime Un ·   0   │
├──────────────────────────────────┴──────────────────────┤
│  60 · Proven Score │ 100 · Achievable │ 4 · Domains ... │  ← metrics band
├────────────────┬───────────────┬────────────────────────┤
│  STRUCTURALLY  │  COMPLEXITY   │  OUTSIDE CONTROL       │  ← 3 sections
│  SOUND         │  CONCENTRATES │                         │
└────────────────┴───────────────┴────────────────────────┘
```

---

## DO NOT MODIFY Compliance

| File | Modified? |
|------|-----------|
| resolver.js | NO |
| renderer.js | NO |
| concepts.json | NO |
| phrases.json | NO |
| schema.json | NO |
| /api/topology | NO |
| /api/gauge | NO |
| pages/topology.js | NO |
| pages/index.js | NO |
| MeaningSection | NO |
| MeaningBlock | NO |

---

## Files Modified

| File | Change |
|------|--------|
| `app/gauge-product/pages/overview.js` | ExecutiveDecisionBlock signal strip, StatusBand bar removal, ScoreGauge + StructuralGraph added, visual zone render |
| `app/gauge-product/styles/gauge.css` | EVL.01 CSS block appended: `.ed-signal-*`, `.ev-visual-zone`, `.eg-*`, `.sg-*`, typography normalization, section discipline |
