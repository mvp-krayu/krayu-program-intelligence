# Signal Infrastructure

## Definition
Governed system through which Program Intelligence converts execution evidence from engineering systems into structured analytical outputs. Every output linked to verifiable source artifacts. Operationalized through pios. Surfaced through signal_platform.

## Classification
- Phase 1 Category: A — Routed Derivative Entity
- Surface Type: anchor_surface
- Maturity Level: COMPLETE
- Authority Codes: CKR-001 | CKR-005 | CAT-00 | GOV-00

## Role in Program Intelligence
Operational capability node. Resolves execution_blindness. Operationalized by pios. Surfaces outputs through signal_platform. Contains execlens as its board-facing layer.

## Canonical Position
- Route: /signal-infrastructure/
- Canonical URL: https://krayu.be/program-intelligence#signal-infrastructure
- Backing File: pages/signal-infrastructure.md
- Publish Status: live

## Relationships
Inbound:
- signal_platform →[S] signal_infrastructure
- pios →[Op] signal_infrastructure
- program_intelligence →[R] signal_infrastructure
- program_intelligence_gap →[Rv] signal_infrastructure
- execution_blindness →[Rv] signal_infrastructure

Outbound:
- signal_infrastructure →[Rv] execution_blindness
- signal_infrastructure →[R] execution_stability_index
- signal_infrastructure →[R] risk_acceleration_gradient

## Boundaries
- Not a top-level authority node
- Anchor surface only — canonical URL is a fragment of /program-intelligence/
- Distinct from signal_platform: signal_infrastructure is the governed pipeline; signal_platform is the authority node (product surface)
- The five-layer pipeline (evidence_intake → normalization → signal_derivation → analytical_output → intelligence_delivery) references pios steps — normalization is internal, not a separate derivative entity in Phase 1

## Authority Level
- Level: Derivative
- Graph Depth: 1 under signal_platform
- Not promotable to top-level

## Public Surface Readiness
- publish_status: live
- Maturity: COMPLETE
- Surface: anchor_surface at /signal-infrastructure/

## Graph Links
- Primary Parent: [[signal_platform]] [L0] — depth 1
- Cross-Links: XL-03 [[pios]] →[Op], XL-07 →[Rv] [[execution_blindness]], XL-11 [[execlens]] →[S]

## Exclusions
- Does not own pios steps — those are nodes under pios
- Normalization layer is internal pipeline stage — not a separate derivative entity
- signal_platform (L0 authority node) is not redefined here
