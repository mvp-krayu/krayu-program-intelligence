# Workspace Grid Architecture

## Layout Structure

```
┌──────────────────────────────────────────────────────┐
│ SQO Cockpit (.sqo-cockpit, flex row)                 │
├──────────┬───────────────────────────────────────────┤
│          │                                           │
│  NAV     │  CONTENT (.sqo-cockpit__content)          │
│  RAIL    │                                           │
│  220px   │  [overview: SQOCognitiveLayoutShell]      │
│  sticky  │  [section: SQOWorkspacePanel]             │
│          │                                           │
│          │                                           │
│          │                                           │
│          │                                           │
│          │                                           │
├──────────┴───────────────────────────────────────────┤
│ (governance footer is inside content zones)           │
└──────────────────────────────────────────────────────┘
```

## Grid Stability

The workspace grid is stable because:
- Navigation rail has fixed 220px width (`flex-shrink: 0`)
- Content area is fluid (`flex: 1; min-width: 0`)
- Navigation is sticky (`position: sticky; top: 0`)
- Content overflow is hidden (`overflow-x: hidden`)
- Shell remains mounted — no layout reflow on panel switch

## Overview Layout (Cognitive Shell)

When activeSection is 'overview', the content area renders:
```
┌────────────────────────────────────────┐
│ Ribbon (state, auth, debt, maturity)   │
├────────────────────────────────────────┤
│ Hero Region (S-state, blockage)        │
├────────────────────────────────────────┤
│ Blocker Dominance (if blockers exist)  │
├──────────┬─────────────────────────────┤
│ Workflow │ Stage Cluster               │
│ Spine    ├─────────────────────────────┤
│ 220px    │ Progression Rail            │
├──────────┴─────────────────────────────┤
│ Deferred Debt (collapsed by default)   │
├────────────────────────────────────────┤
│ Forensic Links                         │
├────────────────────────────────────────┤
│ Governance Footer                      │
└────────────────────────────────────────┘
```

## Section Layout

When activeSection is a detail section, the content area renders:
```
┌────────────────────────────────────────┐
│ Section Panel (full width)             │
│ (animated entry: 0.15s ease-out)       │
└────────────────────────────────────────┘
```
