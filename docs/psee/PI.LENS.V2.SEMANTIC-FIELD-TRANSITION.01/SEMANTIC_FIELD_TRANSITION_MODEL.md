# SEMANTIC FIELD TRANSITION MODEL

**Stream:** PI.LENS.V2.SEMANTIC-FIELD-TRANSITION.01
**Authority:** Records the transition from "semantic actor cards inside containers" to "semantic operational fields rendered as a living intelligence surface."

---

## 1. The transition

LENS V2 has crossed three discrete iterations of semantic representation:

```
Iteration 1 (PI.LENS.V2.PREMIUM-INTERACTIVE-EXECUTIVE-LAYER.01)
  → semantic zones declared as chips at the corner of panels

Iteration 2 (PI.LENS.V2.SEMANTIC-CANVAS-LAYOUT-CORRECTION.01)
  → 3-column layout with center canvas as primary surface

Iteration 3 (PI.LENS.V2.SEMANTIC-REPRESENTATION-SYSTEM.01)
  → 15 semantic actors composed per lens (eliminates triad repetition)

Iteration 4 (THIS STREAM)
  → semantic actors render as fields, not as cards
```

The four iterations together move LENS V2 from a designed dashboard alternative to a semantic operational intelligence surface. Each iteration kept what worked and corrected the residual failure of its predecessor.

---

## 2. The previous failure mode

After iteration 3, LENS V2 still rendered semantic actors as **cards in containers**:

- `.actor` had a solid `rgba(20, 23, 31, 0.55)` background.
- `.actor` had a 1px `#1a2030` border.
- `.actor` had a `border-radius: 6px`.
- Each actor sat in its own visible rectangle.
- The center canvas was a stack of these rectangles.
- The visual register read as "premium semantic dashboard."

The contract for this stream was explicit: the surface needed to dissolve panel boundaries while preserving semantic structure.

---

## 3. The realized field model

This stream reframes the visual grammar:

| Before                                  | After                                                                  |
|-----------------------------------------|------------------------------------------------------------------------|
| Card with border + background           | Zone with thin top resonance line + transparent background             |
| Cells stacked in a grid                 | Cells composed as gradient zones with tier-color rails                 |
| Hard panel boundaries                   | Atmospheric field gradient on the rep-field container                  |
| Solid `rgba(20,23,31,0.55)` backings    | Transparent + per-mode radial gradient field                           |
| Rectangular cells with full borders     | Gradient rails (left or top) with no enclosing rectangle               |
| Static atmospheric ground               | Mode-reactive radial gradient overlay per lens                         |
| Identical interpretation across modes   | Mode-reactive interpretation labels and tonal shifts                   |

The actors are still semantic objects. They are no longer cards.

---

## 4. The four mechanisms that effected the transition

### 4.1 Mechanism A — `.actor` shell dissolution

The shared `.actor` class lost its visible container. New definition:

```css
.actor {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 22px 22px;
  background: transparent;
  border: none;
  border-radius: 0;
  position: relative;
}
.actor::before {
  content: '';
  position: absolute;
  left: 22px;
  right: 22px;
  top: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(74,158,255,0.22) 22%, rgba(74,158,255,0.22) 78%, transparent 100%);
  opacity: 0.6;
}
```

The actor is now identified by:
- A thin top resonance line (gradient-faded, only ~56% of the actor width).
- The actor-tag (code chip + name) at the top.
- The semantic content beneath.

There is no enclosing rectangle. The actor is felt as a *zone* in the field.

### 4.2 Mechanism B — per-mode field gradients

The `.rep-field` container now carries an `::after` pseudo-element with a mode-specific atmospheric backing:

```css
.rep-field--balanced::after {
  background:
    radial-gradient(60% 50% at 22% 28%, var(--state-bg) 0%, transparent 65%),
    radial-gradient(45% 40% at 78% 78%, rgba(230,184,0,0.05) 0%, transparent 70%),
    radial-gradient(80% 60% at 50% 100%, rgba(74,158,255,0.025) 0%, transparent 80%);
}
.rep-field--dense::after {
  background:
    radial-gradient(38% 32% at 22% 30%, rgba(255,107,107,0.07) 0%, transparent 60%),
    radial-gradient(55% 42% at 50% 55%, rgba(255,158,74,0.06) 0%, transparent 72%),
    radial-gradient(34% 28% at 80% 80%, rgba(230,184,0,0.06) 0%, transparent 65%);
}
.rep-field--investigation::after {
  background:
    linear-gradient(180deg, rgba(74,158,255,0.04) 0%, transparent 30%, rgba(230,184,0,0.04) 100%);
}
.rep-field--boardroom::after {
  background:
    radial-gradient(70% 60% at 50% 42%, var(--state-bg) 0%, transparent 75%);
}
```

Each lens has its own atmospheric signature. The DENSE field has three pressure-tier glow centers in spatial positions matching the ORIGIN / PASS-THROUGH / RECEIVER topology — the field itself encodes the structural cause-and-propagation cognition. The INVESTIGATION field has a top-blue / bottom-yellow vertical gradient — signaling the trace-depth cognition. The BOARDROOM field has a single central state-color radial — signaling projection ceremony.

### 4.3 Mechanism C — cells become rails-and-glow zones

Resolution Boundary cells, Topology cells, Signal Stack rows all lost their borders. They now use:

- A single tier-colored vertical or top stripe (with `filter: blur(0.4px)` for soft rendering).
- A glow dot at the rail anchor.
- A subtle gradient backing (linear or radial, 30-50% opacity).

The cells are still operationally distinct; they are no longer perceptually framed.

### 4.4 Mechanism D — mode-reactive interpretation

The left interpretation column now adapts per lens:

| Lens          | Tag label                  | Body tone                 | Section labels                           |
|---------------|---------------------------|---------------------------|------------------------------------------|
| BALANCED      | EXECUTIVE INTERPRETATION  | posture (white)           | Assessment / Why this matters / Structural context |
| DENSE         | STRUCTURAL INTERPRETATION | structural (orange accent)| Structural reading / Cause and propagation / Structural context |
| INVESTIGATION | FORENSIC INTERPRETATION   | forensic (yellow accent)  | Evidence reading / What the evidence shows / Structural lineage |
| BOARDROOM     | PROJECTION INTERPRETATION | projection (calm, larger) | Posture only                             |

Same content. Different framing. The interpretation no longer reads as a static narrative wall — it reads as a tonally-aware companion to the active cognition mode.

---

## 5. Boardroom monumentality

The Boardroom Confidence Envelope ring grew from 220px to 320px, with a 168px → 168px inner ring plus:

- A new outer atmospheric ring at -36px inset (1px solid, opacity 0.42).
- A far outer dashed atmospheric ring at -88px inset (opacity 0.18).
- The center label grew from 36px to 48px.
- The mask widened from `inset: 14px` to `inset: 22px`.

The ring is now monumental — projection-grade ceremony, not a chart.

---

## 6. What did NOT change

- Cinematic doctrine compliance (humanist sans, no chart libraries, no cyberpunk decoration).
- The 3-column IntelligenceField layout.
- The 15-actor SEMANTIC_ACTORS registry.
- The mode → actor compositions.
- Render-state vocabulary, qualifier semantics, propagation logic, governance verdict.
- Static report tier (still accessed only via Report Pack in the support rail).
- Fixture data — no inventions; no static HTML inlined; no fake live binding.

---

## 7. The result

LENS V2 now reads as a single composed surface with semantic zones rendered as fields, not as a stack of cards. Modes are visually distinct via field gradient signatures and mode-reactive interpretation. The Confidence Envelope ring is a projection-grade monument. The Resolution Boundary, Topology, and Signal Stack cells dissolve into the field — they are recognizable but not framed.

---

## 8. Authority

This document is authoritative for the field-transition model. Future contracts that touch the `.actor` shell or the per-mode `.rep-field` gradients must:

1. Preserve transparent / borderless actor shells.
2. Preserve per-mode atmospheric field signatures.
3. Preserve mode-reactive interpretation tonal shifts.
4. Preserve the Boardroom monumentality.

Restoring solid panel borders or hard card backgrounds is forbidden unless an explicit override contract is issued.

---

**End of semantic field transition model.**
