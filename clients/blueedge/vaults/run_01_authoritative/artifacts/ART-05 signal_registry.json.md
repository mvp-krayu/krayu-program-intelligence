---
node_class: artifact
artifact_id: ART-05
artifact_name: signal_registry.json
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Purpose
Governed signal registry produced by S3. Contains 5 intelligence signals derived from the evidence_confidence model. The authoritative source for all signal claims.

## Producing Step
`pios emit signals` (S3) → signal_registry.json

## Consuming Steps
`/api/signals` → SignalAvailability panel, SignalSet panel

## Structure Summary
registry_id: PIOS-41.4-RUN01-SIGNAL-REGISTRY, total_signals: 5, run_reference: run_01_blueedge.
Each signal: signal_id, title, statement, domain_id/name, capability_id/name, component_ids/names, source_refs, trace_links, evidence_confidence, confidence_rationale, business_impact, risk.
Confidence distribution: STRONG:2 (SIG-001/002), MODERATE:2 (SIG-003/004), WEAK:1 (SIG-005).

## V2 Gap
signal.business_impact and signal.risk fields are ZONE-2 safe but NOT currently displayed in the GAUGE UI. These are available in /api/signals response but unrendered.

## Claims Grounded
[[CLM-18 Governed Signal Count]] [[CLM-19 Signal Evidence Quality Distribution]] [[CLM-20 SIG-001 Sensor Bridge Throughput]] [[CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions]] [[CLM-22 SIG-003 Dependency Load 68 Percent]] [[CLM-23 SIG-004 Structural Volatility Edge Density]] [[CLM-24 SIG-005 Coordination Pressure Partial]]

## Authoritative Path
`docs/pios/41.4/signal_registry.json`
