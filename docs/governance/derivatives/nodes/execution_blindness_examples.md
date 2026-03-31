# Execution Blindness Examples

## Definition
Program scenario surface. Three documented scenarios where activity metrics appeared normal while structural stability deteriorated. Illustrates ESI and RAG detection lead-time advantage over traditional operational reporting.

## Classification
- Phase 1 Category: A — Routed Derivative Entity
- Surface Type: standalone_route
- Maturity Level: STUB
- Authority Codes: none present

## Role in Program Intelligence
Scenario surface node. Child of execution_blindness. Cross-references execution_stability_index, risk_acceleration_gradient, and early_warning_signals. Not a definitional construct — an evidence illustration surface.

## Canonical Position
- Route: /execution-blindness-examples/
- Canonical URL: https://krayu.be/execution-blindness-examples
- Backing File: pages/execution-blindness-examples.md
- Publish Status: preview-pending-publish

## Relationships
Inbound:
- execution_blindness →[R] execution_blindness_examples
- early_warning_signals →[R] execution_blindness_examples
- why_dashboards_fail_programs →[R] execution_blindness_examples

Outbound:
- execution_blindness_examples →[R] execution_blindness
- execution_blindness_examples →[R] execution_stability_index
- execution_blindness_examples →[R] risk_acceleration_gradient
- execution_blindness_examples →[R] early_warning_signals

## Boundaries
- Not a top-level authority node
- STUB maturity: gated at preview-pending-publish; no authority codes
- Does not define execution_blindness — references it
- Scenario data is illustrative — not canonical construct definitions

## Authority Level
- Level: Derivative
- Graph Depth: 2 under program_intelligence (via execution_blindness)
- Not promotable to top-level

## Public Surface Readiness
- publish_status: preview-pending-publish
- Maturity: STUB
- Surface: standalone_route at /execution-blindness-examples/
- Gap: not live; authority codes absent

## Graph Links
- Primary Parent: [[execution_blindness]] [L1] — depth 2

## Exclusions
- Does not own ESI or RAG definitions
- Three program scenarios are content illustrations — not separate graph entities
