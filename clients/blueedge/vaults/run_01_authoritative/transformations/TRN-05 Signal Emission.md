---
node_class: transformation
transformation_id: TRN-05
transformation_name: Signal Emission
stage: S3
command: pios emit signals
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Purpose
Derives intelligence signals from the condition → diagnosis → intelligence evidence chain. Produces signal_registry.json.

## Inputs
- docs/pios/40.5/signal_output_set.md — signal derivations
- docs/pios/40.6/condition_output_set.md — condition evaluations
- docs/pios/40.7/diagnosis_output_set.md — diagnosis results
- docs/pios/40.7/intelligence_output_set.md — intelligence conclusions

## Outputs
- [[ART-05 signal_registry.json]] — 5 signals, confidence distribution STRONG:2/MODERATE:2/WEAK:1

## Rules
Evidence confidence levels: STRONG = complete four-layer chain; MODERATE = deterministic computation confirmed, some conditions pending; WEAK = static component only, runtime component blocked.

## Claims Produced
[[CLM-18 Governed Signal Count]] [[CLM-19 Signal Evidence Quality Distribution]] [[CLM-20 SIG-001 Sensor Bridge Throughput]] [[CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions]] [[CLM-22 SIG-003 Dependency Load 68 Percent]] [[CLM-23 SIG-004 Structural Volatility Edge Density]] [[CLM-24 SIG-005 Coordination Pressure Partial]]
