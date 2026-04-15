---
title: Vault Governance
node_type: governance_meta
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01
status: ACTIVE
---

## Governing Principle

Not everything traceable should be client-visible. Everything visible must be traceable.

This is an architectural constraint — not a preference. Client-safe claims are those that can be explained without exposing operational detail that could be misinterpreted or that lacks meaningful context for a non-technical audience. But every claim that reaches a client must trace backward to a verified artifact chain.

## Exposure Zone Summary

| zone | id | audience | description |
|------|-----|---------|-------------|
| Full Internal Trace Reality | ZONE-0 | Ground truth | Everything the vault knows. Never directly exposed. |
| Operator Surface (GAUGE) | ZONE-1 | Technical operators, CTOs | Full dimension detail, axis results, raw scores, execution state. |
| Client Surface (LENS) | ZONE-2 | Client executives | Summary metrics, business_impact, narrative phrases. No PSEE internals. |
| Audit / Evidence Vault | ZONE-3 | Auditors, technical representatives | Full evidence chain, blocking conditions, traceability maps. |

## LENS Admissibility Standard

A claim is LENS-admissible if and only if it satisfies all five conditions:

1. **Traceability** — traces backward to a verified artifact in the locked baseline
2. **Accuracy** — does not overstate or understate the actual measured state
3. **Audience-appropriateness** — vocabulary matched to the intended audience
4. **Caveat completeness** — all known limitations and partial-evidence conditions accompany the claim
5. **Source attribution** — full evidence chain available for ZONE-3 access

A claim that satisfies 1–3 but lacks required caveats is NOT LENS-admissible until caveats are present.

## GAUGE vs LENS Difference Model

| GAUGE says | LENS says |
|-----------|-----------|
| `execution_status: NOT_EVALUATED` | "Runtime execution assessment is pending" |
| `score.canonical: 60, score.projected: 100` | "Proven foundation: 60/100. Maximum achievable: 100/100 when execution assessment runs." |
| `DIM-04.total_count: 0 (caveat: minimum observable state)` | "No structural unknowns observable in current evidence. Runtime behavior assessment pending." |
| `SIG-002: Seven operational dimensions currently unknown` | "The platform's live operational state cannot be determined from structural analysis alone. Runtime assessment required." |
| `confidence.lower: 60, confidence.upper: 100, status: SPLIT_EXECUTION_NOT_EVALUATED` | "Score confidence range: 60 to 100. Floor is proven. Ceiling is achievable upon execution assessment." |

## Full Specification

`docs/psee/PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01/gauge_lens_exposure_governance.md`
