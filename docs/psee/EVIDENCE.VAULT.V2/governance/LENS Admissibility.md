---
title: LENS Admissibility
node_type: governance
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01
status: ACTIVE
---

## LENS Admissibility Standard

Every client-surfaced claim must satisfy all five conditions:

1. **Traceability** — the claim traces backward to a verified artifact in the locked baseline.
2. **Accuracy** — the claim does not overstate or understate the actual measured state.
3. **Audience-appropriateness** — the vocabulary is matched to the intended audience.
4. **Caveat completeness** — any known limitations or partial-evidence conditions must accompany the claim.
5. **Source attribution** — for ZONE-3 access, the full evidence chain must be available.

A claim satisfying 1–5 for ZONE-2 is LENS-admissible. A claim satisfying 1–3 but lacking required caveats is NOT LENS-admissible until caveats are present.

## Signal Exposure Policy

| signal field | ZONE-1 (GAUGE) | ZONE-2 (LENS) | ZONE-3 (Audit) |
|-------------|---------------|---------------|----------------|
| `signal_id` | YES | NO | YES |
| `title` | YES | YES | YES |
| `statement` | YES | NO — too technical | YES |
| `business_impact` | YES | YES | YES |
| `risk` | YES | YES | YES |
| `evidence_confidence` (label) | YES | YES | YES |
| `confidence_rationale` | YES | NO | YES |
| `domain_name` | YES | YES | YES |
| `source_refs` | YES | NO | YES |
| `trace_links` | YES | NO | YES |

**WEAK confidence signals (SIG-005):**
LENS may not present SIG-005 as a fully established claim. Required surface phrase: "One signal has partial evidence — the static coordination structure suggests elevated sharing, but runtime validation is not yet complete."

## Currently Missing LENS Content

The following rich signal fields are present in `signal_registry.json` but NOT currently displayed in the GAUGE UI:

- `business_impact` — ZONE-2 safe; directly client-presentable
- `risk` — ZONE-2 safe; directly client-presentable

These are identified as **V2 gaps** — high-value LENS content available in the data layer that is not reaching the product surface.

## CONCEPT-06 Semantic Gap — LENS Risk

The CONCEPT-06 predicate in `concepts.json`:
```
"predicate": "score.components.completion_points == 0 AND state.execution_status == 'PHASE_1_ACTIVE'"
```

This will NOT match the Stream 10 schema where `execution_status = 'NOT_EVALUATED'`.

**Risk:** The EXECUTION verdict in `overview.js` ExecutiveDecisionBlock may render as VERIFIED instead of UNKNOWN for the recomputed run — which would be incorrect.

**Requirement before LENS can safely surface the EXECUTION verdict against any Stream-10-schema run:**
Update CONCEPT-06 predicate to include `NOT_EVALUATED` as a matching status.

## Full Specification

`docs/psee/PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01/gauge_lens_exposure_governance.md`
