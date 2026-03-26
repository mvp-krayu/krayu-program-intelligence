# Evidence Fallback — 51.7

Stream: 51.7 — Persona Hard Gate
Date: 2026-03-26

---

## Behavior

IF `queryData` is present AND `enlPersona === null`:

- ENLPanel is NOT rendered
- Evidence panel shows: "Evidence requires a selected Persona"
- CSS class: `evidence-blocked-state`

IF `queryData` is null:

- Evidence panel shows: "Select a query to load evidence."

## Implementation

```jsx
{queryData && enlPersona ? (
  <ENLPanel ... />
) : queryData && !enlPersona ? (
  <div className="evidence-blocked-state">Evidence requires a selected Persona</div>
) : (
  <div className="no-query-state">Select a query to load evidence.</div>
)}
```

## Guarantee

Evidence panel never renders empty. Every state is explicit and visible:

- query missing → query prompt
- persona missing → explicit blocked message
- both present → ENLPanel renders

## Contract Authority

PIOS-51.7-RUN01-CONTRACT-v1
