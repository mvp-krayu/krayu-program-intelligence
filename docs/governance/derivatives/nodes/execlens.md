# ExecLens

## Definition
Board-facing signal layer within signal_platform. Provides a governed, structured interface to program intelligence outputs organized by consumption context: executive view, CTO view, and analyst view.

## Classification
- Phase 1 Category: B — Named Construct Without Own Route
- Surface Type: no_route
- Maturity Level: NONE
- Authority Codes: none present

## Role in Program Intelligence
Signal surface layer node. Surfaces outputs produced by pios via signal_infrastructure. Does not produce intelligence — surfaces what the pios pipeline has already produced.

## Canonical Position
- Route: none
- Backing File: none
- Canonical URL: none
- Referenced In: pages/signal-infrastructure.md, pages/pios.md, pages/signal-platform.md, pages/execution-stability-index.md
- Publish Status: not applicable

## Relationships
Inbound:
- signal_platform →[S] execlens
- signal_infrastructure →[S] execlens

Outbound:
- execlens →[S] signal_infrastructure

## Boundaries
- Not a top-level authority node
- No standalone route or backing page — definition distributed across parent pages
- Does not produce outputs — surfaces signal_infrastructure outputs only
- The three consumption views (executive view, CTO view, analyst view) are internal content — not separate derivative entities in Phase 1 inventory

## Authority Level
- Level: Derivative
- Graph Depth: 1 under signal_platform
- Not promotable to top-level

## Public Surface Readiness
- publish_status: not applicable — no backing page
- Maturity: NONE
- Surface: no_route
- Gap: no standalone definition, no backing page, no canonical URL, no authority codes

## Graph Links
- Primary Parent: [[signal_platform]] [L0] — depth 1
- Cross-Links: XL-11 →[S] [[signal_infrastructure]]

## Exclusions
- Is not signal_platform (L0 authority node)
- Is not signal_infrastructure (separate derivative entity)
- The three views are not graph nodes
