# Persona Entry Contract — 51.8R

Contract: PIOS-51.8R-RUN01-CONTRACT-v1 (guided flow correction)
Date: 2026-03-26

---

## Persona Selection Without Query

Persona selector (PersonaPanel) renders always — query is not required to select a persona.

Prior behavior: `if (!queryId) return null` gated the entire PersonaPanel render on queryId.
Corrected behavior: persona buttons render unconditionally; ENL output section gated by `selectedPersona && queryId`.

Fetch still gated: `if (!selectedPersona || !queryId) return` in useEffect — no adapter call without both.

Rationale: the guided entry model requires persona selection as step 1, before a query is loaded.

---

## Start Demo Dual Gate

`handleStartDemo` enforces two gates in sequence:

1. `if (!enlPersona) return` — persona hard gate [51.7, preserved]
2. `if (!selectedQuery) return` — query hard gate [51.8R guided correction]

Start Lens Demo button: `disabled={!enlPersona || !selectedQuery}` — disabled without both.

Both gates must pass before `setDemoActive(true)` is reached.

---

## Persona Change Reset

When persona changes during an active demo, the full guided state is reset:

```javascript
setDemoActive(false)
setDemoStage(0)
setTraversalNodeIndex(0)
setSelectedFlow(null)
setDemoComplete(false)
setGuidedStepIndex(0)
setRawStepActive(false)
```

Detection: `prevEnlPersonaRef` (useRef) tracks prior persona value.
Effect deps: `[enlPersona, demoActive, demoComplete]` — not `[enlPersona]` alone (guard preserved per 51.6R.2).

---

## Entry UI Copy

- Query selector placeholder: "Select a query to project signals onto this structure."
- Persona panel subtitle: "Interpret this situation from a decision perspective"
