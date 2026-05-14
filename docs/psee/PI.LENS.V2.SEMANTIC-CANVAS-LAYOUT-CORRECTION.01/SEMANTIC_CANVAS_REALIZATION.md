# SEMANTIC CANVAS REALIZATION

**Stream:** PI.LENS.V2.SEMANTIC-CANVAS-LAYOUT-CORRECTION.01
**Authority:** This document records the architectural correction that turned LENS V2 from "executive prose with semantic side panel" into "center semantic canvas with interpretation companion and support rail."

---

## 1. The corrected layout

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ AUTHORITY BAND                                                                      │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ DECLARATION ZONE  (compressed; companion to canvas)                                 │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ QUALIFIER MANDATE BAND  (when active)                                               │
├──────────────────┬───────────────────────────────────────┬──────────────────────────┤
│                  │                                       │                          │
│  EXECUTIVE       │   SEMANTIC OPERATIONAL CANVAS         │  SUPPORT RAIL            │
│  INTERPRETATION  │   (PRIMARY COGNITION SURFACE)         │  (compact)               │
│  LAYER           │                                       │                          │
│                  │   - mode-active visual                │  - evidence state        │
│  - compressed    │   - semantic constructs               │  - qualifier state       │
│    narrative     │   - operational gravity               │  - Report Pack access    │
│  - companion to  │   - visual focus                      │                          │
│    canvas        │                                       │                          │
│                  │                                       │                          │
│  ~280 px         │   ~860 px (the dominant region)        │   ~280 px                │
│                  │                                       │                          │
├──────────────────┴───────────────────────────────────────┴──────────────────────────┤
│ PROPAGATION STRUCTURE ZONE  (full width — descent context)                         │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ EVIDENCE LAYER  (full width — supplementary descent)                                │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ GOVERNANCE RIBBON                                                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

The IntelligenceField changed from a 2-column layout (narrative left ~60%, rep field right ~40%) into a 3-column operational surface where the center carries the primary semantic representation.

---

## 2. What changed structurally

### 2.1 Layout grid

**Before:**
```
.intelligence-field { grid-template-columns: minmax(0, 1fr) minmax(380px, 0.62fr); }
```

**After:**
```
.intelligence-field { grid-template-columns: minmax(260px, 0.85fr) minmax(0, 2.2fr) minmax(280px, 0.8fr); }
.intelligence-field--boardroom { grid-template-columns: minmax(240px, 0.7fr) minmax(0, 2.6fr) minmax(260px, 0.7fr); }
```

The center column now carries the dominant share of horizontal real estate (`2.2fr` vs sides at `0.85fr` / `0.8fr` — roughly 56% center).

### 2.2 Component restructure

| Region              | Before                                                              | After                                                                |
|---------------------|---------------------------------------------------------------------|----------------------------------------------------------------------|
| Left                | `.intel-primary` — full narrative wall (executive_summary + why + structural) | `ExecutiveInterpretation` — compressed companion at 13/12/11 px      |
| Center              | (none — left column was the dominant region)                         | `RepresentationField` (now `.intel-canvas`) — primary cognition surface, mode-weighted |
| Right               | `.rep-column` — RepresentationField as a side panel                  | `SupportRail` — evidence state + qualifier + Report Pack             |

### 2.3 Report Pack relocation

**Before:** Report Pack was rendered as a horizontal full-width band beneath the EvidenceLayer. It interrupted the page rhythm and read as an admin/navigation footer.

**After:** Report Pack is integrated into the right SupportRail as a compact list of artifacts. It sits beside the canvas, visible but not interrupting. The horizontal band is removed entirely.

### 2.4 Center canvas mode designs

The four mode-specific representations were rescaled to fill the wider, taller canvas:

- **BALANCED — Executive Consequence Canvas:** Three horizontal anchors arranged in a row (Source / Coordination / Secondary) connected by a pressure-graded rail. Each anchor carries a 36px tier-glow halo with an inner 12px tier dot. The composition is wide and reads as a *consequence flow*, not as a stacked list.
- **DENSE — Semantic Topology Canvas:** Spatial three-node composition with Coordination Layer as the visually dominant central actor (lifted background, larger marker, raised typography). Primary Delivery to the left as origin; Secondary Delivery to the right as receiver. Pressure flow line connects them through the center.
- **INVESTIGATION — Evidence Trace Canvas:** Three larger trace bands stacked vertically with more breathing room and stronger evidence text mass.
- **BOARDROOM — Atmospheric Projection Canvas:** A 320×320 atmospheric mark area with a 168px state-color ring, surrounding glow, and an outer secondary ring. A 19px supportive sentence and a tracked uppercase scope footer.

---

## 3. The conceptual shift

The previous iteration ("PI.LENS.V2.PREMIUM-INTERACTIVE-EXECUTIVE-LAYER.01") added semantic zones as **metadata chips** at the top of each rep field. The contract for this stream pointed out that this was insufficient — semantic zones must become *visual actors*, not chips on the side panel.

This stream realized the shift by:

1. Moving the rep field from the side panel into the center canvas, where it becomes the primary cognition surface.
2. Rescaling the mode-specific designs (anchors larger, topology spatial, ring larger, trace bands wider).
3. Compressing the executive narrative to a left companion.
4. Folding the support content (evidence state, qualifier, report pack) into a single compact right rail.

Semantic zones now read as visual actors *in the center canvas* — the pressure-tier glow halos, the spatial topology, the trace band tier rails, the atmospheric ring — not as metadata.

---

## 4. The cognitive hierarchy on the corrected surface

Reading order, top to bottom:

1. **Authority band** — calm identity strip.
2. **Declaration zone** — the dominant text element (kept).
3. **Qualifier mandate band** — when active, between declaration and IntelligenceField.
4. **IntelligenceField three-column surface:**
   - Eye lands on the center canvas (the dominant region).
   - Drops to the left interpretation as companion ("what does this mean for me").
   - Glances right to confirm evidence state, qualifier, and report pack availability.
5. **Lower zones (Propagation Structure / Evidence Layer)** — descent context for operators who need it.
6. **Governance ribbon** — stable institutional footer.

The new hierarchy makes the center canvas the second focal point after the declaration. The left interpretation is supporting; the right rail is supporting. This is what the contract specified.

---

## 5. What was preserved

- Cinematic doctrine compliance (humanist sans, atmospheric ground, anti-dashboard floor).
- Persona-line microcopy under the lens controls.
- Semantic zone chips inside each rep field's mode tag.
- Static report artifact registry.
- Future client/run binding contract.
- Render-state vocabulary, qualifier semantics, propagation logic, governance verdict logic — all untouched.

---

## 6. What this stream did NOT do

- Did NOT implement live client/run binding (still a fixture-driven surface).
- Did NOT mutate evidence semantics.
- Did NOT add new dependencies.
- Did NOT rename visible mode labels.
- Did NOT introduce static-HTML report prose into LENS V2.
- Did NOT modify any other route or surface.

The change is entirely a layout / composition / scale correction inside `app/execlens-demo/pages/lens-v2-flagship.js`.

---

**End of semantic canvas realization document.**
