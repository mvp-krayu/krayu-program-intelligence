# Entry Strip Layout — 51.8R

Stream: 51.8R — Entry Strip + Analyst Raw Evidence Access
Date: 2026-03-26
Branch: feature/51-8R-entry-strip-analyst-access
Baseline: f5525dc (stream 51.8)

---

## Change

51.8 rendered guided entry steps as a vertical centered stack. This was corrected
to a horizontal left-aligned strip where Step 1 and Step 2 appear on a single line.

## Before (51.8)

```
        [center]
Step 1 — Select your lens persona
   Select a Persona to enable execution  ← gate message inline
Step 2 — Begin guided execution
[Start Lens Demo button]
```

`flex-direction: column; align-items: center`

## After (51.8R)

```
[left]  1 — Select your lens persona  →  2 — Begin guided execution  [Start Lens Demo]
        Select a Persona to enable execution  ← gate message below strip
```

`.guided-entry-strip`: `flex-direction: row; align-items: center`
`.guided-entry-steps`: `align-items: flex-start` (overrides 51.8 center)

## HTML Structure

```jsx
<div className="guided-entry-steps">
  {/* Horizontal row */}
  <div className="guided-entry-strip">
    <div className="guided-step ...">1 — Select your lens persona [✓ ANALYST]</div>
    <span className="guided-step-arrow">→</span>
    <div className="guided-step ...">2 — Begin guided execution</div>
    <button className="demo-start-btn" disabled={!enlPersona}>Start Lens Demo</button>
  </div>
  {/* Gate message — below strip, not inline */}
  {!enlPersona && <div className="persona-gate-message">Select a Persona to enable execution</div>}
</div>
```

## Preserved

- Step 1 and Step 2 states (active / done) intact
- persona-gate-message present and functional
- disabled={!enlPersona} on Start button
- Persona hard gate in handleStartDemo

## Contract Authority

PIOS-51.8R-RUN01-CONTRACT-v1
