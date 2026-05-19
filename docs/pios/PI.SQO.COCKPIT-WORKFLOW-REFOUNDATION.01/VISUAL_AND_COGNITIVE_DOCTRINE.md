# Visual and Cognitive Doctrine

> **Authority:** This document defines the visual and cognitive principles for the V2 cockpit. It is not a style guide — it is an operational rendering philosophy.

---

## Identity

The cockpit is **professional operator software**.

It is not:
- an admin panel
- a developer dashboard
- an engineering debug surface
- a report browser
- a data table viewer

It is:
- a governed qualification command surface
- a progression-aware operational console
- a semantic authority workflow system

The visual standard is: **Palantir-grade operator coherence** with **governed qualification semantics**.

---

## Anti-Dashboard Doctrine

The cockpit rejects the dashboard paradigm:

| Dashboard Pattern | Cockpit Pattern |
|---|---|
| Equal-weight metric cards | Hierarchy: posture dominates, detail is progressive |
| Everything visible simultaneously | Progressive disclosure: Level 0 → Level 3 |
| User decides what matters | System determines what matters (workflow resolver) |
| Navigation = browsing | Navigation = workflow-driven progression |
| Charts and graphs as primary content | Operational state and actions as primary content |
| Refresh-to-update | State-driven (artifacts are pre-resolved) |

---

## Cognitive Pacing

The cockpit controls information density through pacing:

### Entry Moment (Level 0)

The operator enters the cockpit. They see:

1. **Posture badge** — S-level + posture label. Large. Dominant. The single most important datum.
2. **Primary guidance** — One sentence. What to do next. Linked to the action surface.
3. **Blocker summary** — Count + lane classification. Not individual blocker detail.
4. **Progression path** — Linear visualization. Current step highlighted.

This is 4 pieces of information. Not 15 sections. Not 40 metrics.

### First Interaction (Level 1)

The operator clicks on guidance, a blocker lane, or a progression step. They see:

- Blocker detail for that lane
- Available actions filtered by role
- Obligation queue if review actions are pending
- Evidence state relevant to the current progression step

This is contextual expansion. The information that appears is determined by what the operator interacted with.

### Deep Investigation (Level 2-3)

The operator explicitly requests qualification detail or forensic investigation. They see:

- Full panel content (existing V1 panels)
- Artifact-level data
- Engineering telemetry

This is expert territory. The standard operator workflow never requires it.

---

## Visual Hierarchy

### Primary Surface (Posture + Guidance)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│    S1         PERMANENTLY UNQUALIFIABLE                         │
│    ████                                                         │
│                                                                 │
│    Permanent insufficiency acknowledged. Evidence does not       │
│    support further qualification progression.                   │
│                                                                 │
│    ────────────────────────────────────────────────────────────  │
│                                                                 │
│    ● Structural Onboarding ─── ● Semantic Derivation ─── ◉ X   │
│      complete                    complete                 term  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

The S-level badge is the largest typographic element. The posture label is the dominant text. Guidance is the operational directive. Progression path shows journey context.

### Secondary Surface (Blockers + Actions)

```
┌─────────────────────────────────┬───────────────────────────────┐
│  BLOCKERS (3)                   │  AVAILABLE ACTIONS            │
│                                 │                               │
│  ■ evidence      2 items        │  Review Accept    ● available │
│  ■ crosswalk     1 item         │  Review Reject    ● available │
│  ■ governance    0 items        │  Promotion Req    ⊘ blocked   │
│                                 │    → 3 blockers remaining     │
│                                 │  Insufficiency    ● available │
│                                 │                               │
└─────────────────────────────────┴───────────────────────────────┘
```

Blockers and actions are side-by-side. The operator sees pressure (left) and capability (right) simultaneously.

### Tertiary Surface (Drill-down Content)

Existing V1 panels render here. No change to their internal visual design.

---

## Cinematic Depth

The cockpit uses controlled visual depth to communicate hierarchy:

| Depth Layer | Background | Border | Content |
|---|---|---|---|
| Base (page) | `#0d0f14` | none | Nothing — the darkness behind |
| Surface (primary panels) | `#141720` | `#2a2f40` | Posture, guidance, actions |
| Card (secondary content) | `#1a1e2b` | `#1e2330` | Blockers, obligations, evidence state |
| Deep (tertiary/forensic) | `#12151f` | `#1e2330` | Forensic panel content |
| Emphasis (active state) | transparent | `#4a9eff` left border | Active blocker lane, current progression step |

This is the existing design system from the CSS work. No new colors. No new variables. Depth is communicated through background darkness — primary surfaces are lighter, forensic surfaces are darker.

---

## Posture-Driven Color

The posture state determines the accent coloring of the primary surface:

| Posture | Accent | Meaning |
|---|---|---|
| STRUCTURAL_ONLY | `#7a8aaa` (dim) | Neutral — no semantic authority |
| SEMANTIC_INTAKE | `#4a9eff` (blue) | Active — work to do |
| QUALIFICATION_PENDING | `#ffd700` (yellow) | Attention — obligations pending |
| CROSSWALK_ACTIVE | `#4a9eff` (blue) | Active — work to do |
| RECONCILIATION_ACTIVE | `#4a9eff` (blue) | Active — work to do |
| QUALIFIED | `#64ffda` (green) | Positive — qualified |
| INSUFFICIENT_EVIDENCE | `#ff9e4a` (orange) | Caution — insufficient |
| PERMANENTLY_UNQUALIFIABLE | `#ff6b6b` (red) | Terminal — no progression |

The accent color appears on:
- S-level badge border
- Posture label text
- Progression path current/terminal step
- Primary guidance urgency indicator

NOT on: backgrounds, large areas, decorative elements. Accents are precise.

---

## Typography Hierarchy

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| S-level badge | Monospace | 32-40px | Bold | Posture accent |
| Posture label | Monospace | 18-20px | Normal | `#ccd6f6` |
| Primary guidance | System sans-serif | 15-16px | Normal | `#ccd6f6` |
| Section headings | Monospace | 14-16px | Bold | `#ccd6f6` |
| Body/description | System sans-serif | 13-14px | Normal | `#7a8aaa` |
| Data values | Monospace | 13px | Normal | `#ccd6f6` |
| Labels/badges | Monospace | 10-11px | Normal uppercase | `#4a5570` |
| Governance notices | Monospace | 10px | Normal | `#4a5570` |

Monospace for data and system language. Sans-serif for human-readable description and guidance.

---

## Interaction Principles

1. **Click targets are generous.** No 10px hit zones. Minimum 36px height for interactive elements.
2. **Hover states are subtle.** Background lightening, not color change. `transition: all 0.15s ease`.
3. **Focus states are visible.** Keyboard navigation works. `focus-visible` styles present.
4. **Actions are confirmed.** Governed mutations require explicit confirmation (already implemented in authority workflow).
5. **Navigation is instant.** Client-side routing with shallow updates. No full page reloads.
6. **State changes are visible.** After an action, the cockpit re-resolves workflow state and the UI reflects the change.

---

## Prohibited Visual Patterns

1. **Neon/glow effects** — Not operational software
2. **Decorative animation** — No gratuitous motion
3. **Color gradients** — Flat, controlled backgrounds only
4. **Icon-heavy navigation** — Text labels, not icon guessing
5. **Tooltip-dependent information** — If it matters, render it. Don't hide it behind hover.
6. **Modal dialogs for navigation** — Modals for confirmation only, never for navigation
7. **Infinite scroll** — Paginate or collapse. The operator must know the boundaries.
8. **Empty states with illustrations** — If data doesn't exist, say so. No decorative empty states.
9. **Loading spinners as content** — Data is server-rendered. No client-side loading states for primary content.

---

## Operational Clarity Standard

Every rendered element must answer the operator's question within 2 seconds of viewing:

- **Posture badge** → "What is my qualification state?" (0.5s)
- **Primary guidance** → "What do I do next?" (1s)
- **Blocker summary** → "What's preventing advancement?" (1.5s)
- **Action grid** → "What can I do with my authority?" (2s)

If the operator must read documentation, browse multiple surfaces, or mentally reconstruct state to answer any of these questions — the cockpit has failed.
