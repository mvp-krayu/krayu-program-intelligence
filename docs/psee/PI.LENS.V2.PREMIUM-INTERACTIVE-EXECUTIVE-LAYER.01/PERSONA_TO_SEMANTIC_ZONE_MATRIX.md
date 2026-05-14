# PERSONA → SEMANTIC ZONE MATRIX

**Stream:** PI.LENS.V2.PREMIUM-INTERACTIVE-EXECUTIVE-LAYER.01
**Cross-references:** `SEMANTIC_ZONE_INVENTORY.md`, `PERSONA_LENS_MAPPING.md` (parent stream).

---

## 1. The matrix

Visual emphasis intensity:
- ★ — primary zone for this lens (dominant in the rep field)
- ◐ — secondary zone for this lens (supporting visibility)
- · — present-but-implicit (zone exists in the surface but is not surfaced by this lens)
- — — not surfaced by this lens

| Zone                          | BALANCED | DENSE | INVESTIGATION | BOARDROOM |
|-------------------------------|:--------:|:-----:|:-------------:|:---------:|
| Z1 Executive Posture          |    ★     |   ·   |       ◐       |     ★     |
| Z2 Resolution Boundary         |    ★     |   ·   |       ★       |     ◐     |
| Z3 Semantic Topology          |    —     |   ★   |       ◐       |     —     |
| Z4 Pressure Anchor            |    ◐     |   ★   |       ◐       |     ·     |
| Z5 Signal Stack               |    —     |   ◐   |       ★       |     —     |
| Z6 Cluster Concentration      |    —     |   ★   |       ◐       |     —     |
| Z7 Evidence Trace             |    —     |   —   |       ★       |     —     |
| Z8 Report Pack                |    ★     |   ★   |       ★       |     ★     |

The Z8 Report Pack is constant across all lenses — it is a footer-class artifact access band, not lens-weighted.

---

## 2. Per-lens dominant-zone story

### BALANCED (Executive lens · CEO consequence-first read)

Dominant zones: **Z1 (Posture) · Z2 (Resolution Boundary) · Z4 (Pressure Anchor summary)**.

Story arc on the surface:

1. Read declaration → Z1 posture.
2. Read qualifier mandate band → Z2 resolution boundary.
3. Read calm consequence statement + 3 anchor consequence path → Z4 pressure anchor in summary form.
4. Read Report Pack as access-only → Z8.

The reader closes the loop in under 60 seconds.

### DENSE (Structural lens · CTO cause and propagation)

Dominant zones: **Z3 (Topology) · Z4 (Pressure Anchor) · Z6 (Cluster Concentration)**.

Story arc:

1. Read declaration (Z1 implicit).
2. Read three weighted nodes with edges → Z3 + Z4.
3. Read cluster concentration sub-panel → Z6.
4. Read dense note → operational structural insight.
5. Read Report Pack → Z8.

The structural read takes longer than the BALANCED read. Two minutes is reasonable.

### INVESTIGATION (Evidence lens · Analyst trace and confidence)

Dominant zones: **Z7 (Evidence Trace) · Z5 (Signal Stack) · Z2 (Resolution Boundary)**.

Story arc:

1. Read declaration + qualifier band → posture + Z2.
2. Read three trace bands grouped by role → Z5 + Z7.
3. Read per-band confidence rows → Z2 again, evidence-side.
4. Read Report Pack → Z8.

The analyst stays longer — five to ten minutes is reasonable.

### BOARDROOM (Projection lens · minimal chrome)

Dominant zones: **Z1 (Posture) · Z2 (Confidence Boundary, summary)**.

Story arc:

1. Read declaration at projector size.
2. Read atmospheric mark + supportive sentence → Z1.
3. Glance qualifier mandate band → Z2 summary.
4. Glance Report Pack at footer → Z8 availability.

Boardroom is a 30-second projector read. No analyst load.

---

## 3. Cross-lens consistency

Some zones must remain consistent in *content* across lenses, even when their *visual emphasis* changes. Specifically:

- **Z1 Posture** — readiness state and qualifier-class are the same in every lens. The display register changes, the truth does not.
- **Z2 Resolution Boundary** — qualifier-in-effect and grounding label are the same in every lens. The detail level changes, the boundary does not.
- **Z8 Report Pack** — the four artifact entries are the same in every lens. Lens does not affect availability.

This consistency is part of the institutional trust contract from `EXECUTIVE_COGNITION_MODEL.md` §13.

---

## 4. Zones that are absent from a lens

A zone marked "—" in the matrix is **deliberately absent** from that lens. Examples:

- Z3 (Topology) is absent from BALANCED and BOARDROOM. Adding it would re-introduce structural complexity not appropriate for those lenses.
- Z7 (Evidence Trace) is absent from BALANCED, DENSE, and BOARDROOM. The full trace is an Analyst-class read.
- Z5 (Signal Stack) is absent from BALANCED and BOARDROOM. Signal-by-role grouping is a CTO/Analyst read.

If a future contract proposes adding an absent zone to a lens, the proposal must explicitly justify why and override this matrix.

---

## 5. Visible signature on the LENS V2 surface

The matrix is encoded on the surface through the **zone chips** rendered inside each rep field's `RepModeTag`:

- BALANCED chip stripe: `Z1 EXECUTIVE POSTURE · Z2 RESOLUTION BOUNDARY · Z4 PRESSURE ANCHOR`
- DENSE chip stripe: `Z3 SEMANTIC TOPOLOGY · Z4 PRESSURE ANCHOR · Z6 CLUSTER CONCENTRATION`
- INVESTIGATION chip stripe: `Z7 EVIDENCE TRACE · Z5 SIGNAL STACK · Z2 RESOLUTION BOUNDARY`
- BOARDROOM chip stripe: `Z1 EXECUTIVE POSTURE · Z2 CONFIDENCE BOUNDARY`

The chips read at small size (9px) with subtle steel-blue accent. They are not loud — they are operational identifiers.

---

## 6. Authority

This matrix is authoritative for the persona ↔ zone relationship in LENS V2. Future contracts that introduce a new zone or a new persona / lens MUST update this matrix.

---

**End of persona → semantic zone matrix.**
