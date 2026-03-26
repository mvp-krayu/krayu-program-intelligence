# Persona Narrative Restoration — 51.6R

Stream: 51.6R — Persona Narrative Restoration
Date: 2026-03-26
Authority: This document governs the UI changes in 51.6R

---

## Experience Principle

Persona is PRIMARY (identity, narrative, meaning).
Traversal flow is SECONDARY (mechanism, sequencing, reveal behavior).

User must perceive: "This is what it means for ME"
NOT: "Which mode am I in?"

---

## Problem (51.6 state)

| Issue | Detail |
|---|---|
| Flow selector dominated pre-demo | Fixed-bottom panel competed with persona |
| Persona narrative weak in ENLPanel | No dominant persona framing visible |
| No persona→flow binding | User had to manually select flow |
| Experience felt mode-system | Not guided narrative |

---

## Corrections Applied

### 1. Flow Selector Demotion

- Removed from DemoController pre-demo fixed-bottom panel
- Relocated to inline compact control in hero zone (below Start Demo button)
- Secondary styling: small buttons, minimal visual weight
- `FlowSelector` kept as exported component in DemoController for reuse

### 2. Persona → Default Flow Binding

Static mapping (no computation):

| Persona | Default Flow |
|---|---|
| EXECUTIVE | executive_insight |
| CTO | structural_analysis |
| ANALYST | evidence_audit |

Applied via `useEffect` on `enlPersona` change.
User may override via inline flow selector.

### 3. PersonaNarrativeHeader

Added to ENLPanel as dominant anchor before chain.

| Field | Source | Purpose |
|---|---|---|
| persona chip | persona prop | Identity anchor |
| framing_label | personaData.framing_label | Differentiated framing |
| primary_question | personaData.primary_question | Narrative question |
| lens | personaData.lens | Cognitive frame |
| aggregate_confidence | personaData.aggregate_confidence | Evidence state |

Renders only when persona + personaData are present.
Persona-specific accent color from static `PERSONA_ACCENT` map.

### 4. Layout Fixes

- `.te-pre-demo` overridden to `position: static` (no longer fixed bottom)
- `.demo-entry-zone`: flow selector + start button as vertical stack
- `.demo-flow-inline-wrap`: compact horizontal flow selector
- `.enl-persona-narrative-header`: left-border accent block

---

## Zero Regression Guarantee

- TraversalEngine.js: NOT CHANGED
- Validation scripts: NOT CHANGED
- Data layer: NOT CHANGED
- validate_traversal_sequence.py: 69/69 PASS
- validate_persona_invariance.py: 40/40 PASS
