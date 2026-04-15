---
node_class: claim
claim_id: CLM-18
claim_label: Governed Signal Count
claim_type: metric
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

The signal registry contains 5 governed intelligence signals. Each signal has a complete four-layer evidence chain (condition → diagnosis → intelligence → signal). All 5 signals are classified by evidence confidence.

## Authoritative Value

5

## Source Fields

- `signal_registry.json` → `total_signals`

## Upstream Artifacts

- [[ART-05 signal_registry.json]]

## Transformation Chain

- S3 signal emission

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES
- Reason: Safe — count

## Traceability

- Status: FULL
- Caveats: None

## Surfaces

- SignalAvailability panel
