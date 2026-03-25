# Entry State Definition — 51.4

Stream: 51.4
Date: 2026-03-25

---

## Entry State (Non-Demo)

- `openPanels` initial value: `['situation']`
- SituationPanel: OPEN — topology visible, gauges visible
- SignalPanel: CLOSED
- PersonaPanel: CLOSED
- ENLPanel: CLOSED
- NarrativePanel: CLOSED
- `selectedQuery`: null
- Topology loads without query (42.7 adapter, no --query arg)
- Red node (C_30_Domain_Event_Bus emphasis:high) visible immediately

---

## Entry State (Demo Start)

On `handleStartDemo()`:
- `openPanels` reset to `['situation']`
- `demoActive = true`
- `demoStage = 1`
- `selectedQuery` set to `'GQ-003'` via stage 1 useEffect
- Query fetch begins
- Data ready by time stage 2 opens SignalPanel

---

## Topology Visibility

TopologyPanel is inside SituationPanel which starts OPEN.
Topology loads on mount (no query required).
Red node visible immediately — emphasis:high from 44.2 projection_attachment.

---

## What Is NOT Visible on Entry

- No signal explanation text
- No persona content
- No evidence detail
- No narrative
- No step buttons / step pips
