# Cost Stability

## Definition
Named execution dimension of execution_stability_index. Measures cost performance index enhanced with burn momentum analysis. Detects budget compression signals even when CPI remains within acceptable bounds.

## Classification
- Phase 1 Category: C — ESI Dimension Sub-Construct
- Surface Type: no_route
- Maturity Level: NONE
- Authority Codes: none present

## Role in Program Intelligence
Dimension sub-construct of execution_stability_index. One of five named dimensions contributing to the ESI composite score.

## Canonical Position
- Route: none
- Backing File: none
- Canonical URL: none
- Referenced In: pages/execution-stability-index.md, pages/execution-blindness.md, pages/early-warning-signals-program-failure.md, pages/execution-blindness-examples.md, pages/portfolio-intelligence.md
- Publish Status: not applicable

## Relationships
Inbound:
- execution_stability_index →[D] cost_stability

Outbound:
- none documented in Phase 1 or Phase 2

## Boundaries
- Not a top-level authority node
- No standalone route or backing page — defined within execution_stability_index only
- One of five ESI dimensions — not independently authoritative
- CPI and burn momentum detail are internal to execution_stability_index

## Authority Level
- Level: Derivative
- Graph Depth: 2 under program_intelligence (via execution_stability_index)
- Not promotable to top-level

## Public Surface Readiness
- publish_status: not applicable — no backing page
- Maturity: NONE
- Surface: no_route
- Gap: no standalone definition, no backing page, no canonical URL, no authority codes

## Graph Links
- Primary Parent: [[execution_stability_index]] [L1] — depth 2

## Exclusions
- Is not execution_stability_index
- Variance accumulation, untracked scope, budget compression signals are internal sub-signals — not separate derivative entities
