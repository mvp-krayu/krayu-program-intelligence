# PersonaPanel Behavior — 51.4

Stream: 51.4
Date: 2026-03-25

---

## Changes from 42.29

| Aspect | 42.29 | 51.4 |
|---|---|---|
| Outer wrapper | `<div className="panel persona-panel">` | Removed — DisclosurePanel provides |
| Title header | `<div className="panel-title">Persona Lens</div>` | Removed — DisclosurePanel provides |
| Container class | `panel persona-panel` | `persona-panel-body` |
| Panel title | "Persona Lens" | "What does this mean for you?" |
| Panel subtitle | (none) | "Select audience perspective — Executive, CTO, or Analyst" |
| Collapse behavior | Always visible | Collapsed by default, opens at stage 3 |

---

## Behavior

1. PersonaPanel is wrapped by DisclosurePanel in index.js with id="persona"
2. Collapsed until demo stage 3 or user click
3. On open: persona selector buttons are visible, ENL output is not yet shown
4. On persona selection: fetch `?persona=P&query=queryId` → ENL output appears inside panel
5. Persona switching: selects different button, re-fetches, output updates in-place
6. Query change: resets persona selection and ENL output

---

## Distinct Outputs per Persona

| Persona | Lens | Focus |
|---|---|---|
| EXECUTIVE | delivery_commitment | evaluable, computed, high-emphasis signals |
| CTO | structural_risk | evaluable, computed, high-emphasis signals |
| ANALYST | evidence_gap | blocked, partial, evaluable signals |

Output differs by `framing_label`, `primary_question`, and signal ordering.

---

## No Duplication

- Signals displayed in PersonaPanel are the persona-scoped ENL view (42.16 output)
- Signals displayed in SignalPanel are the raw query response (42.4 output)
- These are different representations from different adapters
- No signal data duplicated within the same panel
