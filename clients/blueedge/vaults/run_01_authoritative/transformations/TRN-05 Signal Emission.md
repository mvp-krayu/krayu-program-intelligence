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

## Product Role

Signal emission is the step where structural evidence becomes actionable intelligence. The four-layer chain (condition → diagnosis → intelligence → signal) converts what is structurally observable into findings that explain operational risk, capacity limits, and unknown state. The five signals produced by this transformation are the most buyer-facing content in the assessment: they answer not just "what is the score?" but "what does the platform's structure reveal about how it behaves and what is not yet measurable?" The business_impact and risk fields in each signal are ready for ZONE-2 (client-facing) surfaces — they represent significant untapped product value in the current GAUGE rendering.
