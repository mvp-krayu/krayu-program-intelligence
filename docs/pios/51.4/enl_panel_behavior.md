# ENLPanel Behavior — 51.4

Stream: 51.4
Date: 2026-03-25

---

## Component

`app/execlens-demo/components/ENLPanel.js`

Wraps: `EvidencePanel` + `NavigationPanel`

---

## Behavior

- Collapsed by default
- Opens at demo stage 4 or user click
- Content: evidence chain + vault traceability links
- No filtering logic in UI
- Depth controlled by existing adapter output (42.4 evidence via 42.1 → 42.2)

---

## Data Source

`queryData.signals` → EvidencePanel (evidence chains per signal)
`queryData.navigation` → NavigationPanel (vault-resolved deep links)

Both sourced from `?query=GQ-003` (42.4 adapter) — same call as SignalPanel.
No additional API call on panel open.

---

## Separation from SignalPanel

- SignalPanel: shows signal summary cards (42.x runtime, gauge format)
- ENLPanel: shows evidence chains + navigation (42.x runtime, detail format)

Same data source (`queryData`), different rendering focus.
Not duplicated — each panel exposes a distinct layer of the same query response.
