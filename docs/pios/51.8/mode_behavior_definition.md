# Mode Behavior Definition — 51.8

Stream: 51.8 — Guided Demo Choreography
Date: 2026-03-26

---

## Two Modes

### Free Explore (`demoActive === false`)

- All panels toggleable via user interaction
- `handleToggle(panelId)` → calls `togglePanel(panelId)` — max 2 panels open
- Persona click → `openPanel('evidence')` fires [51.6R.3]
- No traversal sequencing
- Query selection available
- PersonaPanel starts open (initial state)

### Guided Demo (`demoActive === true`)

- Panels opened by choreography only
- `handleToggle(panelId)` returns early: `if (demoActive) return`
- Manual panel clicks do NOT open or close panels
- Panel revealed by `handleDemoNext` → `setOpenPanels([panels[nextIndex]])`
- Single-focus-node: exactly one panel open at a time [51.6]
- DemoController TraversalBar shows position
- Persona-shaped reveal order via PERSONA_DEFAULT_FLOW

---

## Mode Separation Rule

Manual interaction during guided demo CANNOT:
- Open a panel
- Close a panel
- Switch to free explore state
- Advance traversal out of order

The mode separation is enforced by `handleToggle`:

```javascript
const handleToggle = useCallback((panelId) => {
  if (demoActive) return  // guided mode: no manual toggle [51.8]
  togglePanel(panelId)
}, [demoActive, togglePanel])
```

---

## Mode Transitions

| Event | From | To | Effect |
|---|---|---|---|
| handleStartDemo (with persona) | free explore | guided | setDemoActive(true), traversal begins |
| handleDemoExit | guided | free explore | setDemoActive(false), setSelectedFlow(null) |
| handleDemoNext (final node) | guided | free explore | calls handleDemoExit |

---

## Non-Regression

Free explore mode behavior is unchanged from prior streams:
- `togglePanel` logic unchanged
- max-2 rule unchanged
- Persona→evidence open effect [51.6R.3] unchanged: `if (!enlPersona || demoActive) return`
- PERSONA_AUTO_OPEN effect unchanged: `if (!enlPersona || !demoActive) return`

## Contract Authority

PIOS-51.8-RUN01-CONTRACT-v1
