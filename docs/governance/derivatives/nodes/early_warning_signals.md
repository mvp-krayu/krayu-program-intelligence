# Early Warning Signals

## Definition
Signal reference surface identifying structural signals that precede operational failure. Covers ESI decline patterns, RAG acceleration signals, and dimension-level signals across the five ESI dimensions.

## Classification
- Phase 1 Category: A — Routed Derivative Entity
- Surface Type: standalone_route
- Maturity Level: STUB
- Authority Codes: none present

## Role in Program Intelligence
Reference surface node. Dependent on execution_stability_index as primary parent. Cross-references risk_acceleration_gradient and execution_blindness. Not a definitional construct — a signal reference index.

## Canonical Position
- Route: /early-warning-signals-program-failure/
- Canonical URL: https://krayu.be/early-warning-signals-program-failure
- Backing File: pages/early-warning-signals-program-failure.md
- Publish Status: preview-pending-publish

## Relationships
Inbound:
- execution_stability_index →[R] early_warning_signals
- execution_blindness_examples →[R] early_warning_signals
- why_dashboards_fail_programs →[R] early_warning_signals

Outbound:
- early_warning_signals →[R] execution_stability_index
- early_warning_signals →[R] risk_acceleration_gradient
- early_warning_signals →[R] execution_blindness
- early_warning_signals →[R] execution_blindness_examples

## Boundaries
- Not a top-level authority node
- STUB maturity: gated at preview-pending-publish; no authority codes
- Does not define ESI or RAG — references both
- Dimension-level signals listed here are contextual references — definitional ownership belongs to execution_stability_index and its dimension sub-nodes

## Authority Level
- Level: Derivative
- Graph Depth: 2 under program_intelligence (via execution_stability_index)
- Not promotable to top-level

## Public Surface Readiness
- publish_status: preview-pending-publish
- Maturity: STUB
- Surface: standalone_route at /early-warning-signals-program-failure/
- Gap: not live; authority codes absent

## Graph Links
- Primary Parent: [[execution_stability_index]] [L1] — depth 2
- Cross-Links: XL-09 →[R] [[risk_acceleration_gradient]], XL-10 →[R] [[execution_blindness]]

## Exclusions
- Does not define the five ESI dimensions — those are owned by execution_stability_index sub-nodes
- Real-world scenario data belongs to execution_blindness_examples
