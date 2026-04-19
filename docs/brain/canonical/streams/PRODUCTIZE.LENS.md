---
type: stream-capsule
brain: canonical
layer: L5 → L6
canonical_status: ACTIVE
---

# PRODUCTIZE.LENS

## Purpose

Define the LENS executive intelligence surface as a governed product layer. LENS translates Core-derived structural truth into a projection consumable by executive stakeholders. It is the canonical boundary between internal intelligence and external projection.

LENS does not derive. It projects.

---

## Domain Model Authority

The domain model is defined at the LENS canonical level. It is a fixed projection schema consumed by downstream layers. The static fixture (curated graph data, topology scaffold) encodes this schema. 40.2 classifies evidence INTO this schema — it does not define it. No downstream layer (product, publish, code) may assert domain model ownership independently of this canonical node.

(BlueEdge reference case: 17 nodes, 12 edges, 5 clusters — client engagements use client-specific fixture derived from this schema.)

---

## Boundary

Input: ZONE-2 projections from runtime surface
Output: executive-facing intelligence view — scored, confidence-bounded, navigable

---

## Inputs

- ZONE-2 projections from [[PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01]]
- Curated graph data (static, governed fixture — BlueEdge reference case: 17 nodes, 12 edges, 5 clusters; varies by client)
- Claim-level scores and confidence bands

---

## Outputs

- LENS executive view (/lens route)
- System Intelligence Overview (full-domain coverage — all domains identified in client environment)
- Structural topology view (SVG, light mode for print)
- Focus domain spotlight
- Executive report (HTML artifact, timestamp-stamped)
- Commercial access gating surface

---

## Projection Authority

LENS consumes two input types. Their authority is explicitly partitioned:

**Runtime payload (ZONE-2) is authoritative for:**
- Scores (0–100 per domain/claim)
- Confidence bands (proven floor, achievable ceiling, range)
- Focus domain selection (highest-leverage domain, derived from payload)

**Static fixture (curated graph data) is:**
- A projection scaffold only
- Used for topology layout and SVG rendering
- NOT a source of truth for scores, confidence, or domain selection
- Fixed per client engagement; does not change during runtime

**Conflict resolution:**
In any case of conflict between the runtime payload and the static fixture, the runtime payload overrides. The fixture provides visual structure; the payload provides evidential truth.

---

## Evidence Produced

- LENS report artifact (lens_report_YYYYMMDD_HHMMSS.html)
- STREAM_ID embedded in every report

---

## Upstream Dependencies

- [[PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01]]
- curatedGraphData.js — governed static fixture (SVG_VIEWBOX 0 0 860 475)

---

## Downstream Impact

- Consumed by: [[../../product/lens_product]] (product translation)
- Consumed by: [[../../publish/lens_page]] (publish projection)

---

## Canonical Status

ACTIVE

---

## Related Invariants

- [[../04_INVARIANTS]] — INV-08 (ZONE-2 purity — no SIG-, DOMAIN-, CAP-, COMP- in LENS output)
- [[../04_INVARIANTS]] — INV-01
- [[../04_INVARIANTS]] — INV-05

---

## Code Surface

implements: [[../../code/runtime_surface]]
