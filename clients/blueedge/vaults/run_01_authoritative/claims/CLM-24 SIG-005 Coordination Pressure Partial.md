---
node_class: claim
claim_id: CLM-24
claim_label: SIG-005 Coordination Pressure Partial
claim_type: entity-summary
exposure: ZONE-2
lens_admissible: CONDITIONAL
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation
The coordination pressure signal has a resolved static component of 0.875 — 7 of 8 observable interfaces are shared. The runtime component remains pending (AT-005, AT-007 blocked). Confidence cannot be elevated above WEAK because the signal's defining runtime dimension is absent. The static ratio alone is insufficient for full condition activation.

## Authoritative Value
Coordination Pressure: Static Interface Sharing at 87.5%; Runtime State Unresolved
- signal_id: SIG-005
- evidence_confidence: WEAK
- static_component: 0.875 (7 of 8 observable interfaces are shared)
- runtime_component: BLOCKED — AT-005 (active pipeline runs) and AT-007 (validation gate counts) pending
- domain: Operational Engineering (DOMAIN-16)
- capability: Delivery and Quality Infrastructure (CAP-40)

## Source Fields
- [[COND-003]]
- [[SIG-001]]

## Upstream Artifacts
- [[COND-003]]
- [[SIG-001]]
- [[CI/CD Workflows]] (COMP-88)
- [[Docker Compose Orchestration]] (COMP-89)

## Transformation Chain
- static interface scan → shared interfaces / total observable interfaces = 0.875 (7/8)
- runtime component → BLOCKED (AT-005, AT-007 not yet available)

## Entity Links
- Signal: SIG-005
- Domain: DOMAIN-16 (Operational Engineering)
- Capability: CAP-40 (Delivery and Quality Infrastructure)
- Components: COMP-88 (CI/CD Workflows), COMP-89 (Docker Compose Orchestration)

## Exposure
- ZONE: ZONE-2
- LENS admissible: CONDITIONAL
- Reason: WEAK confidence must be surfaced; cannot claim "coordination pressure confirmed". Required LENS phrase: "One signal has partial evidence — the static coordination structure suggests elevated sharing, but runtime validation is not yet complete."

## Traceability
- Status: PARTIAL
- Caveats: Static component confirmed (0.875); runtime component blocked pending AT-005 (active pipeline runs) and AT-007 (validation gate counts)

## Surfaces
- SignalAvailability panel: SIG-005, confidence chip WEAK
- Business impact: A static interface sharing ratio of 0.875 means virtually all observable interfaces are coordinated across multiple components, elevating the coordination cost of any platform change.
- Risk: Without the runtime component (AT-005 and AT-007), it is unknown whether validation gates are operating at a frequency sufficient to manage the high static coordination pressure.
