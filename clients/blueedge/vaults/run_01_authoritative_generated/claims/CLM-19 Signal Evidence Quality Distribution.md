---
node_class: claim
claim_id: CLM-19
claim_label: Signal Evidence Quality Distribution
claim_type: distribution
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

Signal confidence distribution: STRONG:2, MODERATE:2, WEAK:1. STRONG signals are fully computed from static evidence with complete four-layer chains. MODERATE signals are deterministic but pending activation (e.g., Stream 75.1 threshold activation). WEAK signals have a resolved static component but a blocked runtime component.

## Authoritative Value

STRONG:2, MODERATE:2, WEAK:1

## Source Fields

- `signal_registry.json` → per-signal `evidence_confidence`

## Upstream Artifacts

- [[ART-05 signal_registry.json]]

## Transformation Chain

- S3 signal emission — evidence_confidence classification

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES — with explanation of confidence terminology
- Reason: Confidence terminology requires explanation for non-technical LENS

## Traceability

- Status: FULL
- Caveats: None

## Surfaces

- SignalAvailability confidence indicators
