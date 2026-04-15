---
node_class: entity
entity_id: ENT-signals
entity_family: Signals
count: 5
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Definition
5 governed intelligence signals derived from the evidence_confidence model traversing condition → diagnosis → intelligence chains from the structural artifacts. Source: `docs/pios/41.4/signal_registry.json`.

## Signal Inventory
| signal_id | title (short) | confidence | domain |
|-----------|--------------|-----------|--------|
| SIG-001 | Sensor Bridge Throughput Ceiling | STRONG | Edge Data Acquisition |
| SIG-002 | Seven Core Dimensions Unknown | STRONG | Platform Infrastructure and Data |
| SIG-003 | Dependency Load 68% | MODERATE | Event-Driven Architecture |
| SIG-004 | Structural Volatility Edge Density >1 | MODERATE | Platform Infrastructure and Data |
| SIG-005 | Coordination Pressure 87.5% Static | WEAK | Operational Engineering |

## Role in Claims
- [[CLM-18 Governed Signal Count]] — total=5
- [[CLM-19 Signal Evidence Quality Distribution]] — STRONG:2, MODERATE:2, WEAK:1
- [[CLM-20 SIG-001 Sensor Bridge Throughput]]
- [[CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions]]
- [[CLM-22 SIG-003 Dependency Load 68 Percent]]
- [[CLM-23 SIG-004 Structural Volatility Edge Density]]
- [[CLM-24 SIG-005 Coordination Pressure Partial]]

## Exposure Classification
- ZONE-1: full signal with statement, confidence_rationale, source_refs
- ZONE-2: title + business_impact + risk + confidence label (no statement, no rationale, no source_refs)
- NOTE: business_impact and risk fields are ZONE-2 safe but NOT currently displayed in GAUGE UI — identified as V2 gap
