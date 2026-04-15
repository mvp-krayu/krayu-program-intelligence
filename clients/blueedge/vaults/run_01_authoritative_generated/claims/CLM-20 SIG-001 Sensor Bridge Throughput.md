---
node_class: claim
claim_id: CLM-20
claim_label: SIG-001 Sensor Bridge Throughput
claim_type: signal
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

Signal SIG-001: Sensor Bridge Throughput Ceiling: Configuration Confirmed, Runtime Unknown. Confidence: STRONG. This signal was derived from the four-layer evidence chain (condition → diagnosis → intelligence → signal) and is grounded in the Edge Data Acquisition domain, capability: Network Security Intelligence Collection.

## Authoritative Value

STRONG confidence

## Business Impact

The sensor bridge is the sole forwarding pathway for HASI network security intelligence; its 0.333 rec/sec ceiling is the hard upper bound on threat data delivery to the cloud, directly constraining the security intelligence pipeline capacity for all connected SVG devices.

## Risk

If runtime sensor bridge performance deviates from configured parameters — due to execution failures, connection errors, or configuration drift — the security intelligence pipeline will silently underperform with no currently observable indicator in the platform's operational state.

## Source Fields

- `signal_registry.json` → `signals[SIG-001]`
- Source refs: `INTEL-001`, `DIAG-006`, `COND-006`, `SIG-006`

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

Sensor Bridge Throughput Ceiling: Configuration Confirmed, Runtime Unknown is the only confirmed data pathway for network security intelligence in this platform. The throughput ceiling is a static configuration constant — actual runtime performance is unknown. For a buyer, this signal defines both a known constraint (the declared ceiling) and an unknown risk (whether runtime performance matches configuration). It is the most concrete single-pathway measurement in this assessment.
