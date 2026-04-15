---
node_class: claim
claim_id: CLM-20
claim_label: SIG-001 Sensor Bridge Throughput
claim_type: entity-summary
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation
The HASI sensor bridge (hasi_bridge.py) is configured at a declared throughput ceiling of 0.333 records/second (10 records per 30-second polling cycle). This is a static configuration constant, not a runtime measurement. Actual ingestion throughput under live conditions is unknown. The evidence chain is complete from static analysis alone.

## Authoritative Value
Sensor Bridge Throughput Ceiling: Configuration Confirmed, Runtime Unknown
- signal_id: SIG-001
- evidence_confidence: STRONG
- domain: Edge Data Acquisition (DOMAIN-01)
- capability: Network Security Intelligence Collection (CAP-02)

## Source Fields
- `INTEL-001`
- `DIAG-006`
- `COND-006`
- `SIG-006`

## Upstream Artifacts
- `INTEL-001`
- `DIAG-006`
- `COND-006`
- `SIG-006`
- hasi_bridge.py (COMP-74)
- HASI v1.0.0 (COMP-75)

## Transformation Chain
- SIG-006 → COND-006 → DIAG-006 → INTEL-001 (four-layer chain, STRONG)

## Entity Links
- Signal: SIG-001
- Domain: DOMAIN-01 (Edge Data Acquisition)
- Capability: CAP-02 (Network Security Intelligence Collection)
- Components: COMP-74 (hasi_bridge.py), COMP-75 (HASI v1.0.0)

## Exposure
- ZONE: ZONE-2
- LENS admissible: YES
- Reason: Business impact and risk only; signal statement and confidence_rationale are ZONE-1/3 only

## Traceability
- Status: FULL
- Caveats: Four-layer chain (SIG-006 → COND-006 → DIAG-006 → INTEL-001). Runtime throughput is not measured; ceiling is static configuration only.


## Why It Matters

The sensor bridge is the only pathway through which HASI network security intelligence reaches the cloud. Its throughput ceiling of 0.333 records/second is a structural hard limit — not a performance degradation risk but a fixed capacity constraint confirmed in the static configuration. A buyer needs to know that the security intelligence pipeline has a measurable and bounded capacity, and that runtime performance is not yet observable. This signal establishes what is known (the ceiling) and what is not (whether actual throughput meets it under live conditions).

## Surfaces
- SignalAvailability panel: SIG-001, confidence chip STRONG
- Business impact: The sensor bridge is the sole forwarding pathway for HASI network security intelligence; its 0.333 rec/sec ceiling is the hard upper bound on threat data delivery to the cloud, directly constraining the security intelligence pipeline capacity for all connected SVG devices.
- Risk: If runtime sensor bridge performance deviates from configured parameters — due to execution failures, connection errors, or configuration drift — the security intelligence pipeline will silently underperform with no currently observable indicator in the platform's operational state.
