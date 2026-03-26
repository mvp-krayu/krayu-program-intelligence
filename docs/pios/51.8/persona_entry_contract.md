# Persona Entry Contract — 51.8

Stream: 51.8 — Guided Demo Choreography
Date: 2026-03-26

---

## Persona-First Entry

### Visible Step Structure

On page load (pre-demo state):

```
Step 1 — Select your lens persona   [active]
Step 2 — Start Lens Demo            [inactive]
[Start Lens Demo button — disabled]
```

After persona selected:

```
Step 1 — Select your lens persona ✓ ANALYST   [done]
Step 2 — Start Lens Demo                       [active]
[Start Lens Demo button — enabled]
```

### Implementation

Hero section (index.js):
```jsx
{!demoActive && (
  <div className="guided-entry-steps">
    <div className={`guided-step${enlPersona ? ' guided-step-done' : ' guided-step-active'}`}>
      <span className="guided-step-num">1</span>
      <span className="guided-step-label">Select your lens persona</span>
      {enlPersona && <span className="guided-step-persona">{enlPersona}</span>}
    </div>
    {!enlPersona && (
      <div className="persona-gate-message">Select a Persona to enable execution</div>
    )}
    <div className={`guided-step${enlPersona ? ' guided-step-active' : ''}`}>
      <span className="guided-step-num">2</span>
      <span className="guided-step-label">Start Lens Demo</span>
    </div>
    <button className="demo-start-btn" onClick={handleStartDemo} disabled={!enlPersona}>
      Start Lens Demo
    </button>
  </div>
)}
```

### Panel Ordering

PersonaPanel is the first DisclosurePanel rendered (pre-demo: `useState(['persona'])`).
User sees persona selector immediately on page load without needing to scroll or infer.

### Preserved from 51.7

- Persona hard gate: `if (!enlPersona) return` in handleStartDemo
- `disabled={!enlPersona}` on Start button
- `persona-gate-message` class: "Select a Persona to enable execution"
- Evidence blocked without persona

### Scope Boundary

This contract governs entry choreography only.
Persona data fetch, ENL rendering, traversal execution — unchanged from prior streams.

## Contract Authority

PIOS-51.8-RUN01-CONTRACT-v1
