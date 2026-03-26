# Persona Guard — 51.7

Stream: 51.7 — Persona Hard Gate
Date: 2026-03-26

---

## Behavior

IF `enlPersona === null`:

- `handleStartDemo` returns immediately — demo does NOT start
- `setDemoActive(true)` is NOT called
- `setTraversalNodeIndex`, `setSelectedFlow`, `setOpenPanels` are NOT called
- UI shows: "Select a Persona to enable execution"
- Start button is `disabled={!enlPersona}`

## Implementation

```javascript
const handleStartDemo = () => {
  // Persona hard gate — execution blocked without explicit selection [51.7]
  if (!enlPersona) return
  ...
}
```

## Forbidden Patterns Removed

- `if (!enlPersona) setEnlPersona('CTO')` — silent default (51.6R.4) — REMOVED
- `PERSONA_DEFAULT_FLOW.CTO` — fallback inference — REMOVED

## Blocked State

```jsx
{!demoActive && !enlPersona && (
  <div className="persona-gate-message">Select a Persona to enable execution</div>
)}
{!demoActive && (
  <button ... disabled={!enlPersona}>Start Lens Demo</button>
)}
```

## Contract Authority

PIOS-51.7-RUN01-CONTRACT-v1
