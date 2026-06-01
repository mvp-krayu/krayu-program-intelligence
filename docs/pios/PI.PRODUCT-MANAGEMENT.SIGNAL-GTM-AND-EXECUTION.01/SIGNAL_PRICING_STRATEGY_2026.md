# Signäl Pricing Strategy 2026

> **Authority:** This document defines the pricing STRUCTURE for all Signäl commercial offers. It defines models, anchors, units, bundling logic, and upsell mechanics. It does NOT define specific price points — those are operational decisions that depend on market testing, buyer feedback, and competitive reality.

> **Frozen inputs:** SIGNAL_SKU_MODEL_2026.md, SIGNAL_PRODUCT_PLAN_2026.md, SIGNAL_TIER1_COMMERCIAL_OFFER.md, SIGNAL_COMPETITIVE_POSITIONING.md

---

## Pricing Principle

Signäl is priced as **advisory intelligence**, not software tooling.

This distinction drives every structural decision below:

| Advisory Intelligence | Software Tooling |
|----------------------|-----------------|
| Per-engagement or per-outcome | Per-seat or per-month |
| Value anchored to decision quality | Value anchored to feature access |
| Buyer compares to consultants | Buyer compares to SaaS tools |
| Price justified by what it replaces | Price justified by feature comparison |
| Conversation about investment | Conversation about cost |

**Why this matters:** If Signäl is priced like SaaS ($X/seat/month), it competes against SonarQube, CodeScene, and LinearB on feature checklists. If Signäl is priced like advisory intelligence, it competes against consultant assessments, manual due diligence, and architecture reviews. The second comparison is where Signäl wins — structurally and commercially.

The moment pricing feels like software licensing, category positioning collapses.

---

## Strategic Decision 1: What Is the Pricing Unit?

### Options Assessed

| Unit | Definition | Pros | Cons |
|------|-----------|------|------|
| **Per program** | One fee per program assessed | Natural scope boundary. Buyer understands "program." Aligns with how they budget. | "Program" can be ambiguous (monorepo with 3 services — 1 program or 3?) |
| **Per repository** | One fee per repository analyzed | Clean technical boundary. No ambiguity. | Too granular. A program with 5 repos becomes 5x the price. Creates scope anxiety. Feels like tooling, not intelligence. |
| **Per assessment** | One fee per assessment engagement | Aligns with advisory model. One engagement, one fee. | Identical to per-program for SA. Only differs at SC (multiple runs). |
| **Per seat** | One fee per user accessing LENS | Standard SaaS model. | Immediately positions as tooling. A CTO sharing findings with their board shouldn't increase the price. Destroys advisory positioning. |
| **Per organization** | One fee per customer entity | Simple. No scope anxiety. | Underprices large orgs, overprices small ones. No relationship between fee and value delivered. |

### Decision: Per-Program Assessment

**The pricing unit is one program assessed.**

A "program" is defined as: a bounded execution scope with its own structural topology — typically one or more repositories that together constitute a deployable system or platform. The scoping conversation happens during evidence intake, not during pricing.

**Why per-program wins:**

1. It matches how buyers think. A CTO says "I want structural intelligence on our payments platform." That's one program. One engagement. One fee.
2. It creates natural expansion. "Want to assess your second program?" is a clean upsell.
3. It avoids the SaaS trap. Per-seat pricing makes every new stakeholder a cost conversation. Per-program pricing makes sharing findings free.
4. It aligns with the advisory model. A consultant assessing a program charges for the engagement, not per reader of the report.

**Scoping rule:** If a "program" contains structurally independent subsystems that require separate topology reconstruction, each subsystem is a separate assessment. This is a structural determination, not a commercial one — Signäl determines scope during evidence intake based on structural boundaries, not the customer's organizational definition.

---

## Strategic Decision 2: Advisory Bundled or Separate?

### Options Assessed

| Model | Description | Pros | Cons |
|-------|-----------|------|------|
| **Bundled** | Advisory session included in every SA engagement | Feels like a complete intelligence engagement. No surprise costs. Delivers maximum value. | Slightly higher headline price. Customer cannot "skip" advisory to save money. |
| **Separate** | LENS + Structural Verdict delivered first. Advisory session priced as add-on. | Lower headline price. Customer chooses depth. | Splits the value moment. Customer receives findings without interpretation and may undervalue them. Creates a two-step sale. |
| **Hybrid** | Brief advisory included (30 min). Extended advisory (90 min) as upgrade. | Middle ground. | Complexity. "How much advisory do I get?" is a bad question. |

### Decision: Advisory Bundled

**The advisory session is included in every SA and SA-DD engagement. Always.**

**Why bundled wins:**

1. The advisory session IS the value delivery moment. A CTO receiving a Structural Verdict without a walkthrough may not fully absorb the findings. The advisory session creates the "I need this ongoing" reaction that drives SC conversion.
2. Separating advisory creates a perception gap. "They gave me a report and then charged me extra to explain it" is a category-killing experience.
3. The advisory session is where structural language transfers. After the walkthrough, the CTO uses terms like "coupling inertia" and "dependency amplification" in their own conversations. That's category creation through vocabulary transfer. It's too valuable to gate behind an upsell.
4. Cost of delivery is marginal. The advisory session is 60-90 minutes of a prepared walkthrough. The intelligence is already produced. The marginal cost of delivery is low relative to the value it generates.

**Exception:** SE (Enterprise) pricing bundles dedicated advisory allocation (quarterly reviews, on-demand consultations) as part of the platform license. This is not "extra advisory" — it's the enterprise service model.

---

## Strategic Decision 3: Fixed Fee or Range?

### Options Assessed

| Model | Description | Pros | Cons |
|-------|-----------|------|------|
| **Fixed fee** | One price per SA engagement regardless of program size | Simple. No scope negotiation. "This is what it costs." | Underprices large programs. Overprices small ones. |
| **Range by program size** | Price scales with structural complexity (number of domains, files, dependency edges) | Fair. Larger programs = more analysis = higher fee. | Introduces a scoping conversation before pricing. Customer doesn't know their "structural complexity." |
| **Tiered fixed** | 2-3 fixed prices based on rough program size (S/M/L) | Simple with some fairness. "Small program, medium program, large program." | Where are the boundaries? A "medium" program that's structurally complex may be underpriced. |
| **Value-based** | Price based on the buyer's context (PE deal value, program budget, modernization budget) | Maximizes revenue per engagement. | Requires deep discovery before quoting. Feels consultative. Hard to publish. |

### Decision: Single Fixed Fee — MARKET VALIDATION REQUIRED for Tiering

**Launch with one price. One offer. One conversation.**

The first 10 customers will buy "Structural Assessment" — not "Structural Assessment Standard" or "Structural Assessment Complex." The customer does not know their dependency node count, topology size, or structural complexity. They know: "We have a platform."

**Launch model:**

| Tier | Pricing Model |
|------|---------------|
| **Structural Assessment** | Fixed published fee — one price, one offer |
| **Enterprise-scale** (>5,000 files or multi-repository) | Custom quote (scoping call required) |

**Why single price for launch:**

1. Simplest possible first conversation. No tier selection. No scoping questions. "This is what it costs."
2. The customer cannot self-assess structural complexity. Introducing tiers before the market understands the product creates confusion, not fairness.
3. Early-stage pricing should optimize for deal velocity, not price discrimination.
4. Market feedback from the first 10 engagements will reveal whether tiering is needed and where the natural boundaries are.

**Future tiering (MARKET VALIDATION REQUIRED):** If early engagements reveal that small programs are overpriced or large programs are underpriced, introduce Standard/Complex tiers based on observed structural complexity patterns. The tier boundaries should come from operational data, not from assumptions about file counts.

**Scoping mechanism:** For enterprise-scale programs (obvious from the evidence intake — multi-repository, >5,000 files), a custom quote is appropriate. For everything else: one price.

---

## Strategic Decision 4: SC Subscription Basis

### Options Assessed

| Model | Description | Pros | Cons |
|-------|-----------|------|------|
| **Per-program annual** | Fixed annual fee per program under continuous assessment | Clean. Predictable. Matches SA expansion path. | Multi-program customers hit a linear cost wall. |
| **Per-program annual + run credits** | Annual platform fee + credits consumed per assessment run | Caps platform cost. Runs become a usage metric. | Credit models create "save my credits" behavior. Discourages the frequent assessment that drives value. |
| **Flat annual** | One annual fee regardless of run count or program count | Maximum simplicity. No usage anxiety. | Underprices heavy users. Overprices light users. |
| **Per-program annual, unlimited runs** | Annual fee per program. Run as often as you want. | Encourages frequent assessment. Aligns incentives (more runs = more structural insight = more value = more renewal). | Marginal cost per run must be low enough to sustain unlimited model. |

### Decision: Per-Program Annual, Unlimited Runs

**SC is priced as an annual per-program subscription with unlimited assessment runs.**

**Why unlimited runs wins:**

1. The core SC value proposition is "track how your structural posture evolves." If runs are rationed, the customer runs less. If they run less, they see less evolution. If they see less evolution, they don't renew. Unlimited runs aligns incentives perfectly.
2. Marginal cost per run is low. The structural intelligence pipeline is automated. Once evidence intake is operational, additional runs are compute cost, not labor cost.
3. It differentiates from SA. SA = one assessment, one fee. SC = continuous access, run whenever you need to. The unlimited model makes this difference visceral.
4. Credit models create bad behavior. A customer with 4 remaining credits in Q4 either hoards them or rushes them. Neither produces good outcomes.

**Multi-program SC:** Each additional program under the same SC subscription is priced at a discount to the first (declining marginal cost — the platform is already provisioned, the advisory relationship exists, only the structural analysis is additive).

---

## Strategic Decision 5: SA-DD Premium Basis

### Options Assessed

| Model | Description | Pros | Cons |
|-------|-----------|------|------|
| **Fixed premium over SA** | SA-DD = SA price + fixed DD premium | Simple. Transparent. | Doesn't capture deal-driven urgency value. |
| **Multiple of SA** | SA-DD = Nx SA price | Simple. Scales with program size. | Arbitrary multiplier feels unjustified. |
| **Deal-timeline premium** | SA-DD priced relative to the alternative (manual DD at $50-150K over 4-6 weeks) | Captures maximum value. Anchored to competitor pricing. | Requires knowing the buyer's alternative cost. |
| **Per-target fixed** | SA-DD has its own fixed price, independent of SA | Clean. Dedicated pricing for a dedicated buyer. | Disconnected from SA pricing logic. |

### Decision: Per-Target Fixed, Anchored to DD Alternative

**SA-DD is priced as a standalone per-target engagement with its own published price, anchored to the manual due diligence alternative.**

**Why this wins:**

1. SA-DD has a different buyer (PE, M&A), a different urgency (deal timeline), and a different competitive anchor (DD consultancies at $50-150K over 4-6 weeks). Pricing it as "SA + premium" anchors to the wrong reference.
2. The SA-DD buyer doesn't know or care what SA costs. They compare against their DD consulting budget. The pricing conversation is: "5 days and $X versus 4 weeks and $100K+ of consultant time."
3. Per-target is the natural unit. One acquisition target, one structural assessment, one Structural Verdict for the investment committee.
4. SA-DD includes capabilities that SA does not (all 4 cognitive modes, Investigation Protocol, guided investigation, investigation trail). The deliverable set justifies a standalone price.

**Pricing anchor:** The buyer's alternative is manual technical due diligence at $50-150K over 4-6 weeks. SA-DD should price significantly below this while delivering governed, reproducible intelligence in 3-5 days. The value is not "cheaper DD" — it's "better DD, faster."

---

## Strategic Decision 6: SE License Basis

### Options Assessed

| Model | Description | Pros | Cons |
|-------|-----------|------|------|
| **Per-program platform fee** | Annual fee per program on the enterprise platform | Scales with usage. Fair. | At 10+ programs, becomes expensive. Creates program-counting friction. |
| **Flat enterprise license** | One fee for the enterprise. Unlimited programs. | Maximum simplicity. No program-counting. Encourages adoption. | Hard to price without knowing org size. Underprices large orgs. |
| **Tiered enterprise** | S/M/L enterprise tiers based on program count or org size | Balances simplicity with fairness. | Tier boundaries create friction ("we're M but almost L"). |
| **Platform + per-program** | Base platform fee + per-program assessment fee | Platform fee covers infrastructure (RBAC, operator workflow). Per-program covers structural analysis. | Two-part pricing is more complex. |

### Decision: Platform + Per-Program with Volume Commitment

**SE is priced as: annual platform license (covers RBAC, operator authority, enterprise infrastructure) + per-program assessment fees at a committed volume discount.**

**Why this wins:**

1. It separates two distinct values. The platform (RBAC, operator workflow, governance infrastructure) is organizational capability. The per-program assessment is analytical capability. Enterprise buyers understand this distinction — it's how they buy infrastructure + usage.
2. Volume commitment creates predictable revenue. "License for 5 programs at $X/program/year" is a multi-year commitment with clear expansion path.
3. Per-program fees at volume discount encourage adoption. Adding program #6 costs less than program #1. This aligns with the enterprise motion: start with 2-3 programs, expand to portfolio.
4. The platform fee justifies the enterprise premium. Without it, SE is "SC but more expensive." The platform fee covers real infrastructure (RBAC, multi-program, SLA, dedicated advisory) that SC doesn't require.

---

## Strategic Decision 7: Upsell Mechanics

### SA → SC Conversion

| Mechanism | How It Works |
|-----------|-------------|
| **Assessment credit** | SA engagement fee is credited toward the first year of SC subscription. Customer pays the delta, not SA + SC. |
| **Why it works** | Removes the "I already paid for an assessment" objection. The SA engagement becomes a trial of continuous intelligence. The SC conversation is: "You've seen one snapshot. Want to see the evolution? Your SA fee applies to the annual subscription." |
| **Risk** | If SA credit is too generous, SC annual fee feels like "just the difference" rather than substantial value. Credit should be partial (e.g., 50-75% of SA fee), not full. |

### SA-DD → SE Conversion

| Mechanism | How It Works |
|-----------|-------------|
| **Portfolio expansion** | After DD on one target, the PE firm wants structural intelligence across portfolio companies. SE platform license covers multiple programs. |
| **Why it works** | The DD buyer has already seen the Structural Verdict's value. Expanding to portfolio is a natural conversation: "Want this visibility across all your portfolio companies?" |
| **Pricing bridge** | SA-DD engagement fee does NOT credit toward SE (different buyer context, different budget). SE is a new conversation with portfolio management. |

### SC → SE Conversion

| Mechanism | How It Works |
|-----------|-------------|
| **Multi-stakeholder trigger** | When the SC customer needs RBAC (multiple stakeholders accessing LENS with different roles), they've outgrown SC. |
| **Operator authority trigger** | When the SC customer needs governed qualification workflows with audit trails, they need SE operator authority. |
| **Multi-program trigger** | When the SC customer wants structural intelligence on a second program and needs cross-program visibility. |
| **Pricing bridge** | SC annual fee credits toward SE platform license (first year). Additional programs priced at SE volume rates. |

### Upsell Path Summary

```
SA ──────────────────→ SC
(assessment credit)    (annual subscription)
                         │
SA-DD ─────────────────│─→ SE
(no credit — different │   (platform + per-program)
 buyer, different       │
 budget)                └──→ SE
                       (SC credits toward SE)
```

---

## Strategic Decision 8: What Is NOT Priced Separately

These are included, never unbundled:

| Capability | Why It's Included |
|-----------|------------------|
| **Software Intelligence** | SW-INTEL is the default intelligence activation included in every assessment. SA-1 without SW-INTEL was eliminated. Every engagement includes full Software Intelligence activation. Pricing SW-INTEL separately would re-create the SA-1 problem. |
| **Advisory session** | The advisory walkthrough is part of the engagement (Strategic Decision 2). Never charged separately for SA/SA-DD. |
| **Structural Verdict** | The 9-chapter Verdict is a core SA deliverable. Not an add-on report. |
| **Evidence Record** | The governed evidence snapshot is included in every engagement. Not a premium artifact. |
| **Cognitive mode access** | Within a tier's included modes, access is not per-mode priced. SA gets BOARDROOM + BALANCED. SC/SA-DD get all 4. No per-mode fees. |

**Why this matters:** Every item above has been proposed as a potential upsell at some point. Unbundling any of them weakens the core offer and creates feature-comparison pricing that collapses advisory positioning into SaaS positioning. The upsell is tier progression (SA → SC → SE), not feature unbundling within a tier.

---

## Pricing Architecture Summary

```
SA (Standard)           Fixed published fee
SA (Complex)            Fixed published fee (premium)
SA (Enterprise-scale)   Custom quote

SA-DD                   Fixed published fee (anchored to DD alternative)

SC                      Annual per-program subscription
                        Unlimited assessment runs
                        Multi-program discount

SE                      Annual platform license
                        + per-program assessment fees
                        + volume commitment discount
```

### Competitive Anchoring

| SKU | Buyer Compares Against | Signäl Position |
|-----|----------------------|-----------------|
| **SA** | Architecture consultant ($30-80K, 4-6 weeks). Manual architecture review. Internal team doing ad-hoc analysis. | Faster (days not weeks). Governed (deterministic, not opinion). Reproducible (same evidence, same findings). Priced below consultant engagement, above SaaS tool. |
| **SA-DD** | DD consulting firm ($50-150K, 4-6 weeks). In-house manual code review. | 10x faster. Governed and reproducible. Evidence-traced for investment committee. Priced as fraction of DD consulting alternative. |
| **SC** | Ongoing architecture advisory retainer ($10-25K/month). Repeated consultant engagements. | Self-service between advisories. Continuous structural visibility. Unlimited runs. Priced below advisory retainer. |
| **SE** | Enterprise tooling license ($50-200K/year). Architecture governance consulting. | Combines tool + advisory + governance. RBAC and operator authority. Multi-program. Priced as platform, not tool. |

---

## Anti-Patterns

| Anti-Pattern | Why It Fails | What To Do Instead |
|-------------|-------------|-------------------|
| Per-seat pricing | Positions as SaaS tool. Punishes sharing findings with leadership. CTO won't buy if adding their VP to LENS costs more. | Per-program. Unlimited viewers within engagement scope. |
| Feature-gated pricing within a tier | "Pay $X more for SW-INTEL" makes it feel like an add-on, not the product. Creates comparison shopping within your own product. | Tier progression. All features within a tier are included. Upsell is the next tier, not feature unlocking. |
| Usage-based pricing (per API call, per query) | Creates "save my queries" anxiety. Discourages the deep investigation that creates value and drives renewal. | Unlimited within tier. Queries, runs, and exploration are included. |
| Discounting SA to "get in the door" | Signals that the product isn't worth the asking price. Anchors the buyer's expectation for SC/SE pricing. | Assessment credit toward SC conversion. The SA price holds. The SC conversion rewards commitment. |
| Publishing SE pricing | Enterprise pricing is relationship-based. Publishing it either undercuts or overprices. | "Contact us." Platform license pricing requires a scoping conversation. |
| Pricing advisory separately | Splits the value delivery moment. Customer receives findings without context. Creates "report without explanation" risk. | Advisory is bundled. Always. |
| Per-finding pricing | "We found 15 findings, that's $X per finding." Absurd. Also creates an incentive to generate more findings. | Per-program engagement fee. Number of findings is a quality indicator, not a pricing multiplier. |

---

## Price Point Guidelines

Not specific numbers. Positioning guidelines for when price points are set.

| SKU | Floor Anchor | Ceiling Anchor | Positioning |
|-----|-------------|---------------|-------------|
| **SA Standard** | Above highest SaaS tool annual subscription in the buyer's stack | Below cheapest architecture consultant engagement | "More than a tool. Less than a consultant. Faster and more governed than both." |
| **SA Complex** | 1.5-2.5x SA Standard | Still below consultant engagement for equivalent program | Same positioning. Premium justified by structural complexity, not feature difference. |
| **SA-DD** | Above SA Complex | Below manual DD consulting (typically $50-150K) | "A fraction of your DD budget. 10x faster. Reproducible." |
| **SC** | Above 2x SA Standard annual (customer must perceive value over repeat SA) | Below advisory retainer ($10-25K/month) | "Continuous structural intelligence at a fraction of advisory retainer cost." |
| **SE Platform** | Above SC annual (platform infrastructure justifies premium) | Competitive with enterprise tooling licenses | "Platform + intelligence + advisory. Not just another enterprise tool." |

---

## Open Questions for Market Testing

These cannot be resolved by strategy alone. They require buyer feedback:

| # | Question | How to Test |
|---|----------|------------|
| Q1 | Does the SA assessment credit toward SC actually accelerate conversion, or does the buyer treat SA as complete and not engage on SC? | Track SA→SC conversion rate with and without credit offer. |
| Q2 | Is "Standard / Complex / Enterprise-scale" the right tier boundary, or do buyers want a single published price? | Test both in sales conversations. If scope anxiety kills deals, simplify to one price. |
| Q3 | Do PE buyers anchor SA-DD against their DD consulting budget, or against SA pricing? | Listen to how PE buyers frame the price conversation in first 3 engagements. |
| Q4 | Is unlimited assessment runs in SC perceived as valuable, or do customers actually run 1-2x per year regardless? | Track run frequency in first 3 SC customers. If usage is low, consider whether unlimited is the right message. |
| Q5 | Does the platform + per-program model for SE create scope friction, or does the volume discount encourage expansion? | First 2 SE conversations will reveal whether the two-part model is intuitive to enterprise buyers. |

---

## Implementation Dependency

This pricing strategy requires ONE artifact to operationalize:

**SIGNAL_PRICE_CARD_2026.md** — The actual price points for each SKU tier.

This artifact is a commercial decision (not a product-management artifact) and should be produced when the first SA engagement is being scoped. Price points are calibrated against the specific buyer and market — they cannot be set in isolation.

The pricing STRUCTURE defined here is stable. The price POINTS are operational and will evolve with market feedback.
