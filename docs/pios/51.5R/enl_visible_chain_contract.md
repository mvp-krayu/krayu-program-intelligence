# ENL Visible Chain Contract — 51.5R

Stream: 51.5R — ENL Visible Chain Materialization Repair
Date: 2026-03-25
Authority: This document is the sequence authority for ENLPanel.js chain rendering

---

## Gap Identified

51.5 completed ENL wiring without regression but did not produce a visibly chain-dominant experience:

| Defect | Detail |
|---|---|
| All personas show same field hierarchy | evidence_chain, source, supporting objects in same order |
| No numbered steps | Evidence appeared as flat card stack |
| No visual connector | Steps not connected as chain |
| Persona changed only framing text | business_impact / risk / blocking_point not foregrounded |
| Chain breadcrumb existed but was visual-only | No primary field foregrounding per step |

---

## Visible Chain Contract

### Chain Structure

```
[CHAIN HEADER]
  label  |  path_desc  |  entry_rule  |  step count

[CHAIN BREADCRUMB]
  SIG-003 (Evaluable, emphasis:high) → SIG-004 (Evaluable)

[STEP 1 — ENTRY ▶]  ← numbered, entry-styled
  SIG-003 | Evaluable | emphasis:high | [lens tag]
  Signal title
  ─────────────────────
  [PERSONA PRIMARY FIELD — visually dominant]
  [PERSONA SECONDARY FIELD — if defined]
  ─────────────────────
  Source: COND-001 (40.6/condition_output_set.md)  [secondary]

↕ connector

[STEP 2]  ← numbered, standard
  ...same structure, same primary field type
```

### Persona Chain Matrix

| Persona | Primary Field | Secondary Field | Entry Rule |
|---|---|---|---|
| EXECUTIVE | business_impact | — | emphasis:high first |
| CTO | risk | evidence_chain | evaluable state first |
| ANALYST | evidence_chain | blocking_point | blocking point first |

### No-Persona State

When no persona is selected: evidence_chain shown as default primary field.
No traversal header rendered. Steps still numbered.

---

## Allowed Repair Actions

- Numbered step structure
- Visual step connector between steps
- Entry marker on step 1
- Persona-specific primary field rendered prominently in each step
- Static `PERSONA_LENS_FOCUS` rules (no computation, no ranking)
- Chain breadcrumb with state badges

## Forbidden Repair Actions

- Dynamic ranking of signals
- Filtering by hidden logic
- Summarizing evidence into prose
- Mutating evidence field values
- Adding new evidence data
- Changing API outputs
- Changing runtime behavior

---

## Determinism Guarantee

- Traversal order: sourced from personaData.enl_signals (42.16) — array reorder only
- Primary field: static lookup from PERSONA_LENS_FOCUS — no computation
- Step count: signal array length — no computation
- Entry rule: static label — display only, not used to filter or reorder
