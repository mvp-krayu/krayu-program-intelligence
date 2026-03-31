# Condition and Diagnosis

## Definition
Step 04 of the PiOS transformation chain. Translates signals into states and traceable explanations. All diagnosis maintains a direct link to the originating evidence chain. No diagnosis produced without a traceable evidence chain.

## Classification
- Phase 1 Category: D — PiOS Process Step Construct
- Surface Type: no_route
- Maturity Level: NONE
- Authority Codes: none present

## Role in Program Intelligence
Process step sub-construct of pios. Fourth and final step in the four-step PiOS transformation chain. Produces condition-level (system state description) and diagnostic-level (evidence-traced explanation) outputs.

## Canonical Position
- Route: none
- Backing File: none
- Canonical URL: none
- Referenced In: pages/pios.md, pages/signal-infrastructure.md
- Publish Status: not applicable

## Relationships
Inbound:
- pios →[P] condition_and_diagnosis

Outbound:
- none documented in Phase 1 or Phase 2

## Boundaries
- Not a top-level authority node
- No standalone route or backing page — defined within pios only
- One of four ordered PiOS steps — not independently authoritative
- System State Description and Evidence-Traced Explanation are output types of this step — not separate derivative entities in Phase 1 inventory

## Authority Level
- Level: Derivative
- Graph Depth: 1 under pios
- Not promotable to top-level

## Public Surface Readiness
- publish_status: not applicable — no backing page
- Maturity: NONE
- Surface: no_route
- Gap: no standalone definition, no backing page, no canonical URL, no authority codes

## Graph Links
- Primary Parent: [[pios]] [L0] — depth 1

## Exclusions
- System State Description and Evidence-Traced Explanation are internal output types — not graph nodes
- Traceability constraints are architectural properties of pios — not a separate derivative entity
