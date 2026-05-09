# SEMANTIC ATMOSPHERIC LAYERING

**Stream:** PI.LENS.V2.SEMANTIC-FIELD-TRANSITION.01
**Scope:** How LENS V2 stacks visual layers atmospherically without resorting to decoration.

---

## 1. The layer model

The LENS V2 surface composes its visual depth through ordered layers. Each layer carries semantic purpose:

```
Layer 7  Atmospheric overlays (mode-reactive ring concentric atmosphere)
Layer 6  Actor content (semantic zones — typography, rails, glow dots)
Layer 5  Field gradient (per-mode atmospheric backing on the rep-field)
Layer 4  IntelligenceField column dividers and rail backings
Layer 3  Canvas envelope gradients (state-color top, warm bottom)
Layer 2  Body environmental gradient (subtle global atmosphere)
Layer 1  Graphite ground (#14171f canvas base)
```

Each layer has a job. Removing any layer would visibly remove a semantic affordance.

---

## 2. Layer-by-layer specification

### Layer 1 — Graphite ground

- Color: `#14171f`.
- Role: dominant ground; never pure black.
- Anti-pattern: pure `#000` (would read as developer dark mode).

### Layer 2 — Body environmental gradient

- Set on `.v2-canvas`:
  ```css
  background:
    radial-gradient(120% 80% at 18% 0%, rgba(74,158,255,0.04) 0%, transparent 55%),
    radial-gradient(140% 90% at 88% 110%, rgba(255,158,74,0.025) 0%, transparent 60%),
    #14171f;
  ```
- Role: low-amplitude environmental atmosphere across the entire body.
- Anti-pattern: heavy gradient or saturated tones (would read as decoration).

### Layer 3 — Canvas envelope gradients

- Set on `.intel-canvas`:
  ```css
  background:
    radial-gradient(110% 70% at 50% 0%, rgba(74,158,255,0.04) 0%, transparent 60%),
    radial-gradient(70% 50% at 50% 100%, rgba(255,158,74,0.025) 0%, transparent 70%);
  ```
- Role: top blue tint + bottom warm tint specifically inside the IntelligenceField center column. Frames the canvas region.

### Layer 4 — IntelligenceField column dividers

- Subtle `border-right: 1px solid #1a2030` between the three columns.
- Role: separating the interpretation / canvas / support rail without competing for attention.

### Layer 5 — Field gradient (per-mode signature)

- Set on `.rep-field::after`.
- BALANCED: state-color upper-left + warm lower-right + bottom blue.
- DENSE: three pressure-tier glow centers (HIGH upper-left, ELEVATED center, MODERATE lower-right).
- INVESTIGATION: vertical blue→yellow corridor.
- BOARDROOM: single central state-color radial.
- Role: the *mode signature* lives here. Switching lenses changes this layer.

### Layer 6 — Actor content

- Each actor renders semantic content using:
  - Top resonance line (1px gradient-faded).
  - Tag with code chip + name.
  - Tier-rail (left or top, blurred).
  - Glow dots at rail anchors.
  - Typography ladder (display weights for headlines, body for prose, monospace for hashes).
- Role: the *what* of the surface. Mode-agnostic shell, mode-aware composition.

### Layer 7 — Atmospheric overlays

- BOARDROOM Confidence Envelope concentric rings (-36px solid, -88px dashed).
- Boardroom mark glow halo (radial gradient).
- Inference Prohibition governance contour (extends behind the statement).
- Role: ceremonial / governance atmosphere — only when semantically justified.

---

## 3. Layering discipline

### 3.1 Each layer is felt, not seen

The layers are designed so that:

- A reader does not consciously notice each layer.
- A reader experiences the surface as one composed atmosphere.
- A reader can still *find* the layers when reading deliberately.

This is the difference between *atmosphere* and *decoration*.

### 3.2 Layer order is fixed

The z-index and pseudo-element ordering must be preserved:

- Layer 5 sits in `::after` of `.rep-field` with `z-index: -1` (behind actor content).
- Layer 7 sits in `::before` of `.actor` (resonance line) and `::after` of specific actors (governance contour).
- Layer 6 sits naturally in the document flow (no z-index manipulation).

If a future contract reorders the layers, atmospheric coherence will break.

### 3.3 Each layer has bounded amplitude

- Layer 2: opacity 0.025–0.04 — barely felt.
- Layer 3: opacity 0.025–0.04 — slightly more present at canvas edges.
- Layer 5: opacity 0.04–0.07 (state-tinted) — visible as field signature.
- Layer 6: full opacity (semantic content).
- Layer 7: opacity 0.18–0.42 — atmospheric, never dominant.

The amplitudes are calibrated. Increasing any layer's opacity by 0.10 would make the layer cross from atmospheric to decorative.

---

## 4. What the layers achieve together

The layered composition produces:

- **Operational gravity** — the surface feels weighted, not flat.
- **Atmospheric continuity** — switching lenses re-lights the surface, not reloads it.
- **Semantic coherence** — every layer encodes meaning.
- **Restraint** — the surface is calm despite carrying semantic richness.

These are the cinematic doctrine's promises. The layered composition is what delivers them.

---

## 5. Anti-pattern enforcement

The following are forbidden in the layering model:

- High-amplitude saturated gradients (would read as decoration).
- Full-opacity overlays on Layer 5 or 7 (would compete with content).
- Animated gradients (would distract from cognition).
- Gradient borders with chart-library register.
- Lens flares, particles, sparkle effects.
- Any blur with radius > 1px on content layers (Layer 6).
- Multiple state-colors mixed in a single layer (would dilute the state signature).

---

## 6. Authority

This layering model is authoritative for the LENS V2 atmospheric system. Future contracts that touch any of the seven layers must:

1. Preserve the layer order.
2. Preserve the bounded amplitudes.
3. Preserve the semantic anchoring of each layer.
4. Honor the anti-pattern enforcement.

---

**End of semantic atmospheric layering.**
