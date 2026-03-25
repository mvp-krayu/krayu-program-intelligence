# ENL Traversal Definition — 51.5

Stream: 51.5 — ENL Materialization in Unified Demo Surface
Date: 2026-03-25
Authority: This document is the traversal sequence authority for ENLPanel.js

---

## Traversal Rules (Static — No Computation)

| Persona   | Label                      | Path Description                                                   |
|-----------|----------------------------|--------------------------------------------------------------------|
| EXECUTIVE | Impact-First Traversal     | High-emphasis signals first, then evaluable — program delivery impact lens |
| CTO       | Evidence-Grounded Traversal| Evaluable signals first, then computed — structural risk evidence lens      |
| ANALYST   | Gap-First Traversal        | Blocked signals first, then partial — evidence gap identification lens     |

---

## Traversal Order Source

Traversal order is sourced from `personaData.enl_signals` (42.16 adapter output).

- The 42.16 adapter returns `enl_signals` ordered by persona-specific relevance.
- `applyTraversalOrder()` reorders the signal array to match this ENL order.
- No sort computation occurs in the UI — array reorder only.

---

## No-Persona State

When `persona` prop is null (no persona selected):
- No traversal header is rendered
- Signals appear in default query order (from 42.x adapter)
- `isEntry` marker is suppressed on all entries

---

## Evidence Ownership

| Content          | Owner          |
|------------------|----------------|
| Signal display   | SignalPanel    |
| Evidence chains  | ENLPanel       |
| Traversal path   | ENLPanel       |
| Navigation links | NavigationPanel (inside ENLPanel) |

No duplication. ENLPanel does not re-render signal gauges.

---

## Fail-Closed Rules

- R1: Traversal order is deterministic by persona — static rules, no computation
- R2: Evidence data sourced from signals prop (42.4 adapter) — unchanged
- R3: Traversal ordering sourced from personaData.enl_signals (42.16) — unchanged
- R4: No new API calls, no new computation
- R5: Same evidence set, different documented path through it
- R6: No duplication — evidence owned here, signals owned by SignalPanel
