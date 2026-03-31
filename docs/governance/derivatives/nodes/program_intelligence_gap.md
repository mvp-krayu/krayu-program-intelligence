# Program Intelligence Gap

## Definition
Structural space between what engineering systems report and what executive leadership needs to govern large technology programs. Not a data gap — an interpretive gap. Engineering systems answer operational questions; executive leadership requires program-level intelligence.

## Classification
- Phase 1 Category: A — Routed Derivative Entity
- Surface Type: anchor_surface
- Maturity Level: COMPLETE
- Authority Codes: CKR-001 | CAT-00 | GOV-00

## Role in Program Intelligence
Causal-condition node. Produces execution_blindness as its visible failure mode. Resolved by pios and signal_infrastructure. Defines the structural justification for the program_intelligence discipline.

## Canonical Position
- Route: /program-intelligence-gap/
- Canonical URL: https://krayu.be/program-intelligence#program-intelligence-gap
- Backing File: pages/program-intelligence-gap.md
- Publish Status: live

## Relationships
Inbound:
- program_intelligence →[R] program_intelligence_gap

Outbound:
- program_intelligence_gap →[PB] execution_blindness
- program_intelligence_gap →[Rv] pios
- program_intelligence_gap →[Rv] signal_infrastructure

## Boundaries
- Not a top-level authority node
- Anchor surface only — canonical URL is a fragment of /program-intelligence/
- Does not define the solution — references pios and signal_infrastructure as resolution mechanisms
- The three structural properties (operational data is not analytical intelligence, activity is not execution health, aggregation is not interpretation) are internal content — not separate derivative entities

## Authority Level
- Level: Derivative
- Graph Depth: 1 under program_intelligence
- Not promotable to top-level

## Public Surface Readiness
- publish_status: live
- Maturity: COMPLETE
- Surface: anchor_surface at /program-intelligence-gap/

## Graph Links
- Primary Parent: [[program_intelligence]] [L0] — depth 1
- Cross-Links: XL-08 →[PB] [[execution_blindness]], XL-14 →[Rv] [[pios]]

## Exclusions
- Resolution mechanism detail belongs to pios and signal_infrastructure nodes
- Does not include portfolio-level gap analysis — that is scoped to portfolio_intelligence
