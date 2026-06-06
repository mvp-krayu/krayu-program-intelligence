# LENS Gravity Projection Options — How AF-001 Should Appear

Stream: PI.LENS-GRAVITY-PROJECTION.01
Date: 2026-06-06
Classification: G2 (architecture-consuming)
Status: COMPLETE

---

## The Projection Problem

AF-001 states: the code center of mass and the operational center of mass do not fully coincide. This is a spatial-structural finding — it describes two gravity fields that occupy different regions of the system.

How should LENS and EIR project this for executives?

---

## Option 1: Dual Topology Overlay

**Surface:** Dense / Chief Architect topology view

**Concept:** The existing structural topology (nodes, edges, pressure zones) gains a second overlay layer showing runtime connectivity edges. Where the two layers diverge, visual tension is visible.

**Projection mechanics:**
- Static topology rendered as current (nodes, edges, cluster boundaries)
- Runtime edges overlaid with distinct visual treatment (dashed lines, different color family)
- Gravity wells marked with visual weight indicators — static well at one locus, runtime well at another
- Divergent regions highlighted by color differential (high static + low runtime vs low static + high runtime)

**Strengths:**
- Uses the existing topology substrate — no new surface required
- Divergence is visually self-evident (two gravity centers that don't overlap)
- Chief Architect can trace individual edges

**Weaknesses:**
- Visual density could overwhelm — two complete edge sets on one topology
- Requires the topology to render both static and runtime edges correctly
- Dense persona only — not appropriate for Boardroom/Balanced

---

## Option 2: Gravity Comparison Panel

**Surface:** Boardroom / Transformation Leader

**Concept:** A side-by-side or stacked comparison showing static gravity loci vs. operational gravity loci. Not a topology — a governed narrative panel.

**Projection mechanics:**
- Left/top: **Code Center of Mass** — domain name, top static conditions, file-level hubs
- Right/bottom: **Operational Center of Mass** — domain name, runtime components, coordination mechanisms
- Center/between: **Divergence indicator** — "coincident" / "partially divergent" / "fully divergent"
- Below: AF-001 executive implication as governed narrative

**Strengths:**
- Clean executive surface — no graph complexity
- Directly answers "where is the gravity?" without requiring topology literacy
- Works for Boardroom and Transformation Leader altitudes
- The divergence state is the primary content, not a derived observation from dense data

**Weaknesses:**
- Does not show the topology — loses spatial context
- Requires two distinct gravity computations to populate

---

## Option 3: Annotated Topology with Gravity Markers

**Surface:** Balanced / Operator

**Concept:** The existing topology with gravity markers (visual weight indicators at specific nodes) showing where static mass concentrates vs. where runtime mass concentrates. Not a full edge overlay — marker-based.

**Projection mechanics:**
- Static gravity markers: solid circles/weights at static hub nodes (Platform Infrastructure)
- Runtime gravity markers: distinct icon at runtime hub nodes (Fleet Core Operations, Event-Driven Architecture)
- Size/weight proportional to condition count or severity
- Domains without markers are structurally neutral
- Divergence is visible as spatial separation between the two marker types

**Strengths:**
- Lighter than full dual-edge overlay — markers instead of edges
- Works at Balanced altitude — not too dense, not too abstract
- Spatial divergence is immediately visible (markers in different regions)
- Compatible with existing topology rendering

**Weaknesses:**
- Loses edge-level detail (which specific event flows, which MQTT topics)
- Marker placement requires gravity computation per domain

---

## Option 4: EIR Narrative Chapter

**Surface:** EIR (Executive Intelligence Report)

**Concept:** AF-001 becomes a standalone chapter in the EIR titled "Structural vs Operational Gravity." The chapter presents the divergence as a governed finding with evidence, implication, and visual summary.

**Projection mechanics:**
- Chapter title from AF-001 title
- Opening statement from AF-001 description
- Evidence table: static loci vs runtime loci with evidence sources
- Implication paragraph from AF-001 executive_implication
- Optional: inline comparison diagram (static dot vs runtime dot on a simplified domain map)

**Strengths:**
- EIR already has a chapter structure — AF-001 fits naturally as a high-order chapter
- Narrative format appropriate for document consumption
- No topology rendering required — text + table
- Can be included in Structural Assessment delivery artifact

**Weaknesses:**
- Static document — no interaction
- Cannot drill into component-level detail without becoming too long

---

## Recommendation by Persona

| Persona | Recommended Option | Why |
|---|---|---|
| **Boardroom** | Option 2 (Gravity Comparison Panel) | Executives need the divergence state, not the topology. Clean panel with governed narrative. |
| **Balanced** | Option 3 (Annotated Topology) | CTO/VP Eng wants to see WHERE in the topology, but not every edge. Markers give spatial context at the right altitude. |
| **Dense** | Option 1 (Dual Topology Overlay) | Chief Architect wants full evidence depth. Both edge sets visible. Dense by design. |
| **Operator** | Option 3 + drill-down | Operator needs markers for orientation, then ability to drill into specific runtime components. |
| **EIR** | Option 4 (Narrative Chapter) | Document artifact — AF-001 as standalone chapter with evidence table. |

---

## Data Requirements

All options require the following data to be available at projection time:

| Data | Source | Currently Available |
|---|---|---|
| Static gravity loci | ConsequenceCompiler → static conditions by domain | YES |
| Runtime gravity loci | ConsequenceCompiler → runtime conditions by domain | YES |
| AF-001 finding object | deriveArchitecturalFindings() | YES |
| Runtime component names | formatRuntimeTopology → runtime dependency hubs | YES |
| Domain backing status | qualifyDomainBacking → qualified registry | YES |
| Divergence classification | AF-001 divergent loci count | YES (3 divergent loci) |

No new data computation is needed. All required data is already produced by the cognition spine. The work is projection — connecting existing cognition objects to visual surfaces.

---

## Implementation Sequencing (if pursued)

1. **EIR chapter (Option 4)** — lowest effort, highest immediate value. AF-001 is already in `deriveArchitecturalFindings()`. ConsequenceNativeEIR.js can render it as a chapter. No UI work.
2. **Gravity Comparison Panel (Option 2)** — moderate effort. New Boardroom component. Data already available from verdict.
3. **Annotated Topology (Option 3)** — moderate effort. Extend existing topology renderer with gravity markers.
4. **Dual Overlay (Option 1)** — highest effort. Requires runtime edge rendering on the SVG topology. Runtime edge data available but SVG integration not trivial.

---

## What This Assessment Does NOT Do

- No React implementation
- No component code
- No SVG rendering
- No projection function implementation
- No ConsequenceCompiler changes
- No new cognition objects

This is a projection design assessment. Implementation is a separate stream.
