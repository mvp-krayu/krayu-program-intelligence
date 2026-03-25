# PersonaPanel Spec — 42.29

Stream: 42.29
Date: 2026-03-25
Contract: PIOS-42.29-RUN01-CONTRACT-v1
File: app/execlens-demo/components/PersonaPanel.js

---

## Purpose

Render persona selector + ENL display panel.
Same query drives all layers. No reload. Perspective switch only.

---

## Props

| Prop | Type | Description |
|---|---|---|
| queryId | string | Currently selected query (e.g. "GQ-003") |

---

## Behavior

1. When queryId changes: resets persona selection, ENL data, error state.
2. When persona selected: calls `?persona=P&query=queryId`.
3. ENL response displayed: framing label, primary question, emphasis nodes, signal rows.
4. No separate demo, no topology reload.

---

## Persona Buttons

| Button | ID | Calls |
|---|---|---|
| Executive | EXECUTIVE | `?persona=EXECUTIVE&query=GQ-003` |
| CTO | CTO | `?persona=CTO&query=GQ-003` |
| Analyst | ANALYST | `?persona=ANALYST&query=GQ-003` |

---

## DOM Sections

| Section | data-demo-section | Purpose |
|---|---|---|
| Panel root | persona | DemoController step 7 target |
| ENL output | enl | DemoController step 8 target |

---

## Display Elements

- Persona selector buttons (3)
- ENL framing label (persona-specific)
- ENL primary question (persona-specific)
- Emphasis nodes (chips, red badge for emphasis:high)
- Signal rows: signal_id, signal_state, relevance, emphasis badge, title, location
- Projection source attribution

---

## Rules

| Rule | Description |
|---|---|
| R1 | Persona calls same query as currently active queryId prop |
| R2 | No new computation — display only |
| R3 | ENL section keyed to current queryId prop |
