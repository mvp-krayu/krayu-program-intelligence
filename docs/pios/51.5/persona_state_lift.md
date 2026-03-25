# Persona State Lift — 51.5

Stream: 51.5 — ENL Materialization in Unified Demo Surface
Date: 2026-03-25

---

## Problem

In 51.4, PersonaPanel held `selectedPersona` and `personaData` as local state.
ENLPanel had no awareness of which persona was selected or what personaData it returned.
ENL traversal in ENLPanel required both values to render persona-shaped traversal paths.

---

## Solution

Lifted persona selection and persona data to `index.js` via callbacks.

### New Props — PersonaPanel.js

| Prop                | Type     | Purpose                                                   |
|---------------------|----------|-----------------------------------------------------------|
| `onPersonaChange`   | function | Called with personaId string when a persona button is clicked |
| `onPersonaDataChange` | function | Called with data object when persona fetch succeeds     |

Both are optional — `?.()` safe call pattern used throughout.

### New State — index.js

| State           | Init  | Description                                          |
|-----------------|-------|------------------------------------------------------|
| `enlPersona`    | null  | Currently active persona string (EXECUTIVE/CTO/ANALYST) |
| `enlPersonaData`| null  | Current 42.16 adapter response for active persona    |

### Reset Triggers

Both are reset to null on:
- `selectedQuery` change (useEffect in index.js)
- `queryId` change (useEffect in PersonaPanel.js)
- fetch error (PersonaPanel.js catch block)

---

## Data Flow

```
User clicks persona button
  → PersonaPanel.handlePersonaSelect(personaId)
    → setSelectedPersona(personaId)      (local — drives fetch)
    → onPersonaChange?.(personaId)       (lifted → index.js enlPersona)
  → fetch /api/execlens?persona=P&query=Q
    → success: setPersonaData(data)
              onPersonaDataChange?.(data) → index.js enlPersonaData
    → error:  onPersonaChange?.(null)
              onPersonaDataChange?.(null)

index.js:
  enlPersona    → ENLPanel persona prop
  enlPersonaData → ENLPanel personaData prop
```

---

## Non-Violations

- No new API calls introduced — PersonaPanel still calls exactly one route
- No persona computation in index.js — state lift only
- PersonaPanel display behavior unchanged — still renders ENL output locally
