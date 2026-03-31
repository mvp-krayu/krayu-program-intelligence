# Risk Acceleration Gradient

## Definition
Dynamic risk measurement model. Captures how execution risk evolves over time — measuring rate of change, acceleration, and cross-boundary propagation of risk within a program environment.

## Classification
- Phase 1 Category: A — Routed Derivative Entity (cross-classified as ESI dimension)
- Surface Type: standalone_route
- Maturity Level: COMPLETE
- Authority Codes: CKR-015 | RSR-07 | RSP-07 | SCI-00

## Role in Program Intelligence
Dynamics-measurement construct. Answers: "How fast is the program moving — and in which direction?" Produced by pios. Embedded as the fifth named dimension of execution_stability_index. Also consumed independently by portfolio_intelligence.

## Canonical Position
- Route: /risk-acceleration-gradient/
- Backing File: pages/risk-acceleration-gradient.md
- Canonical URL: https://krayu.be/risk-acceleration-gradient
- Publish Status: live

## Relationships
Inbound:
- pios →[P] risk_acceleration_gradient
- program_intelligence →[R] risk_acceleration_gradient
- execution_stability_index →[D] risk_acceleration_gradient
- execution_blindness →[R] risk_acceleration_gradient
- early_warning_signals →[R] risk_acceleration_gradient
- execution_blindness_examples →[R] risk_acceleration_gradient
- why_dashboards_fail_programs →[R] risk_acceleration_gradient

Outbound:
- risk_acceleration_gradient →[D] execution_stability_index
- risk_acceleration_gradient →[C] portfolio_intelligence
- risk_acceleration_gradient →[R] execution_stability_index

## Boundaries
- Not a top-level authority node
- Cross-classified as standalone L1 entity AND as dimension_of execution_stability_index — primary graph placement is L1 under program_intelligence
- The three internal dynamics (rate_of_change, acceleration_of_risk, propagation_across_boundaries) are sub-components — not separate derivative entities in Phase 1 inventory

## Authority Level
- Level: Derivative
- Graph Depth: 1 under program_intelligence (primary); cross-classified as depth 2 under execution_stability_index
- Not promotable to top-level

## Public Surface Readiness
- publish_status: live
- Maturity: COMPLETE
- Surface: standalone_route at /risk-acceleration-gradient/

## Graph Links
- Primary Parent: [[program_intelligence]] [L0] — depth 1
- Cross-Links: XL-02 [[pios]] →[P], XL-04 →[D] [[execution_stability_index]], XL-06 →[C] [[portfolio_intelligence]], XL-09 [[early_warning_signals]] →[R]

## Exclusions
- Internal dynamics components are not graph nodes
- RAG scoring ranges are internal — not enumerated as separate derivative entities
