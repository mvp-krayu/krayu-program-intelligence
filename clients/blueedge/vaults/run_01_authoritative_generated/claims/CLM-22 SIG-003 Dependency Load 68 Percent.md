---
node_class: claim
claim_id: CLM-22
claim_label: SIG-003 Dependency Load 68 Percent
claim_type: signal
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

Signal SIG-003: Dependency Load: 68% of Architectural Relationships Are Dependency Edges. Confidence: MODERATE. This signal was derived from the four-layer evidence chain (condition → diagnosis → intelligence → signal) and is grounded in the Event-Driven Architecture domain, capability: Domain Event Bus.

## Authoritative Value

MODERATE confidence

## Business Impact

A dependency load of 0.682 means most architectural connections are direct dependencies, elevating the blast radius of any component-level failure or change; deployment safety, change management, and incident containment all require accounting for this coupling density.

## Risk

If any of the 15 dependency edges involves a WEAKLY GROUNDED component (such as Apache Kafka or Apache Flink) or an undocumented runtime dependency, the actual coupling may be higher than observed; unmanaged dependency concentration will increase non-linearly as new modules are added to the 63-module backend.

## Source Fields

- `signal_registry.json` → `signals[SIG-003]`
- Source refs: `COND-001`, `SIG-002`

## Upstream Artifacts

- [[ART-05 signal_registry.json]]

## Transformation Chain

- S3 signal emission — four-layer chain: COND → DIAG → INTEL → SIG

## Exposure

- ZONE: ZONE-2 (business_impact + risk + evidence_confidence label)
- LENS admissible: YES
- Reason: statement and confidence_rationale are ZONE-1/3 only; business_impact and risk are ZONE-2

## Traceability

- Status: FULL
- Caveats: None

## Surfaces

- SignalAvailability panel (title + business_impact + evidence_confidence)

## Why It Matters

A dependency load of 0.682 means most architectural connections are direct dependencies, elevating the blast radius of any component-level failure or change; deployment safety, change management, and incident containment all require accounting for this coupling density. A dependency load above 0.6 means most architectural connections are direct dependencies, not loose event-driven couplings. This is a structural fact about the platform's coupling topology — it informs change management, deployment risk, and incident blast radius calculations.
