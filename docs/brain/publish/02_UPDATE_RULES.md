---
type: governance
brain: publish
---

# Publish Brain — Update Rules

## Principle

The publish brain projects product truth into public-facing language. It introduces no new truth. Everything visible in the publish brain — claims, CTAs, audience definitions, copy — must be traceable to a product node, which is itself traceable to canonical and code.

Publish brain updates are evaluated last, after canonical, code, and product are settled.

---

## When the Publish Brain Must Be Updated

| Condition | Action |
|---|---|
| Product claim changes that is currently projected into publish | Amend affected publish node |
| CTA label or conversion path changes | Amend cta_model or affected page node |
| New product tier or engagement option now available | Extend product ladder section in affected node |
| Audience definition changes | Amend affected page node |
| Controlled claim's product basis changes | Amend the Controlled Claims table |
| New publish surface introduced (new page, new route) | Create new publish node |
| Existing publish copy contains a claim with no current product basis | Remove or correct the claim |
| Entry point or secondary CTA changes | Amend affected page node Entry Point section |

If a stream produces no public-facing change, the publish brain requires no update. Record: `NOT IMPACTED — no update required`.

---

## How Claims Are Promoted from Product to Publish

A claim may appear in publish only if it has already passed through the product brain.

Promotion path:
1. Claim exists in a product node with canonical backing
2. Claim appears in the product node's system capability mapping table
3. Claim is added to the publish node's Controlled Claims table with links to both product and canonical basis
4. Claim appears in public-facing copy only after the Controlled Claims table entry is complete and verified

Skipping this path — adding copy without a Controlled Claims table entry — is a governance violation.

---

## Publish Introduces No New Truth

The publish brain may:
- Rephrase product claims for executive readability and persuasion
- Select which claims to feature prominently on a given surface
- Adjust CTA copy, urgency framing, and entry point sequencing
- Define audience targeting and trigger conditions for engagement

The publish brain may NOT:
- Introduce a capability not present in the product brain
- State a measurable that no product node defines
- Create a new tier, access model, or engagement path independently of product
- Override product or canonical truth through copy choices

---

## CTA and Message Change Control

When a CTA or message changes:

1. Identify which product claim the CTA drives toward
2. Verify the claim exists in the product brain with canonical backing
3. If the change affects the CTA model system-wide → amend `cta_model.md`
4. If the change is page-specific → amend only the affected page node
5. Verify no CTA implies capability not present in the product brain

CTA copy that implies a product capability must link to the product node that backs it in the Controlled Claims table.

---

## Amend vs Extend

**Amend a publish node when:**
- An existing controlled claim is no longer backed by product
- A CTA points to a product path that has changed
- Audience definition has changed based on product positioning update
- Copy contains a claim that has been corrected or removed upstream

**Extend a publish node when:**
- A new product capability is now available for public projection
- A new section is being added to a page (new trigger card, new CTA block)
- A new entry point is introduced
- A new controlled claim is being promoted from product

---

## Final Controlled-Claims Validation

Before any publish brain update is considered closed, verify for every claim in the Controlled Claims table of the modified publish node:

- [ ] Product basis link resolves to an existing product node
- [ ] Canonical basis link resolves to an existing canonical node or stream capsule
- [ ] Claim language in the table matches what is currently stated in the product node
- [ ] No claim appears in the publish copy that is absent from the Controlled Claims table

If any check fails → the publish node update is invalid. Resolve the upstream gap before closing.

---

## Lineage Record

After any update to a publish node, append to a `## Lineage` section at the bottom of the file:

| Stream | Date | Change | Product basis |
|---|---|---|---|
| [STREAM_ID] | [YYYY-MM-DD] | [One sentence: what changed in this publish node] | [[../product/AFFECTED_NODE]] |

---

## Source Entry Control Modules

The following modules govern how routes enter the governed publish system. They are stored in:

`docs/brain/publish/source-entry/`

| Module | File | Purpose |
|---|---|---|
| WEB.SOURCE.ENTRY.PATTERN | `source-entry/WEB.SOURCE.ENTRY.PATTERN.md` | Detect routes present live but absent from governance |
| ROUTE.CLASSIFICATION.MODEL | `source-entry/ROUTE.CLASSIFICATION.MODEL.md` | Classify any detected route into exactly one governance class |
| ENTRY.GATE.RULESET | `source-entry/ENTRY.GATE.RULESET.md` | Define conditions under which a route may enter governed status |

### Mandatory Consultation Rule

These modules MUST be consulted before any stream that:
- introduces a new route to krayu.be or mirror.krayu.be
- references or links to krayu.be routes from mirror pages
- modifies `route_source_map.yaml`
- proposes or evaluates a bridge page between krayu.be and signal-pi.com

Consultation sequence:
1. Run `WEB.SOURCE.ENTRY.PATTERN` — detect any ungoverned routes first
2. Apply `ROUTE.CLASSIFICATION.MODEL` — classify each ungoverned route
3. Apply `ENTRY.GATE.RULESET` — verify all registration preconditions are met
4. Follow `PIPELINE.HANDOFF.MODEL` — execute through governed pipeline stages

Failure to consult these modules before route-touching work is a governance violation.
