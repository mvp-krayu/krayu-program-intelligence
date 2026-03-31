# Execution Blindness

## Definition
Condition in which a technology program appears operationally normal while structural instability signals are already emerging across program dimensions. Engineering systems are reporting accurately within their design scope — the blindness is structural, not a malfunction.

## Classification
- Phase 1 Category: A — Routed Derivative Entity
- Surface Type: anchor_surface
- Maturity Level: COMPLETE
- Authority Codes: CKR-001 | CKR-014 | CKR-015 | CAT-00

## Role in Program Intelligence
Failure-condition node. Represents the visible outcome of the program_intelligence_gap. Resolved by signal_infrastructure. Parent entity for execution_blindness_examples and why_dashboards_fail_programs surface pages.

## Canonical Position
- Route: /execution-blindness/
- Canonical URL: https://krayu.be/program-intelligence#execution-blindness
- Backing File: pages/execution-blindness.md
- Publish Status: live

## Relationships
Inbound:
- program_intelligence →[R] execution_blindness
- program_intelligence_gap →[PB] execution_blindness
- signal_infrastructure →[Rv] execution_blindness

Outbound:
- execution_blindness →[R] execution_stability_index
- execution_blindness →[R] risk_acceleration_gradient
- execution_blindness →[R] execution_blindness_examples
- execution_blindness_examples →[R] execution_blindness
- why_dashboards_fail_programs →[R] execution_blindness
- early_warning_signals →[R] execution_blindness

## Boundaries
- Not a top-level authority node
- Anchor surface only — canonical URL is a fragment of /program-intelligence/, not a standalone route
- The five instability dimensions (schedule_stability, cost_stability, delivery_predictability, flow_compression, risk_acceleration_gradient) are referenced here but owned by execution_stability_index

## Authority Level
- Level: Derivative
- Graph Depth: 1 under program_intelligence
- Not promotable to top-level

## Public Surface Readiness
- publish_status: live
- Maturity: COMPLETE
- Surface: anchor_surface at /execution-blindness/

## Graph Links
- Primary Parent: [[program_intelligence]] [L0] — depth 1
- Children: [[execution_blindness_examples]], [[why_dashboards_fail_programs]]
- Cross-Links: XL-07 [[signal_infrastructure]] →[Rv], XL-08 →[PB] from [[program_intelligence_gap]], XL-10 [[early_warning_signals]] →[R]

## Exclusions
- Does not own the five ESI dimensions — they belong to execution_stability_index
- The mechanism of blindness explanation is contextual content — not a separate entity
