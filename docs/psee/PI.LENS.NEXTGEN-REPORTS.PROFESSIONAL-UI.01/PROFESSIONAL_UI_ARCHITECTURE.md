# Professional Executive Rendering Architecture

**Stream:** PI.LENS.NEXTGEN-REPORTS.PROFESSIONAL-UI.01  
**Document type:** PROFESSIONAL UI AND EXECUTIVE RENDERING ARCHITECTURE  
**Status:** COMPLETE  
**Date:** 2026-05-08  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  
**Upstream bridge:** PI.LENS.GEIOS.PRODUCTIZATION-BRIDGE.01 (4e2a9e2)  
**Upstream schema:** PI.LENS.NEXTGEN-REPORTS.REPORT-OBJECT-MODEL.01 (e588150)  
**Upstream normalization:** PI.LENS.NEXTGEN-REPORTS.COGNITIVE-NORMALIZATION-INTEGRATION.01 (775d7c1)  
**Upstream explainability:** PI.LENS.NEXTGEN-REPORTS.EVIDENCE-PANEL-ARCHITECTURE.01 (b1f0e9f)  
**Execution mode:** CREATE_ONLY  
**Implementation target:** Phase 2 — Interactive Executive Intelligence Reports  

---

## 1. Executive Summary

The Professional UI Architecture defines the executive rendering doctrine, visual hierarchy, layout architecture, and visual governance for LENS NextGen. It converts the intelligence layer contracts — Report Object Model, Cognitive Normalization, Explainability Panel Architecture — into a coherent, operator-grade visual system.

LENS is not a dashboard. LENS is not an analytics product. LENS is executive operational intelligence infrastructure — a decision-support surface that renders governed structural intelligence in a form worthy of board-level and executive-team trust. Every visual decision in this architecture is governed by that principle.

This document does not implement UI code. It defines the rendering contracts that downstream implementation streams must honor.

---

## 2. Executive Rendering Philosophy

### 2.1 Core Rendering Principle

> LENS must feel like executive operational intelligence infrastructure, not consumer SaaS analytics.

The distinction is not aesthetic — it is architectural. Consumer SaaS analytics prioritizes engagement, exploration, and visual novelty. Executive operational intelligence prioritizes accuracy, trust, speed of understanding, and auditability. These are different products with different rendering obligations.

### 2.2 Intelligence Over Decoration

Rendering exists to serve intelligence, not to demonstrate technical capability:

| Rendering Serves | Rendering Does Not Serve |
|-----------------|------------------------|
| Clarity of the readiness verdict | Visual complexity for its own sake |
| Traceability of evidence | Color for aesthetic preference |
| Accessibility of explainability | Animation as delight |
| Density without cognitive overload | Chart types that imply precision that doesn't exist |
| Consistency that builds trust | Brand differentiation through visual noise |

### 2.3 Deterministic Rendering

The rendering layer inherits the determinism guarantee of the intelligence layer:

- Same report_object + same audience tier → same visual output
- Visual state is not a product of session state, user preference, or rendering randomness
- Governance states (BLOCKED, DIAGNOSTIC) are rendered identically across all clients
- No A/B testing of readiness badge colors, qualifier chip styles, or evidence panel layouts

### 2.4 Rendering Cannot Reinterpret Intelligence

The rendering layer is a transformation layer, not an interpretation layer:

- Rendering cannot reassign readiness states
- Rendering cannot upgrade or downgrade qualifier chips
- Rendering cannot hide evidence panels to improve aesthetic cleanliness
- Rendering cannot promote uncertain findings to confident displays
- Rendering cannot add explanatory text not present in the report_object

---

## 3. Professional UI Doctrine

### 3.1 Operator-Grade Presentation

LENS is used by people who make consequential decisions. The UI must reflect that:

**Factual over decorative:** Typography conveys information, not personality. Every visual element has a governance reason to exist.

**Dense over sparse:** Executives reviewing structural intelligence expect density. Sparse layouts lose credibility. Density is managed through structure and progressive disclosure, not by removing information.

**Consistent over creative:** Every qualifier chip looks the same. Every readiness badge follows the same token system. Every signal card has the same structure. Consistency is the trust mechanism.

**Explicit over hidden:** Governance states are never hidden. Qualifiers are never softened. Blocked states are never silently replaced. The executive sees exactly what the intelligence layer reports.

### 3.2 What LENS Must Never Become

| Forbidden Form | Visual Prohibition |
|---------------|-------------------|
| Consumer AI chatbot | No conversation pane, no AI avatar, no "Ask me anything" bar |
| Generic SaaS dashboard | No metric-wall layout, no widget grid, no card-count decoration |
| Analytics BI tool | No exploratory drill-down without evidence backing, no chart-first layout |
| Prompt playground | No text input fields in any Phase 2–4 surface |
| Confidence bar charts | No numerical confidence visualization, no progress bars for certainty |
| Gamified analytics | No scores out of 10, no color-gradient heat maps without semantic basis |
| Decorative graph overload | No chart for every signal, no forced visualization of structural logic |
| Social/collaborative workspace | No inline comments, no reactions, no presence indicators in Phase 2 |

### 3.3 Trust Vocabulary in Rendering

Every rendering decision communicates a message about trustworthiness:

| Rendering Choice | Trust Signal |
|-----------------|-------------|
| Consistent qualifier chip appearance | "Qualifiers are always handled the same way" |
| Explicit blocked-state notice | "We tell you when something is unavailable" |
| Inverted-pyramid narrative structure | "The conclusion is stated first, not buried" |
| Evidence immediately expandable | "Every claim can be verified" |
| Same layout every report | "There is no hiding in structure variation" |
| Audit surfaces available but collapsed | "The audit trail exists and is accessible" |

---

## 4. Intelligence Layout Architecture

### 4.1 Seven Rendering Regions

The executive report is composed of seven rendering regions, each with a defined purpose and visual priority:

```
┌─────────────────────────────────────────────────────┐
│  REGION_EXECUTIVE_HEADER                             │
│  Readiness badge ◆ Report identity ◆ Scope ◆ Qual   │
├─────────────────────────────────────────────────────┤
│  REGION_INTELLIGENCE_SUMMARY                         │
│  Executive summary ◆ WHY section ◆ Top domains      │
├──────────────────────────┬──────────────────────────┤
│  REGION_EXPLAINABILITY   │  REGION_TOPOLOGY         │
│  7-panel explainability  │  Structural topology     │
│  surface                 │  (Phase 3+ activated)    │
├──────────────────────────┴──────────────────────────┤
│  REGION_DIAGNOSTIC (conditional)                     │
│  Blocked / diagnostic / qualifier notices            │
├─────────────────────────────────────────────────────┤
│  REGION_LINEAGE (collapsed by default)               │
│  Analysis provenance ◆ Baseline ◆ Stream refs        │
├─────────────────────────────────────────────────────┤
│  REGION_AUDIT (audience-gated)                       │
│  Full audit chain ◆ Hash values ◆ Run identifiers   │
└─────────────────────────────────────────────────────┘
```

### 4.2 Region Properties

| Region | Default Visibility | Audience | Collapse Behavior |
|--------|-------------------|---------|--------------------|
| REGION_EXECUTIVE_HEADER | Always visible | ALL | Cannot collapse |
| REGION_INTELLIGENCE_SUMMARY | Always visible | ALL | Cannot collapse |
| REGION_EXPLAINABILITY | Always accessible | ALL | Panels collapse independently |
| REGION_TOPOLOGY | Phase 3+ placeholder | ALL (Phase 3+) | Collapsed in Phase 2 |
| REGION_DIAGNOSTIC | Conditional (governance-driven) | ALL | Cannot suppress if triggered |
| REGION_LINEAGE | Collapsed | ADVISORY+ | Expand by interaction |
| REGION_AUDIT | Audience-gated | AUDIT only | Gated at session |

### 4.3 Region Composition Rules

**REGION_EXECUTIVE_HEADER** must always contain:
- Readiness badge (with ALI-03 executive label)
- Qualifier chip (if qualifier_class ≠ Q-00)
- Report title and scope indicator
- Timestamp (generation date)
- Governance verdict status (as label — not raw PASS/FAIL in executive tier)

**REGION_INTELLIGENCE_SUMMARY** must always contain:
- Executive summary narrative (full text)
- WHY section (primary causal statement)
- Domain evidence summary (count + top contributing domain)
- Propagation summary (one-sentence structural summary)

**REGION_EXPLAINABILITY** must always contain:
- WHY panel (pre-rendered; EXPANDED default)
- EVIDENCE drawers (collapsible per domain)
- QUALIFIERS panel (EXPANDED if qualifier active)
- CONFIDENCE panel (COLLAPSED default; always accessible)
- READINESS_STATE panel (EXPANDED default; always accessible)
- TRACE panel (COLLAPSED; Advisory+ accessible)
- LINEAGE panel (accessible via REGION_LINEAGE; Advisory+)

---

## 5. Visual Hierarchy System

### 5.1 Five-Layer Visual Priority

```
LAYER 1 — VERDICT (highest visual weight; always in view):
  Component: Readiness Badge
  Content: State label + qualifier chip
  Visual treatment: Dominant; primary color token; largest type weight
  Cannot be hidden, minimized, or de-emphasized

LAYER 2 — INTELLIGENCE (high visual weight; always in view):
  Component: Executive Summary + WHY
  Content: Narrative text; causal statement
  Visual treatment: Full-width; readable body; inverted pyramid
  Cannot be replaced with a chart or metric grid

LAYER 3 — EVIDENCE SUMMARY (visible; medium weight):
  Component: Domain evidence cards (summary row)
  Content: Domain aliases; pressure labels; grounding chips
  Visual treatment: Card grid; scannable; qualifier chips inline
  Default: collapsed signal-card detail; one-click expand

LAYER 4 — EVIDENCE DEPTH (expandable; lower weight):
  Component: Evidence drawers; signal cards; propagation path
  Content: Per-signal evidence; propagation narrative; trace summary
  Visual treatment: Drawer expand; structured list; evidence hierarchy
  Default: collapsed; expand on interaction

LAYER 5 — AUDIT (collapsed; minimal executive weight):
  Component: TRACE panel; LINEAGE panel; hash references
  Content: Derivation lineage; baseline references; audit identifiers
  Visual treatment: Compact reference style; audit-tier typography
  Default: collapsed (executive); accessible (advisory+)
```

### 5.2 Color Token System

Color is governance-driven, not aesthetic:

| Token Category | Governance Source | Allowed Uses |
|---------------|------------------|-------------|
| Readiness state tokens | ALI-03 mapping; ReadinessState enum | Readiness badge background; badge text |
| Qualifier tokens | Q-taxonomy chip styles | Qualifier chip; affected module border |
| Pressure tier tokens | PressureTier enum; NORM-PROP-01 | Signal card pressure indicator |
| Diagnostic token | DIAGNOSTIC_ONLY state | Diagnostic banner; diagnostic panel border |
| Blocked token | BLOCKED state; governance_verdict FAIL | Blocked notice; blocked module overlay |
| Neutral surface | N/A | Background; card surface; typography |

**Forbidden color uses:**
- Aesthetic gradients for hero sections
- Green/red for readiness when token system is defined
- Red for "bad" signals without governance basis
- Color-only encoding (must have text and/or icon reinforcement)
- Unauthorized custom colors outside the design token system

### 5.3 Typography Hierarchy

| Level | Purpose | Style Class |
|-------|---------|-------------|
| Report Title | Report identity | `.report-title` — largest; highest weight |
| Readiness Label | State verdict | `.readiness-label` — dominant; state-token color |
| Section Header | Region/panel titles | `.section-header` — clear; authoritative |
| Narrative Body | Executive summary; WHY | `.narrative-body` — readable; 16–18px |
| Evidence Body | Signal cards; evidence text | `.evidence-body` — compact; 14–16px |
| Label | Chips; metadata labels | `.label` — small; uppercase tracking |
| Audit Reference | Hash refs; stream IDs | `.audit-ref` — monospace; muted color |

**Forbidden typography uses:**
- Decorative fonts in intelligence surfaces
- Italic body text for primary intelligence statements
- Font size as the only hierarchy mechanism
- All-caps primary narrative text

---

## 6. Executive Information Density Model

### 6.1 Density Philosophy

Density is a feature, not a problem. Executives expect to engage with complex structural intelligence in a compact, navigable form. Density is managed through:

1. **Structure** — visual grouping, consistent grid, clear regions
2. **Progressive disclosure** — default collapsed for depth layers; expand on demand
3. **Type hierarchy** — visual weight differentiates primary from secondary content
4. **Whitespace as separator** — whitespace between intelligence layers, not within them

### 6.2 Density Classes

| Class | Use | Typical Content |
|-------|-----|----------------|
| EXECUTIVE_DENSE | Primary report surface | Summary + evidence cards + expandable panels |
| EXECUTIVE_BALANCED | Single-domain focus view | One domain's evidence + propagation |
| INVESTIGATION_DENSE | Advisory evidence review | All evidence drawers open; signal cards expanded |
| AUDIT_DENSE | Full audit review | All panels open; hash refs visible; lineage expanded |

### 6.3 Information Priority Rules

When screen space is constrained:

| Priority | Content | Can Compress? |
|----------|---------|--------------|
| P1 | Readiness badge + label | NO — always full size |
| P2 | Executive summary (first paragraph) | NO — always visible |
| P3 | WHY section (primary statement) | NO — always visible |
| P4 | Domain evidence summary (top 3) | YES — expand affordance remains |
| P5 | Signal cards (collapsed per domain) | YES — summary row only |
| P6 | Propagation summary | YES — one sentence |
| P7 | Explainability panels | YES — collapsed; always accessible |
| P8 | TRACE / LINEAGE / AUDIT | YES — collapsed; audience-gated |

No content is removed in constrained layouts. Compression means visible-but-collapsed, not absent.

### 6.4 Forbidden Density Anti-Patterns

| Anti-Pattern | Why Forbidden |
|-------------|--------------|
| Truncating executive summary without expand | Evidence is hidden — governance violation |
| Hiding qualifier chip to clean up header | Qualifier suppression — governance violation |
| Rendering only top-1 domain evidence | Evidence incompleteness without notice |
| "See full report" link to separate page | Evidence should not be behind a second navigation |
| Infinite scroll replacing progressive disclosure | Destroys visual region structure |

---

## 7. Explainability Surface Placement

### 7.1 Placement Architecture

The explainability bundle occupies REGION_EXPLAINABILITY. In Phase 2, panels are rendered inline within the report as expandable sections.

```
PHASE 2 EXPLAINABILITY PLACEMENT:

REGION_INTELLIGENCE_SUMMARY
  ├── [Always visible] Executive summary
  ├── [Always visible] WHY section
  └── [Always visible] Domain evidence summary

REGION_EXPLAINABILITY (inline sections):
  ├── EVIDENCE DRAWERS — inline accordion per domain
  │   [Collapsed default → Expand on click]
  ├── QUALIFIERS PANEL — inline section
  │   [Expanded if qualifier active; collapsed if Q-00]
  ├── CONFIDENCE PANEL — inline section
  │   [Collapsed default; expand affordance always present]
  ├── READINESS_STATE PANEL — inline section
  │   [Expanded default; accessible from header badge interaction]
  ├── TRACE PANEL — inline section [Advisory+]
  │   [Collapsed; access button "View Analysis Trace"]
  └── LINEAGE PANEL — inline section [Advisory+]
      [Collapsed; access button "View Analysis Provenance"]
```

### 7.2 Phase 3 Slide-Out Preparation

Phase 3 will activate explainability panels as slide-out drawers from a persistent sidebar. Phase 2 architecture must be compatible with this evolution:

- Panel components are standalone rendering units (no parent dependency)
- Panel IDs are stable and addressable
- Panel content is not embedded inline in other components
- Expand/collapse affordances are implementation-independent

### 7.3 Explainability Access Affordances

| Access Point | Trigger | Panel Activated |
|-------------|---------|----------------|
| Readiness badge interaction | Click/tap | READINESS_STATE panel |
| Qualifier chip interaction | Click/tap | QUALIFIERS panel |
| "View Evidence" button | Click | EVIDENCE drawers |
| "View Analysis Trace" link | Click | TRACE panel (Advisory+) |
| "View Coverage Details" link | Click | CONFIDENCE panel |
| Domain card interaction | Click | Domain-specific EVIDENCE drawer |

All access affordances use vocabulary from `executive_vocabulary_contract.json` interaction_labels section.

---

## 8. Signal Card Rendering Semantics

### 8.1 Signal Card Structure

```
SIGNAL CARD:
┌────────────────────────────────────────────┐
│  [Signal Label]           [Qualifier Chip] │
│  [Domain Alias]                            │
│  [Pressure Label]    [Pressure Indicator]  │
│  ─────────────────────────────────────────│
│  [Evidence Text]                           │
└────────────────────────────────────────────┘
```

### 8.2 Signal Card Visual Rules

| Element | Rendering Rule |
|---------|---------------|
| Signal label | ALI-01 or ALI-02 executive label; raw keys forbidden |
| Domain alias | ALI-04 client alias; raw domain IDs forbidden |
| Pressure label | NORM-PROP-01 tier label; numerical values forbidden |
| Pressure indicator | Pressure-tier color token (HIGH/ELEVATED/MODERATE/LOW) |
| Qualifier chip | Q-taxonomy chip style (AMBER/BLUE/GREY); empty for Q-00 |
| Evidence text | Vocabulary contract applied; forbidden terms excluded |

### 8.3 Signal Card Grouping

Signal cards are grouped by domain (evidence drawer). Within a domain:

- Ordered by pressure tier: HIGH first, then ELEVATED, then MODERATE, then LOW
- Maximum visible per domain summary: top-3 (full list in expanded drawer)
- Qualifier chip present on each card with active qualifier (not just on domain header)

### 8.4 Prohibited Signal Card Renderings

- Raw signal keys: `cpi_score`, `cfa_score`, `CPI`, `CFA` — forbidden in any visible text
- Numerical signal values — forbidden in executive surface
- Threshold values — forbidden in executive surface
- Comparative metrics without grounded comparative evidence
- "Trend arrows" that imply temporal prediction

---

## 9. Topology Rendering Semantics

### 9.1 Phase 2 Topology Placeholder

In Phase 2, the topology region is a placeholder. The structural topology is communicated through:

- Domain evidence cards (ALI-04 aliases)
- Propagation path text (TRACE panel)
- Propagation role labels (ORIGIN / RECEIVER / PASS-THROUGH / ISOLATED)

A topology visualization component is not rendered in Phase 2.

### 9.2 Phase 3+ Topology Rendering Rules

When the topology region is activated (Phase 3+):

| Rule | Requirement |
|------|-------------|
| Read-only display | No user modification of topology nodes or edges |
| ALI-04 aliases only | No raw domain IDs or cluster keys visible |
| No numerical topology data | No edge weights, topology metrics, or score values |
| Pressure color tokens | Pressure tier → design token only; no numerical values |
| Structural only | No operational platform terminology unless client-aliased |
| No topology "correction" | User cannot flag or edit topology configuration |

### 9.3 Topology Simplification Rules

| Principle | Implementation |
|-----------|---------------|
| Summary by default | Show domain-level topology; cluster detail on expand |
| Propagation path highlighted | Origin→Receiver path highlighted when TRACE panel active |
| No node overload | Maximum visible nodes in summary view: 5–7 domains |
| Alias-only labels | Domain and cluster labels from ALI-04/ALI-05; never raw keys |
| No animation for topology propagation | Direction shown statically; no animated flow |

### 9.4 Topology Immutability Enforcement

- Topology display object is READ-ONLY from canonical_topology.json
- Any user interaction with topology nodes is display navigation, not editing
- No "topology correction" or "flag this domain" interaction in any phase
- No GEIOS topology internals (canonical_topology.json path, cluster IDs) visible in topology region

---

## 10. Readiness and Qualifier Rendering

### 10.1 Readiness Badge Rendering

The readiness badge is the highest-priority visual element in the report:

```
READINESS BADGE:
┌────────────────────────────────────────────┐
│  ● [State Color Token]  [State Label]      │
│  [Qualifier Chip — if active]              │
│  [Scope indicator — if partial grounding]  │
└────────────────────────────────────────────┘
```

| ReadinessState | Executive Label | Badge Token |
|----------------|----------------|-------------|
| EXECUTIVE_READY | "Executive Ready" | token-ready (defined in design system) |
| EXECUTIVE_READY_WITH_QUALIFIER | "Executive Ready — Qualified" | token-ready-qualified |
| DIAGNOSTIC_ONLY | "Under Structural Review" | token-diagnostic |
| SUPPRESSED_FROM_EXECUTIVE | "Not Available" | token-suppressed |
| BLOCKED_PENDING_DOMAIN_GROUNDING | "Pending Grounding" | token-blocked |

**Badge rendering rules:**
- Badge is always the first rendered element in REGION_EXECUTIVE_HEADER
- Badge token (color) is derived from ReadinessState; never from user preference
- Raw ReadinessState enum values are forbidden in badge text
- Badge cannot be replaced with a generic status indicator
- Badge cannot be hidden in any view mode

### 10.2 Qualifier Chip Rendering

| Qualifier | Chip Label | Chip Token | Tooltip Source |
|-----------|-----------|-----------|---------------|
| Q-00 | No chip | N/A | N/A |
| Q-01 | "Partial Grounding" | token-qualifier-amber | Q-taxonomy tooltip (pre-rendered) |
| Q-02 | "Structural View" | token-qualifier-blue | Q-taxonomy tooltip (pre-rendered) |
| Q-03 | "Under Review" | token-qualifier-grey | Q-taxonomy tooltip (pre-rendered) |
| Q-04 | No chip; absence notice | N/A | Absence notice text |

**Qualifier rendering rules:**
- Chips are rendered inline with the readiness badge
- Chip tooltip is pre-rendered Q-taxonomy text — not AI-generated
- Q-04 renders an absence notice section — never silently absent
- No qualifier chip can be hidden to improve visual simplicity
- Chip label text is from vocabulary contract; raw Q-xx values forbidden

### 10.3 Propagation Role Rendering

| Role | Display Label | Visual Treatment |
|------|--------------|-----------------|
| ORIGIN | "Origin of Pressure" | Distinct indicator (e.g., source icon) |
| RECEIVER | "Pressure Receiver" | Directional indicator |
| PASS_THROUGH | "Pressure Pass-through" | Flow indicator |
| ISOLATED | "Independent Domain" | Neutral indicator |

Role labels use exact vocabulary from `executive_vocabulary_contract.json` evidence_vocabulary.propagation_role_labels. Raw enum values (ORIGIN, RECEIVER, etc.) are forbidden in executive surface.

---

## 11. Blocked and Diagnostic Rendering

### 11.1 Blocked-State Rendering

Blocked state renders an explicit notice that replaces the affected intelligence content:

```
BLOCKED MODULE:
┌────────────────────────────────────────────────────┐
│  ⚠ Readiness classification unavailable            │
│  ─────────────────────────────────────────────────│
│  Reason: [Governance verdict: FAIL]                │
│       or [Evidence integrity: UNVERIFIED]          │
│  ─────────────────────────────────────────────────│
│  [View Audit Trace]  (Advisory/Audit tier only)    │
└────────────────────────────────────────────────────┘
```

**Blocked rendering rules:**
- Blocked notice is explicit — never blank, never "loading"
- Blocked module uses `token-blocked` visual treatment (not readiness token)
- Intelligence content is not partially rendered behind a blocked module
- No "retry" or "regenerate" affordance in Phase 2
- Audit trace access available to Advisory+ tier even in blocked state

### 11.2 Diagnostic-State Rendering

Diagnostic state renders a notice alongside (not replacing) the affected content:

```
DIAGNOSTIC BANNER:
┌────────────────────────────────────────────────────┐
│  ℹ This report contains content under advisory     │
│    review. Advisory confirmation recommended.       │
└────────────────────────────────────────────────────┘
```

**Diagnostic rendering rules:**
- Diagnostic banner appears at the top of REGION_EXECUTIVE_HEADER
- Affected panels show a diagnostic indicator (visual treatment: `token-diagnostic` border)
- Intelligence content remains visible with diagnostic frame
- Diagnostic state does not visually suppress any panel
- Advisory notice is explicit; the word "advisory" is always present

### 11.3 Suppression Notice Rendering (Q-04)

When qualifier_class = Q-04, affected sections render:

```
SUPPRESSION NOTICE:
┌────────────────────────────────────────────────────┐
│  Signal intelligence withheld from this view.      │
└────────────────────────────────────────────────────┘
```

The suppression notice is a first-class rendered element — not a tooltip, not a footnote. It occupies the space where the affected content would have appeared.

---

## 12. Responsive Rendering Model

### 12.1 Viewport Behavior

The executive report adapts to viewport context without losing intelligence depth:

| Viewport | Layout Adjustment |
|----------|------------------|
| Desktop (≥1200px) | Two-column: explainability left; evidence right; topology Phase 3+ right |
| Tablet (768–1199px) | Single column; all regions stacked; progressive disclosure unchanged |
| Presentation mode (≥1400px, fullscreen) | Enlarged readiness badge; enlarged narrative; reduced depth by default |
| Print / PDF | All regions printed; collapsed panels expanded; audit tier optional |

### 12.2 Responsive Compression Rules

| Content | Responsive Behavior |
|---------|-------------------|
| Readiness badge | Never compressed; scales proportionally |
| Executive summary | Full text always visible; no truncation |
| Qualifier chips | Always visible; never hidden on narrow viewport |
| Domain evidence cards | Stack vertically; no horizontal scroll |
| Signal cards | Collapse to summary row (count + top signal) |
| Explainability panels | Stack vertically; same expand/collapse behavior |
| TRACE/LINEAGE | Remain collapsed; same access affordance |

### 12.3 Forbidden Responsive Behaviors

- Hiding the readiness badge on narrow viewport
- Truncating the executive summary with "read more" without showing full text
- Hiding qualifier chips on narrow viewport
- Replacing evidence cards with a count-only metric
- Requiring horizontal scrolling for primary intelligence content

---

## 13. Workspace Compatibility Model

### 13.1 Phase 2 Compatibility Requirements

The Phase 2 report must be structurally compatible with the Phase 3 workspace shell without requiring re-architecture:

| Requirement | Implementation |
|------------|---------------|
| Module independence | Each intelligence module is a standalone rendering unit |
| Stable module IDs | Module registry entries use stable, deterministic IDs |
| Panel addressability | Explainability panels are addressable by panel_id |
| Content separation | Content not embedded in layout code |
| Token-based styling | All colors via design tokens; no hardcoded values |
| No workspace dependencies | Phase 2 report works without workspace shell |

### 13.2 Phase 3 Evolution Slots

Phase 2 report structure reserves the following slots for Phase 3 activation:

| Slot | Phase 3 Activation |
|------|-------------------|
| Topology region placeholder | Topology visualization component |
| Explainability sidebar slot | Slide-out panel container |
| Cross-report navigation slot | Workspace report switcher |
| EVIDENCE_DRAWER interaction | Enhanced drawer with richer evidence navigation |

These slots are structurally reserved but empty in Phase 2. No Phase 3 code is activated.

### 13.3 Design Token Architecture

The design token system must be defined before any implementation begins:

| Token Category | Governance Source |
|---------------|-----------------|
| Readiness state tokens | ALI-03 mapping; ReadinessState enum |
| Qualifier tokens | Q-taxonomy (Q-00..Q-04) |
| Pressure tier tokens | PressureTier enum |
| Diagnostic token | DIAGNOSTIC_ONLY governance state |
| Blocked token | governance_verdict FAIL |
| Typography scale | Section §5.3 |
| Spacing scale | Intelligence layout model (intelligence_layout_model.md) |

Design tokens are not aesthetic preferences — they are governance outputs. Token values cannot be changed without updating the governance mapping that defines them.

---

## 14. Governance Preservation

### 14.1 Rendering Governance Rules

| Rule ID | Rule | Enforcement |
|---------|------|------------|
| PUI-GOV-01 | Rendering cannot reinterpret intelligence | Report_object content is rendered, never interpreted |
| PUI-GOV-02 | Rendering cannot suppress qualifiers | Qualifier chips mandatory per EXP-QUAL-01 |
| PUI-GOV-03 | Rendering cannot alter readiness state | readiness_state token is immutable from report_object |
| PUI-GOV-04 | Rendering cannot expose GEIOS internals | Forbidden vocabulary enforced at render |
| PUI-GOV-05 | Blocked states are explicit | EXP-BLOCK-01; token-blocked renders blocked notice |
| PUI-GOV-06 | Diagnostic states are explicit | EXP-DIAG-01; token-diagnostic renders diagnostic notice |
| PUI-GOV-07 | No conversational UI surfaces | No text input, no AI assistant UX in any region |
| PUI-GOV-08 | No probabilistic confidence visualization | EXP-CONF-01; no confidence bars, no percentage displays |
| PUI-GOV-09 | Topology is read-only display | No edit, annotate, or modify affordances on topology region |
| PUI-GOV-10 | Deterministic rendering | Same report_object → same visual output, always |

### 14.2 Phase 2 Visual Restrictions

| Restriction | Status in Phase 2 |
|------------|-------------------|
| No conversational pane | ABSENT — no UI region reserved |
| No free-form text input | ABSENT — no input fields in any region |
| No AI assistant avatar | ABSENT — no AI persona in visual system |
| No investigation flow | ABSENT — INVESTIGATION_ENTRY registered but inactive |
| No copilot entry | ABSENT — COPILOT_ENTRY registered but inactive |
| No topology interactive editor | ABSENT — topology region placeholder only |
| No real-time data refresh | ABSENT — report renders from committed report_object |

---

## 15. Validation

See `PROFESSIONAL_UI_VALIDATION.md` for the complete validation record.

**Validation verdict:** PROFESSIONAL_UI_ARCHITECTURE_VIABLE  
**Executive rendering doctrine defined:** PASS  
**Seven rendering regions defined:** PASS  
**Visual hierarchy (5 layers) defined:** PASS  
**Density model defined:** PASS  
**Explainability placement defined:** PASS  
**Signal card semantics defined:** PASS  
**Topology rendering semantics defined:** PASS  
**Qualifier rendering semantics defined:** PASS  
**Blocked/diagnostic rendering defined:** PASS  
**Workspace compatibility defined:** PASS  
**No code implementation:** PASS  

---

*Stream PI.LENS.NEXTGEN-REPORTS.PROFESSIONAL-UI.01 — COMPLETE*  
*Baseline: governed-dpsig-baseline-v1 (092e251)*  
*Issued: 2026-05-08*
