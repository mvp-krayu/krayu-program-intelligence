---
node_class: claim
claim_id: CLM-12
claim_label: Score Confidence Range
claim_type: metric
exposure: ZONE-2
lens_admissible: CONDITIONAL
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation
When execution_layer_evaluated=False, confidence status is SPLIT_EXECUTION_NOT_EVALUATED. Lower bound = canonical score (proven floor). Upper bound = projected score (ceiling). When execution is evaluated, lower=upper=single resolved score and status=COMPUTED. The raw status string is operator-only; LENS phrase: "Score confidence range: 60 to 100. Floor is proven. Ceiling is achievable upon execution assessment."

## Authoritative Value
lower=60, upper=100, status=SPLIT_EXECUTION_NOT_EVALUATED

## Source Fields
- `confidence.lower`
- `confidence.upper`
- `confidence.status`

## Upstream Artifacts
- [[ART-01 gauge_state.json]]
- [[CLM-09 Proven Structural Score]]
- [[CLM-10 Achievable Score Projected]]

## Transformation Chain
- lower = canonical score (proven floor)
- upper = projected score (achievable ceiling)
- status = SPLIT_EXECUTION_NOT_EVALUATED when execution_layer_evaluated=False
- On evaluation: lower=upper=resolved score; status=COMPUTED

## Entity Links
- Stage of origin: S4
- Visible in GAUGE: PARTIAL — available in API, not currently in main UI panels

## Exposure
- ZONE: ZONE-2
- LENS admissible: CONDITIONAL
- Reason: "score range confirmed" admissible in ZONE-2; raw status string SPLIT_EXECUTION_NOT_EVALUATED is ZONE-1 only

## Traceability
- Status: FULL
- Caveats: None


## Why It Matters

The confidence range [60, 100] is the honest representation of assessment state when execution has not yet been evaluated. It tells any reviewer that there is no uncertainty about the floor — 60 is proven — and that the range will collapse to a single number once execution runs. A single score without this context understates what is already known and obscures what remains pending. The range is both transparent and commercially useful: it separates what is evidence-backed from what is achievable.

## Surfaces
- `confidence.lower` / `confidence.upper` in `/api/gauge`
