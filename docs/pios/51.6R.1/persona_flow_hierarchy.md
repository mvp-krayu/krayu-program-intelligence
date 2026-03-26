# Persona Flow Hierarchy — 51.6R.1

Stream: 51.6R.1 — Persona-First Demo Entry Correction
Date: 2026-03-26

---

## Hierarchy

| Layer | Role | Visibility |
|---|---|---|
| Persona | PRIMARY: identity + meaning | Always visible (PersonaPanel) |
| Flow | SECONDARY: reveal mechanism | During demo only (TraversalBar) |
| Start Demo | Entry CTA | Pre-demo hero (sole action) |

---

## Persona → Default Flow (static, no computation)

| Persona | Default Flow | Experience Theme |
|---|---|---|
| EXECUTIVE | executive_insight | Answer first → signals → evidence |
| CTO | structural_analysis | Answer → structure → signals → evidence |
| ANALYST | evidence_audit | Evidence first → structure → signals → answer |

Auto-assigned on persona selection via `useEffect` in index.js.
User may override via compact flow buttons inside TraversalBar during demo.
No computation. Static lookup only.

---

## What Changed in 51.6R.1

| Aspect | Before (51.6R) | After (51.6R.1) |
|---|---|---|
| Flow selector location | Hero zone (pre-demo) | Inside TraversalBar (during demo) |
| Entry actions | 2 (flow + start) | 1 (start only) |
| Flow assignment | User + auto | Auto (user override during demo) |
| User cognitive load at entry | Flow decision + start | Start only |
