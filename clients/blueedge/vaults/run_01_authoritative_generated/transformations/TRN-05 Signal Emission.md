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
Traverses the four-layer evidence chain (condition → diagnosis → intelligence → signal) to produce governed intelligence signals.

## Inputs
- 40.5 signal output set
- 40.6 condition output set
- 40.7 diagnosis + intelligence output sets

## Outputs
- [[ART-05 signal_registry.json]] — 5 signals: STRONG:2, MODERATE:2, WEAK:1

## Evidence Chain
```
COND-XXX → DIAG-XXX → INTEL-XXX → SIG-XXX
```
Each signal has a complete four-layer provenance chain.

## Claims Produced
[[CLM-18 Governed Signal Count]] [[CLM-19 Signal Evidence Quality Distribution]] [[CLM-20 SIG-001 Sensor Bridge Throughput]] [[CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions]] [[CLM-22 SIG-003 Dependency Load 68 Percent]] [[CLM-23 SIG-004 Structural Volatility Edge Density]] [[CLM-24 SIG-005 Coordination Pressure Partial]]

## Product Role
Signal emission is the transformation where structural evidence becomes actionable intelligence. Each signal has a `business_impact` and `risk` field that is ZONE-2 safe and directly usable in LENS surface claims.
