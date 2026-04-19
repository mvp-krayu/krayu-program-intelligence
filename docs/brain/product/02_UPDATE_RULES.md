---
type: governance
brain: product
---

# Product Brain — Update Rules

## Principle

The product brain translates canonical truth and code capability into a grounded product description. It may translate. It may not invent. Every claim in the product brain must be traceable backward to either canonical or code.

Product brain updates are evaluated after canonical and code are settled.

---

## When the Product Brain Must Be Updated

| Condition | Action |
|---|---|
| New product capability introduced | Extend or create product node |
| Existing capability removed or constrained | Amend product node |
| Product tier changed (added, removed, renamed) | Amend engagement_model or create new node |
| Measurable claim changes (score range, count, format, duration) | Amend product node + verify canonical backing |
| Constraint changes (gating, access, output format) | Amend product node |
| Code brain change creates or removes a product-visible feature | Update system capability mapping |
| Canonical change invalidates an existing product claim | Amend product node with correction |
| Engagement model step changed | Amend engagement_model node |

If a stream produces no product-visible change, the product brain requires no update. Record: `NOT IMPACTED — no update required`.

---

## How New Offer Language Is Tested

Before adding any new offer language to a product node:

1. Identify the canonical basis — which stream capsule or invariant supports this claim?
2. Identify the code basis — which code node implements it?
3. Confirm both exist and are internally consistent
4. Add the claim with links to both the canonical and code basis

If no canonical basis exists → the claim may not be added.
If no code implementation exists → the claim may not be added as current capability.

An ungrounded claim is a product brain violation regardless of how accurate it may seem.

---

## Amend vs Extend

**Amend a product node when:**
- An existing claim is incorrect and must be corrected
- An existing capability has been removed or changed upstream
- A constraint has changed (e.g., access tier gating, output format)
- Canonical correction propagates into a product claim

**Extend a product node when:**
- A new capability is being added to an existing product surface
- A new constraint is additive and does not conflict with existing content
- A new tier or engagement option is introduced

---

## Product May Translate, Not Invent

The product brain may:
- Rephrase canonical truth in language an executive buyer understands
- Group capabilities into offer bundles for the engagement model
- Map product deliverables to canonical outputs
- Define measurables derived from canonical definitions

The product brain may NOT:
- State that the system does something that no canonical node defines
- Claim a measurable output that no code node produces
- Describe an engagement model that no upstream stream has established
- Assert capability beyond what the code brain maps

---

## Every Measurable Claim Must Link Backward

Any claim in a product node that uses a measurable (count, score range, format, duration, number of steps) must include a link to:
- The canonical node that defines it, AND/OR
- The code node that produces it

Unlinked measurables are a validation violation. They must be either linked or removed before the product brain update is closed.

---

## Lineage Record

After any update to a product node, append to a `## Lineage` section at the bottom of the file:

| Stream | Date | Change | Canonical basis |
|---|---|---|---|
| [STREAM_ID] | [YYYY-MM-DD] | [One sentence: what changed] | [[../canonical/streams/AFFECTED_CAPSULE]] |
