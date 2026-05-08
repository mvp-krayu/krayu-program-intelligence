# Intelligence Layout Model

**Stream:** PI.LENS.NEXTGEN-REPORTS.PROFESSIONAL-UI.01  
**Document type:** INTELLIGENCE LAYOUT MODEL  
**Status:** COMPLETE  
**Date:** 2026-05-08  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  

---

## 1. Purpose

This document defines the structural layout model for LENS NextGen executive intelligence reports. It defines how the seven rendering regions compose into readable, navigable, executive-grade surfaces across all supported viewing contexts.

Layout is not an aesthetic decision. Layout is an intelligence hierarchy decision. What appears first, what appears at full width, what is collapsed by default — these are governance outputs derived from the executive rendering doctrine.

---

## 2. Layout Principles

### 2.1 Non-Negotiable Layout Rules

| Rule | Requirement |
|------|-------------|
| Summary first | Readiness badge and executive summary are always the first rendered elements |
| Evidence immediately reachable | No more than one interaction to reach evidence drawers from any view |
| Explainability always accessible | All 7 explainability panels reachable without leaving the report |
| Qualifiers never hidden | Qualifier chips visible in header at all viewport sizes |
| Topology simplified by default | Topology is a Phase 3+ detail; not shown by default in Phase 2 |
| Audit surfaces collapsed by default | TRACE/LINEAGE/AUDIT regions collapsed; audience-gated |
| Executive cognitive load minimized | Layers 1–3 always visible; Layers 4–5 require one interaction to reveal |

### 2.2 Forbidden Layout Patterns

| Pattern | Why Forbidden |
|---------|--------------|
| Infinite scroll dashboard | Destroys region hierarchy; evidence becomes findable only by scrolling |
| Widget chaos (arbitrary card grid) | No intelligence priority; treats all data as equal weight |
| SaaS metric wall (12 KPI cards) | Wrong product category; implies BI not intelligence |
| Chart-first layout | Charts are not primary; narrative and readiness verdict are primary |
| Sidebar-first navigation | Sidebar for audit/trace only; primary content is main column |
| Tabs that hide primary regions | Tabs cannot place executive summary on a non-default tab |

---

## 3. Desktop Layout Model

### 3.1 Desktop Primary Layout (≥1200px)

```
┌──────────────────────────────────────────────────────────────────┐
│  REGION_EXECUTIVE_HEADER (full width, fixed top)                 │
│  [Readiness Badge] [State Label] [Qualifier Chip] [Scope] [Date] │
├──────────────────────────────────────────────────────────────────┤
│  REGION_DIAGNOSTIC (conditional; full width)                     │
│  [Blocked notice] OR [Diagnostic banner] — renders if triggered  │
├──────────────────────────────────┬───────────────────────────────┤
│  MAIN COLUMN (65% width)         │  EXPLAINABILITY COLUMN (35%)  │
│                                  │                               │
│  REGION_INTELLIGENCE_SUMMARY     │  REGION_EXPLAINABILITY        │
│  ─ Executive summary (full)      │  ─ WHY panel [expanded]       │
│  ─ WHY primary statement         │  ─ QUALIFIERS [if active]     │
│  ─ Domain evidence summary       │  ─ EVIDENCE drawers           │
│  ─ Propagation summary           │  ─ CONFIDENCE [collapsed]     │
│                                  │  ─ READINESS_STATE [expanded] │
│  DOMAIN EVIDENCE SECTION         │  ─ TRACE [collapsed; Adv+]   │
│  ─ Domain cards (summary row)    │  ─ LINEAGE [collapsed; Adv+] │
│  ─ [Expand per domain]           │                               │
│  ─ Signal cards (collapsed)      │                               │
│  ─ Evidence drawers (closed)     │                               │
│                                  │                               │
│  REGION_TOPOLOGY (Phase 3+)      │                               │
│  [Placeholder in Phase 2]        │                               │
├──────────────────────────────────┴───────────────────────────────┤
│  REGION_LINEAGE (full width; collapsed; Advisory+)               │
├──────────────────────────────────────────────────────────────────┤
│  REGION_AUDIT (full width; collapsed; Audit tier only)           │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Column Composition Rules

**Main column (65%):**
- REGION_INTELLIGENCE_SUMMARY always fully rendered in main column
- Domain evidence section: summary cards first; expandable drawers inline
- Scrollable when content exceeds viewport; sticky header preserves readiness badge

**Explainability column (35%):**
- WHY panel: always visible at top of explainability column
- Panels stack vertically; each independently collapsible
- Column becomes an accordion in tablet layout (stacked below main column)
- Phase 3: column becomes a persistent slide-out panel

### 3.3 Evidence Card Grid

Domain evidence cards are rendered as a structured summary grid:

```
DOMAIN EVIDENCE SUMMARY GRID:
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ [Domain Alias 1] │  │ [Domain Alias 2] │  │ [Domain Alias 3] │
│ [Pressure Label] │  │ [Pressure Label] │  │ [Pressure Label] │
│ [Grounding chip] │  │ [Grounding chip] │  │ [Grounding chip] │
│ [Prop Role]      │  │ [Prop Role]      │  │ [Prop Role]      │
│ [▼ View Evidence]│  │ [▼ View Evidence]│  │ [▼ View Evidence]│
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

- Maximum 3 cards per row; wraps on narrow contexts
- Ordered by propagation role: ORIGIN first
- Each card shows: domain alias, pressure label, grounding chip, propagation role, expand affordance
- Grounding chip always visible (never hidden in card summary)

---

## 4. Widescreen Layout Model (≥1400px)

### 4.1 Three-Column Layout (Phase 3+)

In widescreen contexts with Phase 3 workspace shell active:

```
┌──────────┬─────────────────────────────────┬───────────────────┐
│ WORKSPACE │  REPORT MAIN CONTENT            │  TOPOLOGY PANEL   │
│ NAVIGATOR │                                 │  (Phase 3+)       │
│           │  [All regions from desktop]     │  [Domain topology │
│           │                                 │   read-only view] │
└──────────┴─────────────────────────────────┴───────────────────┘
```

**Phase 2 widescreen (without workspace shell):**
Two-column only. Workspace navigator column is absent. Topology panel column is absent.

### 4.2 Widescreen-Specific Rules

- Readiness badge does not exceed a defined maximum size (not "hero" scale)
- Narrative text width is constrained (max 80 characters wide) for readability
- Explainability column is sticky on scroll beyond the main column
- Evidence cards can use a 4-column grid (vs 3 on desktop)

---

## 5. Presentation Mode Layout

### 5.1 Purpose

Presentation mode is for board room or executive committee presentations. The report is displayed on a large screen; audience is multiple people viewing from distance.

### 5.2 Presentation Mode Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER [enlarged badge + state label — 140% scale]              │
├──────────────────────────────────────────────────────────────────┤
│  EXECUTIVE SUMMARY [enlarged body — 120% scale]                  │
│  [First paragraph only by default; expand affordance present]    │
├──────────────────────────────────────────────────────────────────┤
│  TOP DOMAINS [3 summary cards — full width; enlarged]            │
│  [Depth layers collapsed by default — reduced cognitive load]    │
└──────────────────────────────────────────────────────────────────┘
```

**Presentation mode rules:**
- Readiness badge enlarged but proportional
- First paragraph of executive summary visible; full text on expand
- Top 3 domains by pressure tier visible; remaining on expand
- QUALIFIERS panel visible if qualifier active; others collapsed
- TRACE/LINEAGE/AUDIT not shown by default (audience-appropriate)
- No evidence drawers auto-expanded in presentation mode

---

## 6. Printable Executive Brief Model

### 6.1 Print Layout

The printable brief linearizes all regions for paper output:

```
PAGE 1:
  REGION_EXECUTIVE_HEADER (full width)
  REGION_DIAGNOSTIC (if triggered)
  REGION_INTELLIGENCE_SUMMARY (full text)

PAGE 2+:
  DOMAIN EVIDENCE SECTION (all domains; all drawers expanded)
  SIGNAL CARDS (per domain; all cards)
  PROPAGATION PATH (full text)

APPENDIX (optional — audience-gated):
  REGION_LINEAGE (Advisory+ content)
  REGION_AUDIT (Audit tier content; hash values)
```

**Print rules:**
- All collapsed panels are expanded for print
- All evidence drawers are open for print
- Evidence_object_hash: abbreviated in Advisory print; full in Audit print
- Derivation hash: reference ID only in all print tiers
- Page breaks inserted between regions
- Design token colors translated to print-safe values (not reliant on backlit contrast)

---

## 7. Responsive Collapse Behavior

### 7.1 Collapse Priority on Narrow Viewport

When the viewport narrows below desktop breakpoint:

| Content | Collapse Behavior |
|---------|-----------------|
| Readiness badge | NEVER collapses; scales proportionally |
| Qualifier chip | NEVER hidden; moves to second line if needed |
| Executive summary | NEVER truncated; single column |
| WHY section | NEVER collapsed; single column |
| Explainability column | Collapses to below main content; accordion style |
| Domain evidence summary | Stacks to single card per row |
| Signal cards | Collapse to summary row (title + top signal) |
| TRACE panel | Remains collapsed; access link present |
| LINEAGE/AUDIT | Remains collapsed; audience-gated access link |

### 7.2 No Horizontal Scroll Rule

Primary intelligence content must never require horizontal scrolling:
- Domain evidence cards wrap vertically; no horizontal card scroll
- Propagation path uses text description on narrow viewports; no scrollable diagram
- Signal cards stack; no card row overflow

---

## 8. Progressive Disclosure Layout Flow

### 8.1 Disclosure Levels

```
LEVEL 1 — IMMEDIATELY VISIBLE (no interaction):
  Readiness badge + state label + qualifier chip
  Executive summary paragraph 1
  WHY section primary statement
  Domain evidence summary (top domains)
  QUALIFIERS panel (if qualifier active)

LEVEL 2 — ONE INTERACTION (single click/tap):
  Full executive summary (if > 1 paragraph)
  All domain evidence cards
  Full WHY panel content (contributing signals)
  Evidence drawers (per domain)
  CONFIDENCE panel
  READINESS_STATE panel

LEVEL 3 — TWO INTERACTIONS:
  Signal cards per domain (within evidence drawer)
  Full propagation path (within TRACE panel)
  TRACE panel (click + expand)

LEVEL 4 — ADVISORY/AUDIT ONLY:
  TRACE panel full content
  LINEAGE panel
  AUDIT panel
  Hash value display (abbreviated → full)
```

### 8.2 Navigation Between Levels

| From | To | Interaction |
|------|----|-------------|
| Level 1 | Level 2 | Click domain card header / Click "View Evidence" |
| Level 2 | Level 3 | Click domain drawer / Click "View Analysis Trace" |
| Level 3 | Level 4 | Requires Advisory+ audience tier |
| Any level | Readiness badge | Always visible; no navigation required |
| Any level | QUALIFIERS panel | Click qualifier chip or "View Coverage Details" |

---

## 9. Investigation Expansion Model (Phase 4 Preparation)

### 9.1 Phase 4 Investigation Flow Layout

Phase 4 will introduce structured investigation flows. Phase 2 layout reserves slots:

```
PHASE 4 INVESTIGATION LAYOUT (future):
┌──────────────────────────────────────────────────────────────────┐
│  REGION_EXECUTIVE_HEADER                                         │
├──────────────────────────────────────────────────────────────────┤
│  INVESTIGATION HEADER [active investigation title]               │
├──────────────┬───────────────────────────────────────────────────┤
│  EVIDENCE    │  INVESTIGATION SURFACE                            │
│  NAVIGATOR   │  [Structured evidence comparison]                 │
│  [Domain     │  [Signal trace views]                             │
│  list]       │  [Propagation path detail]                        │
└──────────────┴───────────────────────────────────────────────────┘
```

**Phase 2 status:** INVESTIGATION_ENTRY registered but inactive. No investigation navigation slot rendered in Phase 2.

---

## 10. Audit Expansion Model

### 10.1 Audit Layout

When audience tier = AUDIT, all regions expand:

```
AUDIT EXPANSION:
┌──────────────────────────────────────────────────────────────────┐
│  REGION_EXECUTIVE_HEADER (expanded; governance verdict label)    │
├──────────────────────────────────────────────────────────────────┤
│  REGION_INTELLIGENCE_SUMMARY (full)                              │
├──────────────────────────────────────────────────────────────────┤
│  REGION_EXPLAINABILITY (ALL PANELS EXPANDED)                     │
├──────────────────────────────────────────────────────────────────┤
│  REGION_LINEAGE (expanded; full baseline + stream + hash)        │
├──────────────────────────────────────────────────────────────────┤
│  REGION_AUDIT (expanded; run ID + full hashes + rendering meta)  │
└──────────────────────────────────────────────────────────────────┘
```

**Audit layout rules:**
- All panels expanded by default at audit tier
- Hash values: evidence_object_hash full; derivation_hash reference ID
- Rendering metadata visible (normalization_version; ali_rules_applied)
- Governance verdict: full record
- All qualifier states fully expanded and labeled

---

*Stream PI.LENS.NEXTGEN-REPORTS.PROFESSIONAL-UI.01 — Intelligence Layout Model — COMPLETE*  
*Baseline: governed-dpsig-baseline-v1 (092e251)*  
*Issued: 2026-05-08*
