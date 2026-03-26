# ENL Visible Chain Definition — 51.5R

Stream: 51.5R — ENL Visible Chain Materialization Repair
Date: 2026-03-26

---

## Components

### ChainHeader
- Renders traversal label, path description, entry rule, step count
- Absent when no persona selected
- Source: ENL_TRAVERSAL[persona] — static

### ChainBreadcrumb
- Renders ordered signal IDs with state badges
- Entry node (step 1) visually distinguished
- Always rendered when signals present

### ChainStep
- Numbered step with visual connector to next step
- Step 1 always marked as entry (▶ Entry marker, entry-styled number circle)
- Primary field: persona-specific, visually dominant
- Secondary field: persona-specific, rendered below primary
- Source row: always secondary (below primary fields, separated by divider)

### ChainPrimaryField
- Static read of one evidence field from signal payload
- No transformation
- business_impact: direct string display
- risk: direct string display
- evidence_chain: split on → rendered as vertical segment chain
- blocking_point: direct string display, blocking color accent

---

## Static Rules (PERSONA_LENS_FOCUS)

No computation. Direct field reads from 42.4 signal payload.

```
EXECUTIVE → primary: business_impact
CTO       → primary: risk,           secondary: evidence_chain
ANALYST   → primary: evidence_chain, secondary: blocking_point
```

---

## Field Mapping

| Field key | Source path in signal payload |
|---|---|
| business_impact | signal.business_impact |
| risk | signal.risk |
| evidence_chain | signal.evidence.evidence_chain |
| blocking_point | signal.evidence.blocking_point |

All fields are direct reads — no joins, no inference, no computation.

---

## CSS Structure

| Class | Purpose |
|---|---|
| .enl-chain-header | traversal label + entry rule container |
| .enl-chain-breadcrumb | horizontal signal path |
| .enl-chain-list | vertical chain step container |
| .enl-chain-step | single step (number col + body) |
| .enl-chain-step-entry | entry step visual styling |
| .enl-step-number-col | step number circle + connector line |
| .enl-step-body | step content area |
| .enl-chain-primary-field | persona-foregrounded field block |
| .enl-chain-field-blocking | blocking_point accent variant |
| .enl-chain-segments | evidence chain segment list |
| .enl-step-source-row | secondary source detail row |
