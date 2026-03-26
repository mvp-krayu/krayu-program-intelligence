# Persona Behavior Contract — 51.6

Stream: 51.6 — ENL Traversal Runtime Engine
Date: 2026-03-26

---

## Mandatory Invariance

IDENTICAL data across all personas.
ONLY reveal depth and panel open state may differ.
ZERO content variation.

Verified by: validate_persona_invariance.py — 40/40 PASS

---

## Persona Auto-Open (PERSONA_AUTO_OPEN)

| Persona | Auto-Open Panels | Node Role Mapping |
|---|---|---|
| EXECUTIVE | [narrative] | ANSWER only |
| CTO | [narrative, situation, signals] | ANSWER + STRUCTURE + SIGNAL |
| ANALYST | [narrative, signals] | ANSWER + SIGNAL |

Behavior:
- Applied when persona is selected via PersonaPanel
- Skipped when demo/traversal is active (traversal controls visibility)
- Respects max-2 panel rule (merged, sliced to last 2)

---

## Persona Invariance Evidence (GQ-003)

| Check | EXECUTIVE | CTO | ANALYST |
|---|---|---|---|
| signal IDs | SIG-003, SIG-004 | SIG-003, SIG-004 | SIG-003, SIG-004 |
| SIG-003 title | identical | identical | identical |
| SIG-004 title | identical | identical | identical |
| framing_label | Program Delivery Risk | Architectural Structural Risk | Evidence State and Gaps |

Same data. Different framing. Zero content mutation.

---

## No Computation Rule

PersonaPanel calls `/api/execlens?persona=P&query=Q` — unchanged.
42.16 adapter returns persona-scoped ordering — unchanged.
TraversalEngine does not recompute, re-rank, or re-filter.
PERSONA_AUTO_OPEN is a static lookup — no logic.
