# Entry Model Correction — 51.6R.1

Stream: 51.6R.1 — Persona-First Demo Entry Correction
Date: 2026-03-26

---

## Problem (51.6R state)

The 51.6R inline flow selector in the hero zone created a competing action at entry:

```
[Executive Insight] [Structural Analysis] [Evidence Audit]   ← flow selector visible
[Start ExecLens Demo]                                        ← primary CTA
```

User saw two competing concepts before understanding the demo. Experience ambiguity.

---

## Corrected Entry Model

```
[Start ExecLens Demo]                                        ← sole CTA
```

Flow is automatically selected by persona (PERSONA_DEFAULT_FLOW, no computation).
User sees no flow choice at entry — the system is self-coherent.

Flow override available ONLY inside the active demo bar (TraversalBar):

```
[Executive Insight ↓]  [Executive Insight] [Structural Analysis] [Evidence Audit]
                         ↑ compact override, visible only during active demo
```

---

## Entry Sequence (Corrected)

1. User loads app → sees "Start ExecLens Demo" only
2. User selects query (QuerySelector) → data loads
3. User selects persona (PersonaPanel) → flow auto-assigned via PERSONA_DEFAULT_FLOW
4. User clicks "Start ExecLens Demo" → traversal begins at first flow node
5. During demo: user may override flow via compact buttons in TraversalBar

---

## Rules

- Single CTA at entry: Start ExecLens Demo
- Flow selector: hidden pre-demo
- Flow assignment: automatic via persona (static lookup)
- Flow override: available inside TraversalBar only
- No computation at any step
