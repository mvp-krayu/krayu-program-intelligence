---
type: publish-node
brain: publish
path: /lens
---

# lens_page

## Message

Presents LENS Assessment as a specific, bounded engagement product. Describes what the report contains, what the engagement looks like, and what the buyer receives.

Core message anchor: "Decision-ready. Not descriptive."

---

## Audience

Decision-ready buyers who have recognized a trigger and are evaluating whether to engage.

---

## Entry Point

- Primary CTA: "Request an Assessment"
- Secondary: "View a sample report section"
- Tertiary: plans tier comparison (links to /plans)

---

## Linked Product Node

derived_from: [[../product/lens_product]]
derived_from: [[../product/lens_report]]

---

## Controlled Claims

| Claim | Product Basis | Canonical Basis |
|---|---|---|
| "Full-domain system overview" | [[../product/lens_report]] | [[../canonical/streams/PRODUCTIZE.LENS]] |
| "Structural topology view" | [[../product/lens_report]] | [[../canonical/streams/PRODUCTIZE.LENS]] |
| "Focus domain spotlight" | [[../product/lens_report]] | [[../canonical/streams/PRODUCTIZE.LENS]] |
| "Print-ready executive artifact" | [[../product/lens_report]] | [[../canonical/streams/PRODUCTIZE.LENS]] |
| "Guided review session included" | [[../product/engagement_model]] | [[../canonical/05_DECISIONS]] — DEC-07 |
| "No instrumentation required" | [[../product/engagement_model]] | [[../canonical/streams/PRODUCTIZE.RAW.SOURCE.INTAKE.01]] |

## Controlled Claims — Tier 2 (Diagnostic Access)

Language boundary: claims MUST frame consequence statements conditionally ("if degraded"). Claims MUST NOT state advisory direction, prioritization, or inference-free derivation for consequence class outputs.

**Delivery form (Phase 1):** Tier-2 content is delivered as a zone-based Diagnostic Narrative HTML export. The delivery unit is a diagnostic zone (derived deterministically from canonical topology and signal registry), not the raw INVESTIGATION_TARGET schema. Publish claims must reflect this zone-based form, not the investigation-target schema framing.

**Phase gate note:** The `consequence_class` claim (STRUCTURAL-INFERENCE row below) requires Phase 2 activation before it may appear in any publish surface. In Phase 1, this dimension is deferred — do not publish this claim until entitlement gating and consequence_class surface are implemented.

| Claim | Product Basis | Canonical Basis | Derivation Class | Phase Gate |
|---|---|---|---|---|
| "Each unknown dimension identified individually" | [[../product/diagnostic_access_product]] | [[../canonical/streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01]] | EVIDENCE-DERIVABLE | Phase 1 — active |
| "Scope gap described for each unknown dimension" | [[../product/diagnostic_access_product]] | [[../canonical/streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01]] | EVIDENCE-DERIVABLE | Phase 1 — active |
| "System area responsible for each dimension identified" | [[../product/diagnostic_access_product]] | [[../canonical/streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01]] | EVIDENCE-DERIVABLE | Phase 1 — active |
| "Consequence if each dimension is in a degraded state" | [[../product/diagnostic_access_product]] | [[../canonical/streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01]] | STRUCTURAL-INFERENCE — conditional framing required | Phase 2 — DEFERRED: do not publish |
| "What evidence would move each dimension from unknown to confirmed" | [[../product/diagnostic_access_product]] | [[../canonical/streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01]] | EVIDENCE-DERIVABLE | Phase 1 — active |

### Forbidden Publish Claims (Tier 2)

The following claims are forbidden in any publish surface for Diagnostic Access:

- "All findings traceable to specific evidence — not inferred" — FALSE: consequence class is STRUCTURAL-INFERENCE. This claim must not appear.
- "interrogate it, prioritize it, and act on it" — "prioritize" and "act on" are advisory verbs implying authority beyond governed output. Replace with: "investigate and understand".
- Any claim asserting certainty about current system degradation state.
- Any claim implying open-ended advisory guidance or consulting output.
- Any claim describing Tier-2 delivery as "investigation target" schema output — Phase 1 delivery form is zone-based Diagnostic Narrative; INVESTIGATION_TARGET schema is the canonical concept layer only.

---

## Lineage

| Stream | Date | Change | Product basis |
|---|---|---|---|
| PRODUCTIZE.LENS.COMMERCIAL.PACKAGE.05 | 2026-04-22 | Extended with Tier 2 Controlled Claims section; forbidden claims documented | [[../product/diagnostic_access_product]] |
| BRAIN.RECONCILE.LENS.TIER2.01 | 2026-04-23 | Added delivery form note (zone-based Diagnostic Narrative = Phase 1 form); added Phase gate column; added forbidden claim for investigation-target schema framing; deferred consequence_class publish claim to Phase 2 | [[../product/diagnostic_access_product]] |
| PUBLISH.BRAIN.GOVERNANCE.UPDATE.01 | 2026-04-23 | Appended Surface Governance section: surface ownership table, target resolution rule, canonical truth rule, publish state model, execution rule | N/A |

---

## Surface Governance

Extension: PUBLISH.BRAIN.GOVERNANCE.UPDATE.01

### 1. Surface Ownership

Publish surfaces are exclusive by content role:

| Surface | Repo | Permitted content |
|---|---|---|
| mirror.krayu.be | krayu-mirror | authority / category / discipline |
| mirror.signal-pi.com | signal-mirror | product / commercial / LENS |

Content must never cross surfaces.

### 2. Target Resolution

Every publish execution must declare:
- TARGET REPO (name or path)
- TARGET SURFACE (domain)

A surface name alone is insufficient. "mirror" is not a valid execution target.

If repo and surface are not both explicit → publish execution must stop.

### 3. Canonical Truth

Canonical must reflect existing surface reality.

- If the primary page exists → canonical may point to it
- If the primary page does not exist → the page must self-canonicalize

No forward-pointing canonicals are allowed.

### 4. Publish State

| State | Condition |
|---|---|
| prepared | local change present |
| staged in repo | committed locally |
| deployed | pushed and built |
| published live | reachable on target surface |

Intent does not equal deployment evidence.

### 5. Execution Rule

PUBLISH governance is enforced by brain activation plus stream contract.
It is not enforced by hidden memory.
If the stream does not activate PUBLISH explicitly, PUBLISH rules are not assumed.
