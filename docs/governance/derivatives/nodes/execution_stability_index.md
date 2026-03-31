# Execution Stability Index

## Definition
Composite structural stability indicator. Converts multi-dimensional execution signals into a single 0–100 score measuring whether a program is stable, degrading, or approaching systemic risk. Computed from five named execution dimensions.

## Classification
- Phase 1 Category: A — Routed Derivative Entity
- Surface Type: standalone_route
- Maturity Level: COMPLETE
- Authority Codes: CKR-014 | RSR-06 | RSP-06 | SCI-00

## Role in Program Intelligence
State-measurement construct. Answers: "Where is the program right now?" Produced by pios. Contains five named dimension sub-constructs. Consumed by portfolio_intelligence for cross-program comparison.

## Canonical Position
- Route: /execution-stability-index/
- Backing File: pages/execution-stability-index.md
- Canonical URL: https://krayu.be/execution-stability-index
- Publish Status: live

## Relationships
Inbound:
- pios →[P] execution_stability_index
- program_intelligence →[R] execution_stability_index
- risk_acceleration_gradient →[D] execution_stability_index
- execution_blindness →[R] execution_stability_index
- early_warning_signals →[R] execution_stability_index
- execution_blindness_examples →[R] execution_stability_index
- why_dashboards_fail_programs →[R] execution_stability_index

Outbound:
- execution_stability_index →[D] schedule_stability
- execution_stability_index →[D] cost_stability
- execution_stability_index →[D] delivery_predictability
- execution_stability_index →[D] flow_compression
- execution_stability_index →[D] risk_acceleration_gradient
- execution_stability_index →[C] portfolio_intelligence
- execution_stability_index →[R] risk_acceleration_gradient

## Boundaries
- Not a top-level authority node
- Does not produce diagnosis — produces composite stability score only
- ESI score bands are internal scoring ranges — not separate derivative entities
- risk_acceleration_gradient is cross-classified as both a dimension of this entity and a standalone L1 derivative — not a duplication

## Authority Level
- Level: Derivative
- Graph Depth: 1 under program_intelligence
- Not promotable to top-level

## Public Surface Readiness
- publish_status: live
- Maturity: COMPLETE
- Surface: standalone_route at /execution-stability-index/

## Graph Links
- Primary Parent: [[program_intelligence]] [L0] — depth 1
- Children: [[schedule_stability]], [[cost_stability]], [[delivery_predictability]], [[flow_compression]], [[early_warning_signals]]
- Cross-Links: XL-01 [[pios]] →[P], XL-04 [[risk_acceleration_gradient]] →[D], XL-05 →[C] [[portfolio_intelligence]]

## Exclusions
- ExecLens and signal surface definitions are not part of this entity
- ESI score band labels (Structurally Stable, Emerging Instability, Compounding Stress, Critical Exposure) are internal classification — not separate nodes
