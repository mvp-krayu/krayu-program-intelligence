---
node_class: claim
claim_id: CLM-22
claim_label: SIG-003 Dependency Load 68 Percent
claim_type: entity-summary
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation
The program-level dependency load is computed at 0.682 — 15 of 22 architectural relationship edges are dependency relationships. This indicates a structurally dense dependency graph where most inter-component connections are direct load-bearing dependencies rather than loose event-driven couplings. R-038 confirms all backend modules DEPENDS_ON FleetEventsModule, making it the dependency hub.

## Authoritative Value
Dependency Load: 68% of Architectural Relationships Are Dependency Edges
- signal_id: SIG-003
- evidence_confidence: MODERATE
- ratio: 0.682 (15 dependency edges of 22 total architectural edges)
- domain: Event-Driven Architecture (DOMAIN-11)
- capability: Domain Event Bus (CAP-30)

## Source Fields
- [[COND-001]]
- [[SIG-002]]

## Upstream Artifacts
- [[COND-001]]
- [[SIG-002]]
- [[FleetEventsModule]] (COMP-65)

## Transformation Chain
- structural edge count → dependency edge count / total edge count = 0.682 (15/22)
- ratio value confirmed reproducible in 40.5 validation

## Entity Links
- Signal: SIG-003
- Domain: DOMAIN-11 (Event-Driven Architecture)
- Capability: CAP-30 (Domain Event Bus)
- Components: COMP-65 (FleetEventsModule)

## Exposure
- ZONE: ZONE-2
- LENS admissible: YES
- Reason: Business impact and ratio in context ("15 of 22 architectural connections are load-bearing")

## Traceability
- Status: FULL
- Caveats: MODERATE confidence — deterministic computation confirmed but some conditions pending activation (Stream 75.1)

## Surfaces
- SignalAvailability panel: SIG-003, confidence chip MODERATE
- Business impact: A dependency load of 0.682 means most architectural connections are direct dependencies, elevating the blast radius of any component-level failure or change; deployment safety, change management, and incident containment all require accounting for this coupling density.
- Risk: If any of the 15 dependency edges involves a WEAKLY GROUNDED component or an undocumented runtime dependency, the actual coupling may be higher than observed; unmanaged dependency concentration will increase non-linearly as new modules are added.
