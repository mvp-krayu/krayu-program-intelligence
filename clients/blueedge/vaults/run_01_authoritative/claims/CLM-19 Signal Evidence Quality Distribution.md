---
node_class: claim
claim_id: CLM-19
claim_label: Signal Evidence Quality Distribution
claim_type: entity-summary
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation
Evidence confidence reflects the quality of the evidence chain supporting each signal. STRONG = complete four-layer chain (signal → condition → diagnosis → intelligence). MODERATE = deterministic computation confirmed but some conditions pending activation (Stream 75.1). WEAK = static component only; runtime component blocked or absent (AT-005, AT-007 pending for SIG-005).

## Authoritative Value
STRONG:2 (SIG-001, SIG-002), MODERATE:2 (SIG-003, SIG-004), WEAK:1 (SIG-005)

## Source Fields
- `signal_registry.json` → `signals[].evidence_confidence`

## Upstream Artifacts
- [[ART-05 signal_registry.json]]
- [[CLM-20 SIG-001 Sensor Bridge Throughput]]
- [[CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions]]
- [[CLM-22 SIG-003 Dependency Load 68 Percent]]
- [[CLM-23 SIG-004 Structural Volatility Edge Density]]
- [[CLM-24 SIG-005 Coordination Pressure Partial]]

## Transformation Chain
- signal_registry.json → signals[].evidence_confidence → confidence tier grouping → distribution count

## Entity Links
- Stage of origin: S3

## Exposure
- ZONE: ZONE-2
- LENS admissible: YES
- Reason: Evidence quality distribution is commercially meaningful, with explanation of confidence tiers

## Traceability
- Status: FULL
- Caveats: None

## Surfaces
- SignalAvailability confidence chips: STRONG:2, MODERATE:2, WEAK:1
