---
node_class: claim
claim_id: CLM-18
claim_label: Governed Signal Count
claim_type: count
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation
5 signals in the governed signal registry for BlueEdge run_01_blueedge. Each signal was derived from the evidence_confidence model traversing condition → diagnosis → intelligence chains from the structural artifacts. The registry is at docs/pios/41.4/signal_registry.json. Confidence distribution: STRONG:2, MODERATE:2, WEAK:1.

## Authoritative Value
5

## Source Fields
- `signal_registry.json` → `total_signals` = 5

## Upstream Artifacts
- [[ART-05 signal_registry.json]]
- `docs/pios/41.4/signal_registry.json`

## Transformation Chain
- pios emit signals → signal_registry.json → total_signals count
- condition → diagnosis → intelligence chains → 5 governed signals
- Confidence distribution: STRONG:2, MODERATE:2, WEAK:1

## Entity Links
- Stage of origin: S3 (pios emit signals)

## Exposure
- ZONE: ZONE-2
- LENS admissible: YES
- Reason: headline signal count

## Traceability
- Status: FULL
- Caveats: None

## Surfaces
- SignalAvailability "5 signals detected"
- `/api/signals` total=5
