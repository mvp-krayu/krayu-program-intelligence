# SEMANTIC SPATIAL COMPOSITION GUIDE

**Stream:** PI.LENS.V2.SEMANTIC-FIELD-TRANSITION.01
**Scope:** How semantic actors compose spatially as fields, not as a card stack.

---

## 1. The compositional principle

> A semantic surface is composed of zones in a field, not panels in a grid.

A zone is recognizable but not framed. A panel is framed by definition. The transition from panel-thinking to zone-thinking is the design contract of this stream.

---

## 2. The compositional units

| Unit                 | Visual signature                                              | Examples in current LENS V2                                      |
|----------------------|---------------------------------------------------------------|------------------------------------------------------------------|
| Field                | Per-mode atmospheric radial gradient on the rep-field         | DENSE field with 3 pressure-tier glow centers                    |
| Zone (actor)         | Top resonance line + tag + transparent shell                  | Decision Posture, Resolution Boundary, Cluster Concentration ... |
| Sub-zone (cell/row)  | Vertical or top tier-rail + soft gradient backing             | Resolution Boundary cells; Topology cells; Signal rows           |
| Glow dot             | Radial-gradient dot at a rail anchor                          | Resolution rail dots; Topology cell tier dots                    |
| Resonance line       | Horizontal gradient-faded 1px line                            | Top of each actor; between Signal rows                           |
| Field rail           | Long gradient-faded line crossing the field                   | Topology connecting rail through PASS-THROUGH center             |
| Atmospheric ring     | Concentric circles around a central anchor                    | Boardroom Confidence Envelope outer rings                        |

Each unit is small. Together they compose the surface.

---

## 3. Spatial logic by mode

### 3.1 BALANCED — Confidence landscape

The field is composed of:

- A state-color glow concentrated upper-left (reading direction anchor).
- A warm yellow glow lower-right (resolution boundary tail).
- A subtle blue radial at the bottom of the field (semantic-substrate hint).

Within this landscape:

- Decision Posture sits at the top — its resonance line is suppressed (first-of-type), making it the visual anchor.
- Resolution Boundary 3-cell sits below — each cell uses a vertical rail in its respective category color (blue / yellow / muted) and a glow dot at the rail head.
- Confidence Boundary bar sits beneath — a horizontal gradient with diagonal-hatch advisory portion.
- Pressure Anchor single line sits at the bottom — a single tier-color glow dot + name + tier.

The composition reads top-to-bottom but the *meaning* is a posture landscape: how confident is the assessment, where are the boundaries, what's the source.

### 3.2 DENSE — Structural topology environment

The field is composed of:

- HIGH-pressure red glow upper-left (origin neighborhood).
- ELEVATED amber glow center (coordination layer absorption basin).
- MODERATE yellow glow lower-right (receiver exposure neighborhood).

Within this environment:

- Semantic Topology + Structural Backing + Semantic-Only Exposure renders as a three-column matrix where each cell uses:
  - A top resonance line in the cell's tier color.
  - A radial backing gradient.
  - For semantic-only cells, a diagonal-hatch overlay signaling advisory state.
- Cluster Concentration sits below — a 32px headline + thin gradient bar + meta line.
- Absorption Load sits below — a left-rail panel with the 68% absorbed indicator.

The composition is spatially aligned with the field gradient: the upper-left glow sits behind the ORIGIN cell; the central glow sits behind the PASS-THROUGH cell; the lower-right glow sits behind the RECEIVER cell. The field *is* the topology.

### 3.3 INVESTIGATION — Trace depth corridor

The field is composed of:

- A vertical blue→yellow gradient from top to bottom (lineage descent → qualified receiver state).

Within this corridor:

- Evidence Trace lineage: a vertical chain of dots and edges descending through the field. Each step has a small glow dot and a connecting gradient line.
- Signal Stack: each signal row has a left tier rail with blur, with thin connector lines between rows. Q-01 partial-grounding rows carry a warm gradient overlay.
- Inference Prohibition: a left-rail statement with a broader yellow governance contour extending behind it (via the `::after` pseudo element).

The composition reads top-to-bottom as descent through evidence — the field gradient supports the cognition.

### 3.4 BOARDROOM — Projection ceremony

The field is composed of:

- A single state-color radial glow centered at 50% 42% — pure projection ceremony.

Within this field:

- Decision Posture label at the top.
- Confidence Envelope ring (320px) with two outer atmospheric rings (-36px solid, -88px dashed).
- Two-row readout below the ring (grounded + advisory).
- Single supportive sentence.
- Line accent.
- Scope footer.

The composition is centered and ceremonial — the field is the ring.

---

## 4. The three composition rules

### 4.1 Rule 1 — Every visual element earns its semantic place

No decoration. Every gradient, every rail, every dot encodes:

- A pressure tier, OR
- A grounding state, OR
- A cognition mode signal, OR
- A semantic actor identifier.

If a visual element does not encode one of these, it is removed.

### 4.2 Rule 2 — Containers dissolve, content stays

The semantic structure is preserved. The visible containerization is not. A reader can still distinguish actor zones (via top resonance lines and actor-tags); they cannot count rectangles.

### 4.3 Rule 3 — Mode signature lives in the field, not in the actors

The mode signature (BALANCED's confidence landscape, DENSE's topology environment, INVESTIGATION's trace corridor, BOARDROOM's projection ceremony) is encoded by the field gradient. Actors are mode-agnostic in their shell — they are mode-aware only in their content.

---

## 5. Anti-pattern enforcement

The following are forbidden in this composition model:

- Hard `border: 1px solid` rectangles around actor content.
- Solid opaque backgrounds on actor shells.
- Equal-weight tile grids that read as dashboard tiles.
- Decorative glow / lens-flare / particle effects.
- Animations on the field gradients (atmospheric drifts only — no rotation, no pulse).
- Sharp shadows.
- Gradient borders with chart-library register (rainbow / neon / multi-stop saturated).

If any of these appear, the field-thinking has regressed and the contract has been violated.

---

## 6. Authority

This guide is authoritative for the spatial composition vocabulary. Future contracts that compose new semantic zones must:

1. Use the field / zone / sub-zone / glow-dot / resonance-line / field-rail / atmospheric-ring vocabulary.
2. Preserve the per-mode field gradient signature.
3. Honor the three composition rules.
4. Honor the anti-pattern enforcement.

---

**End of semantic spatial composition guide.**
