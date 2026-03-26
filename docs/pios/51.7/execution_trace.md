# Execution Trace — 51.7

Stream: 51.7 — Persona Hard Gate
Date: 2026-03-26

---

## Path: Persona null, user clicks Start

1. `handleStartDemo()` called
2. `if (!enlPersona) return` → exits immediately
3. `setDemoActive(true)` NOT called
4. `setSelectedFlow` NOT called
5. `setOpenPanels` NOT called
6. `setSelectedQuery` NOT called
7. Demo remains inactive
8. UI shows "Select a Persona to enable execution"

## Path: Persona null, evidence panel open

1. `queryData` present, `enlPersona === null`
2. Render guard: `queryData && enlPersona` → false
3. Fallback branch: `queryData && !enlPersona` → true
4. Renders: "Evidence requires a selected Persona"
5. ENLPanel NOT instantiated
6. No persona API call (PersonaPanel fetch guarded by `selectedPersona`)

## Path: Persona selected, user clicks Start

1. `handleStartDemo()` called
2. `if (!enlPersona) return` → does NOT exit
3. `activeFlow` derived from `PERSONA_DEFAULT_FLOW[enlPersona]`
4. `setDemoActive(true)` called
5. Traversal proceeds normally

## Path: Persona selected, evidence panel open

1. `queryData` present, `enlPersona` set
2. Render guard: `queryData && enlPersona` → true
3. ENLPanel renders with persona-shaped chain

---

## Invariant

In all states: no silent progression, no empty panels, no undefined outputs.
