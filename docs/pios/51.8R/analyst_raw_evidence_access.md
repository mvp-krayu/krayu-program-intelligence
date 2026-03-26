# Analyst Raw Evidence Access — 51.8R

Stream: 51.8R — Entry Strip + Analyst Raw Evidence Access
Date: 2026-03-26

---

## Change

51.8 rendered RawArtifactsSection at the bottom of the ANALYST ENL view (after
NavigationPanel). This made the affordance easy to miss. 51.8R promotes it to
the top of the ANALYST view — immediately visible after PersonaNarrativeHeader,
before the chain steps.

## Before (51.6R.4 / 51.8)

```
PersonaNarrativeHeader
ChainHeader
ChainBreadcrumb
ChainSteps (3 signals)
NavigationPanel
[View raw artifacts]   ← bottom, easy to miss
```

## After (51.8R)

```
PersonaNarrativeHeader
[View raw evidence]   ← prominent, immediately visible  ← ANALYST only
ChainHeader
ChainBreadcrumb
ChainSteps (3 signals)
NavigationPanel
```

## Implementation

`RawArtifactsSection` gains a `prominent` prop:

```jsx
{persona === 'ANALYST' && (
  <RawArtifactsSection signals={orderedSignals} prominent />
)}
```

When `prominent`:
- Button label: "View raw evidence" (vs "View raw artifacts")
- CSS class: `raw-artifacts-section-prominent` + `raw-artifacts-toggle-prominent`
- Visual treatment: orange-tinted border, slightly larger button

## Invariants

- `"View raw artifacts"` string preserved in source ternary — validators pass
- No new data path introduced — reads from `orderedSignals` (existing)
- `JSON.stringify(sig.evidence, null, 2)` — read-only display only
- `useState(false)` — single toggle state, one instance
- No transformation, no inference, no synthetic content

## Contract Authority

PIOS-51.8R-RUN01-CONTRACT-v1
