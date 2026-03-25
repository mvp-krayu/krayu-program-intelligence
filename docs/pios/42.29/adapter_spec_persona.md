# Adapter Spec — Persona View Map (42.16)

Stream: 42.29
Contract: PIOS-42.16-RUN01-CONTRACT-v1
Script: scripts/pios/42.16/persona_view_map.py

---

## Purpose

Map ENL signal output to a persona-scoped view. No new computation.

---

## Rules

| Rule | Description |
|---|---|
| R1 | ENL data sourced from 42.15 adapter logic (same chain) |
| R2 | Persona mapping only — no new computation, no scoring |
| R3 | Persona labels and focal fields are static mapping constants |
| R4 | Fail closed on invalid persona or query_id (exit 1) |
| R5 | JSON output to stdout only; no file writes |
| R6 | Deterministic — same inputs → same output |

---

## Personas

| Persona | Lens | Framing Label | Primary Question |
|---|---|---|---|
| EXECUTIVE | delivery_commitment | Program Delivery Risk | What does this mean for my program delivery commitment? |
| CTO | structural_risk | Architectural Structural Risk | What structural risk does this expose in my architecture? |
| ANALYST | evidence_gap | Evidence State and Gaps | What evidence gaps remain and what would close them? |

---

## Signal Ordering

Each persona has `focus_signal_states` and `focus_emphasis` constants.
Signals matching focus criteria appear first (primary). Others appear second (secondary).

**No signals are removed** — all enl_signals from 42.15 are present in output.

| Persona | Focus States | Focus Emphasis |
|---|---|---|
| EXECUTIVE | evaluable, computed, partial | high |
| CTO | evaluable, computed | high |
| ANALYST | blocked, partial, evaluable | (none) |

---

## Input

```
python3 scripts/pios/42.16/persona_view_map.py --persona EXECUTIVE --query GQ-003
python3 scripts/pios/42.16/persona_view_map.py --persona CTO --query GQ-003
python3 scripts/pios/42.16/persona_view_map.py --persona ANALYST --query GQ-003
```

---

## Output

Adds to ENL output:
- `persona`: selected persona
- `lens`: persona lens identifier
- `framing_label`: display label
- `primary_question`: persona question
- `enl_signals`: ordered by persona focus
- `emphasis_nodes`: carried from 42.15 unchanged
