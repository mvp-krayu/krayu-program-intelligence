---
type: publish-node
brain: publish
path: /contact (and inline across pages)
---

# cta_model

## Message

Call to action structure for converting page visitors into assessment requests. Two primary conversion paths: direct assessment request, or product tier inquiry.

---

## Audience

All audiences — the CTA model applies across the full site at every entry point.

---

## Entry Point

- Primary: "Request a LENS Assessment" — assessment intake or direct contact
- Secondary: "Talk to us about your environment" — open inquiry
- Tertiary: "View Access Plans" — routes to /plans

---

## Linked Product Node

derived_from: [[../product/engagement_model]]
derived_from: [[../product/01_PRODUCT_MAP]]

---

## Controlled Claims

| CTA Claim | Product Basis | Canonical Basis |
|---|---|---|
| "Fast, controlled engagement" | [[../product/engagement_model]] | [[../canonical/streams/PRODUCTIZE.RAW.SOURCE.INTAKE.01]] |
| "Minimal client effort" | [[../product/engagement_model]] | [[../canonical/streams/PRODUCTIZE.RAW.SOURCE.INTAKE.01]] |
| "Decision-ready report" | [[../product/lens_report]] | [[../canonical/streams/PRODUCTIZE.LENS]] |

---

## CTA Rules

- CTA copy must not introduce new claims not present in product brain
- CTA must not imply capability not justified by canonical
- Tier upgrade CTAs must link to /plans — never to direct pricing
