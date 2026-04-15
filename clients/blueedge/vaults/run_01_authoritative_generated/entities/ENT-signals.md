---
node_class: entity
entity_id: ENT-signals
entity_label: Signals
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

# Entity: Signals

## Definition

Intelligence signals are forward-looking findings derived from the four-layer evidence chain: condition → diagnosis → intelligence → signal. Each signal has a classified evidence confidence level.

## Registry

5 signals. Distribution: STRONG:2, MODERATE:2, WEAK:1.

| signal | title | confidence |
|--------|-------|-----------|
| SIG-001 | Sensor Bridge Throughput Ceiling: Configuration Co... | STRONG |
| SIG-002 | Platform Runtime State: Seven Core Dimensions Are ... | STRONG |
| SIG-003 | Dependency Load: 68% of Architectural Relationship... | MODERATE |
| SIG-004 | Structural Volatility: Edge-to-Node Density Exceed... | MODERATE |
| SIG-005 | Coordination Pressure: Static Interface Sharing at... | WEAK |

## Exposure Policy

| field | ZONE-1 | ZONE-2 | ZONE-3 |
|-------|--------|--------|--------|
| title | YES | YES | YES |
| statement | YES | NO | YES |
| business_impact | YES | YES | YES |
| risk | YES | YES | YES |
| evidence_confidence | YES | YES | YES |
| confidence_rationale | YES | NO | YES |
| source_refs | YES | NO | YES |

**Note:** `business_impact` and `risk` fields are ZONE-2 safe but not currently rendered in GAUGE UI — unrendered product value gap.

## Source Artifact

[[ART-05 signal_registry.json]]

## Related Claims

[[CLM-18 Governed Signal Count]] [[CLM-19 Signal Evidence Quality Distribution]] [[CLM-20 SIG-001 Sensor Bridge Throughput]] [[CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions]] [[CLM-22 SIG-003 Dependency Load 68 Percent]] [[CLM-23 SIG-004 Structural Volatility Edge Density]] [[CLM-24 SIG-005 Coordination Pressure Partial]]
