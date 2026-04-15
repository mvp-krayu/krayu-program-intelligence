---
node_class: claim
claim_id: CLM-12
claim_label: Score Confidence Range
claim_type: range
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

The confidence range is [60, 100]. The lower bound (60) is the proven canonical score. The upper bound (100) is the projected score achievable when execution runs. The status `SPLIT_EXECUTION_NOT_EVALUATED` indicates the split: structural proof is complete; execution proof is pending. The range collapses to a single point when execution assessment runs.

## Authoritative Value

[60, 100]

## Source Fields

- `gauge_state.json` → `confidence.lower`, `confidence.upper`, `confidence.status`

## Upstream Artifacts

- [[ART-01 gauge_state.json]]

## Transformation Chain

- pios compute gauge (S4) — confidence_and_variance_model

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES — "score range confirmed"
- Reason: Status value SPLIT_EXECUTION_NOT_EVALUATED is ZONE-1 only

## Traceability

- Status: FULL
- Caveats: Status `SPLIT_EXECUTION_NOT_EVALUATED` is internal — not for LENS surface

## Why It Matters

A confidence range of [60, 100] is a precise, honest statement about the limits of structural assessment. The 60 floor is backed by evidence that will not change. The 100 ceiling is contingent on execution. For decision-making, this range tells buyers exactly what is known and what remains to be measured — neither overstating certainty nor understating the structural foundation.

## Surfaces

- StatusBand confidence display
- ScoreGauge range indicator
